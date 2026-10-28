import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UsersDefinition {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
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
  profilePicture: string;

  @IsString()
  @IsOptional()
  bio: string;

  // @IsString()
  // @IsNotEmpty()
  // role: string;
}
