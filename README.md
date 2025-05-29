# README

## Mongo

- Use docker to install and run mongodb: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-community-with-docker/

  - start docker container: docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
  - check if docker started: docker container ls
  - connect to docker: mongosh --port 27017

- For arrays filters in where, they're used as "OR", unless you send an element like ["hero,wild"], then it's going to join them as an AND

## Kafka

Commands:

- docker run -d -p 9092:9092 --name broker apache/kafka:latest
- docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
- docker rm containerId

## Limitations

- Create A with a Children B. If in the creation request A is requested through B, it'll fail as A doesn't exist when we look for B's children

## Supports

- Create an object together with it's children
- Go from parent to children and from children to parent
- Query efficiently: relatedObjects that are not being requested will not be fetched
- Update an object with new children to add them to the object

## Pending

- use directives to add subscriptions
- attributes on mutations to match form specs
- handle removal of n:m relations without removing one of the objects
- separar los Inputs de create y update
- manejar el caso en que tenga permisos para crear una entidad pero no la otra (bloquear toda la operación)
- block readOne when you don't have access to the owner entity (AuthZ)
- Agregar list y maxPages a children entities (Ej: mensajes dentro de chats)

## Pagination

If you send a -1 in pageSize, it'll assume you want all the elements

## File transfer

### Create card

curl -X POST \
 -F 'operations={"query":"mutation CreateCard($faction: String, $file: File!) { \
 createCard( \
 data: {name: \"card\", description: \"description\", faction: $faction, cost: 7, image: $file, frequency: 0, favoritedCount: 0, comments: []} \
 ) { id } \
 }","variables":{"faction":"chaos","file":null}}' \
 -F 'map={"0":["variables.file"]}' \
 -F '0=@uploads/Chaos_AG_Units000_card_0_0_resized_400_50.png' \
 http://localhost:4000/graphql

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

### AuthN / AuthZ

We're using 2 tokens: an access token and a refresh token. The access token has all the info of the user and is secure to read directly from,
but has a shorter duration. If the access token is expired, we use the refresh token to give you a new access token automatically on any endpoint.
Both durations are handled by env variables

### AuthZ

AuthZ has 2 components: static and entity based. Static is when the permission depends on user roles or is public.
Entity based is when we check for owners and collaborators in the final entity

#### Access token expiration

It has 2 expirations: one for the cookie, and another in the expiresIn param.
The expiresIn parameter is what matters because it can't be modified by the user.
We added the cookie expiration to handle most expired token cases at the cookie level.
This means we won't receive expired tokens in most cases,
reducing the number of checks needed

### Features

- Multi value filter:
  - { faction: "chaos,corruption" }: filter with either of these values

### Python

python3 resize.py
python3 utils/upload.py

### Firestore emulator

Add serviceAccountKey.json file from FireStore
