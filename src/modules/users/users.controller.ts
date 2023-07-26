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
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { CreateUser, UpdateUser, LoginDto } from './dto/user.dto';
import { User } from '../../entities/user.entity';
import { UsersService } from './users.service';
import { AuthService } from '../../auth/authService';
import { AuthGuard } from '../../auth/auth.guard';

@ApiTags('user')
@Controller('api/user')
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
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginData.email);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const match = await this.usersService.compareHash(
      loginData.password,
      user.password,
    );
    if (!match) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const token = this.authService.signIn(user);
    this.usersService.update(user._id, { token: token });
    return { token };
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
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
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
  async remove(
    @Param('_idUserDelet') _idUserDelet: string,
    @Param('_idUser') _idUser: string,
  ): Promise<string> {
    return this.usersService.remove(_idUserDelet, _idUser);
  }

  @UseGuards(AuthGuard)
  @Get(':email')
  @ApiBearerAuth()
  findOneByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }
}
