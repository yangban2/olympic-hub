import { NextResponse } from 'next/server';
import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';

interface MedalData {
  rank: number;
  country: string;
  countryCode: string;
  flag: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
  publishedAt: string;
  category: string;
}

interface Highlight {
  sport: string;
  event: string;
  winner: string;
  country: string;
  countryCode: string;
  flag: string;
  result?: string;
  time: string;
}

interface ScheduleEvent {
  time: string;
  sport: string;
  event: string;
  venue: string;
  status: 'upcoming' | 'live' | 'finished';
}

async function scrapeMedals() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.olympics.com/en/olympic-games/milano-cortina-2026/medals', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await page.waitForSelector('table', { timeout: 10000 });

    const medals: MedalData[] = await page.$$eval('table tbody tr', (rows) => {
      return rows.map((row, index) => {
        const cells = row.querySelectorAll('td');
        const countryElement = cells[1];
        const country = countryElement?.textContent?.trim() || '';
        const countryCode = countryElement?.querySelector('span')?.getAttribute('data-country-code') || '';
        
        // Flag emoji from country code
        const flag = countryCode
          ? String.fromCodePoint(...countryCode.split('').map(c => 0x1F1E6 - 65 + c.charCodeAt(0)))
          : '🏳️';

        return {
          rank: index + 1,
          country,
          countryCode,
          flag,
          gold: parseInt(cells[2]?.textContent?.trim() || '0', 10),
          silver: parseInt(cells[3]?.textContent?.trim() || '0', 10),
          bronze: parseInt(cells[4]?.textContent?.trim() || '0', 10),
          total: parseInt(cells[5]?.textContent?.trim() || '0', 10),
        };
      });
    });

    await browser.close();
    return medals;
  } catch (error) {
    await browser.close();
    throw error;
  }
}

async function scrapeNews() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.olympics.com/en/olympic-games/milano-cortina-2026/news', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await page.waitForSelector('article', { timeout: 10000 });

    const news: NewsArticle[] = await page.$$eval('article', (articles) => {
      return articles.slice(0, 10).map((article, index) => {
        const titleEl = article.querySelector('h3, h2, .title');
        const summaryEl = article.querySelector('p, .summary, .description');
        const linkEl = article.querySelector('a');
        const imageEl = article.querySelector('img');
        
        const title = titleEl?.textContent?.trim() || 'Untitled';
        const summary = summaryEl?.textContent?.trim() || '';
        const url = linkEl?.getAttribute('href') || '';
        const image = imageEl?.getAttribute('src') || '';
        
        return {
          id: `news-${Date.now()}-${index}`,
          title,
          summary: summary.substring(0, 200),
          url: url.startsWith('http') ? url : `https://www.olympics.com${url}`,
          image: image.startsWith('http') ? image : `https://www.olympics.com${image}`,
          publishedAt: new Date().toISOString(),
          category: 'general',
        };
      });
    });

    await browser.close();
    return news;
  } catch (error) {
    await browser.close();
    console.error('News scraping failed:', error);
    return [];
  }
}

async function scrapeHighlights() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.olympics.com/en/olympic-games/milano-cortina-2026/results', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await page.waitForSelector('.result-item, .event-result', { timeout: 10000 });

    const highlights: Highlight[] = await page.$$eval('.result-item, .event-result', (items) => {
      return items.slice(0, 5).map((item) => {
        const sportEl = item.querySelector('.sport, [data-sport]');
        const eventEl = item.querySelector('.event, [data-event]');
        const winnerEl = item.querySelector('.winner, .athlete-name');
        const countryEl = item.querySelector('.country, [data-country]');
        const resultEl = item.querySelector('.result, .time, .score');
        
        const sport = sportEl?.textContent?.trim() || 'Unknown';
        const event = eventEl?.textContent?.trim() || 'Unknown';
        const winner = winnerEl?.textContent?.trim() || 'Unknown';
        const country = countryEl?.textContent?.trim() || 'Unknown';
        const countryCode = countryEl?.getAttribute('data-country-code') || '';
        const result = resultEl?.textContent?.trim() || '';
        
        const flag = countryCode
          ? String.fromCodePoint(...countryCode.split('').map(c => 0x1F1E6 - 65 + c.charCodeAt(0)))
          : '🏳️';
        
        return {
          sport,
          event,
          winner,
          country,
          countryCode,
          flag,
          result,
          time: new Date().toISOString(),
        };
      });
    });

    await browser.close();
    return highlights;
  } catch (error) {
    await browser.close();
    console.error('Highlights scraping failed:', error);
    return [];
  }
}

async function scrapeSchedule() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.olympics.com/en/milano-cortina-2026/schedule', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await page.waitForSelector('.schedule-item, .event-schedule', { timeout: 10000 });

    const schedule: ScheduleEvent[] = await page.$$eval('.schedule-item, .event-schedule', (items) => {
      return items.slice(0, 20).map((item) => {
        const timeEl = item.querySelector('.time, [data-time]');
        const sportEl = item.querySelector('.sport, [data-sport]');
        const eventEl = item.querySelector('.event, [data-event]');
        const venueEl = item.querySelector('.venue, [data-venue]');
        const statusEl = item.querySelector('.status, [data-status]');
        
        return {
          time: timeEl?.textContent?.trim() || '',
          sport: sportEl?.textContent?.trim() || 'Unknown',
          event: eventEl?.textContent?.trim() || 'Unknown',
          venue: venueEl?.textContent?.trim() || 'Unknown',
          status: (statusEl?.textContent?.trim().toLowerCase() as any) || 'upcoming',
        };
      });
    });

    await browser.close();
    return schedule;
  } catch (error) {
    await browser.close();
    console.error('Schedule scraping failed:', error);
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🚀 Olympic Hub data update started...');

    // Scrape all data in parallel
    const [medals, news, highlights, schedule] = await Promise.all([
      scrapeMedals(),
      scrapeNews(),
      scrapeHighlights(),
      scrapeSchedule(),
    ]);

    // Save data files
    const dataDir = path.join(process.cwd(), 'public', 'data');
    await fs.mkdir(dataDir, { recursive: true });

    await Promise.all([
      fs.writeFile(
        path.join(dataDir, 'medals.json'),
        JSON.stringify({ lastUpdated: new Date().toISOString(), medals }, null, 2)
      ),
      fs.writeFile(
        path.join(dataDir, 'news.json'),
        JSON.stringify({ lastUpdated: new Date().toISOString(), articles: news }, null, 2)
      ),
      fs.writeFile(
        path.join(dataDir, 'highlights.json'),
        JSON.stringify({ lastUpdated: new Date().toISOString(), highlights }, null, 2)
      ),
      fs.writeFile(
        path.join(dataDir, 'schedule.json'),
        JSON.stringify({ lastUpdated: new Date().toISOString(), events: schedule }, null, 2)
      ),
    ]);

    console.log('✅ All data updated successfully!');

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        medals: medals.length,
        news: news.length,
        highlights: highlights.length,
        schedule: schedule.length,
      },
    });
  } catch (error: any) {
    console.error('❌ Update failed:', error);
    return NextResponse.json(
      { error: 'Update failed', message: error.message },
      { status: 500 }
    );
  }
}
