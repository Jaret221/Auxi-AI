import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Historial } from './schemas/historial.schema';

@Injectable()
export class HistorialService {
  constructor(@InjectModel(Historial.name) private historialModel: Model<Historial>) {}

  async crearEntrada(mensaje: string, tipo: string, gravedad?: string): Promise<Historial> {
    const nuevaEntrada = new this.historialModel({ mensaje, tipo, gravedad });
    return nuevaEntrada.save();
  }

  async obtenerHistorial(): Promise<Historial[]> {
    return this.historialModel.find().sort({ createdAt: -1 }).exec();
  }
}
