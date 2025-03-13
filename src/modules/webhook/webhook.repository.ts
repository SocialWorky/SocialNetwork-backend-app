import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Webhook } from './entities/webhook.entity';

@Injectable()
export class WebhookRepository {
  constructor(
    @InjectRepository(Webhook)
    private readonly webhookRepo: Repository<Webhook>,
  ) {}

  async findByEvent(event: string): Promise<Webhook[]> {
    return this.webhookRepo.find({ where: { event, isActive: true } });
  }

  async findOneById(_id: string): Promise<Webhook> {
    return this.webhookRepo.findOneBy({ _id });
  }

  async findAll(): Promise<Webhook[]> {
    return this.webhookRepo.find();
  }

  async create(event: string, url: string): Promise<Webhook> {
    const webhook = this.webhookRepo.create({ event, url, isActive: true });
    return this.webhookRepo.save(webhook);
  }

  async delete(_id: string): Promise<void> {
    await this.webhookRepo.delete(_id);
  }

  async toggleActive(_id: string, isActive: boolean): Promise<void> {
    await this.webhookRepo.update(_id, { isActive });
  }

  async update(_id: string, event: string, url: string): Promise<void> {
    await this.webhookRepo.update(_id, { event, url });
  }
}
