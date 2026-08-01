param()

$ErrorActionPreference = "Stop"

# Refresh environment variables so it can find the newly installed ffmpeg
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "Starting video compression..." -ForegroundColor Cyan

# Ensure we're in the right directory
if (Test-Path "public") {
    Set-Location "public"
} elseif (-not (Test-Path "heroVideo.mp4")) {
    Write-Host "Error: Could not find public directory or heroVideo.mp4" -ForegroundColor Red
    exit 1
}

$videos = @("heroVideo.mp4", "heroVideoMobile.mp4")

foreach ($video in $videos) {
    if (Test-Path $video) {
        $basename = [System.IO.Path]::GetFileNameWithoutExtension($video)
        $webmOutput = "$basename.webm"
        $mp4Output = "${basename}_compressed.mp4"

        Write-Host "`nProcessing $video -> $webmOutput (VP9 CRF 28)..." -ForegroundColor Yellow
        ffmpeg -y -i $video -c:v libvpx-vp9 -crf 28 -b:v 0 -c:a libopus $webmOutput

        Write-Host "Processing $video -> $mp4Output (H.264 CRF 24)..." -ForegroundColor Yellow
        ffmpeg -y -i $video -c:v libx264 -crf 24 -preset fast -c:a aac $mp4Output

        Write-Host "Replacing original $video with compressed MP4..." -ForegroundColor Yellow
        Move-Item -Force $mp4Output $video
        
        Write-Host "Successfully compressed $video!" -ForegroundColor Green
    } else {
        Write-Host "`nSkipping $video (file not found in public/)" -ForegroundColor Gray
    }
}

Write-Host "`nAll compression tasks finished!" -ForegroundColor Green
