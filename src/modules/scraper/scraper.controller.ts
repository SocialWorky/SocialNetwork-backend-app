import {
  Controller,
  Get,
  Query,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scrape')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get()
  async scrape(
    @Query('url', new ValidationPipe({ transform: true })) url: string,
  ) {
    try {
      const metadata = await this.scraperService.scrapeMetadata(url);
      return metadata;
    } catch (error) {
      throw new BadRequestException(
        `Failed to scrape metadata: ${error.message}`,
      );
    }
  }
}
