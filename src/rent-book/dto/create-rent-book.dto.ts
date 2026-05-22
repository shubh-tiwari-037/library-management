import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsInt, IsNotEmpty, Max, Min } from "class-validator";


export class CreateRentBookDto {
@ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  bookId: number;


  @ApiProperty()
 @Min(1)
 @Max(20)
  @IsNotEmpty()
  dueDate!: number;
}
