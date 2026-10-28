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
import { TotalFollowingService } from './getTotal.service';
import { JwtAuthGuard } from 'src/jwt.guard';

@Controller('follow')
export class TotalFollowingController {
  constructor(private readonly totalFollowingService: TotalFollowingService) {}

  @UseGuards(JwtAuthGuard)
  @Get('total/:id')
  getTotalFollowing(@Param('id') id: string) {
    return this.totalFollowingService.getTotalFollowing(id);
  }
}
