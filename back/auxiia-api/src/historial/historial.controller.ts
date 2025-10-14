import { Controller, Get, Post, Body } from '@nestjs/common';
import { HistorialService } from './historial.service';

@Controller('historial')
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Post()
  async crear(@Body() body: { mensaje: string; tipo: string; gravedad?: string }) {
    return this.historialService.crearEntrada(body.mensaje, body.tipo, body.gravedad);
  }

  @Get()
  async obtener() {
    return this.historialService.obtenerHistorial();
  }
}
