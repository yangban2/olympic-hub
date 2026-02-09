#!/usr/bin/env ts-node

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🏅 실제 메달 데이터 수집 시작...\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-http2']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📍 Olympics.com 접속 중...');
    await page.goto('https://www.olympics.com/en/milano-cortina-2026/medals', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    
    console.log('⏱️  페이지 로딩 대기...');
    await page.waitForTimeout(5000);
    
    console.log('📊 메달 데이터 추출 중...');
    
    const medals = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr, [data-cy="medal-table-row"]');
      const results: any[] = [];
      
      rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 5) return;
        
        // 국가 정보 추출
        const countryCell = cells[1];
        const countryCode = countryCell.textContent?.trim().toUpperCase().slice(0, 3) || '';
        const countryName = countryCell.querySelector('[data-cy="country-name"]')?.textContent?.trim() || countryCode;
        
        // 메달 수 추출
        const gold = parseInt(cells[2]?.textContent?.trim() || '0', 10);
        const silver = parseInt(cells[3]?.textContent?.trim() || '0', 10);
        const bronze = parseInt(cells[4]?.textContent?.trim() || '0', 10);
        const total = gold + silver + bronze;
        
        // 국기 이모지 생성
        const flag = countryCode.length === 3 
          ? String.fromCodePoint(...countryCode.slice(0, 2).split('').map(c => 0x1F1E6 - 65 + c.charCodeAt(0)))
          : '🏳️';
        
        results.push({
          rank: index + 1,
          country: countryName,
          countryCode,
          flag,
          gold,
          silver,
          bronze,
          total
        });
      });
      
      return results;
    });
    
    console.log(`✅ ${medals.length}개국 메달 데이터 수집 완료!\n`);
    
    // 결과 출력
    console.log('📋 메달 순위:');
    medals.slice(0, 10).forEach(m => {
      console.log(`${m.rank}. ${m.flag} ${m.country}: 금${m.gold} 은${m.silver} 동${m.bronze} (합계 ${m.total})`);
    });
    
    // JSON 저장
    const dataDir = path.join(__dirname, '..', 'public', 'data');
    const outputData = {
      lastUpdated: new Date().toISOString(),
      completedEvents: 13,
      totalEvents: 116,
      medals
    };
    
    fs.writeFileSync(
      path.join(dataDir, 'medals.json'),
      JSON.stringify(outputData, null, 2)
    );
    
    console.log('\n✅ medals.json 저장 완료!');
    
  } catch (error: any) {
    console.error('❌ 에러:', error.message);
  } finally {
    await browser.close();
  }
}

main();
