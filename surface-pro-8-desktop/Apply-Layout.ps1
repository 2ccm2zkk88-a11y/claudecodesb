<#
.SYNOPSIS
    Desktop layout for a Surface Pro 8 (13", 2880x1920, 3:2) on Windows 11.

.DESCRIPTION
    Changes only per-user (HKCU) settings, so no admin rights are needed.
    Backs up every key it touches to a .reg file first. Run Undo-Layout.ps1 to revert.

    What it sets:
      - Dark mode for apps and system
      - Taskbar: centered (or left with -TaskbarLeft), search as icon only,
        Task View and Widgets buttons hidden
      - Start menu: "More pins" layout (fewer recommendations)
      - File Explorer: opens to This PC, shows file extensions
      - Snap: snap layouts flyout on, snap assist suggestions on
      - Optional: installs two FancyZones layouts sized for a 3:2 screen
        if PowerToys is installed

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\Apply-Layout.ps1
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\Apply-Layout.ps1 -TaskbarLeft -LightMode
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [switch]$TaskbarLeft,
    [switch]$LightMode,
    [switch]$SkipFancyZones
)

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path

$advanced    = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced'
$personalize = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize'
$search      = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Search'

# --- Backup -----------------------------------------------------------------
$stamp     = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupDir = Join-Path $here 'backup'
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

$i = 0
foreach ($key in $advanced, $personalize, $search) {
    $i++
    $file   = Join-Path $backupDir "$stamp-$i.reg"
    $regKey = $key -replace '^HKCU:', 'HKCU'
    reg.exe export $regKey $file /y | Out-Null
}
Write-Host "Backed up registry keys to $backupDir ($stamp-*.reg)"

# --- Settings ---------------------------------------------------------------
$theme = if ($LightMode) { 1 } else { 0 }
$align = if ($TaskbarLeft) { 0 } else { 1 }

$settings = @(
    @{ Path = $personalize; Name = 'AppsUseLightTheme';     Value = $theme; Label = 'App theme' }
    @{ Path = $personalize; Name = 'SystemUsesLightTheme';  Value = $theme; Label = 'System theme' }
    @{ Path = $advanced;    Name = 'TaskbarAl';             Value = $align; Label = 'Taskbar alignment' }
    @{ Path = $advanced;    Name = 'ShowTaskViewButton';    Value = 0;      Label = 'Hide Task View button' }
    @{ Path = $advanced;    Name = 'TaskbarDa';             Value = 0;      Label = 'Hide Widgets button' }
    @{ Path = $search;      Name = 'SearchboxTaskbarMode';  Value = 1;      Label = 'Search as icon' }
    @{ Path = $advanced;    Name = 'Start_Layout';          Value = 1;      Label = 'Start: more pins' }
    @{ Path = $advanced;    Name = 'LaunchTo';              Value = 1;      Label = 'Explorer opens This PC' }
    @{ Path = $advanced;    Name = 'HideFileExt';           Value = 0;      Label = 'Show file extensions' }
    @{ Path = $advanced;    Name = 'EnableSnapAssistFlyout'; Value = 1;     Label = 'Snap layouts flyout' }
    @{ Path = $advanced;    Name = 'SnapAssist';            Value = 1;      Label = 'Snap assist suggestions' }
)

foreach ($s in $settings) {
    if (-not $PSCmdlet.ShouldProcess($s.Label, "Set $($s.Name) = $($s.Value)")) { continue }
    try {
        if (-not (Test-Path $s.Path)) { New-Item -Path $s.Path -Force | Out-Null }
        Set-ItemProperty -Path $s.Path -Name $s.Name -Value $s.Value -Type DWord
        Write-Host "  [ok]   $($s.Label)"
    }
    catch {
        # Recent Windows 11 builds block some taskbar values (Widgets especially).
        Write-Warning "  [skip] $($s.Label): $($_.Exception.Message). Set it in Settings > Personalization > Taskbar."
    }
}

# --- FancyZones -------------------------------------------------------------
if (-not $SkipFancyZones) {
    $fzDir = Join-Path $env:LOCALAPPDATA 'Microsoft\PowerToys\FancyZones'
    $fzFile = Join-Path $fzDir 'custom-layouts.json'
    $ours = Get-Content (Join-Path $here 'fancyzones-layouts.json') -Raw | ConvertFrom-Json

    if (-not (Test-Path $fzDir)) {
        Write-Host 'PowerToys FancyZones not found. Skipping zone layouts (install PowerToys and rerun to add them).'
    }
    elseif ($PSCmdlet.ShouldProcess($fzFile, 'Add SP8 FancyZones layouts')) {
        if (Get-Process -Name 'PowerToys*' -ErrorAction SilentlyContinue) {
            Write-Warning 'PowerToys is running and may overwrite this file. Quit PowerToys from the tray, then rerun.'
        }
        else {
            $existing = @()
            if (Test-Path $fzFile) {
                Copy-Item $fzFile (Join-Path $backupDir "$stamp-custom-layouts.json")
                $existing = @((Get-Content $fzFile -Raw | ConvertFrom-Json).'custom-layouts')
            }
            $ourIds = $ours.'custom-layouts' | ForEach-Object { $_.uuid }
            $merged = @($existing | Where-Object { $_ -and $ourIds -notcontains $_.uuid }) + @($ours.'custom-layouts')
            # Windows PowerShell 5.1 can serialize arrays as {value, Count} without this.
            Remove-TypeData System.Array -ErrorAction SilentlyContinue
            $json = @{ 'custom-layouts' = $merged } | ConvertTo-Json -Depth 10
            # Write without a BOM; PowerToys' JSON parser rejects one.
            [IO.File]::WriteAllText($fzFile, $json)
            Write-Host '  [ok]   FancyZones layouts added. Open PowerToys, press Win+Shift+` and pick "SP8 Focus + Stack".'
        }
    }
}

# --- Restart Explorer so taskbar changes show -------------------------------
if ($PSCmdlet.ShouldProcess('explorer.exe', 'Restart')) {
    Stop-Process -Name explorer -Force
    Write-Host 'Explorer restarted. Done.'
}
