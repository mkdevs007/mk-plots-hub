import os
from PIL import Image

artifacts_dir = "/Users/rajkishores/.gemini/antigravity/brain/1fd5d93c-8e4f-49f6-b073-694aeb72028f"
files = ["media__1779440661767.png", "media__1779441561262.png"]

for f in files:
    path = os.path.join(artifacts_dir, f)
    if os.path.exists(path):
        img = Image.open(path)
        print(f"{f}: format={img.format}, size={img.size}, mode={img.mode}")
        # Check if transparent
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            print("  Has transparency channel")
        else:
            print("  No transparency channel")
    else:
        print(f"{f} does not exist")
