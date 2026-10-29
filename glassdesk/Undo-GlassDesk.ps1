<#
.SYNOPSIS
    Puts back the wallpaper, transparency and taskbar settings saved by Install-GlassDesk.ps1
    and removes the GlassDesk widgets. Rainmeter and Seelen UI stay installed; uninstall them
    from Settings > Apps if you want them gone.
#>
$ErrorActionPreference = 'Stop'
$backupDir = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) 'backup'
$original = Get-ChildItem $backupDir -Filter 'glassdesk-*.json' -ErrorAction SilentlyContinue |
    Sort-Object Name | Select-Object -First 1   # oldest = your original settings
if (-not $original) { throw "No GlassDesk backup found in $backupDir" }
$b = Get-Content $original.FullName -Raw | ConvertFrom-Json

$desktopKey  = 'HKCU:\Control Panel\Desktop'
$personalize = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize'
$stuckRects  = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\StuckRects3'

if ($null -ne $b.WallpaperStyle) { Set-ItemProperty $desktopKey -Name WallpaperStyle -Value $b.WallpaperStyle }
if ($null -ne $b.TileWallpaper)  { Set-ItemProperty $desktopKey -Name TileWallpaper  -Value $b.TileWallpaper }
Add-Type -Namespace GlassDesk -Name Native -MemberDefinition @'
[DllImport("user32.dll", CharSet = CharSet.Unicode)]
public static extern bool SystemParametersInfo(int action, int param, string value, int flags);
'@
[void][GlassDesk.Native]::SystemParametersInfo(0x14, 0, [string]$b.WallPaper, 3)

if ($null -ne $b.EnableTransparency) {
    Set-ItemProperty $personalize -Name EnableTransparency -Value $b.EnableTransparency -Type DWord
}
if ($b.TaskbarSettings) {
    Set-ItemProperty $stuckRects -Name Settings -Value ([Convert]::FromBase64String($b.TaskbarSettings))
}

$rainmeter = Join-Path $env:ProgramFiles 'Rainmeter\Rainmeter.exe'
if (Test-Path $rainmeter) {
    foreach ($c in 'Calendar', 'Clocks', 'Search', 'Weather') { & $rainmeter "!DeactivateConfig" "GlassDesk\$c" }
}

Stop-Process -Name explorer -Force
Write-Host "Restored settings from $($original.Name). Explorer restarted."
