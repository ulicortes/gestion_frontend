use serde::{Deserialize, Serialize};
use directories::ProjectDirs;
use std::path::PathBuf;
use rusqlite::{Connection, Result};
use std::fs;

#[derive(Serialize, Deserialize, Debug)]
pub struct Articulo {
    id: u64,
    codigo: String,
    nombre: String,
    marca: String,
    cantidad: u32,
    compra: f64,
    venta: f64,
    proveedor: String,
    fecha: String
}

#[derive(Serialize, Deserialize)]
pub struct Compra {
    id: u64,
    total: u64,
    fecha: String,
    cliente: String
}

#[derive(Serialize, Deserialize)]
pub struct VtasxDia {
    dia: String,
    total: u64
}

#[derive(Serialize, Deserialize)]
pub struct ArticuloCompra {
    articulo_id: u64,
    cantidad: u32,
    total: u64
}

#[derive(Serialize, Deserialize)]
pub struct ElemCompra {
    articulo_id: u64,
    compra_id: String,
    cantidad: u32,
    total: u64
}

#[derive(Serialize, Deserialize)]
pub struct Detalle {
    codigo: String,
    nombre: String,
    cantidad: u32,
    total: u64
}

#[derive(Serialize, Deserialize)]
pub struct Resumen {
    ingreso: u64,
    ganancia: u64,
    operaciones: u64
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Cliente {
    id: u64,
    nombre: String,
    apellido: String,
    contacto: String
}

fn get_db_path() -> Result<PathBuf, String> {
    if let Some(proj_dirs) = ProjectDirs::from("com", "inventario", "app_gestion") {
        let db_dir = proj_dirs.data_dir();
        fs::create_dir_all(db_dir).map_err(|e| e.to_string())?;
        
        // Retornamos la ruta completa
        Ok(db_dir.join("inventario.db"))
    } else {
        Err("No se pudo determinar la ruta de datos del sistema".to_string())
    }
}
//La base de datos está en: "/home/uli/.local/share/mi_app/app_database.db"
fn create_database() -> Result<(), String> {
    let db_path = get_db_path()?; // Obtenemos la ruta segura
    
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.execute("PRAGMA foreign_keys = ON;", []).map_err(|e| e.to_string())?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS articulos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT NOT NULL UNIQUE,
            nombre TEXT NOT NULL,
            marca TEXT NOT NULL,
            cantidad INTEGER,
            compra INTEGER,
            venta INTEGER,
            proveedor TEXT,
            fecha TEXT
        );",
        [],
    ).map_err(|e| e.to_string())?;
    println!("Tabla articulos inicializada en ruta segura.");

    conn.execute(
        "CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY,
            nombre TEXT NOT NULL,
            apellido TEXT NOT NULL,
            contacto TEXT UNIQUE
        );",
        [],
    ).map_err(|e| e.to_string())?;
    println!("Tabla clientes inicializada.");

    conn.execute(
        "CREATE TABLE IF NOT EXISTS compras (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            total INTEGER,
            fecha TEXT,
			cliente INTEGER,
			FOREIGN KEY(cliente) REFERENCES clientes(id)
        );",
        [],
    ).map_err(|e| e.to_string())?;
    println!("Tabla compras inicializada.");

    conn.execute(
        "CREATE TABLE IF NOT EXISTS articulos_compras (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            articulo_id INTEGER,
            compra_id INTEGER,
            cantidad INTEGER,
            total INTEGER,
            FOREIGN KEY(articulo_id) REFERENCES articulos(id),
            FOREIGN KEY(compra_id) REFERENCES compras(id)
        );",
        [],
    ).map_err(|e| e.to_string())?;
    println!("Tabla articulos_compras inicializada.");

    conn.execute(
        "CREATE TABLE IF NOT EXISTS diario (
            fecha TEXT PRIMARY KEY,
            ingreso_bruto BIGINT,
            ganancia_bruta BIGINT,
            operaciones INTEGER
        );",
        [],
    ).map_err(|e| e.to_string())?;
    println!("Tabla diario inicializada.");
    
    Ok(())
}

