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
import { RemoveFollowService } from './removeFollowing.service';
import { JwtAuthGuard } from 'src/jwt.guard';

@Controller('follow')
export class RemoveFollowController {
  constructor(private readonly removeFollowService: RemoveFollowService) {}

  @UseGuards(JwtAuthGuard)
  @Post('remove/:id')
  removeFollowing(@Param('id') id: string, @Body('userId') userId: string) {
    return this.removeFollowService.removeFollowing(id, userId);
  }
}
