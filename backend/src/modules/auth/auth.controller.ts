import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ============================================
  // POST /api/auth/register
  // ============================================
  @Post('register')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Create a new user account. Returns user data and access token.',
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    schema: {
      example: {
        user: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          email: "john@example.com",
          firstName: "John",
          lastName: "Doe",
          phone: "+420123456789",
          role: "CUSTOMER",
          createdAt: "2024-12-02T15:00:00.000Z"
        },
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'User with this email already exists',
    schema: {
      example: {
        statusCode: 409,
        message: "User with this email already exists",
        error: "Conflict"
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: [
          "Please provide a valid email address",
          "Password must be at least 6 characters long"
        ],
        error: "Bad Request"
      }
    }
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ============================================
  // POST /api/auth/login
  // ============================================
  @Post('login')
  @ApiOperation({ 
    summary: 'Login user',
    description: 'Authenticate user with email and password. Returns user data and access token.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    schema: {
      example: {
        user: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          email: "john@example.com",
          firstName: "John",
          lastName: "Doe",
          phone: "+420123456789",
          role: "CUSTOMER",
          createdAt: "2024-12-02T15:00:00.000Z"
        },
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: "Invalid email or password",
        error: "Unauthorized"
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: [
          "Please provide a valid email address"
        ],
        error: "Bad Request"
      }
    }
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ============================================
  // GET /api/auth/me
  // ============================================
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get current user profile',
    description: 'Returns the profile of the currently authenticated user. Requires valid JWT token in Authorization header.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns current user data',
    schema: {
      example: {
        message: "Current user data",
        user: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          email: "john@example.com",
          role: "CUSTOMER"
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - token missing or invalid',
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized"
      }
    }
  })
  getProfile(@CurrentUser() user: any) {
    return {
      message: 'Current user data',
      user: user,
    };
  }
}