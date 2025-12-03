import { IsString, IsDateString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Property ID to book',
  })
  @IsString()
  propertyId: string;

  @ApiProperty({
    example: '2024-12-15',
    description: 'Check-in date (YYYY-MM-DD)',
  })
  @IsDateString()
  checkIn: string;

  @ApiProperty({
    example: '2024-12-20',
    description: 'Check-out date (YYYY-MM-DD)',
  })
  @IsDateString()
  checkOut: string;

  @ApiProperty({
    example: 2,
    description: 'Number of guests',
  })
  @IsInt()
  @Min(1, { message: 'At least 1 guest is required' })
  totalGuests: number;
}