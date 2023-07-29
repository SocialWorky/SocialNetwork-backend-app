import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTagDto, UpdateTagDto } from './dto/tagsUsers.dto';
import { TagUsers } from './entities/tag.entity';
import { User } from '../users/entities/user.entity';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class TagsUsersService {
  constructor(
    @InjectRepository(TagUsers)
    private readonly tagRepository: Repository<TagUsers>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async createTag(createTagDto: CreateTagDto): Promise<TagUsers> {
    const tag = new TagUsers();
    tag._id = this.authService.cryptoIdKey();

    tag._idPublication = createTagDto._idPublication;
    const users = await this.userRepository.find({
      where: { _id: In(createTagDto.taggedUsers) },
    });
    tag.taggedUsers = users;

    return this.tagRepository.save(tag);
  }

  async getTagById(_idPublication: string): Promise<TagUsers> {
    return this.tagRepository.findOne({
      where: { _idPublication: _idPublication },
    });
  }

  async updateTag(_id: string, updateTagDto: UpdateTagDto): Promise<TagUsers> {
    const tag = await this.tagRepository.findOne({
      where: { _id: _id },
      relations: ['taggedUsers'], // Include the taggedUsers relation
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    tag._idPublication = updateTagDto._idPublication;

    if (updateTagDto.taggedUsers !== undefined) {
      // Convert _id strings to User objects using findByIds
      const users = await this.userRepository.find({
        where: { _id: In(updateTagDto.taggedUsers) },
      });
      tag.taggedUsers = users;
    }

    return this.tagRepository.save(tag);
  }

  async deleteTag(_id: string): Promise<void> {
    await this.tagRepository.delete(_id);
  }
}
