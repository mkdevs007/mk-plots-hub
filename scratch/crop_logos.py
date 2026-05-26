import os
from PIL import Image

artifacts_dir = "/Users/rajkishores/.gemini/antigravity/brain/1fd5d93c-8e4f-49f6-b073-694aeb72028f"
files = {
    "media__1779440661767.png": "logo_dark_bg.png",
    "media__1779441561262.png": "logo_light_bg.png"
}

for src_name, dest_name in files.items():
    src_path = os.path.join(artifacts_dir, src_name)
    if os.path.exists(src_path):
        img = Image.open(src_path)
        
        # Crop to bounding box of non-zero alpha
        # For image with alpha channel, getbbox() returns bounding box of non-zero pixels
        bbox = img.getbbox()
        if bbox:
            cropped = img.crop(bbox)
            # Add small padding of 5px
            padding = 10
            new_w = cropped.width + padding * 2
            new_h = cropped.height + padding * 2
            padded_img = Image.new("RGBA", (new_w, new_h), (0, 0, 0, 0))
            padded_img.paste(cropped, (padding, padding))
            
            dest_path = os.path.join("/Users/rajkishores/Workspace/MK builders v2/src/assets", dest_name)
            padded_img.save(dest_path, "PNG")
            print(f"Cropped and saved {src_name} -> {dest_name}: original_size={img.size}, new_size={padded_img.size}")
        else:
            print(f"Could not find bounding box for {src_name}")
    else:
        print(f"{src_name} does not exist")
