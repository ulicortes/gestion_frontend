export default class Compra {
    id: number;
    total: number;
    fecha: string;
    cliente: string;

    constructor(id: number, fecha: string, total: number, cliente: string) {
        this.id = id;
        this.total = total;
        this.fecha = fecha;
        this.cliente = cliente;
    }

}