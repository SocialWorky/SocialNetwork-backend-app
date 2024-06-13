import { Injectable, HttpException, HttpStatus, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUser, UpdateUser } from './dto/user.dto';
import { User } from './entities/user.entity';
import { AuthService } from '../../auth/auth.service';
import { Email } from '../mails/entities/mail.entity';
import { Role } from 'src/common/enums/rol.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,

    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUser): Promise<User> {
    const usernameLowercase = createUserDto.username.toLowerCase();

    const userExistsByEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    const userNameExist = await this.usersRepository.findOne({
      where: { username: usernameLowercase },
    });

    if (userExistsByEmail) {
      throw new HttpException(
        'E-mail is already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (userNameExist) {
      throw new HttpException(
        'Username is already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new User();
    user._id = this.authService.cryptoIdKey();

    user.username = usernameLowercase;
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

  async findAll(
    @Query('limit') limit?: number,
    @Query('role') role?: string,
    @Query('excludeAdmin') excludeAdmin: boolean = true,
  ): Promise<User[]> {
    const params = {
      limit,
      role,
      excludeAdmin,
    };

    const queryBuilder = await this.usersRepository.createQueryBuilder('user');

    if (params.limit) {
      queryBuilder.limit(params.limit);
    }

    if (params.role) {
      queryBuilder.andWhere('user.role = :role', { role: params.role });
    }

    if (params.excludeAdmin) {
      queryBuilder.andWhere('user.role != :role', { role: 'admin' });
    }

    return queryBuilder
      .select([
        'user._id',
        'user.username',
        'user.name',
        'user.lastName',
        'user.email',
        'user.role',
        'user.isVerified',
        'user.avatar',
        'user.isActive',
        'user.createdAt',
        'user.updatedAt',
      ])
      .orderBy('user._id', 'DESC')
      .getMany();
  }

  async findOne(_id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { _id: _id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async validUser(_id: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { _id: _id },
    });

    if (!user) {
      return false;
    }

    return true;
  }

  async findOneByUsername(username: string): Promise<
    {
      _id: string;
      username: string;
      name: string;
      lastName: string;
      email: string;
      role: Role;
      avatar: string;
    }[]
  > {
    const searchTerms = username.split(' ').filter((term) => term);

    const searchConditions = searchTerms
      .map((term) => [
        { name: ILike(`%${term}%`) },
        { lastName: ILike(`%${term}%`) },
      ])
      .flat();

    const users = await this.usersRepository.find({
      select: [
        '_id',
        'username',
        'name',
        'lastName',
        'email',
        'role',
        'avatar',
      ],
      where: searchConditions,
    });

    return users.map((user) => ({
      _id: user._id,
      username: user.username,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    }));
  }

  async update(_id: string, updateUser: UpdateUser): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { _id: _id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (updateUser.username) {
      user.username = updateUser.username;
    }

    if (updateUser.name) {
      user.name = updateUser.name;
    }

    if (updateUser.lastName) {
      user.lastName = updateUser.lastName;
    }

    if (updateUser.role) {
      user.role = updateUser.role;
    }

    if (updateUser.isVerified !== undefined) {
      user.isVerified = updateUser.isVerified;
    }

    if (updateUser.isActive !== undefined) {
      user.isActive = updateUser.isActive;
    }

    if (updateUser.avatar) {
      user.avatar = updateUser.avatar;
    }

    if (updateUser.token) {
      user.token = updateUser.token;
    }

    if (updateUser.password) {
      user.password = await bcrypt.hash(updateUser.password, 10);
    }

    await this.usersRepository.save(user);

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
