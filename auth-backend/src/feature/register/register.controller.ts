import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { RegisterHandler } from './register.service';
const jwt = require('jsonwebtoken');
import axios from 'axios';
import { RegisterDto } from './register.dto';
import { RegisterCommand } from './register.command';

@Controller('auth')
export class RegisterController {
  constructor(
    private readonly handler: RegisterHandler, 
  ) {}

  @Post('register')
  async registerUser(@Body() userData: RegisterDto,
    @Res({ passthrough: true }) res: Response,) {
    const command = new RegisterCommand(userData);
    const user = await this.handler.handle(command);

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8,
    });

    return res.status(200).json({
      message: 'User created successfully',
      user,
    });
  }
}
