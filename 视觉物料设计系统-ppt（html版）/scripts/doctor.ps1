# doctor.ps1 — 环境自检：node / python / 浏览器
# 用法：.\scripts\doctor.ps1
# 退出码：0 全部就绪；1 有缺失

$ok = $true
function Check($name, $found, $hint) {
    if ($found) { Write-Host ("[OK]   {0}: {1}" -f $name, $found) -ForegroundColor Green }
    else { Write-Host ("[MISS] {0} —— {1}" -f $name, $hint) -ForegroundColor Yellow; $script:ok = $false }
}

$node = $null
foreach ($c in @($env:QA_NODE, (Get-Command node -ErrorAction SilentlyContinue).Source,
    'C:\Program Files\nodejs\node.exe', 'C:\Program Files (x86)\nodejs\node.exe')) {
    if ($c -and (Test-Path $c)) { $node = $c; break }
}
Check 'node' $node '安装 Node 18+，或用 -Node <路径> 指定'

$py = $null
foreach ($cand in @('python','python3','py')) {
    $c = Get-Command $cand -ErrorAction SilentlyContinue
    if ($c) { $py = if ($cand -eq 'py') { 'py -3' } else { $c.Source }; break }
}
Check 'python' $py '安装 Python 3.10+，或用 -Python <路径> 指定'

$browser = $null
foreach ($b in @($env:QA_BROWSER,
    'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
    'C:\Program Files\Google\Chrome\Application\chrome.exe')) {
    if ($b -and (Test-Path $b)) { $browser = $b; break }
}
Check '浏览器（Chrome/Edge）' $browser '安装 Chrome 或 Edge（qa-deck 自动拉起）'

if ($py) {
    $pillow = & $py -c "import PIL; print('Pillow', PIL.__version__)" 2>$null
    if ($LASTEXITCODE -eq 0) { Write-Host "[OK]   Pillow: $pillow" -ForegroundColor Green }
    else { Write-Host '[WARN] Pillow 未安装 —— 仅影响 PDF 生成：pip install pillow' -ForegroundColor Yellow }
}

if ($ok) { Write-Host "`n环境就绪，可以开始：.\scripts\build.ps1 -Deck .\我的演示.html" -ForegroundColor Green; exit 0 }
else { Write-Host "`n环境有缺失，先按上面提示补齐" -ForegroundColor Red; exit 1 }