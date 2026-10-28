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
import { AddFollowingService } from './addFollowing.service';
import { JwtAuthGuard } from 'src/jwt.guard';

@Controller('follow')
export class AddFollowController {
  constructor(private readonly addFollowingService: AddFollowingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add/:id')
  addFollowing(@Param('id') id: string, @Body('userId') userId: string) {
    return this.addFollowingService.addFollowing(id, userId);
  }
}
