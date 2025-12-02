import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Authentication') // Группа в Swagger
@Controller('auth') // Базовый путь: /api/v1/auth
export class AuthController {
    constructor(private authService: AuthService) { }

    // ============================================
    // POST /api/auth/register
    // ============================================
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
        status: 201,
        description: 'User successfully registered'
    })
    @ApiResponse({
        status: 409,
        description: 'User with this email already exists'
    })
    @ApiResponse({
        status: 400,
        description: 'Validation error'
    })
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }


    // ============================================
    // POST /api/auth/login
    // ============================================
    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({
        status: 200,
        description: 'User successfully logged in'
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid email or password'
    })
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }




    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@CurrentUser() user) { // 🔥 Красиво!
        return user;
    }
}