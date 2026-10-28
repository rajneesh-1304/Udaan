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
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { productImageStorage } from 'src/infra/multer/multer';
import { Profile } from 'src/domain/DTO/profile';
import { JwtAuthGuard } from 'src/jwt.guard';
import { AddProfileService } from './addProfile.service';

@Controller('profile')
export class AddProfileController {
  constructor(private readonly addProfileService: AddProfileService) {}

  @Post('add')
  // @UseInterceptors(
  //   FileFieldsInterceptor(
  //     [
  //       { name: 'image', maxCount: 1 },
  //       { name: 'backgroundImage', maxCount: 1 },
  //     ],
  //     {
  //       storage: productImageStorage,
  //       fileFilter: (req, file, cb) => {
  //         if (!file.mimetype.startsWith('image/')) {
  //           return cb(
  //             new Error('Only image files are allowed'),
  //             false,
  //           );
  //         }
  //         cb(null, true);
  //       },
  //     },
  //   ),
  // )
  updateProfile(
    @Body() data: any,
    // @UploadedFiles()
    // files: {
    //   image?: Express.Multer.File[];
    //   backgroundImage?: Express.Multer.File[];
    // },
  ) {
    return this.addProfileService.addProfile(
      data,
      // files?.image?.[0],
      // files?.backgroundImage?.[0],
    );
  }
}
