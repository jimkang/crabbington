pico-8 cartridge // http://www.pico-8.com
version 16
__lua__
-- enable mouse and keyboard
poke(0x5f2d, 1)

tile_size = 8
tiles_per_side = 16
canvas_size = 128
octo_x = 64
octo_y = 64
octo_last_vector_x = 0
octo_last_vector_y = 0
click_started = false

cls()

function _update()
  mouse_button_state = stat(34)
  -- only move on mouse up.
  if (click_started and mouse_button_state == 0) then
      click_started = false
      x = stat(32)
      y = stat(33)
      if (is_adjacent(octo_x, octo_y, x, y)) then
        new_x = tile_start(stat(32))
        new_y = tile_start(stat(33))
        octo_last_vector_x = new_x - octo_x
        octo_last_vector_y = new_y - octo_y
        octo_x = new_x
        octo_y = new_y
      end
  end
  if (mouse_button_state == 1) then
    click_started = true
  end  
end

function _draw()
  cls()
  draw_grid()
  draw_octo()
  draw_mouse_cursor()
  print(octo_last_vector_x .. ", " .. octo_last_vector_y)
end

-- doing this is unnecessary for web builds.
function draw_mouse_cursor()
  circfill(stat(32), stat(33), 2, 6)
end

function draw_octo()
  sprite = 0
  if abs(octo_last_vector_x) > abs(oct_last_vector_y) then
    sprite = 1
  end
  spr(sprite, octo_x, octo_y, 1, 1, octo_last_vector_x < 0, octo_last_vector_y < 0)
end

function draw_grid()
  for x=1,tiles_per_side do
    line(x * tile_size, 0, x * tile_size, canvas_size, 3)
  end
  for y=1,tiles_per_side do
    line(0, y * tile_size, canvas_size, y * tile_size, 3)
  end
end

function tile_start(n)
  return flr(n/tile_size) * tile_size
end

function tile_center(n)
  return (flr(n/tile_size) + 0.5) * tile_size
end

-- for now, points on the same tile are considered "adjacent".
function is_adjacent(x1, y1, x2, y2)
  return abs(tile_center(x1) - tile_center(x2)) <= tile_size and abs(tile_center(y1) - tile_center(y2)) <= tile_size
end

__gfx__
0088980000000cc0009aa90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
088888800000cccc0339933000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
08988988000ccc8c3033330300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0887788000ccccc10333333000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
08877880009c10c003b33b3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0088880009904c100333333000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00888800099090000603306000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
08000080890098000080080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
