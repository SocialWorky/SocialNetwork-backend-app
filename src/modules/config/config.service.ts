import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Config } from './entities/config.entity';
import { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class ConfigService implements OnModuleInit {
  constructor(
    @InjectRepository(Config)
    private configRepository: Repository<Config>,
  ) {}

  async onModuleInit() {
    const configCount = await this.configRepository.count();
    if (configCount === 0) {
      const defaultConfig = new Config();
      defaultConfig.settings = {
        logoUrl: 'worky-your-logo.png',
        title: 'Worky',
        themeColors: JSON.stringify({}),
        privacyPolicy: 'Default Privacy Policy',
      };
      defaultConfig.createdAt = new Date();
      defaultConfig.updatedAt = new Date();
      await this.configRepository.save(defaultConfig);
    }
  }

  async getConfig(): Promise<Config> {
    return this.configRepository.findOne({ where: { id: 1 } });
  }

  async updateConfig(updateConfigDto: UpdateConfigDto): Promise<Config> {
    let config = await this.configRepository.findOne({ where: { id: 1 } });
    if (!config) {
      config = new Config();
    }
    config.settings = {
      ...config.settings,
      ...updateConfigDto,
    };
    config.updatedAt = new Date();
    return this.configRepository.save(config);
  }
}
