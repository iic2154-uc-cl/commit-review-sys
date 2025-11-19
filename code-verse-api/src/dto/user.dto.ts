import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  gitName?: string;
}
