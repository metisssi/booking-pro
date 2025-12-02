import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // CREATE PROPERTY (Guard проверил что HOST)
  // ============================================
  async create(userId: string, dto: CreatePropertyDto) {
    const property = await this.prisma.property.create({
      data: {
        hostId: userId,
        title: dto.title,
        description: dto.description,
        type: dto.type,
        address: dto.address,
        city: dto.city,
        country: dto.country,
        latitude: dto.latitude,
        longitude: dto.longitude,
        guests: dto.guests,
        bedrooms: dto.bedrooms,
        beds: dto.beds,
        bathrooms: dto.bathrooms,
        pricePerNight: dto.pricePerNight,
        amenities: dto.amenities,
        images: dto.images,
      },
      include: {
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return property;
  }

  // ============================================
  // GET ALL PROPERTIES (публичный доступ)
  // ============================================
  async findAll(city?: string, type?: string, minPrice?: number, maxPrice?: number) {
    const where: any = {};

    if (city) {
      where.city = {
        contains: city,
        mode: 'insensitive',
      };
    }

    if (type) {
      where.type = type;
    }

    if (minPrice || maxPrice) {
      where.pricePerNight = {};
      if (minPrice) where.pricePerNight.gte = minPrice;
      if (maxPrice) where.pricePerNight.lte = maxPrice;
    }

    const properties = await this.prisma.property.findMany({
      where,
      include: {
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return properties.map(property => {
      const totalRating = property.reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = property.reviews.length > 0 
        ? (totalRating / property.reviews.length).toFixed(1) 
        : null;

      return {
        ...property,
        averageRating,
        totalReviews: property.reviews.length,
        reviews: undefined,
      };
    });
  }

  // ============================================
  // GET ONE PROPERTY (публичный доступ)
  // ============================================
  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
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
        reviews: {
          include: {
            guest: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    const totalRating = property.reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = property.reviews.length > 0 
      ? (totalRating / property.reviews.length).toFixed(1) 
      : null;

    return {
      ...property,
      averageRating,
      totalReviews: property.reviews.length,
    };
  }

  // ============================================
  // UPDATE PROPERTY (только владелец)
  // ============================================
  async update(propertyId: string, userId: string, dto: UpdatePropertyDto) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    if (property.hostId !== userId) {
      throw new ForbiddenException('You can only update your own properties');
    }

    const updatedProperty = await this.prisma.property.update({
      where: { id: propertyId },
      data: dto,
      include: {
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedProperty;
  }

  // ============================================
  // DELETE PROPERTY (только владелец)
  // ============================================
  async remove(propertyId: string, userId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    if (property.hostId !== userId) {
      throw new ForbiddenException('You can only delete your own properties');
    }

    await this.prisma.property.delete({
      where: { id: propertyId },
    });

    return { 
      message: 'Property deleted successfully',
      deletedPropertyId: propertyId 
    };
  }

  // ============================================
  // GET MY PROPERTIES (HOST видит свои properties)
  // ============================================
  async getMyProperties(userId: string) {
    const properties = await this.prisma.property.findMany({
      where: {
        hostId: userId,
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
        bookings: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return properties.map(property => {
      const totalRating = property.reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = property.reviews.length > 0 
        ? (totalRating / property.reviews.length).toFixed(1) 
        : null;

      const totalBookings = property.bookings.length;
      const confirmedBookings = property.bookings.filter(b => b.status === 'CONFIRMED').length;

      return {
        ...property,
        averageRating,
        totalReviews: property.reviews.length,
        totalBookings,
        confirmedBookings,
        reviews: undefined,
        bookings: undefined,
      };
    });
  }
}