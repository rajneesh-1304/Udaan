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
import { UpdateProfileService } from './updateProfile.service';
import { JwtAuthGuard } from 'src/jwt.guard';

@Controller('profile')
export class UpdateProfileController {
  constructor(private readonly updateService: UpdateProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
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
    @Param('id') id: string,
    @Body() formDataToSend: any,
    // @UploadedFiles()
    // files: {
    //   image?: Express.Multer.File[];
    //   backgroundImage?: Express.Multer.File[];
    // },
  ) {
    console.log(id, formDataToSend, 'this is id and user data in controller');
    return this.updateService.updateProfile(
      id,
      formDataToSend,
      // files?.image?.[0],
      // files?.backgroundImage?.[0],
    );
  }
}
