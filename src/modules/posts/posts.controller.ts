import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostDto } from './dto/post.dto';
import { Post as PostEntity } from './post.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async findAll() {
    return await this.postService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostEntity> {
    const post = await this.postService.findOne(parseInt(id));
    if (!post) {
      throw new NotFoundException("This Post doesn't Exist");
    }

    return post;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() post: PostDto, @Request() req): Promise<PostEntity> {
    console.log(req.user);
    return await this.postService.create(post, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() post: PostDto,
    @Request() req,
  ): Promise<PostEntity> {
    const { numberOfAffectedRows, updatedPost } = await this.postService.update(
      parseInt(id),
      post,
      req.user.id,
    );

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This Post Doesn't exist.");
    }

    return updatedPost;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const deleted = await this.postService.delete(parseInt(id), req.user.id);
    if (deleted === 0) {
      throw new NotFoundException("This Post Dosen't exist.");
    }

    return { message: 'Deleted Successfully' };
  }
}
