import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectPartnerDto {
  @IsString()
  @IsNotEmpty()
  partnerEmail: string;
}
