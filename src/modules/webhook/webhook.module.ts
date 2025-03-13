import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Webhook } from './entities/webhook.entity';
import { WebhookRepository } from './webhook.repository';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { EventService } from './event.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Webhook]),
    AuthModule,
  ],
  providers: [WebhookRepository, WebhookService, EventService],
  controllers: [WebhookController],
  exports: [WebhookService, EventService],
})
export class WebhookModule {}
