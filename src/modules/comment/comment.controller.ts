import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/comment.dto';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Role } from '../../common/enums/rol.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@ApiTags('Comments')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Auth(Role.USER)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<{ message: string; comment: any }> {
    return this.commentService.createComment(createCommentDto);
  }

  @Auth(Role.ADMIN)
  @Get('all')
  async getAllComments(): Promise<Comment[]> {
    return this.commentService.getAllComments();
  }

  @Put(':id')
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentService.updateComment(id, updateCommentDto);
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: string): Promise<void> {
    return this.commentService.deleteComment(id);
  }

  @Get(':id')
  async getCommentById(@Param('id') id: string): Promise<Comment> {
    return this.commentService.getCommentById(id);
  }
}
