

import {IsEnum,IsInt,  IsOptional,IsString,Max,Min,} from 'class-validator';

import { Transform, Type } from 'class-transformer';

import {ApiPropertyOptional} from '@nestjs/swagger';

import { BookCategory ,BookLanguage, BookStatus,} from 'src/generated/prisma/enums'; 

export class AllBooksDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: BookCategory,
  })
  @IsOptional()
  @IsEnum(BookCategory)
  category?: BookCategory;

  @ApiPropertyOptional({
    enum: BookLanguage,
  })
  @IsOptional()
  @IsEnum(BookLanguage)
  language?: BookLanguage;

  @ApiPropertyOptional({
    enum: BookStatus,
  })
  @IsOptional()
  @IsEnum(BookStatus)
  status?: BookStatus;
}