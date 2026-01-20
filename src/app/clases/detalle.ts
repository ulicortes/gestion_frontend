export default class Detalle {
    codigo: string;
    nombre: string;
    cantidad: number;
    total: number;

    constructor(codigo: string, nombre: string, cantidad: number, total: number) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.total = total;
    }
}