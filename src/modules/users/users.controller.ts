import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
  Put,
  HttpException,
  HttpStatus,
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

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('create')
  @ApiExcludeEndpoint()
  create(@Body() createUser: CreateUser): Promise<User> {
    return this.usersService.create(createUser);
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

  @Get('profile')
  @Auth(Role.USER)
  @ApiBearerAuth()
  getProfile(@ActiveUser() user: UserActiveInterface) {
    return user;
  }

  @Auth(Role.USER)
  @Get()
  @ApiBearerAuth()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Auth(Role.USER)
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('_id', ParseIntPipe) _id: string): Promise<User> {
    return this.usersService.findOne(_id);
  }

  @Auth(Role.USER)
  @Put('edit/:_id')
  @ApiBearerAuth()
  update(
    @Param('_id') _id: string,
    @Body() updateUser: UpdateUser,
  ): Promise<string> {
    return this.usersService.update(_id, updateUser);
  }

  @Auth(Role.USER)
  @Delete('delete/:_idUserDelete/:_id')
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
}
