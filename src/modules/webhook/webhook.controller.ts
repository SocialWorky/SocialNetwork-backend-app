// webhook.controller.ts
import { Controller, Post, Delete, Put, Body, Param, UseGuards, Get } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookRepository } from './webhook.repository';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Role } from '../../common/enums/rol.enum';

@Controller('webhooks')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly webhookRepo: WebhookRepository,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.EDITOR)
  @Post('register')
  async registerWebhook(@Body() body: { event: string; url: string }) {
    const { event, url } = body;
    return this.webhookService.registerWebhook(event, url);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.EDITOR)
  @Get()
  async getWebhooks() {
    return this.webhookService.getAllWebhooks();
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.EDITOR)
  @Delete(':_id')
  async deleteWebhook(@Param('_id') _id: string) {
    await this.webhookRepo.delete(_id);
    return { message: 'Webhook deleted' };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.EDITOR)
  @Put(':_id/toggle-active')
  async toggleActive(@Param('_id') _id: string, @Body('isActive') isActive: boolean) {
    await this.webhookRepo.toggleActive(_id, isActive);
    return { message: `Webhook ${isActive ? 'enabled' : 'disabled'} successfully` };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(Role.EDITOR)
  @Put(':_id')
  async editWebhook(
    @Param('_id') _id: string,
    @Body() body: { event: string; url: string },
  ) {
    const { event, url } = body;
    await this.webhookService.editWebhook(_id, event, url);
    return { message: 'Webhook actualizado exitosamente' };
  }
}
