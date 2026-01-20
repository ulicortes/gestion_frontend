export default class Compra {
    id: number;
    total: number;
    fecha: string;

    constructor(id: number, fecha: string, total: number) {
        this.id = id;
        this.total = total;
        this.fecha = fecha;
    }

}