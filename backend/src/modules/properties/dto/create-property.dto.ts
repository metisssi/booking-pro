import { 
  IsString, 
  IsEnum, 
  IsInt, 
  Min, 
  IsArray, 
  IsOptional,
  MinLength,
  MaxLength 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  VILLA = 'VILLA',
  ROOM = 'ROOM',
  STUDIO = 'STUDIO',
}

export class CreatePropertyDto {
  @ApiProperty({
    example: 'Cozy apartment in Prague center',
    description: 'Property title',
  })
  @IsString()
  @MinLength(5, { message: 'Title must be at least 5 characters' })
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  title: string;

  @ApiProperty({
    example: 'Beautiful 2-bedroom apartment with amazing view of Prague Castle. Perfect for families or couples.',
    description: 'Property description',
  })
  @IsString()
  @MinLength(20, { message: 'Description must be at least 20 characters' })
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters' })
  description: string;

  @ApiProperty({
    example: 'APARTMENT',
    enum: PropertyType,
    description: 'Type of property',
  })
  @IsEnum(PropertyType, { message: 'Invalid property type' })
  type: PropertyType;

  @ApiProperty({
    example: 'Václavské náměstí 68',
    description: 'Street address',
  })
  @IsString()
  @MinLength(5)
  address: string;

  @ApiProperty({
    example: 'Prague',
    description: 'City',
  })
  @IsString()
  @MinLength(2)
  city: string;

  @ApiProperty({
    example: 'Czech Republic',
    description: 'Country',
  })
  @IsString()
  @MinLength(2)
  country: string;

  @ApiProperty({
    example: 50.0755,
    description: 'Latitude coordinate (optional)',
    required: false,
  })
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    example: 14.4378,
    description: 'Longitude coordinate (optional)',
    required: false,
  })
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    example: 4,
    description: 'Maximum number of guests',
  })
  @IsInt()
  @Min(1, { message: 'Must accommodate at least 1 guest' })
  guests: number;

  @ApiProperty({
    example: 2,
    description: 'Number of bedrooms',
  })
  @IsInt()
  @Min(0)
  bedrooms: number;

  @ApiProperty({
    example: 2,
    description: 'Number of beds',
  })
  @IsInt()
  @Min(1, { message: 'Must have at least 1 bed' })
  beds: number;

  @ApiProperty({
    example: 1,
    description: 'Number of bathrooms',
  })
  @IsInt()
  @Min(1, { message: 'Must have at least 1 bathroom' })
  bathrooms: number;

  @ApiProperty({
    example: 5000,
    description: 'Price per night in cents (5000 = 50 EUR)',
  })
  @IsInt()
  @Min(100, { message: 'Price must be at least 100 cents (1 EUR)' })
  pricePerNight: number;

  @ApiProperty({
    example: ['WiFi', 'Kitchen', 'Air Conditioning', 'Parking', 'TV'],
    description: 'List of amenities',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  amenities: string[];

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'Array of image URLs',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  images: string[];
}