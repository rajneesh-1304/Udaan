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
import { GetProfilesService } from './getProfiles.service';

@Controller('profile')
export class GetProfilesController {
  constructor(private readonly getProfileService: GetProfilesService) {}

  @Get('getAll')
  getAll(@Query('page') page = 1, @Query('limit') limit = 100) {
    return this.getProfileService.getAll({ page, limit });
  }
}
