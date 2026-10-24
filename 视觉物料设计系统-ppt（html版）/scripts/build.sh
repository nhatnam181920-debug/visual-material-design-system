#!/usr/bin/env bash
# build.sh — 一条命令走完：打包单文件 → 验收 → 出 PDF
#
# 用法：
#   bash scripts/build.sh 我的演示.html [qa目录] [pdf路径]
#
# 依赖：python3（Pillow 可选，用于 PDF）、node、Chrome/Edge/Chromium（QA 自动拉起）

set -euo pipefail
DECK="${1:?用法: bash scripts/build.sh <deck.html> [qa目录] [pdf路径]}"
QA_DIR="${2:-./qa}"
PDF="${3:-${DECK%.html}.pdf}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SINGLE="${DECK%.html}-单文件.html"
PY="${PYTHON:-python3}"

echo "==> [1/3] 打包单文件"
"$PY" "$HERE/bundle-assets.py" "$DECK" "$SINGLE"

echo "==> [2/3] 验收"
if node "$HERE/qa-deck.cjs" "$SINGLE" "$QA_DIR" 1920 1080; then
  echo "==> [3/3] 生成 PDF 备份"
  "$PY" "$HERE/make-pdf.py" "$QA_DIR" "$PDF"
  echo "完成：$SINGLE / $QA_DIR / $PDF"
else
  echo "验收未通过，跳过 PDF（先修复问题，见 $QA_DIR/report.json）"
  exit 1
fi
