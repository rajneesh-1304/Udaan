
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { AuthProvider } from 'src/domain/auth/enums/auth_provider.enum';
import { Role } from 'src/domain/auth/enums/role.enum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ValidateIf((dto: RegisterDto) => dto.provider === AuthProvider.LOCAL)
  @IsString()
  @IsNotEmpty()
  password?: string;

  @ValidateIf((dto: RegisterDto) => dto.provider === AuthProvider.GOOGLE)
  @IsString()
  @IsNotEmpty()
  provider_id?: string;

  @IsEnum(Role)
  role: Role;

  @IsEnum(AuthProvider)
  provider: AuthProvider;
}
