# README

## Limitations

- Create A with a Children B. If in the creation request A is requested through B, it'll fail as A doesn't exist when we look for B's children

## Supports

- Create an object together with it's children
- Go from parent to children and from children to parent
- Query efficiently: relatedObjects that are not being requested will not be fetched
- Update an object with new children to add them to the object

## Pending

- list pagination with cursor
- attributes on mutations to match form specs
- handle removal of n:m relations without removing one of the objects
