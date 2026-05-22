import { IsEnum,IsNotEmpty, IsInt,IsString, IsOptional, Min} from "class-validator";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BookCategory,BookLanguage,BookStatus } from "src/generated/prisma/enums";

export class UpdateBookDto {
 @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  author?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  
  publishedYear?: number;

  @ApiProperty({
    enum: BookCategory,
  })
  @IsEnum(BookCategory)
  category?: BookCategory;

  @ApiProperty({
    enum: BookLanguage,
  })
  @IsEnum(BookLanguage)
  language?: BookLanguage;

  @ApiProperty()
  @IsInt()
  @Min(1)
  totalCopies?: number;

}
