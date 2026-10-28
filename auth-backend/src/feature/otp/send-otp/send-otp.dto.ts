import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SendOtpDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    type?: string = "register";
}

export class OtpDto extends SendOtpDto {}
