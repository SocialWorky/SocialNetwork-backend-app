import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUser, UpdateUser } from './dto/user.dto';
import { User } from '../entities/user.entity';
import { AuthController } from '../auth/auth.controller';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly authController: AuthController,
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
    user._id = this.authController.cryptoUserKey(
      createUserDto.email,
      createUserDto.password,
    );

    user.username = createUserDto.username;
    user.name = createUserDto.name;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, 10);
    user.isAdmin = createUserDto.isAdmin;
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
      'isVerified',
      'avatar',
    ]);
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

  async update(_id: string, updateUser: UpdateUser): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { _id: _id },
    });
    user.username = updateUser.username ? updateUser.username : user.username;
    user.name = updateUser.name ? updateUser.name : user.name;
    user.lastName = updateUser.lastName ? updateUser.lastName : user.lastName;
    user.isAdmin = updateUser.isAdmin ? updateUser.isAdmin : user.isAdmin;
    user.isVerified = updateUser.isVerified
      ? updateUser.isVerified
      : user.isVerified;
    user.isActive = updateUser.isActive ? updateUser.isActive : user.isActive;
    user.avatar = updateUser.avatar ? updateUser.avatar : user.avatar;
    user.token = updateUser.token ? updateUser.token : user.token;
    if (updateUser.password) {
      user.password = await bcrypt.hash(updateUser.password, 10);
    }

    return this.usersRepository.save(user);
  }

  async remove(id: number, _id: string): Promise<string> {
    const requestingUser = await this.usersRepository.findOne({
      where: { _id: _id },
    });
    if (!requestingUser.isAdmin) {
      throw new HttpException('Unauthorized access', HttpStatus.FORBIDDEN);
    }

    const userToDelete = await this.usersRepository.findOne({
      where: { id: id },
    });
    if (!userToDelete) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (userToDelete.isAdmin) {
      throw new HttpException(
        'Cannot delete an administrator',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.usersRepository.remove(userToDelete);

    return 'User ' + userToDelete.username + ' removed';
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email: email });
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
