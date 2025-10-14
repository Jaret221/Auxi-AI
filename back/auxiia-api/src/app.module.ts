import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { ConfigModule } from '@nestjs/config';
import { HistorialModule } from './historial/historial.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/AuxiAI'), 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'auxiia_db',
      entities: [User],
      synchronize: true,
      
    }),
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    HistorialModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],

})
export class AppModule {}
