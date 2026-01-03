import { Injectable } from '@angular/core';
import Articulo from '../clases/articulo';

@Injectable({
  providedIn: 'root',
})
export class ArticulosService {
  constructor() { }
  // articulos: Articulo[] = ;

  getArticulos() {
    return [
      new Articulo(1, "Interruptor Termomagnético 2x20A", "Schneider", 50, 12500.00, 19800.00, "ElectricData S.A.", "2023-10-15"),
      new Articulo(2, "Cable THHN AWG #12 (Rollo 100m)", "Indeco", 20, 48500.00, 72500.00, "Cables del Sur", "2023-11-02"),
      new Articulo(3, "Tomacorriente Doble con Tierra", "Leviton", 100, 5200.00, 8900.00, "Suministros Alpha", "2023-11-10"),
      new Articulo(4, "Cinta Aislante (Negro)", "3M", 200, 5000.00, 8200.00, "Ferreteria Central", "2023-09-20"),
      new Articulo(5, "Panel LED Circular 18W", "Philips", 40, 18500.00, 31500.00, "Ilumina S.A.C.", "2023-11-25"),
      new Articulo(6, "Caja Rectangular Galvanizada", "Dexson", 300, 5000.00, 7800.00, "MetalMec", "2023-10-05"),
      new Articulo(7, "Diferencial Residual 2x40A", "ABB", 15, 42500.00, 68500.00, "ElectricData S.A.", "2023-11-12"),
      new Articulo(8, "Tubo Conduit PVC 3/4 (Tramo 3m)", "Pavco", 80, 5200.00, 9100.00, "Tubos & Perfiles", "2023-11-18"),
      new Articulo(9, "Multímetro Digital", "Fluke", 5, 185000.00, 298000.00, "Herramientas Pro", "2023-08-30"),
      new Articulo(10, "Lámpara de Emergencia LED", "Opalux", 25, 21500.00, 35800.00, "Suministros Alpha", "2023-12-01"),
      new Articulo(11, "Pulsador Timbre Redondo", "BTicino", 60, 5100.00, 8800.00, "Cables del Sur", "2023-11-05"),
      new Articulo(12, "Sensor de Movimiento 360°", "Sylvania", 12, 26500.00, 42500.00, "Ilumina S.A.C.", "2023-11-20"),
      new Articulo(13, "Canaleta con Adhesivo 20x10mm", "Legrand", 150, 5300.00, 9200.00, "Ferreteria Central", "2023-10-28"),
      new Articulo(14, "Bornera de Conexión 10mm", "Phoenix Contact", 500, 5000.00, 7800.00, "ElectricData S.A.", "2023-11-01"),
      new Articulo(15, "Foco LED E27 9W (Luz Fría)", "Sylvania", 120, 5200.00, 8900.00, "Ilumina S.A.C.", "2023-12-05"),
      new Articulo(16, "Interruptor Simple Empotrable", "BTicino", 90, 5200.00, 8500.00, "Suministros Alpha", "2023-12-08"),
      new Articulo(17, "Enchufe Industrial 32A Trifásico", "Schneider", 10, 18000.00, 29500.00, "ElectricData S.A.", "2023-11-22"),
      new Articulo(18, "Cable UTP Cat 6 (Rollo 305m)", "Panduit", 8, 45000.00, 72000.00, "Cables del Sur", "2023-10-30"),
      new Articulo(19, "Contacto Simple con Tierra", "Leviton", 110, 5100.00, 8900.00, "Suministros Alpha", "2023-11-14"),
      new Articulo(20, "Transformador 220V a 12V 60W", "Mean Well", 18, 12500.00, 21500.00, "ElectricData S.A.", "2023-11-27"),
      new Articulo(21, "Reflector LED 50W Exterior", "Philips", 22, 16500.00, 29800.00, "Ilumina S.A.C.", "2023-12-03"),
      new Articulo(22, "Ventilador Extractor 6 Pulgadas", "Soler & Palau", 14, 26000.00, 44500.00, "Ferreteria Central", "2023-10-18"),
      new Articulo(23, "Temporizador Digital Programable", "Omron", 9, 38500.00, 62500.00, "ElectricData S.A.", "2023-11-09"),
      new Articulo(24, "Caja de Distribución 12 Polos", "Schneider", 30, 9500.00, 16800.00, "MetalMec", "2023-11-16"),
      new Articulo(25, "Balasto Electrónico 2x36W", "Osram", 26, 7200.00, 12500.00, "Ilumina S.A.C.", "2023-10-25")

    ];
  }
}