#[tauri::command]
fn new_article(
    codigo: String,
    nombre: String,
    marca: String,
    cantidad: i32,
    compra: f64,
    venta: f64,
    proveedor: String,
    fecha: String,
) -> Result<String, String> {
    let db_path = get_db_path()?;
    // 1. Abrir conexión
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 2. Ejecutar el INSERT
    // El id no lo pasamos si es INTEGER PRIMARY KEY AUTOINCREMENT en SQLite
    conn.execute(
        "INSERT INTO articulos (codigo, nombre, marca, cantidad, compra, venta, proveedor, fecha) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        (codigo, nombre, marca, cantidad, compra, venta, proveedor, fecha),
    ).map_err(|e| e.to_string())?;

    Ok("Artículo guardado correctamente".to_string())
}

#[tauri::command]
fn edit_article(
    id: i64,
    codigo: String,
    nombre: String,
    marca: String,
    cantidad: i32,
    compra: f64,
    venta: f64,
    proveedor: String,
    fecha: String,
) -> Result<String, String> {
    
    let db_path = get_db_path()?;
    // 1. Abrir conexión
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 2. Ejecutar el INSERT
    // El id no lo pasamos si es INTEGER PRIMARY KEY AUTOINCREMENT en SQLite
    conn.execute(
        "UPDATE articulos SET codigo=?1, nombre=?2, marca=?3, cantidad=?4,
         compra=?5, venta=?6, proveedor=?7, fecha=?8 WHERE id=?9",
        (codigo, nombre, marca, cantidad, compra, venta, proveedor, fecha, id),
    ).map_err(|e| e.to_string())?;

    Ok("Artículo editado correctamente".to_string())
}

#[tauri::command]
fn new_exit(
    total: u64,
    fecha: String,
    articulos: Vec<ArticuloCompra>,
    cliente: u64,
) -> Result<String, String> {
    let db_path = get_db_path()?;
    let mut conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 1. Iniciamos una transacción
    let tx = conn.transaction().map_err(|e| e.to_string())?;

    // 2. Insertamos la compra (el "encabezado")
    tx.execute(
        "INSERT INTO compras (total, fecha, cliente) VALUES (?1, ?2, ?3)",
        (total, fecha.clone(), cliente),
    ).map_err(|e| e.to_string())?;

    // 3. ¡AQUÍ ESTÁ EL TRUCO!: Obtenemos el ID que se generó recién
    let compra_id = tx.last_insert_rowid();

    let mut ganancia: u64 = 0;
    // 4. Insertamos cada artículo usando ese compra_id
    for item in articulos {
        let diferencia: u64 = tx.query_row(
        "SELECT venta - compra FROM articulos WHERE id = ?1",
            [item.articulo_id],
            |row| Ok(row.get(0)?),
        ).map_err(|e| e.to_string())?;

        ganancia += diferencia * item.cantidad as u64;

        tx.execute(
            "INSERT INTO articulos_compras (articulo_id, compra_id, cantidad, total) 
             VALUES (?1, ?2, ?3, ?4)",
            (item.articulo_id, compra_id, item.cantidad, item.total),
        ).map_err(|e| e.to_string())?;

        tx.execute(
            "UPDATE articulos SET cantidad = cantidad-?1 WHERE id=?2",
            (item.cantidad, item.articulo_id),
        ).map_err(|e| e.to_string())?;
    }
    tx.execute(
        "INSERT INTO diario(fecha, ingreso_bruto, ganancia_bruta, operaciones) 
        VALUES (?1, ?2, ?3, 1)
        ON CONFLICT(fecha) DO UPDATE SET
        ingreso_bruto = ingreso_bruto + excluded.ingreso_bruto,
        ganancia_bruta = ganancia_bruta + excluded.ganancia_bruta,
        operaciones = operaciones + 1",
        (fecha, total, ganancia),
    ).map_err(|e| e.to_string())?;

    // 5. Si todo salió bien, guardamos los cambios permanentemente
    tx.commit().map_err(|e| e.to_string())?;

    Ok("Compra creada.".to_string())
}

#[tauri::command]
fn delete_article(id: u32) -> Result<String, String> {
    let db_path = get_db_path()?;
    // 1. Abrir conexión
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 2. Ejecutar el INSERT
    // El id no lo pasamos si es INTEGER PRIMARY KEY AUTOINCREMENT en SQLite
    conn.execute(
        "DELETE FROM articulos WHERE id=?1",
        (id,),
    ).map_err(|e| e.to_string())?;

    Ok("Artículo borrado correctamente".to_string())
}

