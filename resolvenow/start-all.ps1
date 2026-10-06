$ErrorActionPreference = "Stop"

Write-Host "Starting ResolveNow Microservices..." -ForegroundColor Cyan

# Start Eureka Server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend\eureka-server'; .\mvnw spring-boot:run" -WindowStyle Normal
Start-Sleep -Seconds 10 # Wait for Eureka to spin up

# Start API Gateway
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend\api-gateway'; .\mvnw spring-boot:run" -WindowStyle Normal

# Start Auth Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend\auth-service'; .\mvnw spring-boot:run" -WindowStyle Normal

# Start Complaint Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend\complaint-service'; .\mvnw spring-boot:run" -WindowStyle Normal

# Start Assignment Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend\assignment-service'; .\mvnw spring-boot:run" -WindowStyle Normal

# Start Notification Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend\notification-service'; .\mvnw spring-boot:run" -WindowStyle Normal

Start-Sleep -Seconds 5

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'frontend'; npm run dev" -WindowStyle Normal

Write-Host "All services started! The frontend should be running at http://localhost:5173" -ForegroundColor Green
