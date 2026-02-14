# Quick Setup Verification Script
# Run this to check if your environment is properly configured

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Smart Bookmark App - Setup Check" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check Node version
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($nodeVersion) {
    Write-Host "OK Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "ERROR Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check npm version
Write-Host "Checking npm version..." -ForegroundColor Yellow
$npmVersion = npm --version
if ($npmVersion) {
    Write-Host "OK npm: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "ERROR npm not found" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "OK Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "WARNING Dependencies not installed. Run: npm install" -ForegroundColor Yellow
}

# Check if .env.local exists
Write-Host "Checking environment variables..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "OK .env.local file exists" -ForegroundColor Green
    
    # Check if it has the required variables
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "NEXT_PUBLIC_SUPABASE_URL" -and $envContent -match "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
        if ($envContent -match "your-supabase-url" -or $envContent -match "your-supabase-anon-key") {
            Write-Host "WARNING Please update .env.local with your actual Supabase credentials" -ForegroundColor Yellow
        } else {
            Write-Host "OK Environment variables configured" -ForegroundColor Green
        }
    } else {
        Write-Host "ERROR Missing required environment variables" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR .env.local file not found" -ForegroundColor Red
    Write-Host "  Create it and add your Supabase credentials" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Ensure you have completed the Supabase setup" -ForegroundColor White
Write-Host "2. Update .env.local with your Supabase credentials" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White
Write-Host "4. Open: http://localhost:3000" -ForegroundColor White
Write-Host "==================================" -ForegroundColor Cyan
