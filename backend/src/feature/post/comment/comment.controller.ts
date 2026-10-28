import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt.guard';
import { CommentPostService } from './comment.service';

@Controller()
export class CommentPostController {
  constructor(private readonly commentPostService: CommentPostService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('comment/:id')
  addComment(@Param('id') id: string, @Body('data') data: any) {
    return this.commentPostService.addComment(id, data);
  }
}