#[tauri::command]
fn get_articles() -> Result<Vec<Articulo>, String> {
    let db_path = get_db_path()?;
    // 1. Conexión (Asegúrate de que la ruta sea correcta)
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 2. Preparar sentencia
    let mut stmt = conn
        .prepare("SELECT id, codigo, nombre, marca, cantidad, compra, venta, proveedor, fecha FROM articulos")
        .map_err(|e| e.to_string())?;

    // 3. Ejecutar query
    let articulos_iter = stmt.query_map([], |row| {
        // Asegúrate de que los tipos coincidan: i32, String, f64, etc.
        Ok(Articulo {
            id: row.get(0)?,
            codigo: row.get(1)?,
            nombre: row.get(2)?,
            marca: row.get(3)?,
            cantidad: row.get(4)?,
            compra: row.get(5)?,
            venta: row.get(6)?,
            proveedor: row.get(7)?,
            fecha: row.get(8)?,
        })
    }).map_err(|e| e.to_string())?;
    // 4. Transformación manual (Evita el error de collect)
    let mut lista_articulos = Vec::new();
    
    for resultado in articulos_iter {
        // resultado es un Result<Articulo, rusqlite::Error>
        match resultado {
            Ok(art) => lista_articulos.push(art),
            Err(e) => return Err(format!("Error leyendo fila: {}", e)),
        }
    }

    Ok(lista_articulos)
}

