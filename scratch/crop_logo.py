from PIL import Image

# Open the uploaded high-res image
img = Image.open("/Users/rajkishores/.gemini/antigravity/brain/1fd5d93c-8e4f-49f6-b073-694aeb72028f/media__1779473691934.png")
if img.mode != "RGBA":
    img = img.convert("RGBA")

# Bounding box coordinates with alpha > 10 threshold
min_x = 13
min_y = 22
max_x = 1000
max_y = 293

# Crop the image
cropped_img = img.crop((min_x, min_y, max_x + 1, max_y + 1))

# Save the cropped logo to the workspace assets folder, replacing the old one
output_path = "/Users/rajkishores/Workspace/MK builders v2/src/assets/logo.png"
cropped_img.save(output_path, "PNG")

print("Successfully cropped and saved the new logo to:")
print(output_path)
print("New logo dimensions:", cropped_img.size)
