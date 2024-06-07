import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from './entities/publications.entity';
import { User } from '../users/entities/user.entity';
import { Media } from '../postMediaFiles/entities/postMediaFiles.entity';
import { Comment } from '../comment/entities/comment.entity';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
} from './dto/publication.dto';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class PublicationService {
  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  async createPublication(createPublicationDto: CreatePublicationDto) {
    const publication = new Publication();
    publication._id = this.authService.cryptoIdKey();
    publication.content = createPublicationDto.content;
    publication.privacy = createPublicationDto.privacy;
    publication.extraData = createPublicationDto.extraData;
    publication.createdAt = new Date();
    publication.updatedAt = new Date();

    const author = await this.userRepository.findOneBy({
      _id: createPublicationDto.authorId,
    });
    if (!author) {
      throw new BadRequestException('Author not found');
    }

    const newPublications = await this.publicationRepository.save({
      ...publication,
      author,
    });

    return {
      message: 'Publication created successfully',
      publications: newPublications,
    };
  }

  async getAllPublications(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    const skip = (page - 1) * pageSize;
    const publications = await this.publicationRepository
      .createQueryBuilder('publication')
      .leftJoinAndSelect('publication.author', 'author')
      .leftJoinAndSelect('publication.media', 'media')
      .leftJoinAndSelect('publication.reaction', 'reaction')
      .leftJoinAndSelect('reaction.user', 'reactionUser')
      .leftJoinAndSelect('reaction.customReaction', 'customReaction')
      .leftJoinAndSelect('publication.taggedUsers', 'taggedUsers')
      .leftJoinAndSelect('taggedUsers.userTagged', 'taggedUser')
      .leftJoinAndSelect('publication.comment', 'comment')
      .leftJoinAndSelect('comment.author', 'commentAuthor')
      .leftJoinAndSelect('comment.media', 'commentMedia')
      .select([
        'publication._id',
        'publication.content',
        'publication.privacy',
        'publication.extraData',
        'author._id',
        'author.username',
        'author.name',
        'author.lastName',
        'author.avatar',
        'publication.createdAt',
        'publication.updatedAt',
        'media._id',
        'media.url',
        'media.urlThumbnail',
        'media.urlCompressed',
        'reaction._id',
        'reactionUser._id',
        'reactionUser.username',
        'taggedUsers._id',
        'taggedUser._id',
        'taggedUser.username',
        'taggedUser.name',
        'customReaction._id',
        'customReaction.name',
        'customReaction.emoji',
        'comment._id',
        'comment.content',
        'comment.createdAt',
        'commentAuthor._id',
        'commentAuthor.name',
        'commentAuthor.lastName',
        'commentAuthor.username',
        'commentAuthor.avatar',
        'commentMedia._id',
        'commentMedia.url',
      ])
      .where('publication.deletedAt IS NULL')
      .orderBy('publication.createdAt', 'DESC')
      .addOrderBy('comment.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getMany();
    return publications;
  }

  async getCountPublications() {
    return await this.publicationRepository.count();
  }

  async getPublicationById(_id: string) {
    const publications = await this.publicationRepository
      .createQueryBuilder('publication')
      .leftJoinAndSelect('publication.author', 'author')
      .leftJoinAndSelect('publication.media', 'media')
      .leftJoinAndSelect('publication.reaction', 'reaction')
      .leftJoinAndSelect('reaction.user', 'reactionUser')
      .leftJoinAndSelect('reaction.customReaction', 'customReaction')
      .leftJoinAndSelect('publication.taggedUsers', 'taggedUsers')
      .leftJoinAndSelect('taggedUsers.userTagged', 'taggedUser')
      .leftJoinAndSelect('publication.comment', 'comment')
      .leftJoinAndSelect('comment.author', 'commentAuthor')
      .leftJoinAndSelect('comment.media', 'commentMedia')
      .select([
        'publication._id',
        'publication.content',
        'publication.privacy',
        'publication.extraData',
        'author._id',
        'author.username',
        'author.name',
        'author.lastName',
        'author.avatar',
        'publication.createdAt',
        'publication.updatedAt',
        'media._id',
        'media.url',
        'media.urlThumbnail',
        'media.urlCompressed',
        'reaction._id',
        'reactionUser._id',
        'reactionUser.username',
        'taggedUsers._id',
        'taggedUser._id',
        'taggedUser.username',
        'taggedUser.name',
        'customReaction._id',
        'customReaction.name',
        'customReaction.emoji',
        'comment._id',
        'comment.content',
        'comment.createdAt',
        'commentAuthor._id',
        'commentAuthor.name',
        'commentAuthor.lastName',
        'commentAuthor.username',
        'commentAuthor.avatar',
        'commentMedia._id',
        'commentMedia.url',
      ])
      .where('publication._id = :_id', { _id: _id })
      .andWhere('publication.deletedAt IS NULL')
      .getMany();
    return publications;
  }

  async updatePublication(
    _id: string,
    updatePublicationDto: UpdatePublicationDto,
  ) {
    const publication = await this.publicationRepository.findOne({
      where: { _id: _id },
    });
    if (!publication) {
      throw new Error('Publication not found');
    }

    const shouldUpdate =
      updatePublicationDto.content || updatePublicationDto.privacy;

    if (shouldUpdate) {
      publication.content = updatePublicationDto.content
        ? updatePublicationDto.content
        : publication.content;
      publication.privacy = updatePublicationDto.privacy
        ? updatePublicationDto.privacy
        : publication.privacy;

      publication.updatedAt = new Date();
      await this.publicationRepository.save(publication);
    }

    return { message: 'Publication updated successfully' };
  }

  async deletePublication(id: string): Promise<void> {
    await this.publicationRepository.update(id, { deletedAt: new Date() });
  }
}
