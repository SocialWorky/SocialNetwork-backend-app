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
  UseGuards,
  Request,
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
import { AuthGuard } from '../../auth/guard/auth.guard';

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

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiBearerAuth()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('_id', ParseIntPipe) _id: string): Promise<User> {
    return this.usersService.findOne(_id);
  }

  @UseGuards(AuthGuard)
  @Put('edit/:_id')
  @ApiBearerAuth()
  update(
    @Param('_id') _id: string,
    @Body() updateUser: UpdateUser,
  ): Promise<string> {
    return this.usersService.update(_id, updateUser);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:_idUserDelet/:_id')
  @ApiBearerAuth()
  async remove(@Param('_idUserDelet') _idUserDelet: string): Promise<string> {
    return this.usersService.remove(_idUserDelet);
  }

  @UseGuards(AuthGuard)
  @Get('email/:email')
  @ApiBearerAuth()
  async findOneByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }
}
