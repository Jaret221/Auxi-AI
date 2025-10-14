import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 150 })
  apellidos: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ unique: true, length: 150 })
  correo: string;

  @Column({ type: 'varchar', length: 20 })
  telefonoEmergencia: string;

  @Column()
  password: string;
}
