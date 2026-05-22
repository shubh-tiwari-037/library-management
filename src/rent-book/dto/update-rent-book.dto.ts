import { IsDateString, IsEnum, IsNumber, IsOptional } from "class-validator";
import { RentalStatus } from "src/generated/prisma/enums";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateRentBookDto {


  @ApiProperty({enum:RentalStatus})
  @IsOptional()
  @IsEnum(RentalStatus)
  status?: RentalStatus;


}
