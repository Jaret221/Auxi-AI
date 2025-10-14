import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { correo: data.correo } });
    if (exists) throw new ConflictException('El correo ya está registrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepo.create({ ...data, password: hashedPassword });
    await this.userRepo.save(user);

    const { password, ...result } = user; // quitamos la contraseña
    return result;
  }

  async login(data: LoginDto) {
    const user = await this.userRepo.findOne({ where: { correo: data.correo } });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user.id, correo: user.correo };
    const token = this.jwtService.sign(payload);

    const { password, ...userWithoutPassword } = user;
    return { message: 'Login exitoso', token, user: userWithoutPassword };
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const { password, ...result } = user; // quitamos la contraseña
    return result;
  }

  async updateUser(id: number, data: Partial<RegisterDto>) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    Object.assign(user, data);
    await this.userRepo.save(user);

    const { password, ...result } = user; // quitamos la contraseña
    return result;
  }
}
