import {
  IsEnum,
  IsNotEmpty,
  IsInt,
  IsString,
  IsOptional,
  Min,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BookCategory,
  BookLanguage,
  BookStatus,
} from 'src/generated/prisma/enums';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  author!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  publishedYear?: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  bookCode!: number;

  @ApiProperty({
    enum: BookCategory,
    example: BookCategory.Fiction,
  })
  @IsEnum(BookCategory)
  category!: BookCategory;

  @ApiProperty({
    example: BookLanguage.English,
    enum: BookLanguage,
  })
  @IsEnum(BookLanguage)
  language!: BookLanguage;

  @ApiProperty({
    default: 20,
  })
  @IsInt()
  @Min(1)
  totalCopies!: number;

  @ApiProperty()
  @IsInt()
  shelfNumber!: number;

  @ApiPropertyOptional({
    enum: BookStatus,
    example: BookStatus.Available,
  })
  @IsOptional()
  @IsEnum(BookStatus)
  status?: BookStatus;
}
