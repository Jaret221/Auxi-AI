import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Historial, HistorialSchema } from './schemas/historial.schema';
import { HistorialService } from './historial.service';
import { HistorialController } from './historial.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Historial.name, schema: HistorialSchema }])],
  providers: [HistorialService],
  controllers: [HistorialController],
})
export class HistorialModule {}
