#!/bin/bash
# populate_closet.sh
# Usage: ./populate_closet.sh <male_folder> <female_folder>
# Example: ./populate_closet.sh "/path/to/male_clothes" "/path/to/female_clothes"

if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <male_folder> [female_folder]"
    exit 1
fi

# Folders for male and female clothes
male_folder="$1"
female_folder="$2"

# API endpoint for adding a clothing item to the closet
API_URL="http://localhost:8000/api/add_to_closet/"

# Function to process a subfolder for a given user_id and category
# Arguments:
#   $1: folder path for the category (e.g., /path/to/male_clothes/1)
#   $2: user_id to insert for
#   $3: category_id (an integer between 1 and 5)
process_folder() {
    folder_path="$1"
    user_id="$2"
    category_id="$3"
    
    echo "Processing folder: $folder_path for user_id: $user_id, category_id: $category_id"
    
    # Check if folder exists
    if [ ! -d "$folder_path" ]; then
        echo "Folder $folder_path does not exist, skipping."
        return
    fi

    for file in "$folder_path"/*; do
        if [ -f "$file" ]; then
            # Extract item name from filename (without extension)
            filename=$(basename "$file")
            item_name="${filename%.*}"
            
            echo "Uploading: $filename as $item_name"

            # Execute the POST request with curl
            curl -X POST "$API_URL" \
                -F "item_name=$item_name" \
                -F "user_id=$user_id" \
                -F "category_id=$category_id" \
                -F "photo=@$file" \
                -H "Accept: application/json"

            echo -e "\n---"
        fi
    done
}

# Process male clothes for user id 1
if [ -d "$male_folder" ]; then
    echo "Processing male clothes for user 1..."
    for category in 1 2 3 4 5; do
        process_folder "$male_folder/$category" 1 $category
    done
else
    echo "Male folder not found."
fi

# Process female clothes for user id 2
if [ -n "$female_folder" ] && [ -d "$female_folder" ]; then
    echo "Processing female clothes for user 2..."
    for category in 1 2 3 4 5; do
        process_folder "$female_folder/$category" 2 $category
    done
else
    echo "Female folder not found."
fi

# Process combined clothes for user id 3 (if at least one folder exists)
if [ -d "$male_folder" ] || ([ -n "$female_folder" ] && [ -d "$female_folder" ]); then
    echo "Processing combined clothes for user 3..."
    if [ -d "$male_folder" ]; then
        for category in 1 2 3 4 5; do
            process_folder "$male_folder/$category" 3 $category
        done
    fi
    if [ -n "$female_folder" ] && [ -d "$female_folder" ]; then
        for category in 1 2 3 4 5; do
            process_folder "$female_folder/$category" 3 $category
        done
    fi
fi

echo "Done."

# to run ./populateguests.sh "stylemate\frontend\public\defaultcloset\male_closet" "stylemate\frontend\public\defaultcloset\female_closet"