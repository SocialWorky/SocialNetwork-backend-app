import { Controller, Get, Put, Body } from '@nestjs/common';
import { ConfigService } from './config.service';
import { Config } from './entities/config.entity';
import { UpdateConfigDto } from './dto/update-config.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async getConfig(): Promise<Config> {
    return this.configService.getConfig();
  }

  @Put()
  @Auth(Role.ADMIN)
  @ApiBearerAuth()
  async updateConfig(
    @Body() updateConfigDto: UpdateConfigDto,
  ): Promise<Config> {
    return this.configService.updateConfig(updateConfigDto);
  }
}
