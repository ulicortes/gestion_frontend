export default class ArticuloSalida {
    articulo_id: number;
    cantidad: number;
    total: number;

    constructor(id: number, cant: number, total: number) {
        this.articulo_id = id;
        this.cantidad = cant;
        this.total = total*cant;
    }

}
