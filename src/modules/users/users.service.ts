import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUser, UpdateUser } from './dto/user.dto';
import { User } from './entities/user.entity';
import { AuthService } from '../../auth/auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUser): Promise<User> {
    const userExistsByEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userExistsByEmail) {
      throw new HttpException(
        'E-mail is already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new User();
    user._id = this.authService.cryptoIdKey();

    user.username = createUserDto.username;
    user.name = createUserDto.name;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, 10);
    user.role = createUserDto.role;
    user.isVerified = createUserDto.isVerified;
    user.isActive = createUserDto.isActive;
    user.token = createUserDto.token;
    user.avatar = createUserDto.avatar;

    return this.usersRepository.save(user);
  }

  async findAllSelect(select): Promise<User[]> {
    return this.usersRepository.find({ select: select });
  }

  async findAll(): Promise<User[]> {
    return this.findAllSelect([
      '_id',
      'username',
      'name',
      'lastName',
      'email',
      'role',
      'isVerified',
      'avatar',
    ]);
  }

  async findOne(_id: string): Promise<User> {
    return this.usersRepository.findOneBy({ _id: _id });
  }

  async update(_id: string, updateUser: UpdateUser): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { _id: _id },
    });
    user.username = updateUser.username ? updateUser.username : user.username;
    user.name = updateUser.name ? updateUser.name : user.name;
    user.lastName = updateUser.lastName ? updateUser.lastName : user.lastName;
    user.role = updateUser.role ? updateUser.role : user.role;
    user.isVerified = updateUser.isVerified
      ? updateUser.isVerified
      : user.isVerified;
    user.isActive = updateUser.isActive ? updateUser.isActive : user.isActive;
    user.avatar = updateUser.avatar ? updateUser.avatar : user.avatar;
    user.token = updateUser.token ? updateUser.token : user.token;
    if (updateUser.password) {
      user.password = await bcrypt.hash(updateUser.password, 10);
    }

    this.usersRepository.save(user);

    return 'User ' + user.username + ' updated';
  }

  async remove(idUserDelet: string): Promise<string> {
    const userToDelete = await this.usersRepository.findOne({
      where: { _id: idUserDelet },
    });
    if (!userToDelete) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.usersRepository.remove(userToDelete);

    return 'User ' + userToDelete.username + ' removed';
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email: email },
    });
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
