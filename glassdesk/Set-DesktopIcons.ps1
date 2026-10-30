<#
.SYNOPSIS
    Hides the Recycle Bin and swaps your desktop icons for see-through GlassDesk icons.

.DESCRIPTION
    Default: hides the Recycle Bin, hides the real desktop icons, and shows them
    instead as a Rainmeter widget at about 50% opacity (change IconAlpha in
    Documents\Rainmeter\Skins\GlassDesk\Icons\Icons.ini).

    -RecycleBinOnly   just hide the Recycle Bin, leave icons alone
    -Restore          bring back the Recycle Bin and the normal desktop icons

    Double-click a see-through icon to open it, same as before.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\Set-DesktopIcons.ps1
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\Set-DesktopIcons.ps1 -Restore
#>
[CmdletBinding()]
param(
    [switch]$RecycleBinOnly,
    [switch]$Restore
)

$ErrorActionPreference = 'Stop'
$here       = Split-Path -Parent $MyInvocation.MyCommand.Path
$hideIcons  = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\HideDesktopIcons\NewStartPanel'
$advanced   = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced'
$recycleBin = '{645FF040-5081-101B-9F08-00AA002F954E}'
$rainmeter  = Join-Path $env:ProgramFiles 'Rainmeter\Rainmeter.exe'
$skinRoot   = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'Rainmeter\Skins\GlassDesk'

if (-not (Test-Path $hideIcons)) { New-Item -Path $hideIcons -Force | Out-Null }

if ($Restore) {
    Set-ItemProperty $hideIcons -Name $recycleBin -Value 0 -Type DWord
    Set-ItemProperty $advanced  -Name HideIcons   -Value 0 -Type DWord
    if (Test-Path $rainmeter) { & $rainmeter '!DeactivateConfig' 'GlassDesk\Icons' }
    Stop-Process -Name explorer -Force
    Write-Host 'Recycle Bin and normal desktop icons are back.'
    return
}

Set-ItemProperty $hideIcons -Name $recycleBin -Value 1 -Type DWord
Write-Host '  [ok]   Recycle Bin hidden (still in File Explorer: type "Recycle Bin" in the address bar)'

if (-not $RecycleBinOnly) {
    if (-not (Test-Path $rainmeter) -or -not (Test-Path $skinRoot)) {
        Write-Warning 'GlassDesk widgets are not installed, so the see-through icons were skipped. Run Install-GlassDesk.ps1 first.'
    }
    else {
        # Keep opacity and size the user already set in an installed copy.
        $iconsIni = Join-Path $skinRoot 'Icons\Icons.ini'
        $keep = @{}
        $firstInstall = -not (Test-Path $iconsIni)
        if (-not $firstInstall) {
            foreach ($line in Get-Content $iconsIni) {
                if ($line -match '^(IconAlpha|TextAlpha|IconScale)=(.+)$') { $keep[$Matches[1]] = $Matches[2] }
            }
        }
        # Copy only the Icons widget so your edited Variables.inc is left alone.
        Copy-Item (Join-Path $here 'skins\GlassDesk\Icons') $skinRoot -Recurse -Force
        if ($keep.Count) {
            $text = Get-Content $iconsIni -Raw
            foreach ($k in $keep.Keys) { $text = $text -replace "(?m)^$k=.*$", "$k=$($keep[$k])" }
            [IO.File]::WriteAllText($iconsIni, $text)
        }
        New-Item -ItemType Directory -Path (Join-Path $skinRoot '@Resources\Icons') -Force | Out-Null
        $overrides = Join-Path $skinRoot '@Resources\IconOverrides'
        New-Item -ItemType Directory -Path $overrides -Force | Out-Null
        # Desktop may be redirected (OneDrive), so ask Windows for the real path.
        $desktop = [Environment]::GetFolderPath('Desktop').TrimEnd('\') + '\'
        "[Variables]`r`nDesktopPath=$desktop" | Set-Content (Join-Path $skinRoot '@Resources\Desktop.inc') -Encoding ASCII

        Set-ItemProperty $advanced -Name HideIcons -Value 1 -Type DWord

        & $rainmeter '!RefreshApp'
        Start-Sleep -Seconds 2
        & $rainmeter '!ActivateConfig' 'GlassDesk\Icons' 'Icons.ini'
        Start-Sleep -Milliseconds 400
        # Only place it on first install, so a rerun keeps wherever you dragged it.
        if ($firstInstall) { & $rainmeter '!Move' '24' '24' 'GlassDesk\Icons' }
        & $rainmeter '!ZPos' '-2' 'GlassDesk\Icons'
        Write-Host '  [ok]   Desktop icons now see-through (top-left; drag to move)'
        Write-Host "  [info] Custom icons: put a picture named like the item (e.g. 'Beaucoup Banks.png') in"
        Write-Host "         $overrides"
    }
}

Stop-Process -Name explorer -Force
if ($overrides) {
    Start-Sleep -Seconds 3
    Start-Process explorer.exe $overrides
}
Write-Host 'Done. Explorer restarted.'
