import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // ============================================
  // POST /api/bookings (только GUEST)
  // ============================================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GUEST')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new booking',
    description:
      'Create a booking for a property. Only GUESTs can create bookings. The property must be available for the selected dates.',
  })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    schema: {
      example: {
        id: 'booking-id',
        guestId: 'guest-id',
        propertyId: 'property-id',
        checkIn: '2024-12-15T00:00:00.000Z',
        checkOut: '2024-12-20T00:00:00.000Z',
        totalGuests: 2,
        pricePerNight: 5000,
        totalNights: 5,
        totalPrice: 25000,
        status: 'PENDING',
        property: {
          id: 'property-id',
          title: 'Cozy apartment',
          city: 'Prague',
          country: 'Czech Republic',
          images: ['url1', 'url2'],
        },
        guest: {
          id: 'guest-id',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        createdAt: '2024-12-02T20:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or dates conflict',
    schema: {
      example: {
        statusCode: 400,
        message: 'Property is already booked for these dates',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Only GUESTs can create bookings',
  })
  @ApiResponse({
    status: 404,
    description: 'Property not found',
  })
  create(@CurrentUser() user: any, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(user.id, createBookingDto);
  }

  // ============================================
  // GET /api/bookings/my (мои бронирования для GUEST)
  // ============================================
  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GUEST')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get my bookings',
    description:
      'Get all bookings made by the current GUEST. Returns list of bookings with property details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of your bookings',
    schema: {
      example: [
        {
          id: 'booking-id',
          checkIn: '2024-12-15T00:00:00.000Z',
          checkOut: '2024-12-20T00:00:00.000Z',
          totalGuests: 2,
          totalPrice: 25000,
          status: 'CONFIRMED',
          property: {
            id: 'property-id',
            title: 'Cozy apartment',
            city: 'Prague',
            country: 'Czech Republic',
            images: ['url1'],
            host: {
              firstName: 'Maria',
              lastName: 'Smith',
              phone: '+420123456789',
            },
          },
          createdAt: '2024-12-02T20:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Only GUESTs can access this endpoint',
  })
  getMyBookings(@CurrentUser() user: any) {
    return this.bookingsService.getMyBookings(user.id);
  }

  // ============================================
  // GET /api/bookings/host (бронирования моих properties для HOST)
  // ============================================
  @Get('host')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get bookings for my properties',
    description:
      'Get all bookings for properties owned by the current HOST. Returns list of bookings with guest details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of bookings for your properties',
    schema: {
      example: [
        {
          id: 'booking-id',
          checkIn: '2024-12-15T00:00:00.000Z',
          checkOut: '2024-12-20T00:00:00.000Z',
          totalGuests: 2,
          totalPrice: 25000,
          status: 'PENDING',
          property: {
            id: 'property-id',
            title: 'My apartment',
            city: 'Prague',
          },
          guest: {
            id: 'guest-id',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '+420987654321',
          },
          createdAt: '2024-12-02T20:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Only HOSTs can access this endpoint',
  })
  getHostBookings(@CurrentUser() user: any) {
    return this.bookingsService.getBookingsForMyProperties(user.id);
  }

  // ============================================
  // GET /api/bookings/:id (детали бронирования)
  // ============================================
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get booking by ID',
    description:
      'Get detailed information about a specific booking. Only the GUEST who made the booking or the HOST of the property can view it.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns booking details',
    schema: {
      example: {
        id: 'booking-id',
        guestId: 'guest-id',
        propertyId: 'property-id',
        checkIn: '2024-12-15T00:00:00.000Z',
        checkOut: '2024-12-20T00:00:00.000Z',
        totalGuests: 2,
        pricePerNight: 5000,
        totalNights: 5,
        totalPrice: 25000,
        status: 'CONFIRMED',
        property: {
          id: 'property-id',
          title: 'Cozy apartment',
          description: 'Beautiful apartment...',
          city: 'Prague',
          images: ['url1'],
          host: {
            id: 'host-id',
            firstName: 'Maria',
            lastName: 'Smith',
            email: 'maria@example.com',
            phone: '+420123456789',
          },
        },
        guest: {
          id: 'guest-id',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+420987654321',
        },
        createdAt: '2024-12-02T20:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'You can only view your own bookings',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.findOne(id, user.id);
  }

  // ============================================
  // PATCH /api/bookings/:id/confirm (только HOST)
  // ============================================
  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Confirm booking',
    description:
      'Confirm a pending booking. Only the HOST of the property can confirm bookings.',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking confirmed successfully',
    schema: {
      example: {
        id: 'booking-id',
        status: 'CONFIRMED',
        property: {
          title: 'My apartment',
        },
        guest: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        updatedAt: '2024-12-02T20:30:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot confirm booking with current status',
  })
  @ApiResponse({
    status: 403,
    description: 'You can only confirm bookings for your own properties',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  confirmBooking(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.confirmBooking(id, user.id);
  }

  // ============================================
  // PATCH /api/bookings/:id/cancel (GUEST или HOST)
  // ============================================
  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancel booking',
    description:
      'Cancel a booking. Both the GUEST who made the booking and the HOST of the property can cancel it.',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully',
    schema: {
      example: {
        id: 'booking-id',
        status: 'CANCELLED',
        property: {
          title: 'Cozy apartment',
        },
        guest: {
          firstName: 'John',
          lastName: 'Doe',
        },
        updatedAt: '2024-12-02T20:45:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot cancel booking with current status',
  })
  @ApiResponse({
    status: 403,
    description: 'You can only cancel your own bookings',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  cancelBooking(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.cancelBooking(id, user.id);
  }
}