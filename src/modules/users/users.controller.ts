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
import { AuthGuard } from 'src/auth/guard/auth.guard';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
    private readonly _mailsService: MailsService,
  ) {}

  @Post('create')
  @ApiExcludeEndpoint()
  async create(@Body() createUser: CreateUser): Promise<User> {
    const user = await this.usersService.create(createUser);
    await this._mailsService
      .sendEmailWithRetry(user._id, createUser.mailDataValidate)
      .catch(() => {
        throw new HttpException(
          'Failed send email',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
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
      throw new HttpException(
        'Unauthorized access. Please provide valid credentials to access this resource',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const userVerified = user.isVerified;
    if (!userVerified) {
      throw new HttpException('User is not verified', HttpStatus.UNAUTHORIZED);
    }
    const match = await this.usersService.compareHash(
      loginData.password,
      user.password,
    );
    if (!match) {
      throw new HttpException(
        'Unauthorized access. Please provide valid credentials to access this resource',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = this.authService.signIn(user);

    await this.usersService.update(user._id, { token: token });

    await this.usersService.createOrVerifyProfile(user._id);

    return {
      token,
    };
  }

  @ApiExcludeEndpoint()
  @Post('loginGoogle')
  async loginGoogle(@Body() data: any) {
    const validateToken = await this.authService.validateTokenGoogle(
      data.token,
    );
    if (!validateToken) {
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
      return {
        token,
      };
    }
    if (emailUser) {
      const user = await this.usersService.findOneByEmail(data.email);
      const token = this.authService.signIn(user);

      await this.usersService.createOrVerifyProfile(user._id);

      await this.usersService.update(emailUser._id, { token: token });
      return {
        token,
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
    return this.usersService
      .update(_id, updateUser)
      .then(() => ({ message: 'User updated' }));
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Delete('delete/:_idUserDelete')
  async remove(@Param('_idUserDelete') _idUserDelete: string): Promise<string> {
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
  @Get('renewtoken/:_id')
  async renewToken(@Param('_id') _id: string): Promise<string> {
    const user = await this.usersService.findUserById(_id);
    if (!user) {
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
    return this.usersService
      .updateProfile(_id, updateProfileDto)
      .then(() => ({ message: 'Profile updated' }));
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Get('friends/:_id/:_idrequest')
  async friends(
    @Param('_id') _id: string,
    @Param('_idrequest') _idrequest: string,
  ): Promise<boolean> {
    return this.usersService.areFriends(_id, _idrequest);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Get('pending-friend/:_id/:_idrequest')
  async pendingFriend(
    @Param('_id') _id: string,
    @Param('_idrequest') _idrequest: string,
  ): Promise<{ status: boolean; _id: string }> {
    return this.usersService.hasPendingFriendRequest(_id, _idrequest);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.USER)
  @Get('validate-profile/:_id')
  async validateProfile(@Param('_id') _id: string): Promise<Profile> {
    return this.usersService.createOrVerifyProfile(_id);
  }
}
