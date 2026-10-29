<#
.SYNOPSIS
    Glass-style desktop for a Surface Pro 8 on Windows 11: wallpaper, glass widgets,
    transparency, auto-hiding taskbar, and (optionally) a dock with a top menu bar.

.DESCRIPTION
    - Sets the GlassDesk wave wallpaper
    - Turns on transparency effects
    - Installs Rainmeter (free) and loads four glass widgets:
      calendar, world clocks, weather, search bar
    - Auto-hides the Windows taskbar (skip with -KeepTaskbar)
    - With -WithDock, also installs Seelen UI (free) for a dock and top menu bar

    Per-user changes only. Your current settings are saved first. Run Undo-GlassDesk.ps1 to revert.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\Install-GlassDesk.ps1 -WithDock
#>
[CmdletBinding()]
param(
    [switch]$WithDock,
    [switch]$KeepTaskbar
)

$ErrorActionPreference = 'Stop'
$here      = Split-Path -Parent $MyInvocation.MyCommand.Path
$backupDir = Join-Path $here 'backup'
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

$desktopKey  = 'HKCU:\Control Panel\Desktop'
$personalize = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize'
$stuckRects  = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\StuckRects3'

function Get-Value($path, $name) {
    (Get-ItemProperty -Path $path -Name $name -ErrorAction SilentlyContinue).$name
}

# --- Backup -----------------------------------------------------------------
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$taskbarBytes = Get-Value $stuckRects 'Settings'
$backup = [ordered]@{
    WallPaper          = Get-Value $desktopKey 'WallPaper'
    WallpaperStyle     = Get-Value $desktopKey 'WallpaperStyle'
    TileWallpaper      = Get-Value $desktopKey 'TileWallpaper'
    EnableTransparency = Get-Value $personalize 'EnableTransparency'
    TaskbarSettings    = if ($taskbarBytes) { [Convert]::ToBase64String($taskbarBytes) } else { $null }
}
$backup | ConvertTo-Json | Set-Content (Join-Path $backupDir "glassdesk-$stamp.json")
Write-Host "Saved your current settings to backup\glassdesk-$stamp.json"

# --- Wallpaper --------------------------------------------------------------
$picDir = Join-Path ([Environment]::GetFolderPath('MyPictures')) 'GlassDesk'
New-Item -ItemType Directory -Path $picDir -Force | Out-Null
$wallpaper = Join-Path $picDir 'glass-wave-2880x1920.jpg'
Copy-Item (Join-Path $here 'wallpaper\glass-wave-2880x1920.jpg') $wallpaper -Force

Set-ItemProperty $desktopKey -Name WallpaperStyle -Value '10'   # Fill
Set-ItemProperty $desktopKey -Name TileWallpaper  -Value '0'
Add-Type -Namespace GlassDesk -Name Native -MemberDefinition @'
[DllImport("user32.dll", CharSet = CharSet.Unicode)]
public static extern bool SystemParametersInfo(int action, int param, string value, int flags);
'@
# SPI_SETDESKWALLPAPER, save to profile + broadcast change
[void][GlassDesk.Native]::SystemParametersInfo(0x14, 0, $wallpaper, 3)
Write-Host '  [ok]   Wallpaper'

# --- Transparency -----------------------------------------------------------
Set-ItemProperty $personalize -Name EnableTransparency -Value 1 -Type DWord
Write-Host '  [ok]   Transparency effects'

# --- Rainmeter --------------------------------------------------------------
function Install-WithWinget($id, $label) {
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        Write-Warning "winget is missing, so $label can't be installed automatically. Install 'App Installer' from the Microsoft Store, then rerun."
        return $false
    }
    Write-Host "  ...    Installing $label (a Windows prompt may ask for permission)"
    winget install --id $id -e --accept-source-agreements --accept-package-agreements | Out-Host
    return $true
}

$rainmeter = Join-Path $env:ProgramFiles 'Rainmeter\Rainmeter.exe'
if (-not (Test-Path $rainmeter)) {
    if (-not (Install-WithWinget 'Rainmeter.Rainmeter' 'Rainmeter')) { return }
}
if (-not (Test-Path $rainmeter)) {
    Write-Warning "Rainmeter didn't install. Get it from https://www.rainmeter.net, then rerun this script."
    return
}

$skinsDir = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'Rainmeter\Skins'
New-Item -ItemType Directory -Path $skinsDir -Force | Out-Null
Copy-Item (Join-Path $here 'skins\GlassDesk') $skinsDir -Recurse -Force
Write-Host '  [ok]   Widgets copied to Rainmeter'

if (-not (Get-Process -Name Rainmeter -ErrorAction SilentlyContinue)) {
    Start-Process $rainmeter
    Start-Sleep -Seconds 4
}

# Rainmeter positions are in physical pixels, so read the real screen size.
$video  = Get-CimInstance Win32_VideoController | Where-Object CurrentHorizontalResolution | Select-Object -First 1
$width  = if ($video) { [int]$video.CurrentHorizontalResolution } else { 2880 }
$k      = $width / 2880

$layout = @(
    @{ Config = 'GlassDesk\Calendar'; File = 'Calendar.ini'; X = 60;                         Y = 120 }
    @{ Config = 'GlassDesk\Clocks';   File = 'Clocks.ini';   X = 620;                        Y = 120 }
    @{ Config = 'GlassDesk\Search';   File = 'Search.ini';   X = 780;                        Y = 800 }
    @{ Config = 'GlassDesk\Weather';  File = 'Weather.ini';  X = 60;                         Y = 1180 }
)

# Pick up the newly copied skins, then turn off Rainmeter's default sample skins.
& $rainmeter "!RefreshApp"
Start-Sleep -Seconds 2
foreach ($c in 'illustro\Clock', 'illustro\Disk', 'illustro\System', 'illustro\Welcome') {
    & $rainmeter "!DeactivateConfig" $c
}
foreach ($s in $layout) {
    & $rainmeter "!ActivateConfig" $s.Config $s.File
    Start-Sleep -Milliseconds 400
    & $rainmeter "!Move" ([int]($s.X * $k)) ([int]($s.Y * $k)) $s.Config
    & $rainmeter "!ZPos" "-2" $s.Config     # keep widgets on the desktop, behind windows
}
Write-Host '  [ok]   Widgets on the desktop (drag them anywhere)'

# --- Taskbar auto-hide ------------------------------------------------------
if (-not $KeepTaskbar -and $taskbarBytes) {
    $bytes = [byte[]]$taskbarBytes.Clone()
    $bytes[8] = 3   # 3 = auto-hide, 2 = always show
    Set-ItemProperty $stuckRects -Name Settings -Value $bytes
    Write-Host '  [ok]   Taskbar set to auto-hide (move to the bottom edge to show it)'
}

# --- Dock + top bar ---------------------------------------------------------
if ($WithDock) {
    if (Install-WithWinget 'Seelen.SeelenUI' 'Seelen UI') {
        Write-Host '  [info] Open Seelen UI from Start. In its settings, turn ON the Dock and Toolbar,'
        Write-Host '         and turn OFF the Window Manager (tiling) unless you want windows to auto-arrange.'
    }
}

Stop-Process -Name explorer -Force
Write-Host ''
Write-Host 'Done. Explorer restarted.'
