import {
  Controller,
  Get,
  Query,
  ValidationPipe,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('scrape')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @ApiExcludeEndpoint()
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
