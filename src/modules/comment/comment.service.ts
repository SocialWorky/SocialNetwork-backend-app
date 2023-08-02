import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/comment.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { Publication } from '../publications/entities/publications.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { content, authorId, parentPublicationId } = createCommentDto;

    const comment = new Comment();
    comment.content = content;

    // Asignar el autor del comentario utilizando su ID
    const author = new User();
    author._id = authorId;
    comment.author = author;

    // Asignar la publicación padre del comentario utilizando su ID
    const parentPublication = new Publication();
    parentPublication._id = parentPublicationId;
    //comment.parentPublication = parentPublication;

    return this.commentRepository.save(comment);
  }

  async getAllComments(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  async updateComment(
    _id: string, // ID del comentario a editar
    updateCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const { content } = updateCommentDto;

    const comment = await this.commentRepository.findOne({
      where: { _id: _id },
    });
    if (!comment) {
      throw new Error('Comment not found');
    }

    comment.content = content;

    return this.commentRepository.save(comment);
  }

  async deleteComment(_id: string): Promise<void> {
    await this.commentRepository.delete(_id);
  }
}
