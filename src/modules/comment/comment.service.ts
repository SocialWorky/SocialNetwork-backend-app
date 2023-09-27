import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/comment.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { Media } from 'src/modules/postMediaFiles/entities/postMediaFiles.entity';
import { Publication } from '../publications/entities/publications.entity';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,

    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private authService: AuthService,
  ) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { content, authorId, idPublication } = createCommentDto;

    const comment = new Comment();
    comment._id = this.authService.cryptoIdKey();

    comment.content = content;

    const authorOptions: FindOneOptions<User> = { where: { _id: authorId } };
    comment.author = await this.userRepository.findOne(authorOptions);

    const publicationOptions: FindOneOptions<Publication> = {
      where: { _id: idPublication },
    };
    comment.publication =
      await this.publicationRepository.findOne(publicationOptions);

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
