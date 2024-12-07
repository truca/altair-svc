# makes a mutation for all the images in a folder
# 
import glob
import os

# Function to create a card for a faction
def create_card(faction, file_path):
    # Prepare the cURL command
    curl_command = f'curl -X POST -F \'operations={{"query":"mutation CreateCard($faction: String, $file: File!) {{ createCard( data: {{name: \\"card\\", description: \\"description\\", faction: $faction, cost: 7, image: $file, frequency: 0, favoritedCount: 0, comments: []}} ) {{ id }} }}","variables":{{"faction":"{faction}","file":null}}}}\' -F \'map={{"0":["variables.file"]}}\' -F \'0=@{file_path}\' http://localhost:4000/graphql'
    
    # Execute the cURL command
    os.system(curl_command)
    print(f"Card created for faction: {faction}")

# Call the function for all images in the folder that contain _resized_400_50 in their name
def upload_images_in_folder(folder_path):
    # Get all PNG files in the folder
    png_files = glob.glob(os.path.join(folder_path, '*_resized_400_50.png'))
    
    for file_path in png_files:
        faction = file_path.split('/')[-1].split('_')[0]
        lowercased_faction = faction.lower()
        create_card(lowercased_faction, file_path)
        print(f"Uploaded {file_path}")

folder_path = '../../../../Downloads/Cropped_Cards'
upload_images_in_folder(folder_path)