#!/bin/bash

# Olympic Hub - 자동 데이터 업데이트 스크립트
# macOS crontab에서 2시간마다 실행
# 사용법: */2 * * * * /Users/yangban/.openclaw/workspace/olympic-hub/scripts/update-olympic-data.sh

set -e

PROJECT_DIR="/Users/yangban/.openclaw/workspace/olympic-hub"
LOG_FILE="/Users/yangban/.openclaw/workspace/olympic-hub/logs/cron.log"

# 로그 디렉토리 생성
mkdir -p "$(dirname "$LOG_FILE")"

# 로그 시작
echo "================================" >> "$LOG_FILE"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Olympic Hub 데이터 업데이트 시작" >> "$LOG_FILE"

cd "$PROJECT_DIR"

# Node.js 환경 설정 (nvm 사용 시)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 데이터 수집 스크립트 실행
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 데이터 수집 시작..." >> "$LOG_FILE"
npx ts-node scripts/scrape-all-data.ts >> "$LOG_FILE" 2>&1

# Git 상태 확인
if git diff --quiet public/data/; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 변경사항 없음. 종료." >> "$LOG_FILE"
  exit 0
fi

# Git commit & push
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 변경사항 발견. Git commit & push..." >> "$LOG_FILE"
git add public/data/*.json
git commit -m "🏅 Auto-update Olympic data: $(date '+%Y-%m-%d %H:%M')" >> "$LOG_FILE" 2>&1
git push >> "$LOG_FILE" 2>&1

echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ 완료!" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
