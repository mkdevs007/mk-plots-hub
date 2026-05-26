from PIL import Image

img = Image.open("/Users/rajkishores/.gemini/antigravity/brain/1fd5d93c-8e4f-49f6-b073-694aeb72028f/media__1779473691934.png")
if img.mode != "RGBA":
    img = img.convert("RGBA")

pixels = img.load()
width, height = img.size

min_x, min_y, max_x, max_y = width, height, 0, 0
non_trans_count = 0

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        # If the pixel is not fully transparent
        if a > 0:
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)
            non_trans_count += 1

print(f"Non-transparent bounding box: min_x={min_x}, min_y={min_y}, max_x={max_x}, max_y={max_y}")
print(f"Width={max_x - min_x + 1}, Height={max_y - min_y + 1}")
print(f"Total non-transparent pixels: {non_trans_count}")
