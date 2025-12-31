export default class Articulo {
    #id: number = 0;
    #nombre: string;
    #marca: string;
    #cantidad: number;
    #compra: number;
    #venta: number;
    #proveedor: string;
    #fecha: string;

    constructor(id: number, nombre: string, marca: string, cant: number,
        compra: number, venta: number, prov: string, fecha: string) {
        this.#id = id;
        this.#nombre = nombre;
        this.#marca = marca;
        this.#cantidad = cant;
        this.#compra = compra;
        this.#venta = venta;
        this.#proveedor = prov;
        this.#fecha = fecha;
    }

    public getId():number {return this.#id}
    public getNombre():string {return this.#nombre}
    public getMarca():string {return this.#marca}
    public getCantidad():number {return this.#cantidad}
    public getCompra():number {return this.#compra}
    public getVenta():number {return this.#venta}
    public getProveedor():string {return this.#proveedor}
    public getFecha():string {return this.#fecha}
}
