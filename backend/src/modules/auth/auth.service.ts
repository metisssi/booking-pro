import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ============================================
  // REGISTRATION
  // ============================================
  async register(dto: RegisterDto) {
    // 1. Проверяем существует ли пользователь с таким email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // 2. Хешируем пароль (чтобы не хранить в открытом виде)
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Создаём пользователя в базе
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: dto.role || 'CUSTOMER', // По умолчанию CUSTOMER
      },
    });

    // 4. Генерируем JWT токен
    const token = await this.generateToken(user.id, user.email, user.role);

    // 5. Возвращаем пользователя + токен (БЕЗ пароля!)
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      accessToken: token,
    };
  }

  // ============================================
  // HELPER: Generate JWT Token
  // ============================================
  private async generateToken(userId: string, email: string, role: string) {
    const payload = {
      sub: userId,  // "sub" = subject (стандарт JWT)
      email: email,
      role: role,
    };

    return this.jwtService.sign(payload);
  }
}