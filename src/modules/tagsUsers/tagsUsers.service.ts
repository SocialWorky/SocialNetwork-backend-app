import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/tagsUsers.dto';
import { TagUsers } from './entities/tagUsers.entity';
import { User } from '../users/entities/user.entity';
import { AuthService } from '../../auth/auth.service';
import { Publication } from '../publications/entities/publications.entity';
import { Comment } from '../comment/entities/comment.entity';

@Injectable()
export class TagsUsersService {
  constructor(
    @InjectRepository(TagUsers)
    private readonly tagRepository: Repository<TagUsers>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  async createTag(createTagDto: CreateTagDto) {
    const { userTagged, _idPublication } = createTagDto;

    const users = await this.userRepository.findOneBy({
      _id: userTagged,
    });

    if (!users) {
      throw new BadRequestException('User not found');
    }

    const tag = new TagUsers();
    tag._id = this.authService.cryptoIdKey();

    tag._idPublication = _idPublication;

    tag.userTagged = users[0];

    await this.tagRepository.save(tag);
    return { message: 'User as Tagged' };
  }

  async getTagById(_idPublication: string): Promise<TagUsers> {
    return this.tagRepository.findOne({
      where: { _idPublication: _idPublication },
    });
  }

  async deleteTag(_id: string): Promise<void> {
    await this.tagRepository.delete(_id);
  }
}
