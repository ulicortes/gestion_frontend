export class Cliente {
    id: number;
    nombre: string;
    apellido: string;
    contacto: string;

    constructor(id: number, nombre: string, apellido: string, contacto: string) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.contacto = contacto;
    }
}
