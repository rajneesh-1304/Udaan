import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthProvider } from 'src/domain/auth/enums/auth_provider.enum';

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    password: string;

    @IsString()
    @IsOptional()
    provider: AuthProvider;

    @IsString()
    @IsOptional()
    provider_id: string;
}