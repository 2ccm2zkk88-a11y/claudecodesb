# Surface Pro 8 desktop layout (Windows 11)

Tuned for the Surface Pro 8 screen: 13", 2880x1920, 3:2, 200% scaling by default
(about 1440x960 of usable space). That is narrow, so the layouts use two columns, never three.

## What changes

| Area | Setting |
|---|---|
| Theme | Dark mode (use `-LightMode` to keep light) |
| Taskbar | Centered (`-TaskbarLeft` for left), search icon only, Task View and Widgets hidden |
| Start | "More pins" layout |
| File Explorer | Opens to This PC, shows file extensions |
| Snap | Snap layouts flyout and snap assist on |
| FancyZones (if PowerToys installed) | **SP8 Focus + Stack**: 62% main window, two stacked windows on the right. **SP8 Work + Reference**: 60/40 split |

Everything is per-user (HKCU). No admin needed. Every touched key is backed up first.

## Run it

1. Copy this folder to the Surface.
2. Quit PowerToys from the tray if it is running.
3. Open PowerShell in the folder and run:

```powershell
powershell -ExecutionPolicy Bypass -File .\Apply-Layout.ps1
```

Preview without changing anything:

```powershell
powershell -ExecutionPolicy Bypass -File .\Apply-Layout.ps1 -WhatIf
```

## Undo

```powershell
powershell -ExecutionPolicy Bypass -File .\Undo-Layout.ps1
```

## Known limits

- Recent Windows 11 builds block scripts from changing some taskbar values, Widgets most often.
  The script warns and skips those. Turn them off in Settings > Personalization > Taskbar.
- Start menu pins cannot be set per-user by a script on Windows 11 without Intune/Group Policy. Pin by hand.
