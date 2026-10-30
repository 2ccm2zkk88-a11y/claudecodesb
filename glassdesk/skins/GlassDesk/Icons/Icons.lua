-- Swaps in a custom picture for any desktop item that has one in
-- @Resources\IconOverrides, named exactly like the item (e.g. "Beaucoup Banks.png").
local EXTS = { '.png', '.ico', '.jpg' }
local last = {}

function Initialize()
  dir = SKIN:GetVariable('@') .. 'IconOverrides\\'
  count = tonumber(SKIN:GetVariable('IconCount')) or 12
end

function Update()
  for i = 1, count do
    local name = SKIN:GetMeasure('mName' .. i):GetStringValue()
    local path = ''
    if name ~= '' then
      for _, ext in ipairs(EXTS) do
        local f = io.open(dir .. name .. ext, 'rb')
        if f then f:close(); path = dir .. name .. ext; break end
      end
    end
    if path ~= (last[i] or '') then
      local meter = 'Img' .. i
      if path ~= '' then
        SKIN:Bang('!SetOption', meter, 'MeasureName', '')
        SKIN:Bang('!SetOption', meter, 'ImageName', path)
      else
        SKIN:Bang('!SetOption', meter, 'MeasureName', 'mIcon' .. i)
        SKIN:Bang('!SetOption', meter, 'ImageName', '%1')
      end
      SKIN:Bang('!UpdateMeter', meter)
      last[i] = path
    end
  end
  SKIN:Bang('!Redraw')
  return 0
end
