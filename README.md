# README

## Mongo

- Use docker to install and run mongodb: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-community-with-docker/
  - start docker container: docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
  - check if docker started: docker container ls
  - connect to docker: mongosh --port 27017

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

### AuthN / AuthZ

We're using 2 tokens: an access token and a refresh token. The access token has all the info of the user and is secure to read directly from, but has a shorter duration. If the access token is expired, we use the refresh token to give you a new access token automatically on any endpoint. Both durations are handled by env variables

#### Access token expiration

it has 2 expirations: one for the cookie, and another in the expiresIn param, which is the one that matters because it can't be modified by the user. We just added the cookie expiration so that in most cases where the access token is expired, we're simply going to not receive it, so there's less things to check
