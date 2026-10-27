import { Controller, Post, Body, Res,  } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class LogoutController {

  @Post('logout')
  async logoutUser(
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('access_token', { httpOnly: true, secure: false });
    res.clearCookie('refresh_token', { httpOnly: true, secure: false });

    return res.status(200).json({
      message: "User logged out successfully"
    })
  }
}
