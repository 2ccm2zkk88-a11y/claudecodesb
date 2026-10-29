<#
.SYNOPSIS
    Restores the registry backup made by Apply-Layout.ps1 (latest one by default).
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\Undo-Layout.ps1
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\Undo-Layout.ps1 -Stamp 20261029-171500
#>
param([string]$Stamp)

$ErrorActionPreference = 'Stop'
$backupDir = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) 'backup'

if (-not $Stamp) {
    $latest = Get-ChildItem $backupDir -Filter '*.reg' | Sort-Object Name -Descending | Select-Object -First 1
    if (-not $latest) { throw "No backups found in $backupDir" }
    $Stamp = $latest.Name.Substring(0, 15)
}

Get-ChildItem $backupDir -Filter "$Stamp-*.reg" | ForEach-Object {
    reg.exe import $_.FullName | Out-Null
    Write-Host "Restored $($_.Name)"
}

$fz = Join-Path $backupDir "$Stamp-custom-layouts.json"
if (Test-Path $fz) {
    Copy-Item $fz (Join-Path $env:LOCALAPPDATA 'Microsoft\PowerToys\FancyZones\custom-layouts.json') -Force
    Write-Host 'Restored FancyZones layouts (quit PowerToys first if it was running).'
}

Stop-Process -Name explorer -Force
Write-Host 'Explorer restarted. Undo complete.'
