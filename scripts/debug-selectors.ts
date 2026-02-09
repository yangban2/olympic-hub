#!/usr/bin/env ts-node

/**
 * Olympics.com 페이지 구조 분석 스크립트
 */

import { chromium } from 'playwright';

async function debugPage(url: string, pageName: string) {
  console.log(`\n========== ${pageName} ==========`);
  console.log(`URL: ${url}\n`);
  
  const browser = await chromium.launch({ 
    headless: false,  // 브라우저 보이게
    args: ['--disable-http2']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('페이지 로딩 중...');
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    
    console.log('✅ 페이지 로드 성공');
    
    // 3초 대기 (JavaScript 실행 시간)
    await page.waitForTimeout(5000);
    
    // 모든 가능한 selector 확인
    const selectors = [
      'table',
      'article',
      '.result-item',
      '.event-result',
      '.schedule-item',
      '.event-schedule',
      '[data-testid]',
      '.medal',
      '.news',
      '.highlight',
      'div[class*="medal"]',
      'div[class*="news"]',
      'div[class*="result"]',
      'div[class*="schedule"]',
    ];
    
    console.log('\n찾은 요소들:');
    for (const selector of selectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✅ ${selector}: ${count}개`);
        
        // 첫 번째 요소의 HTML 출력 (처음 200자)
        const html = await page.locator(selector).first().innerHTML().catch(() => '');
        if (html) {
          console.log(`   샘플: ${html.substring(0, 200)}...`);
        }
      }
    }
    
    // 페이지 전체 구조 출력
    console.log('\n페이지 body의 주요 클래스:');
    const bodyClasses = await page.evaluate(() => {
      const elements = document.querySelectorAll('div[class], section[class], article[class]');
      const classes = new Set<string>();
      elements.forEach(el => {
        el.className.split(' ').forEach(c => {
          if (c && (c.includes('medal') || c.includes('news') || c.includes('result') || c.includes('schedule'))) {
            classes.add(c);
          }
        });
      });
      return Array.from(classes);
    });
    
    console.log(bodyClasses.join(', '));
    
    // 10초 대기해서 수동으로 확인 가능하게
    console.log('\n10초 대기 중... (페이지 확인 시간)');
    await page.waitForTimeout(10000);
    
  } catch (error: any) {
    console.error(`❌ 에러: ${error.message}`);
  } finally {
    await browser.close();
  }
}

async function main() {
  const pages = [
    ['https://www.olympics.com/en/olympic-games/milano-cortina-2026/medals', 'Medals Page'],
    ['https://www.olympics.com/en/olympic-games/milano-cortina-2026/news', 'News Page'],
  ];
  
  for (const [url, name] of pages) {
    await debugPage(url, name);
  }
}

main().catch(console.error);
