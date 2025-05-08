import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
  Inject,
  BadRequestException,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUser, UpdateUser, LoginDto } from './dto/user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { AuthService } from '../../auth/auth.service';
import { Role } from '../../common/enums/rol.enum';
import { Auth } from '../../auth/decorators/auth.decorator';
import { ActiveUser } from '../../common/decorator/active-user.decorator';
import { UserActiveInterface } from '../../common/interfaces/user-active.interface';
import { MailsService } from '../mails/mails.service';
import { Profile } from './entities/profile.entity';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { EventService } from '../webhook/event.service';
import { EventEnum } from '../webhook/enums/event.enum';
import { AppLogger } from '../records-logs/logger.service';
import { PublicationService } from '../publications/publication.service';
import { CommentService } from '../comment/comment.service';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
    private _publicationService: PublicationService,
    private _commentService: CommentService,
    private readonly _mailsService: MailsService,
    private readonly _eventService: EventService,
    @Inject(AppLogger) private readonly _logger: AppLogger,
  ) {}

  @Post('create')
  @ApiExcludeEndpoint()
  async create(@Body() createUser: CreateUser): Promise<User> {
    const user = await this.usersService.create(createUser);

    if (!user) {

      this._logger.error(
        `Failed to create user`,
        'UsersController create',
        {
          user: user,
        }
      );

      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!user.isVerified) {
      await this._mailsService
        .sendEmailWithRetry(user._id, createUser.mailDataValidate)
        .catch(() => {

          this._logger.error(
            `Failed to send email`,
            'UsersController create',
            {
              user: user,
              mailData: createUser.mailDataValidate,
            }
          );

          throw new HttpException(
            'Failed send email',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });
      this._eventService.emit(EventEnum.USER_REGISTERED, user);

      this._logger.log(
        `User created`,
        'UsersController create',
        {
          user: user,
        }
      );

      return user;

    } else {
      this._eventService.emit(EventEnum.USER_EMAIL_VERIFIED, user);

      this._logger.log(
        `User created`,
        'UsersController create',
        {
          user: user,
        }
      );
    }

    return user;
  }

  // Section Login
  @ApiOperation({
    summary: 'Login user by email and password',
  })
  @ApiOkResponse({
    description: 'Login user',
  })
  @ApiNotFoundResponse({
    description:
      'Login failed. The provided credentials are incorrect or the user does not exist.',
  })
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginData.email);
    if (!user) {
      this._logger.error(
        `Login failed. The user does not exist.`,
        'UsersController',
        {
          email: loginData.email,
        }
      );
      throw new HttpException(
        'Unauthorized access. Please provide valid credentials to access this resource',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const userVerified = user.isVerified;
    if (!userVerified) {
      this._logger.log(
        `Login failed. User is not verified`,
        'UsersController',
        {
          email: loginData.email,
        }
      );
      throw new HttpException('User is not verified', HttpStatus.UNAUTHORIZED);
    }
    const match = await this.usersService.compareHash(
      loginData.password,
      user.password,
    );
    if (!match) {
      this._logger.error(
        `Login failed. The provided credentials are incorrect`,
        'UsersController',
        {
          email: loginData.email,
        }
      );
      throw new HttpException(
        'Unauthorized access. Please provide valid credentials to access this resource',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = this.authService.signIn(user);

    await this.usersService.update(user._id, { token: token, lastConnection: new Date() });

    await this.usersService.createOrVerifyProfile(user._id);

    const userLogged = {
      _id : user._id,
      username: user.username,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      lastConnection: user.lastConnection,
      isTooltipActive: user.isTooltipActive,
      isDarkMode: user.isDarkMode,
    }

    this._eventService.emit(EventEnum.USER_LOGIN, userLogged);

    return {
      token,
      user: userLogged,
    };
  }

  @ApiExcludeEndpoint()
  @Post('loginGoogle')
  async loginGoogle(@Body() data: any) {
    const validateToken = await this.authService.validateTokenGoogle(
      data.token,
    );
    if (!validateToken) {
      this._logger.error(
        `Login failed. The provided credentials are incorrect, token is invalid`,
        'UsersController LoginGoogle',
        {
          email: data.email,
        }
      );
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    }
    const emailUser = await this.usersService.findOneByEmail(data.email);
    if (!emailUser) {
      const createUser: CreateUser = {
        username: data.username,
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: Role.USER,
        isVerified: true,
      };
      const user = await this.usersService.create(createUser);
      const token = this.authService.signIn(user);

      await this.usersService.createOrVerifyProfile(user._id);

      await this.usersService.update(user._id, { token: token });

      const userLogged = {
            _id : user._id,
            username: user.username,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            lastConnection: user.lastConnection,
            isTooltipActive: user.isTooltipActive,
            isDarkMode: user.isDarkMode,
          }

      this._eventService.emit(EventEnum.USER_LOGIN, userLogged);

      return {
        token,
        user: userLogged,
      };
    }
    if (emailUser) {
      const user = await this.usersService.findOneByEmail(data.email);
      const token = this.authService.signIn(user);

      await this.usersService.createOrVerifyProfile(user._id);

      await this.usersService.update(emailUser._id, { token: token });

      const userLogged = {
            _id : user._id,
            username: user.username,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            lastConnection: user.lastConnection,
            isTooltipActive: user.isTooltipActive,
            isDarkMode: user.isDarkMode,
          }

      this._eventService.emit(EventEnum.USER_LOGIN, userLogged);

      return {
        token,
        user: userLogged,
      };
    }
  }

  @Get('checkUsername/:username')
  async checkUsername(@Param('username') username: string) {
    const user = await this.usersService.findUserByUserName(username);
    if (user) {
      return true;
    }
    return false;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Get('profile')
  getProfile(@ActiveUser() user: UserActiveInterface) {
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('role') role?: string,
    @Query('excludeAdmin') excludeAdmin?: boolean,
  ): Promise<User[]> {
    return this.usersService.findAll(limit, role, excludeAdmin);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Get(':_id')
  async findUserById(@Param('_id') _id: string): Promise<User> {
    return this.usersService.findUserById(_id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Put('edit/:_id')
  update(
    @Param('_id') _id: string,
    @Body() updateUser: UpdateUser,
  ): Promise<{ message: string }> {

    const user = this.usersService
      .update(_id, updateUser)
      .then(() => ({ message: 'User updated' }));

    this._logger.log(
      `User updated`,
      'UsersController',
      {
        _id: _id,
        user: user,
        updateData: updateUser,
      }
    );

    this._eventService.emit(EventEnum.USER_EDITED, user);

    return user;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Delete('delete/:_idUserDelete')
  async remove(@Param('_idUserDelete') _idUserDelete: string): Promise<string> {
    const user = await this.usersService.findUserById(_idUserDelete);
    if (!user) {
      this._logger.error(
        `User not found`,
        'UsersController remove',
        {
          _id: _idUserDelete,
        }
      );
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    this._eventService.emit(EventEnum.USER_DELETED, user);

    this._logger.log(
      `User deleted`,
      'UsersController remove',
      {
        _id: _idUserDelete,
        user: user,
      }
    );

    this._publicationService.deletePublicationsByUser(user);
    this._commentService.deleteCommentByUser(user._id);
    return this.usersService.remove(_idUserDelete);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Get('email/:email')
  async findOneByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Get('renewToken/:_id')
  async renewToken(@Param('_id') _id: string): Promise<string> {
    const user = await this.usersService.findUserById(_id);
    if (!user) {
      this._logger.error(
        `User not found`,
        'UsersController renewToken',
        {
          _id: _id,
        }
      );
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.authService.renewToken(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Get('username/:username')
  async findOneByUsername(@Param('username') username: string): Promise<
    {
      _id: string;
      username: string;
      name: string;
      email: string;
      role: Role;
      avatar: string;
    }[]
  > {
    return this.usersService.findOneByName(username);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Get('validUser/:_id')
  async validUser(@Param('_id') _id: string): Promise<boolean> {
    return this.usersService.validUser(_id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Put('profile/:_id')
  async updateProfile(
    @Param('_id') _id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<{ message: string }> {

    this._logger.log(
      `Profile updated`,
      'UsersController',
      {
        _id: _id,
        updateData: updateProfileDto,
      }
    );

    return this.usersService
      .updateProfile(_id, updateProfileDto)
      .then(() => ({ message: 'Profile updated' }));
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Get('friends/:_id/:_idRequest')
  async friends(
    @Param('_id') _id: string,
    @Param('_idRequest') _idRequest: string,
  ): Promise<boolean> {
    return this.usersService.areFriends(_id, _idRequest);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Get('pending-friend/:_id/:_idRequest')
  async pendingFriend(
    @Param('_id') _id: string,
    @Param('_idRequest') _idRequest: string,
  ): Promise<{ status: boolean; _id: string }> {
    return this.usersService.hasPendingFriendRequest(_id, _idRequest);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Get('myFriends/:_id')
  async friendsRequest(@Param('_id') _id: string): Promise<
    {
      _id: string;
      username: string;
      name: string;
      lastName: string;
      email: string;
      avatar: string;
    }[]
  > {
    return this.usersService.getFriendsList(_id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Get('validate-profile/:_id')
  async validateProfile(@Param('_id') _id: string): Promise<Profile> {
    return this.usersService.createOrVerifyProfile(_id);
  }

  @Post('register-device')
  async registerDevice(@Body() body: { deviceId: string }, @Req() req) {
    const userId = req.user.id;
    const { deviceId } = body;

    if (!deviceId) {
      throw new BadRequestException('El parámetro deviceId es requerido.');
    }

    try {
      await this.usersService.registerDevice(userId, deviceId);
      return { message: 'Dispositivo registrado correctamente.' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al registrar el dispositivo.');
    }
  }

  @Get('device-id/:userId')
  async getDeviceId(@Param('userId') userId: string) {
    try {
      const deviceId = await this.usersService.getDeviceId(userId);
      return { deviceId };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al obtener el ID del dispositivo.');
    }
  }

}
