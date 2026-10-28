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
import { JwtAuthGuard } from 'src/jwt.guard';
import { GetProfileBySearchService } from './getProfileBySearch.service';

@Controller('profile')
export class GetProfileBySearchController {
  constructor(private readonly getProfileBySearch: GetProfileBySearchService) {}

  @UseGuards(JwtAuthGuard)
  @Get('search')
  getProfile(@Query('searchTerm') searchTerm: string) {
    return this.getProfileBySearch.getProfileBySearch(searchTerm);
  }
}
