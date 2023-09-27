import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/comment.dto';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Role } from '../../common/enums/rol.enum';

@ApiTags('Comments')
@Auth(Role.USER)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  @ApiBearerAuth()
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentService.createComment(createCommentDto);
  }

  @Auth(Role.ADMIN)
  @Get('all')
  @ApiBearerAuth()
  async getAllComments(): Promise<Comment[]> {
    return this.commentService.getAllComments();
  }

  @Put(':id')
  @ApiBearerAuth()
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentService.updateComment(id, updateCommentDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  async deleteComment(@Param('id') id: string): Promise<void> {
    return this.commentService.deleteComment(id);
  }
}
