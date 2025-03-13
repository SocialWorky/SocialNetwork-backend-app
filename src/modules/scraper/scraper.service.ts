import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ScraperService {
  async scrapeMetadata(url: string): Promise<any> {
    try {
      const validUrl = this.validateUrl(url);
      if (!validUrl) {
        throw new BadRequestException('Invalid URL provided');
      }

      const response = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        },
        maxRedirects: 5,
      });
      const html = response.data;
      const $ = cheerio.load(html);

      const metadata = {
        ogTitle:
          $('meta[property="og:title"]').attr('content') || $('title').text(),
        ogDescription:
          $('meta[property="og:description"]').attr('content') ||
          $('meta[name="description"]').attr('content'),
        ogImage: {
          url:
            $('meta[property="og:image"]').attr('content') ||
            $('link[rel="image_src"]').attr('href'),
        },
        ogUrl: $('meta[property="og:url"]').attr('content') || url,
        ogType: $('meta[property="og:type"]').attr('content'),
        twitterCard: $('meta[name="twitter:card"]').attr('content'),
        twitterSite: $('meta[name="twitter:site"]').attr('content'),
        twitterTitle: $('meta[name="twitter:title"]').attr('content'),
        twitterDescription: $('meta[name="twitter:description"]').attr(
          'content',
        ),
        twitterImage: {
          url: $('meta[name="twitter:image"]').attr('content'),
        },
        fbAppId: $('meta[property="fb:app_id"]').attr('content'),
        fbAdmins: $('meta[property="fb:admins"]').attr('content'),
        whatsappImage: $('meta[property="og:image"]').attr('content'),
        instagramUsername: $('meta[property="instapp:owner_user_id"]').attr(
          'content',
        ),
        linkedinTitle: $('meta[property="og:title"]').attr('content'),
        linkedinDescription: $('meta[property="og:description"]').attr(
          'content',
        ),
        linkedinImage: $('meta[property="og:image"]').attr('content'),
      };

      return metadata;
    } catch (error) {
      throw new Error(`Failed to fetch metadata: ${error.message}`);
    }
  }

  private validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
