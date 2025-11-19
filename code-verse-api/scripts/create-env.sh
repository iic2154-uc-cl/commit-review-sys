#!/bin/bash

# Prints text in bolg green color
green_bold() {
  echo -e "$(tput bold)$(tput setaf 2)$(echo "$1")$(tput sgr0)"
}

# Check if .env.example exists
if [ ! -f .env.example ]; then
    echo "Error: .env.example file not found!"
    exit 1
fi
# Check if .env already exists
if [ -f .env ]; then
    # we mantain the .env or start over
    echo -e "The .env file already exists.\nDo you want to start over? (y/n)"
    read -r answer
    if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
        rm .env
        echo -e "The .env file has been removed.\n"
    else
        echo -e "The .env file has not been removed.\n"
        exit 0
    fi
fi

echo "Add values for env"

# Looping through the contents of .env.example to get env variable names
for var in $(grep -v '^#' .env.example | grep -o '^[^=]\+'); do
    echo -e "Enter value for $(green_bold "$var"):"
    read -r value;
    echo -e "$var = $value\n" >> .env
done
