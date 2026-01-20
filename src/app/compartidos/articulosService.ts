import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import Database from '@tauri-apps/plugin-sql';
import { invoke } from '@tauri-apps/api/core';
import Item from '../clases/item';
import ArticuloSalida from '../clases/articuloSalida';
import Compra from '../clases/compra';
import Detalle from '../clases/detalle';

@Injectable({
  providedIn: 'root',
})

export class ArticulosService {
  URL = "http://localhost:9871";
  constructor(private http: HttpClient) {
  }

  getArticulos(): Observable<Item[]> {
    // return this.http.get<Articulo[]>(this.URL);
    return from(invoke<Item[]>('get_articles'));
  }

  newArticulo(a: Item): Observable<any> {
    // return this.http.post<any>(this.URL, a, {
    //   responseType: 'json'
    // });
    return from(invoke('new_article', {
      codigo: a.codigo,
      nombre: a.nombre,
      marca: a.marca,
      cantidad: a.cantidad,
      compra: a.compra,
      venta: a.venta,
      proveedor: a.proveedor,
      fecha: a.fecha
    }));
  }

  deleteArticulo(id: number): Observable<any> {
    //   return this.http.delete<any>(`${this.URL}/${id}`, {
    //     responseType: 'json'
    //   });
    // }
    return from(invoke('delete_article', { id: id }));
  }

  editArticulo(a: Item): Observable<any> {
    return from(invoke('edit_article', {
      id: a.id,
      codigo: a.codigo,
      nombre: a.nombre,
      marca: a.marca,
      cantidad: a.cantidad,
      compra: a.compra,
      venta: a.venta,
      proveedor: a.proveedor,
      fecha: a.fecha
    }));
  }

  newExit(total:number, fecha: string, articulos: ArticuloSalida[]): Observable<any> {
    return from(invoke('new_exit', {total: total, fecha: fecha, articulos: articulos}));
  }

  getVentas(): Observable<Compra[]> {
    return from(invoke<Compra[]>('get_exits'));
  }

  getDetalle(id: number): Observable<Detalle[]> {
    return from (invoke<Detalle[]>('get_detail_exit', {id: id}));
  }
}

/*
Para crear un servicio en Angular que se comunique de manera eficiente con un backend, 
la estructura debe seguir el principio de **responsabilidad única**. El servicio se encarga 
de la lógica de datos, mientras que el componente solo se encarga de mostrarla.

Aquí tienes la estructura recomendada utilizando las mejores prácticas actuales 
(Angular 14+ con `inject` y `provideHttpClient`):

### 1. Estructura Básica del Servicio

Un servicio profesional suele dividirse en: la URL base, la inyección del cliente HTTP y 
los métodos que devuelven **Observables**.

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model'; // Siempre usa interfaces para tus datos

@Injectable({
  providedIn: 'root' // Esto hace que el servicio sea un Singleton disponible en toda la app
})
export class UserService {
  // 1. Definir la URL del endpoint (idealmente viene de un environment)
  private readonly apiUrl = 'https://api.tu-backend.com/v1/users';

  // 2. Inyectar HttpClient
  private http = inject(HttpClient);

  // 3. Método para obtener datos (GET)
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // 4. Método para obtener un solo recurso por ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // 5. Método para enviar datos (POST)
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
}

```

---

### 2. Puntos clave de la estructura

* **Tipado Fuerte (`Interfaces`):** No uses `any`. Define interfaces para la respuesta del 
backend. Esto te dará autocompletado y evitará errores en tiempo de ejecución.
* **Inyección con `inject()`:** Es la forma moderna de Angular que hace el código más 
limpio y fácil de testear, evitando el constructor saturado.
* **Uso de `Observable`:** Angular usa RxJS por defecto. El servicio no debe hacer 
el `.subscribe()`; eso le corresponde al componente o al pipe `async`.

---

### 3. Cómo consumir el servicio en el Componente

El componente debe llamar al método y manejar la suscripción.

```typescript
@Component({ ... })
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  users: User[] = [];

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error al recaudar data:', err);
      }
    });
  }
}

```

---

### Mejores Prácticas Adicionales

1. **Manejo de Errores:** Puedes usar el operador `catchError` de RxJS dentro del servicio para centralizar los mensajes de error.
2. **Environments:** No escribas la URL a mano como en el ejemplo anterior; usa `environment.apiUrl` para que cambie automáticamente entre desarrollo y producción.
3. **Interceptores:** Si necesitas enviar un **Token (JWT)** en cada llamada, no lo hagas en el servicio. Usa un `HttpInterceptor` para adjuntar los headers globalmente.

¿Te gustaría que te ayude a configurar un **Intercerptor** para manejar la autenticación o prefieres ver cómo implementar el manejo de errores con **RxJS**?
*/