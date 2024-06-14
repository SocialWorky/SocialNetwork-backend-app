import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Reaction } from './entities/reaction.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Publication } from '../publications/entities/publications.entity';
import { Comment } from '../comment/entities/comment.entity';
import { CreateReactionDto } from './dto/reaction.dto';
import { CustomReaction } from '../customReaction/entities/customReaction.entity';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,

    @InjectRepository(CustomReaction)
    private readonly customReactionRepository: Repository<CustomReaction>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  async createReaction(createReactionDto: CreateReactionDto) {
    const customReactionRes = await this.customReactionRepository.findOneBy({
      _id: createReactionDto._idCustomReaction,
    });

    if (!customReactionRes) {
      throw new BadRequestException('Custom reaction not found');
    }

    const reaction = new Reaction();

    reaction._id = this.authService.cryptoIdKey();

    const userAuthor: FindOneOptions<User> = {
      where: { _id: createReactionDto.authorId },
    };

    const user = await this.userRepository.findOne(userAuthor);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    reaction.user = user;

    reaction.customReaction = customReactionRes;

    if (createReactionDto.isPublications) {
      const publication = await this.publicationRepository.findOne({
        where: { _id: createReactionDto._idPublication },
      });

      if (!publication) {
        throw new BadRequestException('Publication not found');
      }

      reaction.isPublications = true;
      reaction.isComment = false;
      reaction.publication = publication;
    }

    if (createReactionDto.isComment) {
      const comment = await this.commentRepository.findOne({
        where: { _id: createReactionDto._idPublication },
      });

      if (!comment) {
        throw new BadRequestException('Comment not found');
      }

      reaction.isPublications = false;
      reaction.isComment = true;
      reaction.comment = comment;
    }

    await this.reactionRepository.save(reaction);

    return { message: 'Reaction created successfully' };
  }

  async getReactionById(_id: string): Promise<Reaction> {
    return this.reactionRepository.findOneBy({ _id: _id });
  }

  async getAllReactions(): Promise<Reaction[]> {
    return this.reactionRepository.find();
  }

  async updateReaction(
    _id: string,
    reactionData: CreateReactionDto,
  ): Promise<Reaction> {
    const reaction = await this.reactionRepository.findOne({
      where: { _id: _id },
    });

    if (!reaction) {
      throw new BadRequestException('Reaction not found');
    }

    const customReactionRes = await this.customReactionRepository.findOneBy({
      _id: reactionData._idCustomReaction,
    });

    if (!customReactionRes) {
      throw new BadRequestException('Custom reaction not found');
    }

    reaction.customReaction = customReactionRes;

    if (reactionData.isPublications) {
      const publication = await this.publicationRepository.findOne({
        where: { _id: reactionData._idPublication },
      });

      if (!publication) {
        throw new BadRequestException('Publication not found');
      }

      reaction.isPublications = true;
      reaction.isComment = false;
      reaction.publication = publication;
    }

    if (reactionData.isComment) {
      const comment = await this.commentRepository.findOne({
        where: { _id: reactionData._idPublication },
      });

      if (!comment) {
        throw new BadRequestException('Comment not found');
      }

      reaction.isPublications = false;
      reaction.isComment = true;
      reaction.comment = comment;
    }

    return await this.reactionRepository.save(reaction);
  }

  async deleteReaction(_id: string): Promise<void> {
    await this.reactionRepository.delete(_id);
  }
}
