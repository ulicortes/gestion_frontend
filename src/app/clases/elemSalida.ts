export default class ElemSalida {
    #id: number = 0;
    #codigo: string;
    #nombre: string;
    #cantidad: number;
    #stock: number;
    #venta: number;

    constructor(id: number, codigo: string, nombre: string, cant: number, stock: number, venta: number) {
        this.#id = id;
        this.#codigo = codigo;
        this.#nombre = nombre;
        this.#cantidad = cant;
        this.#stock = stock;
        this.#venta = venta;
    }

    public getId():number {return this.#id}
    public getCodigo():string {return this.#codigo}
    public getNombre():string {return this.#nombre}
    public getCantidad():number {return this.#cantidad}
    public getStock():number {return this.#stock}
    public getVenta():number {return this.#venta}
    public setCantidad(n: number) {this.#cantidad = n}
}