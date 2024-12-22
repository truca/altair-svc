import json
import requests

# Configuration
graphql_endpoint = "http://localhost:4000/graphql"  # Adjust this to your GraphQL endpoint
json_file_path = "./guild_upgrades.json"  # Path to your JSON file

# Function to read JSON file
def load_guild_upgrades(json_file):
    with open(json_file, 'r') as file:
        return json.load(file)

def create_guild_upgrade(guild_upgrade):
    # Extract necessary fields
    name = guild_upgrade['name']
    is_unique = guild_upgrade.get('isUnique', False)
    description = guild_upgrade.get('description', '')
    cost = guild_upgrade['cost']
    is_exclusive_to_campaigns = guild_upgrade.get('isExclusiveToCampaigns', False)
    options = guild_upgrade.get('options', [])
    allows_tags = guild_upgrade.get('allowsTags', [])
    allows_tags_max = max(option.get('allowsTagsMax', 0) for option in options) if options else 0 

    # Define the GraphQL mutation and variables
    query = """
    mutation CreateGuildUpgrade($name: String!, $isUnique: Boolean, $allowsTags: [String], $allowsTagsMax: Float, $description: String, $options: [GuildUpgradeOptionInputType], $cost: Float!, $isExclusiveToCampaigns: Boolean) {
        createGuildUpgrade(
            data: {name: $name, isUnique: $isUnique, allowsTags: $allowsTags, allowsTagsMax: $allowsTagsMax, description: $description, options: $options, cost: $cost, isExclusiveToCampaigns: $isExclusiveToCampaigns}
        ) {
            id
            name
        }
    }
    """

    variables = {
        "name": name,
        "isUnique": is_unique,
        "allowsTags": allows_tags,
        "allowsTagsMax": allows_tags_max,
        "description": description,
        "options": options,
        "cost": cost,
        "isExclusiveToCampaigns": is_exclusive_to_campaigns
    }

    # Make the request to the GraphQL API
    response = requests.post(
        graphql_endpoint,
        json={'query': query, 'variables': variables}
    )

    # Handle response
    if response.status_code == 200:
        print("Guild upgrade created successfully:", response.json())
    else:
        raise Exception(f"Query failed with status code {response.status_code}: {response.text}")

if __name__ == "__main__":
    guild_upgrades = load_guild_upgrades(json_file_path)

    # Iterate over each guild upgrade and create them
    for upgrade in guild_upgrades:
        create_guild_upgrade(upgrade)