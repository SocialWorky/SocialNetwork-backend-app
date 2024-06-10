import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Publication } from './entities/publications.entity';
import { User } from '../users/entities/user.entity';
import { Media } from '../postMediaFiles/entities/postMediaFiles.entity';
import { Comment } from '../comment/entities/comment.entity';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
} from './dto/publication.dto';
import { AuthService } from '../../auth/auth.service';
import { Friendship } from '../friends/entities/friend.entity';
import { Status } from 'src/common/enums/status.enum';

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

    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
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

  async getFriendIds(userId: string): Promise<string[]> {
    const friendships = await this.friendshipRepository.find({
      where: [
        { requester: { _id: userId }, status: Status.ACCEPTED },
        { receiver: { _id: userId }, status: Status.ACCEPTED },
      ],
      relations: ['requester', 'receiver'],
    });

    const friendIds = friendships.map((friendship) =>
      friendship.requester._id === userId
        ? friendship.receiver._id
        : friendship.requester._id,
    );

    return friendIds;
  }

  async getAllPublications(
    page: number = 1,
    pageSize: number = 10,
    type: string = 'all',
    userId: string,
  ): Promise<Publication[]> {
    const skip = (page - 1) * pageSize;
    const friendIds = await this.getFriendIds(userId); // Obtener los IDs de los amigos

    const queryBuilder = this.publicationRepository
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
      ]);

    if (type === 'all') {
      queryBuilder
        .where(
          new Brackets((qb) => {
            qb.where('publication.privacy = :privacyPublic', {
              privacyPublic: 'public',
            }).orWhere('publication.author._id = :userId', { userId });

            if (friendIds.length > 0) {
              qb.orWhere(
                new Brackets((subQb) => {
                  subQb
                    .where('publication.author._id IN (:...friendIds)', {
                      friendIds,
                    })
                    .andWhere('publication.privacy IN (:...privacyLevels)', {
                      privacyLevels: ['friends', 'public'],
                    });
                }),
              );
            }
          }),
        )
        .andWhere('publication.deletedAt IS NULL')
        .orderBy('publication.createdAt', 'DESC')
        .addOrderBy('comment.createdAt', 'DESC');
    } else if (type === 'public') {
      queryBuilder
        .where('publication.privacy = :privacy', { privacy: 'public' })
        .andWhere('publication.deletedAt IS NULL')
        .orderBy('publication.createdAt', 'DESC')
        .addOrderBy('comment.createdAt', 'DESC');
    } else if (type === 'private') {
      queryBuilder
        .where('publication.privacy = :privacy', { privacy: 'private' })
        .andWhere('publication.author._id = :userId', { userId })
        .andWhere('publication.deletedAt IS NULL')
        .orderBy('publication.createdAt', 'DESC')
        .addOrderBy('comment.createdAt', 'DESC');
    }

    const publications = await queryBuilder.skip(skip).take(pageSize).getMany();
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
