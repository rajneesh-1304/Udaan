import { Controller, Post, Body, Res, } from '@nestjs/common';
import { Response } from 'express';
import { LoginHandler } from './login.service';
import { LoginDto } from './login.dto';
import { LoginCommand } from './login.command';
const jwt = require('jsonwebtoken');

@Controller('auth')
export class LoginController {
  constructor(private readonly handler: LoginHandler) { }

  @Post('login')
  async loginUser(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginCommand = new LoginCommand(data);
    const user = await this.handler.handle(loginCommand);

    const token = jwt.sign(
      {
        uuid: user.uuid,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 1,
    });

    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 30,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      user
    })
  }
}
