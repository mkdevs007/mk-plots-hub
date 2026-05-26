from PIL import Image

img = Image.open("/Users/rajkishores/.gemini/antigravity/brain/1fd5d93c-8e4f-49f6-b073-694aeb72028f/media__1779473691934.png")
if img.mode != "RGBA":
    img = img.convert("RGBA")

pixels = img.load()
width, height = img.size

for threshold in [0, 5, 10, 20, 50, 100, 200, 250]:
    min_x, min_y, max_x, max_y = width, height, 0, 0
    count = 0
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a > threshold:
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
                count += 1
    if count > 0:
        print(f"Alpha > {threshold:3}: BBox min_x={min_x:4}, min_y={min_y:4}, max_x={max_x:4}, max_y={max_y:4} | Width={max_x - min_x + 1:4}, Height={max_y - min_y + 1:4} | Count={count}")
    else:
        print(f"Alpha > {threshold:3}: No pixels found")
