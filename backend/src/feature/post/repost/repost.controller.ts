import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt.guard';
import { RepostService } from './repost.service';

@Controller()
export class RepostController {
  constructor(private readonly repostService: RepostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('repost/:id')
  addRepost(
    @Param() id: string,
    @Body('userId') userId: any,
    @Body('name') name: any,
  ) {
    return this.repostService.addRepost(id, userId, name);
  }
}
