#!/usr/bin/env bash
# doctor.sh — 环境自检：node / python / 浏览器
set -uo pipefail
ok=1
check() { if [ -n "$2" ]; then echo "[OK]   $1: $2"; else echo "[MISS] $1 —— $3"; ok=0; fi; }

NODE_BIN="$(command -v node || true)"
check "node" "$NODE_BIN" "安装 Node 18+，或设置 QA_NODE"

PY_BIN="$(command -v python3 || command -v python || true)"
check "python" "$PY_BIN" "安装 Python 3.10+，或设置 QA_PYTHON"

CHROME=""
for b in "${QA_BROWSER:-}" "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
         "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
         "/usr/bin/google-chrome" "/usr/bin/chromium" "/usr/bin/chromium-browser"; do
  if [ -n "$b" ] && [ -x "$b" ]; then CHROME="$b"; break; fi
done
check "浏览器（Chrome/Edge）" "$CHROME" "安装 Chrome/Edge/Chromium（qa-deck 自动拉起）"

if [ -n "$PY_BIN" ]; then
  if "$PY_BIN" -c "import PIL" 2>/dev/null; then echo "[OK]   Pillow"; else echo "[WARN] Pillow 未安装 —— 仅影响 PDF：pip install pillow"; fi
fi

if [ "$ok" = "1" ]; then echo; echo "环境就绪，可以开始：bash scripts/build.sh 我的演示.html"; else echo; echo "环境有缺失"; exit 1; fi