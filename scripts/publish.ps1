# Ejecutar UNA vez si gh/vercel no están autenticados:
#   gh auth login
#   npx vercel login
#
# Luego: .\scripts\publish.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

$gh = "C:\Program Files\GitHub CLI\gh.exe"
& $gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Falta: gh auth login" -ForegroundColor Red
  exit 1
}

git add -A
$status = git status --porcelain
if ($status) {
  git -c user.name="Portfolio Bot" -c user.email="portfolio@local" commit -m "Update portfolio"
}

$remote = git remote get-url origin 2>$null
if (-not $remote) {
  & $gh repo create portafolio --public --source=. --remote=origin --push
} else {
  git push -u origin HEAD
}

Set-Location client
npx vercel deploy --prod --yes
Write-Host "Listo. URL arriba." -ForegroundColor Green
