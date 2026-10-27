import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthProvider } from 'src/domain/auth/enums/auth_provider.enum';
import { Role } from 'src/domain/auth/enums/role.enum';

export class RegisterDto {
    @IsString()
    uuid: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    password: string;

    @IsString()
    @IsOptional()
    provider_id: string;

    @IsEnum(Role)
    role: Role

    @IsEnum(AuthProvider)
    provider: AuthProvider
}