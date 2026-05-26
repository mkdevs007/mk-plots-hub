from PIL import Image
from collections import Counter

img = Image.open("/Users/rajkishores/.gemini/antigravity/brain/1fd5d93c-8e4f-49f6-b073-694aeb72028f/media__1779473691934.png")
if img.mode != "RGBA":
    img = img.convert("RGBA")

pixels = img.load()
width, height = img.size

# Sample the four corners to see what the background color is
corners = [
    pixels[0, 0],
    pixels[width - 1, 0],
    pixels[0, height - 1],
    pixels[width - 1, height - 1]
]
print("Corners:", corners)

# Sample a grid of pixels
sample_colors = []
for y in range(0, height, 32):
    for x in range(0, width, 32):
        sample_colors.append(pixels[x, y])

counter = Counter(sample_colors)
print("Common sampled colors:", counter.most_common(10))
