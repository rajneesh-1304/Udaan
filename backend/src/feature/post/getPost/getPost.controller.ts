import { Body, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt.guard';
import { GetPostService } from './getPost.service';

@Controller()
export class GetPostController {
  constructor(private readonly getPostService: GetPostService) {}

  @UseGuards(JwtAuthGuard)
  @Get('getPost/:id')
  getPost(@Param() id: string) {
    return this.getPostService.getPosts(id);
  }
}
