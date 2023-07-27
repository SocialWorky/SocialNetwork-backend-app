import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { Comment } from '../../entities/comment.entity';
import { CommentService } from './comment.service';

@Controller('api/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createComment(@Body() comment: Comment): Promise<Comment> {
    return this.commentService.createComment(comment);
  }

  @Get(':_id')
  async getCommentById(@Param('_id') _id: string): Promise<Comment> {
    return this.commentService.getCommentById(_id);
  }

  @Get()
  async getAllComments(): Promise<Comment[]> {
    return this.commentService.getAllComments();
  }

  @Put(':_id')
  async updateComment(
    @Param('_id') _id: string,
    @Body() commentData: Partial<Comment>,
  ): Promise<Comment> {
    return this.commentService.updateComment(_id, commentData);
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: number): Promise<void> {
    return this.commentService.deleteComment(id);
  }
}
