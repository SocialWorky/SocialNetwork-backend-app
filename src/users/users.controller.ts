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
import { CreateUser, UpdateUser, LoginDto } from './dto/user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';
import { AuthService } from '../auth/authService';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('create')
  create(@Body() createUser: CreateUser): Promise<User> {
    return this.usersService.create(createUser);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put('edit/:_id')
  update(
    @Param('_id') _id: string,
    @Body() updateUser: UpdateUser,
  ): Promise<User> {
    return this.usersService.update(_id, updateUser);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id/:_id')
  async remove(
    @Param('id') id: number,
    @Param('_id') _id: string,
  ): Promise<string> {
    return this.usersService.remove(id, _id);
  }

  @UseGuards(AuthGuard)
  @Get(':email')
  findOneByEmail(@Param('email', ParseIntPipe) email: string): Promise<User> {
    return this.usersService.findOneByEmail(email);
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
}
