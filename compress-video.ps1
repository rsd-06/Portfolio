<#
.SYNOPSIS
    Encodes a raw hero video into the web-ready desktop and mobile variants.

.DESCRIPTION
    Produces, from one raw master:
      public/heroVideo.webm        1080p VP9   (desktop, preferred)
      public/heroVideo.mp4         1080p H.264 (desktop, fallback)
      public/heroVideoMobile.webm   720p VP9   (mobile, preferred)
      public/heroVideoMobile.mp4    720p H.264 (mobile, fallback)

    The previous version of this script read public/heroVideo.mp4 as its INPUT
    and then moved its own output back over that same path. Running it twice
    silently re-compressed an already-compressed file (generation loss) and
    overwrote the WebM. It also printed "Skipping" and exited 0 when the input
    was missing, so a no-op looked like success.

    This version never writes over its input, requires -InputPath explicitly,
    and fails loudly if the input is missing.

.PARAMETER InputPath
    The raw master video. Must not live at one of the generated output paths.

.PARAMETER Variant
    Which outputs to produce: Desktop, Mobile, or Both (default).

.EXAMPLE
    npm run compress-video -- -InputPath "C:\raw\hero-master.mov"
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$InputPath,

    [ValidateSet("Desktop", "Mobile", "Both")]
    [string]$Variant = "Both"
)

$ErrorActionPreference = "Stop"

# Refresh PATH so a freshly installed ffmpeg is visible without a new shell.
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
            [System.Environment]::GetEnvironmentVariable("Path", "User")

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Host "Error: ffmpeg is not on PATH." -ForegroundColor Red
    exit 1
}

$repoRoot = $PSScriptRoot
$publicDir = Join-Path $repoRoot "public"
if (-not (Test-Path $publicDir)) {
    Write-Host "Error: public/ not found next to this script." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $InputPath)) {
    Write-Host "Error: input not found: $InputPath" -ForegroundColor Red
    exit 1
}

$inputFull = (Resolve-Path $InputPath).Path

$outputs = @{
    DesktopWebm = Join-Path $publicDir "heroVideo.webm"
    DesktopMp4  = Join-Path $publicDir "heroVideo.mp4"
    MobileWebm  = Join-Path $publicDir "heroVideoMobile.webm"
    MobileMp4   = Join-Path $publicDir "heroVideoMobile.mp4"
}

# Refuse to read from a path we are about to write to.
foreach ($out in $outputs.Values) {
    if ($inputFull -eq $out) {
        Write-Host "Error: input is also an output path ($out)." -ForegroundColor Red
        Write-Host "Keep the raw master outside public/ so it is never overwritten." -ForegroundColor Red
        exit 1
    }
}

function Invoke-Encode {
    param($Label, $ArgList, $OutPath)

    Write-Host "`n$Label -> $(Split-Path $OutPath -Leaf)" -ForegroundColor Yellow
    & ffmpeg @ArgList
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ffmpeg failed for $Label (exit $LASTEXITCODE)." -ForegroundColor Red
        exit $LASTEXITCODE
    }
    $sizeMb = [math]::Round((Get-Item $OutPath).Length / 1MB, 2)
    Write-Host "  ok - $sizeMb MB" -ForegroundColor Green
}

# The hero video is always rendered muted, so audio is stripped (-an) rather
# than re-encoded. That alone removes a meaningful slice of the file.

if ($Variant -in @("Desktop", "Both")) {
    Invoke-Encode "Desktop VP9 1080p" @(
        "-y", "-v", "error", "-i", $inputFull,
        "-vf", "scale=1920:-2",
        "-c:v", "libvpx-vp9", "-crf", "32", "-b:v", "0",
        "-deadline", "good", "-cpu-used", "2", "-row-mt", "1",
        "-an", $outputs.DesktopWebm
    ) $outputs.DesktopWebm

    Invoke-Encode "Desktop H.264 1080p" @(
        "-y", "-v", "error", "-i", $inputFull,
        "-vf", "scale=1920:-2",
        "-c:v", "libx264", "-crf", "26", "-preset", "slow",
        "-profile:v", "high", "-pix_fmt", "yuv420p",
        "-an", "-movflags", "+faststart", $outputs.DesktopMp4
    ) $outputs.DesktopMp4
}

if ($Variant -in @("Mobile", "Both")) {
    Invoke-Encode "Mobile VP9 720p" @(
        "-y", "-v", "error", "-i", $inputFull,
        "-vf", "scale=1280:-2",
        "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0",
        "-deadline", "good", "-cpu-used", "2", "-row-mt", "1",
        "-an", $outputs.MobileWebm
    ) $outputs.MobileWebm

    Invoke-Encode "Mobile H.264 720p" @(
        "-y", "-v", "error", "-i", $inputFull,
        "-vf", "scale=1280:-2",
        "-c:v", "libx264", "-crf", "30", "-preset", "slow",
        "-profile:v", "main", "-pix_fmt", "yuv420p",
        "-an", "-movflags", "+faststart", $outputs.MobileMp4
    ) $outputs.MobileMp4
}

Write-Host "`nAll encodes finished." -ForegroundColor Green
Write-Host "Remember to refresh the poster (public/hero.jpg) if the footage changed:" -ForegroundColor DarkGray
Write-Host "  ffmpeg -y -i `"$inputFull`" -vf `"scale=1920:-2`" -frames:v 1 -q:v 3 public/hero.jpg" -ForegroundColor DarkGray
