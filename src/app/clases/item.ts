export default class Item {
    id: number;
    codigo: string;
    nombre: string;
    marca: string;
    cantidad: number;
    compra: number;
    venta: number;
    proveedor: string;
    fecha: string;

    constructor(id: number, codigo: string, nombre: string, marca: string, cant: number,
        compra: number, venta: number, prov: string, fecha: string) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.marca = marca;
        this.cantidad = cant;
        this.compra = compra;
        this.venta = venta;
        this.proveedor = prov;
        this.fecha = fecha;
    }

    public getCodigo():string {return this.codigo}
    public getNombre():string {return this.nombre}
    public getMarca():string {return this.marca}
    public getCantidad():number {return this.cantidad}
    public getCompra():number {return this.compra}
    public getVenta():number {return this.venta}
    public getProveedor():string {return this.proveedor}
    public getFecha():string {return this.fecha}
}
