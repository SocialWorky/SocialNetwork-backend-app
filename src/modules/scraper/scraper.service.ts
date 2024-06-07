import { Injectable } from '@nestjs/common';
import axios from 'axios';
import cheerio from 'cheerio';

@Injectable()
export class ScraperService {
  async scrapeMetadata(url: string): Promise<any> {
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      const metadata = {
        ogTitle: $('meta[property="og:title"]').attr('content'),
        ogDescription: $('meta[property="og:description"]').attr('content'),
        ogImage: {
          url: $('meta[property="og:image"]').attr('content'),
        },
        ogUrl: $('meta[property="og:url"]').attr('content'),
        ogType: $('meta[property="og:type"]').attr('content'),
      };

      return metadata;
    } catch (error) {
      throw new Error(`Failed to fetch metadata: ${error.message}`);
    }
  }
}
