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
    publication.content = createPublicationDto.content || '';
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

    const userReceiving = await this.userRepository.findOneBy({
      _id: createPublicationDto.userReceivingId,
    });

    if (userReceiving) {
      publication.userReceiving = userReceiving;
    }

    const newPublications = await this.publicationRepository.save({
      ...publication,
      author,
    });

    return {
      message: 'Publication created successfully',
      publications: {
        _id: newPublications._id,
        content: newPublications.content,
        privacy: newPublications.privacy,
        extraData: newPublications.extraData,
        createdAt: newPublications.createdAt,
        updatedAt: newPublications.updatedAt,
        fixed: newPublications.fixed,
        author: {
          _id: author._id,
          username: author.username,
          name: author.name,
          lastName: author.lastName,
          avatar: author.avatar,
          email: author.email,
        },
      },
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

  async getPendingFriendRequests(
    userId: string,
  ): Promise<{ userId: string; requestId: string }[]> {
    const pendingFriendships = await this.friendshipRepository.find({
      where: [
        { requester: { _id: userId }, status: Status.PENDING },
        { receiver: { _id: userId }, status: Status.PENDING },
      ],
      relations: ['requester', 'receiver'],
    });

    return pendingFriendships.map((friendship) => ({
      userId:
        friendship.requester._id === userId
          ? friendship.receiver._id
          : friendship.requester._id,
      requestId: friendship.id,
    }));
  }

  // TODO: Este método debería ser refactorizado para que sea más eficiente, los filtros se estan realizando en memoria.
  async getAllPublications(
    page: number = 1,
    pageSize: number = 10,
    type: string = 'all',
    consultId: string,
    userId: string = '',
  ): Promise<{ publications: Publication[]; total: number }> {
    const skip = (page - 1) * pageSize;

    let friendIds = [];
    let pendingFriendRequests = [];

    if (type === 'all') {
      friendIds = await this.getFriendIds(userId);
      pendingFriendRequests = await this.getPendingFriendRequests(userId);
    } else if (type === 'postProfile' && consultId !== userId) {
      friendIds = await this.getFriendIds(consultId);
      pendingFriendRequests = await this.getPendingFriendRequests(consultId);
    }

    const queryBuilder = this.publicationRepository
      .createQueryBuilder('publication')
      .leftJoinAndSelect('publication.author', 'author')
      .leftJoinAndSelect('publication.userReceiving', 'userReceiving')
      .leftJoinAndSelect('publication.media', 'media')
      .leftJoinAndSelect('media.comments', 'mediaComments')
      .leftJoinAndSelect('mediaComments.author', 'mediaCommentsAuthor')
      .leftJoinAndSelect('publication.reaction', 'reaction')
      .leftJoinAndSelect('reaction.user', 'reactionUser')
      .leftJoinAndSelect(
        'reaction.customReaction',
        'customReaction',
        undefined,
        { withDeleted: true },
      )
      .leftJoinAndSelect('publication.taggedUsers', 'taggedUsers')
      .leftJoinAndSelect('taggedUsers.userTagged', 'taggedUser')
      .leftJoinAndSelect('publication.comment', 'comment')
      .leftJoinAndSelect('comment.author', 'commentAuthor')
      .leftJoinAndSelect('comment.media', 'commentMedia')
      .leftJoinAndSelect('commentMedia.comments', 'commentMediaComments')
      .leftJoinAndSelect('commentMediaComments.author', 'commentMediaCommentsAuthor')
      .select([
        'publication._id',
        'publication.content',
        'publication.privacy',
        'publication.fixed',
        'publication.extraData',
        'author._id',
        'author.username',
        'author.name',
        'author.lastName',
        'author.avatar',
        'author.email',
        'userReceiving._id',
        'userReceiving.username',
        'userReceiving.name',
        'userReceiving.lastName',
        'userReceiving.avatar',
        'userReceiving.email',
        'publication.createdAt',
        'publication.updatedAt',
        'media._id',
        'media.url',
        'media.urlThumbnail',
        'media.urlCompressed',
        'mediaComments._id',
        'mediaComments.content',
        'mediaComments.createdAt',
        'mediaCommentsAuthor._id',
        'mediaCommentsAuthor.name',
        'mediaCommentsAuthor.lastName',
        'mediaCommentsAuthor.username',
        'mediaCommentsAuthor.avatar',
        'reaction._id',
        'reaction.isPublications',
        'reaction.isComment',
        'reaction.customReaction',
        'reactionUser._id',
        'reactionUser.username',
        'reactionUser.name',
        'reactionUser.lastName',
        'reactionUser.avatar',
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
        'commentMedia.urlThumbnail',
        'commentMedia.urlCompressed',
        'commentMediaComments._id',
        'commentMediaComments.content',
        'commentMediaComments.createdAt',
        'commentMediaCommentsAuthor._id',
        'commentMediaCommentsAuthor.name',
        'commentMediaCommentsAuthor.lastName',
        'commentMediaCommentsAuthor.username',
        'commentMediaCommentsAuthor.avatar',
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
        .andWhere('publication.deletedAt IS NULL');
    } else if (
      type === 'postProfile' &&
      consultId !== userId &&
      friendIds.includes(userId)
    ) {
      queryBuilder
        .where(
          new Brackets((qb) => {
            qb.where('publication.author._id = :consultId', { consultId })
              .orWhere('publication.userReceiving = :consultId');
          })
        )
        .andWhere('publication.privacy IN (:...privacyLevels)', {
          privacyLevels: ['public', 'friends'],
        })
        .andWhere('publication.deletedAt IS NULL');
    } else if (
      type === 'postProfile' &&
      consultId !== userId &&
      !friendIds.includes(userId)
    ) {
      queryBuilder
        .where('publication.author._id = :consultId', { consultId })
        .andWhere('publication.privacy IN (:...privacyLevels)', {
          privacyLevels: ['public'],
        })
        .andWhere('publication.deletedAt IS NULL');
    } else if (type === 'postProfile' && consultId === userId) {
      queryBuilder
        .where(
          new Brackets(qb => {
            qb.where('publication.author._id = :consultId', { consultId })
              .orWhere('publication.userReceiving = :userReceiving', {
                userReceiving: consultId,
              });
          })
        )
        .andWhere('publication.deletedAt IS NULL');
    }

    queryBuilder
      .orderBy('publication.fixed', 'DESC')
      .addOrderBy('publication.createdAt', 'DESC')
      .addOrderBy('comment.createdAt', 'DESC');

    const [publications, total] = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    //TODO Agregar isMyFriend e isFriendshipPending a cada publicación
    const finalPublications = publications.map((publication) => {
      const pendingRequest = pendingFriendRequests.find(
        (request) => request.userId === publication.author._id,
      );

      return {
        ...publication,
        isMyFriend: friendIds.includes(publication.author._id),
        isFriendshipPending: pendingRequest ? pendingRequest.requestId : null,
      };
    });

    return {
      publications: finalPublications,
      total,
    };
  }

  async getCountPublications() {
    return await this.publicationRepository.count();
  }

  async getPublicationById(_id: string, currentUserId: string) {

    let friendIds = [];

    let pendingFriendRequests = [];

    friendIds = await this.getFriendIds(currentUserId);

    pendingFriendRequests = await this.getPendingFriendRequests(currentUserId);

    const publications = await this.publicationRepository
      .createQueryBuilder('publication')
      .leftJoinAndSelect('publication.author', 'author')
      .leftJoinAndSelect('publication.userReceiving', 'userReceiving')
      .leftJoinAndSelect('publication.media', 'media')
      .leftJoinAndSelect('media.comments', 'mediaComments')
      .leftJoinAndSelect('mediaComments.author', 'mediaCommentsAuthor')
      .leftJoinAndSelect('publication.reaction', 'reaction')
      .leftJoinAndSelect('reaction.user', 'reactionUser')
      .leftJoinAndSelect(
        'reaction.customReaction',
        'customReaction',
        undefined,
        { withDeleted: true },
      )
      .leftJoinAndSelect('publication.taggedUsers', 'taggedUsers')
      .leftJoinAndSelect('taggedUsers.userTagged', 'taggedUser')
      .leftJoinAndSelect('publication.comment', 'comment')
      .leftJoinAndSelect('comment.author', 'commentAuthor')
      .leftJoinAndSelect('comment.media', 'commentMedia')
      .leftJoinAndSelect('commentMedia.comments', 'commentMediaComments')
      .leftJoinAndSelect('commentMediaComments.author', 'commentMediaCommentsAuthor')
      .select([
        'publication._id',
        'publication.content',
        'publication.privacy',
        'publication.fixed',
        'publication.extraData',
        'author._id',
        'author.username',
        'author.name',
        'author.lastName',
        'author.avatar',
        'author.email',
        'userReceiving._id',
        'userReceiving.username',
        'userReceiving.name',
        'userReceiving.lastName',
        'userReceiving.avatar',
        'userReceiving.email',
        'publication.createdAt',
        'publication.updatedAt',
        'media._id',
        'media.url',
        'media.urlThumbnail',
        'media.urlCompressed',
        'mediaComments._id',
        'mediaComments.content',
        'mediaComments.createdAt',
        'mediaCommentsAuthor._id',
        'mediaCommentsAuthor.name',
        'mediaCommentsAuthor.lastName',
        'mediaCommentsAuthor.username',
        'mediaCommentsAuthor.avatar',
        'reaction._id',
        'reaction.isPublications',
        'reaction.isComment',
        'reaction.customReaction',
        'reactionUser._id',
        'reactionUser.username',
        'reactionUser.name',
        'reactionUser.lastName',
        'reactionUser.avatar',
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
        'commentMedia.urlThumbnail',
        'commentMedia.urlCompressed',
        'commentMediaComments._id',
        'commentMediaComments.content',
        'commentMediaComments.createdAt',
        'commentMediaCommentsAuthor._id',
        'commentMediaCommentsAuthor.name',
        'commentMediaCommentsAuthor.lastName',
        'commentMediaCommentsAuthor.username',
        'commentMediaCommentsAuthor.avatar',
      ])
      .where('publication._id = :_id', { _id })
      .andWhere('publication.deletedAt IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where('publication.author._id = :currentUserId', { currentUserId })
          .orWhere('publication.privacy = :privacyPublic', { privacyPublic: 'public' });
          
          if (friendIds.length > 0) {
            qb.orWhere(
              new Brackets((subQb) => {
                subQb
                  .where('publication.author._id IN (:...friendIds)', { friendIds })
                  .andWhere('publication.privacy IN (:...privacyLevels)', {
                    privacyLevels: ['friends', 'public'],
                  });
              }),
            );
          }
        }),
      )
      .orderBy('comment.createdAt', 'DESC')
      .getMany();

      //TODO Agregar isMyFriend e isFriendshipPending a cada publicación
      const finalPublications = publications.map((publication) => {
        const pendingRequest = pendingFriendRequests.find(
          (request) => request.userId === publication.author._id,
        );

        return {
          ...publication,
          isMyFriend: friendIds.includes(publication.author._id),
          isFriendshipPending: pendingRequest ? pendingRequest.requestId : null,
        };
      });

    return finalPublications;
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

    if (updatePublicationDto.fixed !== undefined) {
      publication.fixed = updatePublicationDto.fixed;
    }

    if (updatePublicationDto.content) {
      publication.content = updatePublicationDto.content;
    }

    if (updatePublicationDto.privacy) {
      publication.privacy = updatePublicationDto.privacy;
    }

    publication.updatedAt = new Date();
    await this.publicationRepository.save(publication);

    return { message: 'Publication updated successfully' };
  }

  async deletePublication(id: string): Promise<{ _id: string }> {
    await this.publicationRepository.update(id, { deletedAt: new Date() });
    return { _id: id };
  }
}
