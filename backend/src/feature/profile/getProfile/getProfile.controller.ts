import {
  Controller,
  Post,
  Body,
  Res,
  Patch,
  Param,
  Get,
  Query,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { GetProfileService } from './getProfile.service';
import { JwtAuthGuard } from 'src/jwt.guard';

@Controller('profile')
export class GetProfileController {
  constructor(private readonly getProfileService: GetProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  getProfile(@Param('id') id: string) {
    return this.getProfileService.getProfile(id);
  }
}
