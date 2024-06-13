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
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { AuthService } from '../../auth/auth.service';
import { Role } from '../../common/enums/rol.enum';
import { Auth } from '../../auth/decorators/auth.decorator';
import { ActiveUser } from '../../common/decorator/active-user.decorator';
import { UserActiveInterface } from '../../common/interfaces/user-active.interface';
import { MailsService } from '../mails/mails.service';

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

  //Section Login
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
    this.usersService.update(user._id, { token: token });
    return {
      token,
    };
  }
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
      this.usersService.update(user._id, { token: token });
      return {
        token,
      };
    }
    if (emailUser) {
      const user = await this.usersService.findOneByEmail(data.email);
      const token = this.authService.signIn(user);
      this.usersService.update(emailUser._id, { token: token });
      return {
        token,
      };
    }
  }

  @Get('checkUsername/:username')
  async checkUsername(@Param('username') username: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      return true;
    }
    return false;
  }

  @Get('profile')
  @Auth(Role.USER)
  @ApiBearerAuth()
  getProfile(@ActiveUser() user: UserActiveInterface) {
    return user;
  }

  @Auth(Role.USER)
  @Get()
  @ApiBearerAuth()
  findAll(
    @Query('limit') limit?: number,
    @Query('role') role?: string,
    @Query('excludeAdmin') excludeAdmin?: boolean,
  ): Promise<User[]> {
    return this.usersService.findAll(limit, role, excludeAdmin);
  }

  @Auth(Role.USER)
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('_id') _id: string): Promise<User> {
    return this.usersService.findOne(_id);
  }

  @Auth(Role.USER)
  @Put('edit/:_id')
  @ApiBearerAuth()
  update(
    @Param('_id') _id: string,
    @Body() updateUser: UpdateUser,
  ): Promise<{ message: string }> {
    return this.usersService
      .update(_id, updateUser)
      .then(() => ({ message: 'User updated' }));
  }

  @Auth(Role.USER)
  @Delete('delete/:_idUserDelete')
  @ApiBearerAuth()
  async remove(@Param('_idUserDelete') _idUserDelete: string): Promise<string> {
    return this.usersService.remove(_idUserDelete);
  }

  @Auth(Role.USER)
  @Get('email/:email')
  @ApiBearerAuth()
  async findOneByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }

  @Auth(Role.USER)
  @Get('renewtoken/:_id')
  @ApiBearerAuth()
  async renewToken(@Param('_id') _id: string): Promise<string> {
    const user = await this.usersService.findOne(_id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.authService.renewToken(user);
  }

  @Auth(Role.USER)
  @Get('username/:username')
  @ApiBearerAuth()
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
    return this.usersService.findOneByUsername(username);
  }

  @Auth(Role.USER)
  @Get('validUser/:_id')
  @ApiBearerAuth()
  async validUser(@Param('_id') _id: string): Promise<boolean> {
    return this.usersService.validUser(_id);
  }
}
