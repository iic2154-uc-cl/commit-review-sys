import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRepoDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Name of the repository
}
