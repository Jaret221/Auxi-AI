import { Controller, Post, Body, UseGuards, Get, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './token/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  // GET /auth/me
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: any) {
    return this.authService.getUserById(req.user.sub);
  }

  // PUT /auth/me
  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateProfile(@Req() req: any, @Body() data: Partial<RegisterDto>) {
    return this.authService.updateUser(req.user.sub, data);
  }
}
