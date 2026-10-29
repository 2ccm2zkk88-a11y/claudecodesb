-- Fills the month grid and moves the "today" circle.
-- Grid constants must match Calendar.ini.
local PAD, TOP, CW, RH = 18, 70, 32, 26

function Initialize()
  scale = tonumber(SKIN:GetVariable('Scale')) or 1
  textColor = SKIN:GetVariable('Text')
end

function Update()
  local now = os.date('*t')
  local first = os.date('*t', os.time{year = now.year, month = now.month, day = 1, hour = 12})
  local startCol = first.wday - 1
  local daysInMonth = os.date('*t', os.time{year = now.year, month = now.month + 1, day = 0, hour = 12}).day

  SKIN:Bang('!SetOption', 'MonthName', 'Text', string.upper(os.date('%B %Y')))

  for i = 0, 41 do
    local d = i - startCol + 1
    local meter = 'Day' .. i
    SKIN:Bang('!SetOption', meter, 'Text', (d >= 1 and d <= daysInMonth) and tostring(d) or '')
    if d == now.day then
      local cx = (PAD + (i % 7) * CW + CW / 2) * scale
      local cy = (TOP + math.floor(i / 7) * RH + RH / 2) * scale
      SKIN:Bang('!SetOption', 'Today', 'Shape',
        string.format('Ellipse %.1f,%.1f,%.1f | Fill Color 255,255,255,235 | StrokeWidth 0', cx, cy, 11 * scale))
      SKIN:Bang('!SetOption', meter, 'FontColor', '45,30,120,255')
    else
      SKIN:Bang('!SetOption', meter, 'FontColor', textColor)
    end
  end

  SKIN:Bang('!UpdateMeter', '*')
  SKIN:Bang('!Redraw')
  return 0
end
