import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt.guard';
import { LikePostService } from './like.service';

@Controller()
export class LikePostController {
  constructor(private readonly likePostService: LikePostService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('like/:id')
  addLike(@Param() id: any, @Body('data') data: any) {
    return this.likePostService.toggleLike(id, data);
  }
}
