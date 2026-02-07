#!/bin/bash
# Olympic Hub 실제 데이터 업데이트 스크립트
# OpenClaw 크론잡에서 2시간마다 실행

set -e

echo "🏅 Olympic Hub 데이터 업데이트 시작..."

# 프로젝트 디렉토리로 이동
cd /Users/yangban/.openclaw/workspace/olympic-hub

# 최신 코드 pull
git pull origin main

# 브라우저 자동화로 데이터 스크래핑 (OpenClaw 브라우저 사용)
echo "🔍 Olympics.com에서 데이터 스크래핑 중..."

# OpenClaw에게 스크래핑 요청
# (이 스크립트는 OpenClaw가 실행하므로 직접 브라우저 제어 가능)

# 변경사항 확인
if git diff --quiet public/data/; then
  echo "✅ 변경사항 없음"
  exit 0
fi

# Git commit & push
echo "📤 변경사항 푸시 중..."
git add public/data/
git commit -m "Update Olympic data: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

echo "🎉 업데이트 완료! Vercel이 자동으로 재배포합니다."
