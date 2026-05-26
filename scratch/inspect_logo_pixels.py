import os
from PIL import Image

logo_dir = "/Users/rajkishores/Workspace/MK builders v2/src/assets"
for name in ["logo_dark_bg.png", "logo_light_bg.png"]:
    path = os.path.join(logo_dir, name)
    if os.path.exists(path):
        img = Image.open(path)
        # Find if it has non-transparent pixels and their colors
        pixels = list(img.getdata())
        non_transparent = [p for p in pixels if p[3] > 0]
        print(f"{name}: total_pixels={len(pixels)}, non_transparent={len(non_transparent)}")
        if non_transparent:
            # Let's see a sample of unique colors
            unique_colors = set(non_transparent)
            print(f"  Number of unique non-transparent colors: {len(unique_colors)}")
            # Sample some colors
            samples = list(unique_colors)[:10]
            print(f"  Sample colors (R, G, B, A): {samples}")
