// webhook.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import fetch from 'node-fetch';
import { EventService } from './event.service';
import { WebhookRepository } from './webhook.repository';

@Injectable()
export class WebhookService implements OnModuleInit {
  private listenerRemovers: Map<string, () => void> = new Map();

  constructor(
    private readonly eventService: EventService,
    private readonly webhookRepo: WebhookRepository,
  ) {}

  async onModuleInit() {
    try {
      const webhooks = await this.webhookRepo.findAll(); 
      webhooks.forEach((webhook) => {
        this.registerListener(webhook);
      });
    } catch (error) {
      console.error('Error al cargar webhooks:', error);
    }
  }

  async getAllWebhooks() {
    return this.webhookRepo.findAll();
  }

  async registerWebhook(event: string, url: string) {
    const webhook = await this.webhookRepo.create(event, url);
    this.registerListener(webhook);
    return webhook;
  }

  async editWebhook(_id: string, event: string, url: string) {
    const remover = this.listenerRemovers.get(_id);
    if (remover) {_id
      remover();
      this.listenerRemovers.delete(_id);
    }

    await this.webhookRepo.update(_id, event, url);

    const updatedWebhook = await this.webhookRepo.findOneById(_id);

    this.registerListener(updatedWebhook);
  }

  async deleteWebhook(_id: string) {
    const remover = this.listenerRemovers.get(_id);
    if (remover) {
      remover();
      this.listenerRemovers.delete(_id);
    }
    await this.webhookRepo.delete(_id);
  }

  private async triggerWebhook(url: string, data: any) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error(`Error al enviar webhook a ${url}:`, error);
    }
  }

  private registerListener(webhook: any) {
    const remover = this.eventService.on(webhook.event, (data) =>
      this.triggerWebhook(webhook.url, data),
    );
    this.listenerRemovers.set(webhook._id, remover);
  }
}
