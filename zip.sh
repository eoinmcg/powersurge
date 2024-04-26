#!/bin/bash

VER=$(awk -F'"' '/"version": ".+"/{ print $4; exit; }' package.json)
COMMIT=$(git rev-parse --short=6 HEAD)

FILE="powersurge-${COMMIT}.zip"

rm *.zip
zip -r $FILE dist/

echo -e "\n-----------------\n"
echo "CREATED: ${FILE}"
