#!/usr/bin/env ts-node

/**
 * Olympic Hub - 전체 데이터 수집 스크립트
 * 메달, 뉴스, 하이라이트, 일정을 모두 수집하여 JSON 파일로 저장
 */

import { chromium } from 'playwright';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length < 2) return '🏳️';
  return String.fromCodePoint(
    ...countryCode.slice(0, 2).toUpperCase().split('').map(c => 0x1F1E6 - 65 + c.charCodeAt(0))
  );
}

async function scrapeMedals(): Promise<MedalData[]> {
  console.log('📊 메달 순위 수집 시작...');
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-http2']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  try {
    await page.goto('https://www.olympics.com/en/olympic-games/milano-cortina-2026/medals', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await page.waitForSelector('table', { timeout: 10000 });

    const medals = await page.$$eval('table tbody tr', (rows) => {
      return rows.map((row, index) => {
        const cells = row.querySelectorAll('td');
        const countryElement = cells[1];
        const country = countryElement?.textContent?.trim() || '';
        const countryCode = countryElement?.querySelector('span')?.getAttribute('data-country-code') || '';
        
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
    console.log(`✅ 메달 데이터 ${medals.length}개국 수집 완료`);
    return medals;
  } catch (error) {
    await browser.close();
    console.error('❌ 메달 수집 실패:', error);
    return [];
  }
}

async function scrapeNews(): Promise<NewsArticle[]> {
  console.log('📰 뉴스 수집 시작...');
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-http2']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  try {
    await page.goto('https://www.olympics.com/en/olympic-games/milano-cortina-2026/news', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await page.waitForSelector('article', { timeout: 10000 });

    const news = await page.$$eval('article', (articles) => {
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
    console.log(`✅ 뉴스 ${news.length}개 수집 완료`);
    return news;
  } catch (error) {
    await browser.close();
    console.error('❌ 뉴스 수집 실패:', error);
    return [];
  }
}

async function scrapeHighlights(): Promise<Highlight[]> {
  console.log('🏅 하이라이트 수집 시작...');
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-http2']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  try {
    await page.goto('https://www.olympics.com/en/olympic-games/milano-cortina-2026/results', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await page.waitForSelector('.result-item, .event-result', { timeout: 10000 });

    const highlights = await page.$$eval('.result-item, .event-result', (items) => {
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
    console.log(`✅ 하이라이트 ${highlights.length}개 수집 완료`);
    return highlights;
  } catch (error) {
    await browser.close();
    console.error('❌ 하이라이트 수집 실패:', error);
    return [];
  }
}

async function scrapeSchedule(): Promise<ScheduleEvent[]> {
  console.log('📅 일정 수집 시작...');
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-http2']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  try {
    await page.goto('https://www.olympics.com/en/milano-cortina-2026/schedule', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await page.waitForSelector('.schedule-item, .event-schedule', { timeout: 10000 });

    const schedule = await page.$$eval('.schedule-item, .event-schedule', (items) => {
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
    console.log(`✅ 일정 ${schedule.length}개 수집 완료`);
    return schedule;
  } catch (error) {
    await browser.close();
    console.error('❌ 일정 수집 실패:', error);
    return [];
  }
}

async function main() {
  console.log('🚀 Olympic Hub 데이터 수집 시작...\n');

  // 병렬로 모든 데이터 수집
  const [medals, news, highlights, schedule] = await Promise.all([
    scrapeMedals(),
    scrapeNews(),
    scrapeHighlights(),
    scrapeSchedule(),
  ]);

  // 데이터 디렉토리
  const dataDir = path.join(__dirname, '..', 'public', 'data');
  await fs.mkdir(dataDir, { recursive: true });

  // JSON 파일로 저장
  const timestamp = new Date().toISOString();

  await Promise.all([
    fs.writeFile(
      path.join(dataDir, 'medals.json'),
      JSON.stringify({ lastUpdated: timestamp, medals }, null, 2)
    ),
    fs.writeFile(
      path.join(dataDir, 'news.json'),
      JSON.stringify({ lastUpdated: timestamp, articles: news }, null, 2)
    ),
    fs.writeFile(
      path.join(dataDir, 'highlights.json'),
      JSON.stringify({ lastUpdated: timestamp, highlights }, null, 2)
    ),
    fs.writeFile(
      path.join(dataDir, 'schedule.json'),
      JSON.stringify({ lastUpdated: timestamp, events: schedule }, null, 2)
    ),
  ]);

  console.log('\n✅ 모든 데이터 저장 완료!');
  console.log(`📊 메달: ${medals.length}개국`);
  console.log(`📰 뉴스: ${news.length}개`);
  console.log(`🏅 하이라이트: ${highlights.length}개`);
  console.log(`📅 일정: ${schedule.length}개`);
}

main().catch((error) => {
  console.error('❌ 에러 발생:', error);
  process.exit(1);
});
