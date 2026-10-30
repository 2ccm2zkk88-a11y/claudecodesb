<#
.SYNOPSIS
    Adds the live day/date/time to the menu bar printed on the office wallpaper.

.DESCRIPTION
    Copies only the MenuClock widget (your other GlassDesk edits are left alone),
    loads it, and pins it to the top-left corner of the screen. Set the wallpaper
    GlassDesk-Office-LiveBar-2880x1920.jpg first, or the clock won't line up.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\Set-MenuBarClock.ps1
#>
$ErrorActionPreference = 'Stop'
$here      = Split-Path -Parent $MyInvocation.MyCommand.Path
$rainmeter = Join-Path $env:ProgramFiles 'Rainmeter\Rainmeter.exe'
$skinRoot  = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'Rainmeter\Skins\GlassDesk'

if (-not (Test-Path $rainmeter) -or -not (Test-Path $skinRoot)) {
    throw 'GlassDesk widgets are not installed. Run Install-GlassDesk.ps1 first.'
}

Copy-Item (Join-Path $here 'skins\GlassDesk\MenuClock') $skinRoot -Recurse -Force

if (-not (Get-Process -Name Rainmeter -ErrorAction SilentlyContinue)) {
    Start-Process $rainmeter
    Start-Sleep -Seconds 4
}
& $rainmeter '!RefreshApp'
Start-Sleep -Seconds 2
& $rainmeter '!ActivateConfig' 'GlassDesk\MenuClock' 'MenuClock.ini'
Start-Sleep -Milliseconds 400
& $rainmeter '!Move' '0' '0' 'GlassDesk\MenuClock'
& $rainmeter '!ZPos' '-2' 'GlassDesk\MenuClock'
& $rainmeter '!Draggable' '0' 'GlassDesk\MenuClock'
Write-Host 'Live clock added to the menu bar.'
