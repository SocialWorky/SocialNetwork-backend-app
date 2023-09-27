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
    const { authorId, _idCustomReaction } = createReactionDto;

    const customReactionRes = await this.customReactionRepository.find({
      where: { _id: _idCustomReaction },
    });

    if (!customReactionRes) {
      throw new Error('Custom reaction not found');
    }

    const reaction = new Reaction();
    reaction._id = this.authService.cryptoIdKey();

    const authorOptions: FindOneOptions<User> = { where: { _id: authorId } };
    reaction.user = await this.userRepository.findOne(authorOptions);

    reaction.customReaction = customReactionRes[0];

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
    reactionData: Partial<Reaction>,
  ): Promise<Reaction> {
    const reaction = await this.reactionRepository.findOne({
      where: { _id: _id },
    });
    if (!reaction) {
      throw new Error('Reaction not found');
    }
    Object.assign(reaction, reactionData);
    return this.reactionRepository.save(reaction);
  }

  async deleteReaction(_id: string): Promise<void> {
    await this.reactionRepository.delete(_id);
  }
}