#[tauri::command]
fn get_exits() -> Result<Vec<Compra>, String> {
    let db_path = get_db_path()?;
    // 1. Conexión (Asegúrate de que la ruta sea correcta)
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 2. Preparar sentencia
    let mut stmt = conn
        .prepare("SELECT co.id, co.total, co.fecha, CONCAT(cl.nombre, ' ', cl.apellido)
            FROM compras co JOIN clientes cl ON co.cliente = cl.id
            where date(co.fecha) = date('now', 'localtime')")
        .map_err(|e| e.to_string())?;

    // 3. Ejecutar query
    let compras_iter = stmt.query_map([], |row| {
        // Asegúrate de que los tipos coincidan: i32, String, f64, etc.
        Ok(Compra {
            id: row.get(0)?,
            total: row.get(1)?,
            fecha: row.get(2)?,
            cliente: row.get(3)?
        })
    }).map_err(|e| e.to_string())?;

    // 4. Transformación manual (Evita el error de collect)
    let mut lista_compras = Vec::new();

    for resultado in compras_iter {
        // resultado es un Result<Articulo, rusqlite::Error>
        match resultado {
            Ok(com) => lista_compras.push(com),
            Err(e) => return Err(format!("Error leyendo fila: {}", e)),
        }
    }

    Ok(lista_compras)
}

#[tauri::command]
fn get_all_exits() -> Result<Vec<Compra>, String> {
    let db_path = get_db_path()?;
    // 1. Conexión (Asegúrate de que la ruta sea correcta)
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 2. Preparar sentencia
    let mut stmt = conn
        .prepare("SELECT co.id, co.total, co.fecha, CONCAT(cl.nombre, ' ', cl.apellido)
         FROM compras co JOIN clientes cl ON co.cliente = cl.id")
        .map_err(|e| e.to_string())?;

    // 3. Ejecutar query
    let compras_iter = stmt.query_map([], |row| {
        // Asegúrate de que los tipos coincidan: i32, String, f64, etc.
        Ok(Compra {
            id: row.get(0)?,
            total: row.get(1)?,
            fecha: row.get(2)?,
            cliente: row.get(3)?
        })
    }).map_err(|e| e.to_string())?;

    // 4. Transformación manual (Evita el error de collect)
    let mut lista_compras = Vec::new();

    for resultado in compras_iter {
        // resultado es un Result<Articulo, rusqlite::Error>
        match resultado {
            Ok(com) => lista_compras.push(com),
            Err(e) => return Err(format!("Error leyendo fila: {}", e)),
        }
    }

    Ok(lista_compras)
}

#[tauri::command]
fn get_detail_exit(id: u64) -> Result<Vec<Detalle>, String> {
    let db_path = get_db_path()?;
    // 1. Conexión (Asegúrate de que la ruta sea correcta)
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 2. Preparar sentencia
    let mut stmt = conn
        .prepare("SELECT a.codigo, a.nombre, ac.cantidad, ac.total FROM articulos_compras ac 
        JOIN articulos a ON ac.articulo_id=a.id
        WHERE ac.compra_id=?1")
        .map_err(|e| e.to_string())?;

    // 3. Ejecutar query
    let detalle_iter = stmt.query_map([id], |row| {
        // Asegúrate de que los tipos coincidan: i32, String, f64, etc.
        Ok(Detalle {
            codigo: row.get(0)?,
            nombre: row.get(1)?,
            cantidad: row.get(2)?,
            total: row.get(3)?,
        })
    }).map_err(|e| e.to_string())?;

    // 4. Transformación manual (Evita el error de collect)
    let mut lista_detalle = Vec::new();

    for resultado in detalle_iter {
        // resultado es un Result<Articulo, rusqlite::Error>
        match resultado {
            Ok(det) => lista_detalle.push(det),
            Err(e) => return Err(format!("Error leyendo fila: {}", e)),
        }
    }

    Ok(lista_detalle)
}

#[tauri::command]
fn get_period(desde: String, hasta: String) -> Result<Resumen, String> {
    let db_path = get_db_path()?;
    // 1. Conexión (Asegúrate de que la ruta sea correcta)
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    // 2. Preparar sentencia
    let mut stmt = conn
        .prepare("SELECT SUM(ingreso_bruto), SUM(ganancia_bruta), SUM(operaciones)
        FROM diario
        WHERE datetime(fecha) between datetime(?1) and datetime(?2)")
        .map_err(|e| e.to_string())?;

    // 3. Ejecutar query
    let res = stmt.query_row([desde, hasta], |row| {
        // Asegúrate de que los tipos coincidan: i32, String, f64, etc.
        Ok(Resumen {
            ingreso: row.get::<_, Option<u64>>(0)?.unwrap_or(0),
            ganancia: row.get::<_, Option<u64>>(1)?.unwrap_or(0),
            operaciones: row.get::<_, Option<u64>>(2)?.unwrap_or(0),
        })
    }).map_err(|e| e.to_string())?;

    Ok(res)
}

#[tauri::command]
fn get_top_5_exits() -> Result<Vec<Detalle>, String> {
    let db_path = get_db_path()?;
    // 1. Conexión (Asegúrate de que la ruta sea correcta)
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 2. Preparar sentencia
    let mut stmt = conn
        .prepare("SELECT a.codigo, a.nombre, SUM(ac.cantidad) as cant, SUM(ac.total) FROM articulos_compras ac 
        JOIN articulos a ON ac.articulo_id=a.id
        GROUP BY a.codigo, a.nombre
        ORDER BY cant DESC
        LIMIT 5")
        .map_err(|e| e.to_string())?;

    // 3. Ejecutar query
    let detalle_iter = stmt.query_map([], |row| {
        // Asegúrate de que los tipos coincidan: i32, String, f64, etc.
        Ok(Detalle {
            codigo: row.get(0)?,
            nombre: row.get(1)?,
            cantidad: row.get(2)?,
            total: row.get(3)?,
        })
    }).map_err(|e| e.to_string())?;

    // 4. Transformación manual (Evita el error de collect)
    let mut lista_detalle = Vec::new();

    for resultado in detalle_iter {
        // resultado es un Result<Articulo, rusqlite::Error>
        match resultado {
            Ok(det) => lista_detalle.push(det),
            Err(e) => return Err(format!("Error leyendo fila: {}", e)),
        }
    }

    Ok(lista_detalle)
}

#[tauri::command]
fn get_exists_per_day() -> Result<Vec<VtasxDia>, String> {
    let db_path = get_db_path()?;
    // 1. Conexión (Asegúrate de que la ruta sea correcta)
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 2. Preparar sentencia
    let mut stmt = conn
        .prepare("SELECT strftime('%d', fecha) as dia, COUNT(*)
        FROM diario 
        GROUP BY dia 
        ORDER BY dia ASC")
        .map_err(|e| e.to_string())?;

    // 3. Ejecutar query
    let detalle_iter = stmt.query_map([], |row| {
        // Asegúrate de que los tipos coincidan: i32, String, f64, etc.
        Ok(VtasxDia {
            dia: row.get(0)?,
            total: row.get(1)?,
        })
    }).map_err(|e| e.to_string())?;

    // 4. Transformación manual (Evita el error de collect)
    let mut lista_detalle = Vec::new();

    for resultado in detalle_iter {
        // resultado es un Result<Articulo, rusqlite::Error>
        match resultado {
            Ok(det) => lista_detalle.push(det),
            Err(e) => return Err(format!("Error leyendo fila: {}", e)),
        }
    }

    Ok(lista_detalle)
}

#[tauri::command]
fn get_top_5_not_exits() -> Result<Vec<Detalle>, String> {
    let db_path = get_db_path()?;
    // 1. Conexión (Asegúrate de que la ruta sea correcta)
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 2. Preparar sentencia
    let mut stmt = conn
        .prepare("SELECT a.codigo, a.nombre, SUM(IFNULL(ac.cantidad, 0)) as cant, SUM(IFNULL(ac.total, 0)) FROM articulos_compras ac 
        RIGHT JOIN articulos a ON ac.articulo_id=a.id
        GROUP BY a.codigo, a.nombre
        ORDER BY cant ASC
        LIMIT 5")
        .map_err(|e| e.to_string())?;

    // 3. Ejecutar query
    let detalle_iter = stmt.query_map([], |row| {
        // Asegúrate de que los tipos coincidan: i32, String, f64, etc.
        Ok(Detalle {
            codigo: row.get(0)?,
            nombre: row.get(1)?,
            cantidad: row.get(2)?,
            total: row.get(3)?,
        })
    }).map_err(|e| e.to_string())?;

    // 4. Transformación manual (Evita el error de collect)
    let mut lista_detalle = Vec::new();

    for resultado in detalle_iter {
        // resultado es un Result<Articulo, rusqlite::Error>
        match resultado {
            Ok(det) => lista_detalle.push(det),
            Err(e) => return Err(format!("Error leyendo fila: {}", e)),
        }
    }

    Ok(lista_detalle)
}

#[tauri::command]
fn get_clients() -> Result<Vec<Cliente>, String> {
    let db_path = get_db_path()?;
    // 1. Conexión (Asegúrate de que la ruta sea correcta)
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 2. Preparar sentencia
    let mut stmt = conn
        .prepare("SELECT id, nombre, apellido, contacto FROM clientes")
        .map_err(|e| e.to_string())?;

    // 3. Ejecutar query
    let clientes_iter = stmt.query_map([], |row| {
        // Asegúrate de que los tipos coincidan: i32, String, f64, etc.
        Ok(Cliente {
            id: row.get(0)?,
            nombre: row.get(1)?,
            apellido: row.get(2)?,
            contacto: row.get(3)?,
        })
    }).map_err(|e| e.to_string())?;
    // 4. Transformación manual (Evita el error de collect)
    let mut lista_cliente = Vec::new();
    
    for resultado in clientes_iter {
        // resultado es un Result<Articulo, rusqlite::Error>
        match resultado {
            Ok(art) => lista_cliente.push(art),
            Err(e) => return Err(format!("Error leyendo fila: {}", e)),
        }
    }

    Ok(lista_cliente)
}

#[tauri::command]
fn new_client(
    nombre: String,
    apellido: String,
    contacto: String,
) -> Result<String, String> {
    let db_path = get_db_path()?;
    // 1. Abrir conexión
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 2. Ejecutar el INSERT
    // El id no lo pasamos si es INTEGER PRIMARY KEY AUTOINCREMENT en SQLite
    conn.execute(
        "INSERT INTO clientes (nombre, apellido, contacto) 
         VALUES (?1, ?2, ?3)",
        (nombre, apellido, contacto),
    ).map_err(|e| e.to_string())?;

    Ok("Cliente guardado correctamente".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let _ = create_database();
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![new_article, delete_article, get_articles, edit_article, new_exit, get_exits, get_all_exits, get_detail_exit, get_period, get_top_5_exits, get_exists_per_day, get_top_5_not_exits, get_clients, new_client])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}