import {
  IsString,
  IsNotEmpty,
  Length,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class UpdateVeiculoRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 10)
  placa: string;

  @IsString()
  @IsNotEmpty()
  @Length(17, 17)
  chassi: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  renavam: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  modelo: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  marca: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  ano: number;
}
