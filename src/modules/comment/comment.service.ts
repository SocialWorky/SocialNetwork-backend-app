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

  async createComment(createCommentDto: CreateCommentDto) {
    const { content, containsMedia, authorId, idPublication, idMedia } = createCommentDto;

    const comment = new Comment();
    comment._id = this.authService.cryptoIdKey();

    comment.content = content;

    if (containsMedia) {
      comment.containsMedia = containsMedia;
    }

    const authorOptions: FindOneOptions<User> = { where: { _id: authorId } };
    comment.author = await this.userRepository.findOne(authorOptions);

    if (idMedia) {
      const mediaOptions: FindOneOptions<Media> = { where: { _id: idMedia } };
      comment.mediaComment = await this.mediaRepository.findOne(mediaOptions);
    }
    if (idPublication) {
      const publicationOptions: FindOneOptions<Publication> = {
        where: { _id: idPublication },
      };
      comment.publication =
        await this.publicationRepository.findOne(publicationOptions);
    }

    await this.commentRepository.save(comment);

    return {
      message: 'Comment created successfully',
      comment: comment, // Return the comment created full data, refactor this to return only the necessary data
    };
  }

  async getAllComments(): Promise<Comment[]> {
    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.publication', 'publication')
      .leftJoinAndSelect('comment.media', 'media')
      .select([
        'comment._id',
        'comment.content',
        'comment.containsMedia',
        'comment.createdAt',
        'comment.updatedAt',
        'comment.deleted',
        'author._id',
        'author.username',
        'author.name',
        'author.lastName',
        'publication._id',
        'publication.content',
        'publication.privacy',
        'publication.extraData',
        'publication.createdAt',
        'publication.updatedAt',
        'media._id',
        'media.url',
        'media.urlThumbnail',
        'media.urlCompressed',
      ]);

    queryBuilder
      .where('comment.deleted = false')
      .addOrderBy('comment.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  async updateComment(
    _id: string,
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
    await this.commentRepository.update(_id, { deleted: true });
  }

  async deleteCommentByUser(_id: string): Promise<void> {
    await this.commentRepository.update({ author: { _id: _id } }, { deleted: true });
  }

  async getCommentById(_id: string): Promise<any> {
    const result = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.author', 'author')
      .leftJoin('comment.publication', 'publication')
      .leftJoin('comment.media', 'media')
      .select('comment._id', '_id')
      .addSelect('comment.content', 'content')
      .addSelect('comment.containsMedia', 'containsMedia')
      .addSelect('comment.createdAt', 'createdAt')
      .addSelect('comment.updatedAt', 'updatedAt')
      .addSelect('comment.deleted', 'deleted')

      .addSelect('author._id', 'authorId')
      .addSelect('author.username', 'authorUsername')
      .addSelect('author.name', 'authorName')
      .addSelect('author.lastName', 'authorLastName')

      .addSelect('publication._id', 'publicationId')

      .addSelect('media._id', 'mediaId')
      .addSelect('media.url', 'mediaUrl')
      .addSelect('media.urlThumbnail', 'mediaUrlThumbnail')
      .addSelect('media.urlCompressed', 'mediaUrlCompressed')

      .where('comment._id = :_id', { _id })
      .andWhere('comment.deleted = false')
      .getRawOne();

    return result;
  }

}
