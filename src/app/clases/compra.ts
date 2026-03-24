export default class Compra {
    id: number;
    total: number;
    fecha: string;
    cliente: string;
    pagado: number;
    mdp: number;

    constructor(id: number, fecha: string, total: number, cliente: string, pagado: number, mdp: number) {
        this.id = id;
        this.total = total;
        this.fecha = fecha;
        this.cliente = cliente;
        this.pagado = pagado;
        this.mdp = pagado;
    }

}