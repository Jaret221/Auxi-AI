import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Historial extends Document {
  @Prop({ required: true })
  mensaje: string;

  @Prop({ required: true })
  tipo: string; // "user" | "bot" | "emergencia"

  @Prop()
  gravedad: string; // leve | moderado | grave
}

export const HistorialSchema = SchemaFactory.createForClass(Historial);
