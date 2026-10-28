import { IsString, IsOptional } from 'class-validator';

export class Profile {
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  headline: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsOptional()
  bio: string;

  @IsString()
  @IsOptional()
  backgroundImage: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsOptional()
  token: string;
}
