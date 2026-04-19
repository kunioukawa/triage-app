#!/bin/bash
# ============================================================
# triage-app ビルド & Docker Hub プッシュスクリプト
# 使い方: ./build_and_push.sh <dockerhub-username>
# 例:     ./build_and_push.sh kunioukawa
# ============================================================
set -e

DOCKERHUB_USER="${1:-t0nari}"
APP_NAME="triage-app"
TAG="latest"

if [ -z "$DOCKERHUB_USER" ]; then
  echo "使い方: $0 <Docker Hub ユーザー名>"
  exit 1
fi

IMAGE="${DOCKERHUB_USER}/${APP_NAME}:${TAG}"

echo ">>> フロントエンドをビルド"
cd "$(dirname "$0")/frontend"
npm install --silent
npm run build
cd ..

echo ">>> Docker イメージをビルド（amd64 + arm64 マルチプラットフォーム）"
docker buildx create --name triage-builder --use 2>/dev/null || docker buildx use triage-builder
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag "${IMAGE}" \
  --push \
  .

echo ""
echo "============================================"
echo "プッシュ完了: ${IMAGE}"
echo ""
echo "【NASでの起動コマンド】"
echo "  docker pull ${IMAGE}"
echo "  docker run -d \\"
echo "    --name triage-app \\"
echo "    --restart unless-stopped \\"
echo "    -p 8000:8000 \\"
echo "    -v /path/to/data:/app/data \\"
echo "    ${IMAGE}"
echo "============================================"
