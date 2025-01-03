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
        logoUrl: 'assets/img/navbar/worky-your-logo.png',
        title: 'Worky',
        themeColors: JSON.stringify({}),
        privacyPolicy: 'Default Privacy Policy',
        contactEmail: 'soporte@worky.cl',
        faviconUrl: 'favicon.ico',
        loginMethods: JSON.stringify({ email: true, google: true }),
        urlSite: 'http://localhost:3000',
        description: 'Worky es una plataforma para compartir ofertas de trabajo',
      };
      defaultConfig.services = {
        logs: {
          enabled: false,
          urlApi: '',
          token: '',
        },
      };
      defaultConfig.customCss = '';
      defaultConfig.createdAt = new Date();
      defaultConfig.updatedAt = new Date();
      await this.configRepository.save(defaultConfig);
    }
  }

  async getConfig(): Promise<Config> {
    const config = await this.configRepository.findOne({ where: { id: 1 } });
    delete config.services;
    return config;
  }

  async getServices(): Promise<Config> {
    return this.configRepository.findOne({
      select: ['services'],
      where: { id: 1 },
    });
  }

  async updateConfig(updateConfigDto: UpdateConfigDto): Promise<Config> {
    let config = await this.configRepository.findOne({ where: { id: 1 } });
    if (!config) {
      config = new Config();
    }
    config.settings = {
      logoUrl: updateConfigDto.logoUrl || config.settings.logoUrl,
      title: updateConfigDto.title || config.settings.title,
      themeColors: updateConfigDto.themeColors || config.settings.themeColors,
      privacyPolicy:
        updateConfigDto.privacyPolicy || config.settings.privacyPolicy,
      contactEmail:
        updateConfigDto.contactEmail || config.settings.contactEmail,
      faviconUrl: updateConfigDto.faviconUrl || config.settings.faviconUrl,
      loginMethods:
        updateConfigDto.loginMethods || config.settings.loginMethods,
      urlSite: updateConfigDto.urlSite || config.settings.urlSite,
      description: updateConfigDto.description || config.settings.description,
    };

    config.customCss = updateConfigDto.customCss;
    config.updatedAt = new Date();

    if (updateConfigDto.services === undefined) {
      return this.configRepository.save(config);
    }
    config.services = {
      logs: !Array.isArray(updateConfigDto.services.logs) ? updateConfigDto.services.logs : config.services.logs,
    };
 
    return this.configRepository.save(config);
  }
}
