# makes a mutation for all the images in a folder
# 
import glob
import os

# Function to create a card for a faction
def create_card(faction, file_path):
    # Get the corresponding text file for the description
    base_name = file_path.replace('_resized_400_50.png', '')
    description_file_path = base_name + '.txt'
    # print(f"Description file path: {description_file_path}")
    
    # Read the description from the text file
    if os.path.exists(description_file_path):
        with open(description_file_path, 'r') as file:
            description = file.read().replace("'", "").replace("\n", "\\n").replace('"', '').replace(')', '').replace('}', '')
    else:
        description = "No description available"

    # Prepare the cURL command
    curl_command = f'curl -X POST -F \'operations={{"query":"mutation CreateCard($faction: String, $file: File!, $description: String) {{ createCard( data: {{name: \\"card\\", description: $description, faction: $faction, cost: 7, image: $file, frequency: 0, favoritedCount: 0, comments: []}} ) {{ id }} }}","variables":{{"faction":"{faction}","file":null,"description":"{description}"}}}}\' -F \'map={{"0":["variables.file"]}}\' -F \'0=@{file_path}\' http://localhost:4000/graphql'
    
    # print(curl_command)

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

folder_path = '../../../Downloads/Cropped_Cards'
upload_images_in_folder(folder_path)

#faction = 'wild'
#card = '../../../Downloads/Cropped_Cards/Wild_AG_Units059_card_1_1_resized_400_50.png'
#create_card(faction, card)