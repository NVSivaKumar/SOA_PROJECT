$ErrorActionPreference = "SilentlyContinue"

Write-Host "Stopping all ResolveNow Microservices..." -ForegroundColor Yellow

# Kill all Java processes (Spring Boot backends)
Write-Host "Stopping backend services..." -ForegroundColor Cyan
Stop-Process -Name "java" -Force
taskkill /F /IM "java.exe" /T > $null 2>&1

# Kill all Node processes (React frontend)
Write-Host "Stopping frontend server..." -ForegroundColor Cyan
Stop-Process -Name "node" -Force
taskkill /F /IM "node.exe" /T > $null 2>&1

Write-Host "All ResolveNow services have been stopped!" -ForegroundColor Green
