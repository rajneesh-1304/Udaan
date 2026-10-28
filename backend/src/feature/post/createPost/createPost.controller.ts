import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { productImageStorage } from 'src/infra/multer/multer';
import { JwtAuthGuard } from 'src/jwt.guard';
import { CreatePostService } from './createPost.service';

@Controller()
export class CreatePostController {
  constructor(private readonly createPostService: CreatePostService) {}

  @UseGuards(JwtAuthGuard)
  // @UseInterceptors(
  //   FilesInterceptor('images', 5, { storage: productImageStorage })
  // )
  @Post('createpost/:id')
  createPost(
    @Param('id') id: string,
    @Body() postData: any,
    // @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.createPostService.createPost(id, postData);
  }
}
