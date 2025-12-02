import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  // ============================================
  // POST /api/v1/properties (только HOST)
  // ============================================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a new property',
    description: 'Only HOSTs can create properties. Requires authentication.',
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Property created successfully',
    schema: {
      example: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        hostId: "host-user-id",
        title: "Cozy apartment in Prague center",
        description: "Beautiful 2-bedroom apartment...",
        type: "APARTMENT",
        city: "Prague",
        country: "Czech Republic",
        pricePerNight: 5000,
        guests: 4,
        bedrooms: 2,
        host: {
          id: "host-user-id",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com"
        },
        createdAt: "2024-12-02T19:00:00.000Z"
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Only HOSTs can create properties',
    schema: {
      example: {
        statusCode: 403,
        message: "Forbidden resource",
        error: "Forbidden"
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - token missing or invalid' 
  })
  create(
    @CurrentUser() user: any,
    @Body() createPropertyDto: CreatePropertyDto,
  ) {
    return this.propertiesService.create(user.id, createPropertyDto);
  }

  // ============================================
  // GET /api/v1/properties (публичный доступ)
  // ============================================
  @Get()
  @ApiOperation({ 
    summary: 'Get all properties',
    description: 'Get list of all properties with optional filters. Public access.',
  })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by property type (APARTMENT, HOUSE, VILLA, ROOM, STUDIO)' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price per night in cents' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price per night in cents' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns list of properties',
    schema: {
      example: [
        {
          id: "property-id",
          title: "Cozy apartment in Prague",
          city: "Prague",
          country: "Czech Republic",
          pricePerNight: 5000,
          guests: 4,
          bedrooms: 2,
          type: "APARTMENT",
          averageRating: "4.5",
          totalReviews: 12,
          host: {
            id: "host-id",
            firstName: "John",
            lastName: "Doe"
          }
        }
      ]
    }
  })
  findAll(
    @Query('city') city?: string,
    @Query('type') type?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    const minPriceNum = minPrice ? parseInt(minPrice) : undefined;
    const maxPriceNum = maxPrice ? parseInt(maxPrice) : undefined;
    
    return this.propertiesService.findAll(city, type, minPriceNum, maxPriceNum);
  }

  // ============================================
  // GET /api/v1/properties/my (мои properties)
  // ============================================
  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get my properties',
    description: 'Get all properties owned by the current HOST. Requires authentication.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns list of your properties with statistics',
    schema: {
      example: [
        {
          id: "property-id",
          title: "My apartment",
          city: "Prague",
          pricePerNight: 5000,
          averageRating: "4.8",
          totalReviews: 15,
          totalBookings: 23,
          confirmedBookings: 20
        }
      ]
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Only HOSTs can access this endpoint' 
  })
  getMyProperties(@CurrentUser() user: any) {
    return this.propertiesService.getMyProperties(user.id);
  }

  // ============================================
  // GET /api/v1/properties/:id (публичный доступ)
  // ============================================
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get property by ID',
    description: 'Get detailed information about a specific property. Public access.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns property details',
    schema: {
      example: {
        id: "property-id",
        title: "Cozy apartment in Prague",
        description: "Beautiful apartment...",
        type: "APARTMENT",
        city: "Prague",
        country: "Czech Republic",
        address: "Václavské náměstí 68",
        pricePerNight: 5000,
        guests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 1,
        amenities: ["WiFi", "Kitchen"],
        images: ["url1", "url2"],
        averageRating: "4.5",
        totalReviews: 12,
        host: {
          id: "host-id",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "+420123456789"
        },
        reviews: [
          {
            rating: 5,
            comment: "Amazing place!",
            guest: {
              firstName: "Maria",
              lastName: "Smith"
            }
          }
        ]
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Property not found' 
  })
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  // ============================================
  // PATCH /api/v1/properties/:id (только владелец)
  // ============================================
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update property',
    description: 'Update property details. Only the property owner can update. Requires authentication.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Property updated successfully' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'You can only update your own properties',
    schema: {
      example: {
        statusCode: 403,
        message: "You can only update your own properties",
        error: "Forbidden"
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Property not found' 
  })
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(id, user.id, updatePropertyDto);
  }

  // ============================================
  // DELETE /api/v1/properties/:id (только владелец)
  // ============================================
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete property',
    description: 'Delete property. Only the property owner can delete. Requires authentication.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Property deleted successfully',
    schema: {
      example: {
        message: "Property deleted successfully",
        deletedPropertyId: "property-id"
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'You can only delete your own properties' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Property not found' 
  })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.propertiesService.remove(id, user.id);
  }
}