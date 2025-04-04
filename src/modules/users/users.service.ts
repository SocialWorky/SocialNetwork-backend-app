import { Injectable, HttpException, HttpStatus, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUser, LoginDto, UpdateUser } from './dto/user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { AuthService } from '../../auth/auth.service';
import { Email } from '../mails/entities/mail.entity';
import { Role } from 'src/common/enums/rol.enum';
import { Status } from 'src/common/enums/status.enum';
import { Friendship } from '../friends/entities/friend.entity';
import { ConfigService } from '../config/config.service';
import { InvitationCodeService } from '../invitationCode/invitation-code.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,

    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,

    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,

    private readonly authService: AuthService,
    
    private _configService: ConfigService,

    private readonly _invitationCodeService: InvitationCodeService,

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

    const configData = await this._configService.getConfig();
    if (configData.settings.invitationCode) {
      if (!createUserDto.invitationCode) {
        throw new HttpException(
          'Invitation code is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const validateInvitation = await this._invitationCodeService.validate(createUserDto.email, createUserDto.invitationCode);

      if (!validateInvitation) {
        throw new HttpException(
          'Invalid invitation code',
          HttpStatus.BAD_REQUEST,
        );
      }

      createUserDto.isVerified = true;

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

    const savedUser = await this.usersRepository.save(user);

    const profile = new Profile();
    profile.user = savedUser;
    await this.profilesRepository.save(profile);

    return savedUser;
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

    if (updateUser.isTooltipActive !== undefined) {
      user.isTooltipActive = updateUser.isTooltipActive;
    }

    if (updateUser.isDarkMode !== undefined) {
      user.isDarkMode = updateUser.isDarkMode;
    }

    if (updateUser.lastConnection) {
      user.lastConnection = updateUser.lastConnection;
    }

    await this.usersRepository.save(user);

    return 'User ' + user.username + ' updated';
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
      .leftJoinAndSelect('user.profile', 'profile')
      .select([
        'user._id',
        'user.username',
        'user.name',
        'user.lastName',
        'user.email',
        'user.role',
        'profile',
        'user.isVerified',
        'user.avatar',
        'user.isActive',
        'user.createdAt',
        'user.updatedAt',
      ])
      .orderBy('user.createdAt', 'DESC')
      .getMany();
  }

  async findUserById(_id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { _id: _id },
      relations: ['profile'],
      select: [
        '_id',
        'username',
        'name',
        'lastName',
        'email',
        'role',
        'isVerified',
        'avatar',
        'isTooltipActive',
        'isActive',
        'createdAt',
        'updatedAt',
        'lastConnection',
      ],
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

  async findUserByUserName(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username: username },
    });

    return user;
  }

  async findOneByName(username: string): Promise<
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

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email: email },
    });
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async remove(idUserDelete: string): Promise<string> {
    const userToDelete = await this.usersRepository.findOne({
      where: { _id: idUserDelete },
    });
    if (!userToDelete) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.usersRepository.update(userToDelete._id, {
      deletedAt: new Date(),
      isActive: false,
    });

    return 'User ' + userToDelete.username + ' removed';
  }

  async loginUser(loginData: LoginDto): Promise<{ token: string }> {
    const user = await this.findOneByEmail(loginData.email);
    if (!user) {
      throw new HttpException(
        'Unauthorized access. Please provide valid credentials to access this resource',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const userVerified = user.isVerified;
    if (!userVerified) {
      throw new HttpException('User is not verified', HttpStatus.UNAUTHORIZED);
    }
    const match = await this.compareHash(loginData.password, user.password);
    if (!match) {
      throw new HttpException(
        'Unauthorized access. Please provide valid credentials to access this resource',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = this.authService.signIn(user);

    this.update(user._id, { token: token });

    const userValidate = await this.findUserById(user._id);

    if (!userValidate.profile) {
      const newProfile = new Profile();
      newProfile.user = user;
      await this.profilesRepository.save(newProfile);
    }

    return { token };
  }

  async createOrVerifyProfile(_id: string) {
    const userValidate = await this.findUserById(_id);

    if (!userValidate) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!userValidate.profile) {
      const newProfile = new Profile();
      newProfile.user = userValidate;
      await this.profilesRepository.save(newProfile);
      return newProfile;
    }

    return userValidate.profile;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const user = await this.findUserById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const profile = await this.profilesRepository.findOne({
      where: { _id: user.profile?._id },
    });

    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    if (updateProfileDto.legend) {
      if (updateProfileDto.legend === 'null') {
        profile.legend = null;
      } else {
        profile.legend = updateProfileDto.legend;
      }
    }
    if (updateProfileDto.coverImage) {
      if (updateProfileDto.coverImage === 'null') {
        profile.coverImage = null;
      } else {
        profile.coverImage = updateProfileDto.coverImage;
      }
    }
    if (updateProfileDto.coverImageMobile) {
      if (updateProfileDto.coverImageMobile === 'null') {
        profile.coverImageMobile = null;
      } else {
        profile.coverImageMobile = updateProfileDto.coverImageMobile;
      }
    }
    if (updateProfileDto.dateOfBirth) {
      if (updateProfileDto.dateOfBirth === 'null') {
        profile.dateOfBirth = null;
      } else {
        profile.dateOfBirth = updateProfileDto.dateOfBirth;
      }
    }
    if (updateProfileDto.description) {
      if (updateProfileDto.description === 'null') {
        profile.description = null;
      } else {
        profile.description = updateProfileDto.description;
      }
    }
    if (updateProfileDto.location && updateProfileDto.location.city) {
      if (updateProfileDto.location.city === 'null') {
        profile.location.city = null;
      } else {
        profile.location.city = updateProfileDto.location.city;
      }
    }
    if (updateProfileDto.location && updateProfileDto.location.region) {
      if (updateProfileDto.location.region === 'null') {
        profile.location.region = null;
      } else {
        profile.location.region = updateProfileDto.location.region;
      }
    }
    if (updateProfileDto.location && updateProfileDto.location.country) {
      if (updateProfileDto.location.country === 'null') {
        profile.location.country = null;
      } else {
        profile.location.country = updateProfileDto.location.country;
      }
    }
    if (updateProfileDto.socialNetwork) {
      profile.socialNetwork = {
        nombre: updateProfileDto.socialNetwork.nombre,
        link: updateProfileDto.socialNetwork.link,
        type: updateProfileDto.socialNetwork.type,
      };
    }
    if (updateProfileDto.relationshipStatus) {
      if (updateProfileDto.relationshipStatus === 'null') {
        profile.relationshipStatus = null;
      } else {
        profile.relationshipStatus = updateProfileDto.relationshipStatus;
      }
    }
    if (updateProfileDto.website) {
      if (updateProfileDto.website === 'null') {
        profile.website = null;
      } else {
        profile.website = updateProfileDto.website;
      }
    }
    if (updateProfileDto.phone) {
      if (updateProfileDto.phone === 'null') {
        profile.phone = null;
      } else {
        profile.phone = updateProfileDto.phone;
      }
    }
    if (updateProfileDto.whatsapp) {
      profile.whatsapp = {
        number: updateProfileDto.whatsapp.number,
        isViewable: updateProfileDto.whatsapp.isViewable,
      };
    }
    if (updateProfileDto.sex) {
      if (updateProfileDto.sex === 'null') {
        profile.sex = null;
      } else {
        profile.sex = updateProfileDto.sex;
      }
    }
    if (updateProfileDto.work) {
      if (updateProfileDto.work === 'null') {
        profile.work = null;
      } else {
        profile.work = updateProfileDto.work;
      }
    }
    if (updateProfileDto.school) {
      if (updateProfileDto.school === 'null') {
        profile.school = null;
      } else {
        profile.school = updateProfileDto.school;
      }
    }
    if (updateProfileDto.university) {
      if (updateProfileDto.university === 'null') {
        profile.university = null;
      } else {
        profile.university = updateProfileDto.university;
      }
    }
    if (updateProfileDto.hobbies) {
      profile.hobbies = {
        name: updateProfileDto.hobbies.name,
      };
    }
    if (updateProfileDto.interests) {
      profile.interests = {
        name: updateProfileDto.interests.name,
      };
    }
    if (updateProfileDto.languages) {
      profile.languages = {
        name: updateProfileDto.languages.name,
      };
    }

    await this.profilesRepository.save(profile);

    return profile;
  }

  async areFriends(userId: string, requestId: string): Promise<boolean> {
    const existingFriendship = await this.friendshipRepository.findOne({
      where: [
        {
          requester: { _id: userId },
          receiver: { _id: requestId },
          status: Status.ACCEPTED,
        },
        {
          requester: { _id: requestId },
          receiver: { _id: userId },
          status: Status.ACCEPTED,
        },
      ],
      relations: ['requester', 'receiver'],
    });

    return !!existingFriendship;
  }

  async hasPendingFriendRequest(
    userId1: string,
    userId2: string,
  ): Promise<{ status: boolean; _id: string }> {
    const pendingFriendship = await this.friendshipRepository.findOne({
      where: [
        {
          requester: { _id: userId1 },
          receiver: { _id: userId2 },
          status: Status.PENDING,
        },
        {
          requester: { _id: userId2 },
          receiver: { _id: userId1 },
          status: Status.PENDING,
        },
      ],
      relations: ['requester', 'receiver'],
    });

    return { status: !!pendingFriendship, _id: pendingFriendship?.id };
  }

  async getFriendsList(userId: string): Promise<
    {
      _id: string;
      username: string;
      name: string;
      lastName: string;
      email: string;
      avatar: string;
    }[]
  > {
    const friendships = await this.friendshipRepository.find({
      where: [
        { requester: { _id: userId }, status: Status.ACCEPTED },
        { receiver: { _id: userId }, status: Status.ACCEPTED },
      ],
      relations: ['requester', 'receiver'],
    });
  
    const friends = friendships.map((friendship) => {
      const friend =
        friendship.requester._id === userId
          ? friendship.receiver
          : friendship.requester;
  
      return {
        _id: friend._id,
        username: friend.username,
        name: friend.name,
        lastName: friend.lastName,
        email: friend.email,  
        avatar: friend.avatar,
      };
    });
  
    return friends;
  }

}
