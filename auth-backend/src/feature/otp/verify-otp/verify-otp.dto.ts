import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Role } from "src/domain/auth/enums/role.enum";

export class VerifyOtpDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(4, 8)
    otp: string;

    @IsOptional()
    @IsString()
    type?: string = "register";

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    uuid?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
