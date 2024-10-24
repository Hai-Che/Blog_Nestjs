import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { storageConfig } from 'src/helpers/config';
import { CreatePostDto } from './dto/create-post.dto';
import { extname } from 'path';
import { PostService } from './post.service';
import { FilterPostDto } from './dto/filter-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('post'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const acceptedExt = ['.png', '.jpg', '.jpeg'];
        if (!acceptedExt.includes(ext)) {
          req.fileValidationError = `Ext is not supported, ext should be ${acceptedExt.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = 'File size is too large, max size is 5MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  create(
    @Req() req: any,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File not found');
    }
    return this.postService.create(req.user_data.id, {
      ...createPostDto,
      thumbnail: file.path,
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() query: FilterPostDto): Promise<any> {
    return this.postService.findAll(query);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  findDetail(@Param('id') id: string): Promise<PostEntity> {
    return this.postService.findDetail(Number(id));
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('post'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const acceptedExt = ['.png', '.jpg', '.jpeg'];
        if (!acceptedExt.includes(ext)) {
          req.fileValidationError = `Ext is not supported, ext should be ${acceptedExt.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = 'File size is too large, max size is 5MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (file) {
      updatePostDto.thumbnail = file.path;
    }
    return this.postService.update(Number(id), updatePostDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.postService.remove(Number(id));
  }
}
