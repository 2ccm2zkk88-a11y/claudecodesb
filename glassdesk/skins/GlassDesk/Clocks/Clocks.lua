-- Four analog world clocks with their own daylight-saving rules,
-- so they stay right no matter where the Surface is.
-- Layout constants must match Clocks.ini.
local PAD, R, SLOT, CY = 16, 36, 96, 56
local clocks = {}

local function weekday(y, m, d)
  return os.date('*t', os.time{year = y, month = m, day = d, hour = 12}).wday
end

local function nthSunday(y, m, n)
  return 1 + (8 - weekday(y, m, 1)) % 7 + 7 * (n - 1)
end

local function lastSunday(y, m)
  local dim = os.date('*t', os.time{year = y, month = m + 1, day = 0, hour = 12}).day
  return dim - (weekday(y, m, dim) - 1)
end

local function key(t)
  return t.month * 1000000 + t.day * 10000 + t.hour * 100 + t.min
end

local function inDST(rule, now, offset)
  if rule == 'US' then
    local t = os.date('!*t', now + offset * 3600)
    return key(t) >= key{month = 3, day = nthSunday(t.year, 3, 2), hour = 2, min = 0}
       and key(t) < key{month = 11, day = nthSunday(t.year, 11, 1), hour = 1, min = 0}
  elseif rule == 'EU' then
    local t = os.date('!*t', now)
    return key(t) >= key{month = 3, day = lastSunday(t.year, 3), hour = 1, min = 0}
       and key(t) < key{month = 10, day = lastSunday(t.year, 10), hour = 1, min = 0}
  elseif rule == 'AU' then
    local t = os.date('!*t', now + offset * 3600)
    return key(t) < key{month = 4, day = nthSunday(t.year, 4, 1), hour = 2, min = 0}
        or key(t) >= key{month = 10, day = nthSunday(t.year, 10, 1), hour = 2, min = 0}
  end
  return false
end

local function localOffset(now)
  local l, u = os.date('*t', now), os.date('!*t', now)
  u.isdst = l.isdst
  return os.difftime(os.time(l), os.time(u)) / 3600
end

local function line(x1, y1, x2, y2, width, color)
  return string.format('Line %.1f,%.1f,%.1f,%.1f | StrokeWidth %.1f | Stroke Color %s | StrokeStartCap Round | StrokeEndCap Round',
    x1, y1, x2, y2, width, color)
end

function Initialize()
  scale = tonumber(SKIN:GetVariable('Scale')) or 1
  for i = 1, 4 do
    clocks[i] = {
      name = SKIN:GetVariable('Clock' .. i .. 'Name'),
      offset = tonumber(SKIN:GetVariable('Clock' .. i .. 'Offset')) or 0,
      dst = string.upper(SKIN:GetVariable('Clock' .. i .. 'DST') or 'NONE'),
      cx = (PAD + 42 + (i - 1) * SLOT) * scale,
      cy = CY * scale,
      r = R * scale,
    }
    local c = clocks[i]
    local face = 'Face' .. i
    SKIN:Bang('!SetOption', face, 'Shape',
      string.format('Ellipse %.1f,%.1f,%.1f | Fill Color 255,255,255,35 | StrokeWidth %.1f | Stroke Color 255,255,255,90',
        c.cx, c.cy, c.r, scale))
    for h = 0, 11 do
      local a = math.rad(h * 30)
      local inner = (h % 3 == 0) and 0.74 or 0.82
      SKIN:Bang('!SetOption', face, 'Shape' .. (h + 2),
        line(c.cx + c.r * inner * math.sin(a), c.cy - c.r * inner * math.cos(a),
             c.cx + c.r * 0.9 * math.sin(a), c.cy - c.r * 0.9 * math.cos(a),
             ((h % 3 == 0) and 2 or 1) * scale, '255,255,255,200'))
    end
    SKIN:Bang('!SetOption', 'Name' .. i, 'Text', c.name)
  end
  SKIN:Bang('!UpdateMeter', '*')
end

function Update()
  local now = os.time()
  local here = os.date('*t', now)
  local hereOffset = localOffset(now)

  for i, c in ipairs(clocks) do
    local off = c.offset + (inDST(c.dst, now, c.offset) and 1 or 0)
    local t = os.date('!*t', now + off * 3600)

    local ha = math.rad(((t.hour % 12) + t.min / 60) * 30)
    local ma = math.rad((t.min + t.sec / 60) * 6)
    local sa = math.rad(t.sec * 6)
    local hands = 'Hands' .. i
    SKIN:Bang('!SetOption', hands, 'Shape',
      line(c.cx, c.cy, c.cx + c.r * 0.5 * math.sin(ha), c.cy - c.r * 0.5 * math.cos(ha), 3 * scale, '255,255,255,255'))
    SKIN:Bang('!SetOption', hands, 'Shape2',
      line(c.cx, c.cy, c.cx + c.r * 0.75 * math.sin(ma), c.cy - c.r * 0.75 * math.cos(ma), 2 * scale, '255,255,255,255'))
    SKIN:Bang('!SetOption', hands, 'Shape3',
      line(c.cx, c.cy, c.cx + c.r * 0.82 * math.sin(sa), c.cy - c.r * 0.82 * math.cos(sa), 1 * scale, '200,185,255,255'))
    SKIN:Bang('!SetOption', hands, 'Shape4',
      string.format('Ellipse %.1f,%.1f,%.1f | Fill Color 255,255,255,255 | StrokeWidth 0', c.cx, c.cy, 2.5 * scale))

    local dayDiff = (t.year * 1000 + t.yday) - (here.year * 1000 + here.yday)
    local day = (dayDiff > 0 and 'Tomorrow') or (dayDiff < 0 and 'Yesterday') or 'Today'
    local diff = off - hereOffset
    local diffText = (diff >= 0 and '+' or '') .. string.format(diff % 1 == 0 and '%d' or '%.1f', diff) .. 'HRS'
    SKIN:Bang('!SetOption', 'Info' .. i, 'Text', day .. ' ' .. diffText)
  end

  SKIN:Bang('!UpdateMeter', '*')
  SKIN:Bang('!Redraw')
  return 0
end
