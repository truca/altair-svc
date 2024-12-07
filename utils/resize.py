# Description: Resize images in a folder to a specific width and image quality

import glob
from PIL import Image
import os

# Function to resize an image
def resize_image(input_path, new_width, quality):
    # Open the original image
    with Image.open(input_path) as img:
        # Calculate the new height to maintain aspect ratio
        aspect_ratio = img.height / img.width
        new_height = int(new_width * aspect_ratio)
        
        # Resize the image
        resized_img = img.resize((new_width, new_height), Image.LANCZOS)

        # Create the output file name
        base_name, ext = os.path.splitext(input_path)
        output_path = f"{base_name}_resized_{new_width}_{int(quality)}{ext}"
        
        resized_img.save(output_path, format='PNG')

    # Reduce the file size
    reduce_file_size(output_path, quality)
    print(f"Image resized and saved with new name including size: {output_path.split('.')[0]}_resized_{new_width}_{quality}.png")

# Function to reduce the file size of an image
def reduce_file_size(file_path, quality):
    with Image.open(file_path) as img:
        img.save(file_path, 'webp', optimize = True, quality = quality)


# Function to resize all images in a folder
def resize_images_in_folder(folder_path, new_width, quality):
    # Get all PNG files in the folder
    png_files = glob.glob(os.path.join(folder_path, '*.png'))
    
    for file_path in png_files:
        resize_image(file_path, new_width, quality)
        print(f"Resized {file_path}")

# input_image_path = 'uploads/Chaos_AG_Units000_card_0_0.png'  # Path to the input image
folder_path = '../../../../Downloads/Cropped_Cards'
new_width = 400  # Desired width
quality = 50  # Target quality

resize_images_in_folder(folder_path, new_width, quality)