import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePoemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
