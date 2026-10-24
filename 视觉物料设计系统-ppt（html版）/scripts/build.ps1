# build.ps1 — 一条命令走完：打包单文件 → 验收 → 出 PDF
#
# 用法：
#   .\scripts\build.ps1 -Deck .\我的演示.html
#   .\scripts\build.ps1 -Deck .\我的演示.html -QaDir .\qa -Pdf .\我的演示.pdf
#   .\scripts\build.ps1 -Deck .\我的演示.html -Node "C:\Program Files\nodejs\node.exe" -Python "D:\anaconda3\python.exe"
#
# 依赖：Node 18+、Python 3.10+（Pillow 可选，用于 PDF）、Chrome/Edge（验收时自动拉起）

param(
    [Parameter(Mandatory = $true)][string]$Deck,
    [string]$QaDir = '.\qa',
    [string]$Pdf = '',
    [string]$Python = '',
    [string]$Node = ''
)

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path

function Resolve-Node {
    param([string]$Explicit)
    if ($Explicit) { return $Explicit }
    if ($env:QA_NODE) { return $env:QA_NODE }
    $c = Get-Command node -ErrorAction SilentlyContinue
    if ($c) { return $c.Source }
    foreach ($p in @('C:\Program Files\nodejs\node.exe','C:\Program Files (x86)\nodejs\node.exe',"$env:LOCALAPPDATA\Programs\nodejs\node.exe")) {
        if (Test-Path $p) { return $p }
    }
    throw '找不到 node。请安装 Node.js 18+，或用 -Node <路径> 指定。'
}

function Resolve-Python {
    param([string]$Explicit)
    if ($Explicit) { return $Explicit }
    if ($env:QA_PYTHON) { return $env:QA_PYTHON }
    foreach ($cand in @('python','python3','py')) {
        $c = Get-Command $cand -ErrorAction SilentlyContinue
        if ($c) { if ($cand -eq 'py') { return 'py -3' } return $c.Source }
    }
    throw '找不到 python。请安装 Python 3.10+，或用 -Python <路径> 指定。'
}

$nodeExe = Resolve-Node -Explicit $Node
$pyExe = Resolve-Python -Explicit $Python
$deckPath = (Resolve-Path $Deck).Path
$dir = Split-Path -Parent $deckPath
$base = [System.IO.Path]::GetFileNameWithoutExtension($deckPath)
$single = Join-Path $dir "$base-单文件.html"
if (-not $Pdf) { $Pdf = Join-Path $dir "$base.pdf" }

Write-Host "==> [1/3] 打包单文件" -ForegroundColor Cyan
if ($pyExe -eq 'py -3') { & py -3 (Join-Path $here 'bundle-assets.py') $deckPath $single }
else { & $pyExe (Join-Path $here 'bundle-assets.py') $deckPath $single }
if ($LASTEXITCODE -ne 0) { Write-Host '打包失败' -ForegroundColor Red; exit 1 }

Write-Host "==> [2/3] 验收（自动拉起浏览器）" -ForegroundColor Cyan
& $nodeExe (Join-Path $here 'qa-deck.cjs') $single $QaDir 1920 1080
$qaExit = $LASTEXITCODE

Write-Host "==> [3/3] 生成 PDF 备份" -ForegroundColor Cyan
if ($qaExit -eq 0) {
    if ($pyExe -eq 'py -3') { & py -3 (Join-Path $here 'make-pdf.py') $QaDir $Pdf }
    else { & $pyExe (Join-Path $here 'make-pdf.py') $QaDir $Pdf }
}

if ($qaExit -eq 0) {
    Write-Host "`n完成：`n  单文件：$single`n  截图：$QaDir`n  PDF：$Pdf" -ForegroundColor Green
} else {
    Write-Host "`n验收未通过：$QaDir\report.json" -ForegroundColor Red
    exit 1
}