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
import { CheckFollowingService } from './checkFollowing.service';
import { JwtAuthGuard } from 'src/jwt.guard';

@Controller('follow')
export class CheckFollowingController {
  constructor(private readonly checkFollowingService: CheckFollowingService) {}

  @UseGuards(JwtAuthGuard)
  @Get('check/:id/following/:userId')
  addFollowing(@Param('id') id: string, @Param('userId') userId: string) {
    return this.checkFollowingService.checkFollowing(id, userId);
  }
}
