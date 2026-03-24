export default class Detalle {
    codigo: string;
    nombre: string;
    cantidad: number;
    total: number;
    id_art: number;

    constructor(codigo: string, nombre: string, cantidad: number, total: number, id: number) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.total = total;
        this.id_art= id;
    }
}