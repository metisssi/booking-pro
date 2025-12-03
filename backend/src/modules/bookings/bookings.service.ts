import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // CREATE BOOKING (только GUEST)
  // ============================================
  async create(guestId: string, dto: CreateBookingDto) {
    // 1. Проверяем существует ли property
    const property = await this.prisma.property.findUnique({
      where: { id: dto.propertyId },
    });

    if (!property) {
      throw new NotFoundException(
        `Property with ID ${dto.propertyId} not found`,
      );
    }

    // 2. Проверяем что GUEST не бронирует свою же property
    if (property.hostId === guestId) {
      throw new BadRequestException('You cannot book your own property');
    }

    // 3. Проверяем количество гостей
    if (dto.totalGuests > property.guests) {
      throw new BadRequestException(
        `Property can only accommodate ${property.guests} guests`,
      );
    }

    // 4. Валидация дат
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      throw new BadRequestException('Check-in date cannot be in the past');
    }

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    // 5. Проверяем что property свободна в эти даты
    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        propertyId: dto.propertyId,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
        OR: [
          {
            AND: [
              { checkIn: { lte: checkIn } },
              { checkOut: { gt: checkIn } },
            ],
          },
          {
            AND: [
              { checkIn: { lt: checkOut } },
              { checkOut: { gte: checkOut } },
            ],
          },
          {
            AND: [
              { checkIn: { gte: checkIn } },
              { checkOut: { lte: checkOut } },
            ],
          },
        ],
      },
    });

    if (conflictingBooking) {
      throw new BadRequestException(
        'Property is already booked for these dates',
      );
    }

    // 6. Считаем общую стоимость
    const totalNights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalPrice = property.pricePerNight * totalNights;

    // 7. Создаём бронирование
    const booking = await this.prisma.booking.create({
      data: {
        guestId,
        propertyId: dto.propertyId,
        checkIn,
        checkOut,
        totalGuests: dto.totalGuests,
        pricePerNight: property.pricePerNight,
        totalNights,
        totalPrice,
        status: 'PENDING',
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            country: true,
            images: true,
          },
        },
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return booking;
  }

  // ============================================
  // GET MY BOOKINGS (для GUEST)
  // ============================================
  async getMyBookings(guestId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        guestId,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            country: true,
            images: true,
            host: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return bookings;
  }

  // ============================================
  // GET BOOKINGS FOR MY PROPERTIES (для HOST)
  // ============================================
  async getBookingsForMyProperties(hostId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        property: {
          hostId,
        },
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            city: true,
          },
        },
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return bookings;
  }

  // ============================================
  // CONFIRM BOOKING (только HOST)
  // ============================================
  async confirmBooking(bookingId: string, hostId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    // Проверяем что это HOST этой property
    if (booking.property.hostId !== hostId) {
      throw new ForbiddenException(
        'You can only confirm bookings for your own properties',
      );
    }

    // Проверяем что статус PENDING
    if (booking.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot confirm booking with status ${booking.status}`,
      );
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
      },
      include: {
        property: {
          select: {
            title: true,
          },
        },
        guest: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedBooking;
  }

  // ============================================
  // CANCEL BOOKING (GUEST или HOST)
  // ============================================
  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    // Проверяем что это либо GUEST либо HOST
    const isGuest = booking.guestId === userId;
    const isHost = booking.property.hostId === userId;

    if (!isGuest && !isHost) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    // Проверяем что статус позволяет отмену
    if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
      throw new BadRequestException(
        `Cannot cancel booking with status ${booking.status}`,
      );
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
      },
      include: {
        property: {
          select: {
            title: true,
          },
        },
        guest: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return updatedBooking;
  }

  // ============================================
  // GET ONE BOOKING (только GUEST или HOST)
  // ============================================
  async findOne(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: {
          include: {
            host: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    // Проверяем доступ
    const isGuest = booking.guestId === userId;
    const isHost = booking.property.hostId === userId;

    if (!isGuest && !isHost) {
      throw new ForbiddenException('You can only view your own bookings');
    }

    return booking;
  }
}