# README

## Limitations

- Create A with a Children B. If in the creation request A is requested through B, it'll fail as A doesn't exist when we look for B's children

## Supports

- Create an object together with it's children
- Go from parent to children and from children to parent
- Query efficiently: relatedObjects that are not being requested will not be fetched
- Update an object with new children to add them to the object

## Pending

- attributes on mutations to match form specs
- handle removal of n:m relations without removing one of the objects
- separar los Inputs de create y update

## File transfer

### Read file

curl localhost:4000/graphql \
 -F operations='{ "query": "mutation ($file: File!) { readTextFile(file: $file) }", "variables": { "file": null } }' \
 -F map='{ "0": ["variables.file"] }' \
 -F 0=@file.txt

### Save file

curl localhost:4000/graphql \
 -F operations='{ "query": "mutation ($file: File!) { saveFile(file: $file) }", "variables": { "file": null } }' \
 -F map='{ "0": ["variables.file"] }' \
 -F 0=@img.png

### Create book with avatar

curl localhost:4000/graphql \
 -F operations='{ "query": "mutation ($file: File!) { createBook(data:{avatar: $file, name: \"book\"}) { id } }", "variables": { "file": null } }' \
 -F map='{ "0": ["variables.file"] }' \
 -F 0=@img.png
