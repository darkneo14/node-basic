Node Basic

This is a simple Nodejs based project that uses express to create REST apis 
for user login , Adding a Json Patch (using jsonpatch) and converting an
image into a thumbnail.

base: localhost:8081/api
Api endpoints-

1) /login
params- username, password
return- 
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5lbyIsIm5hbWUiOiJUZXN0IFVzZXIiLCJpZCI6Ik5lbyIsImlhdCI6MTQ5NDE4MTY3MSwiZXhwIjoxNDk0MTgzMTExfQ.bYI1B_YWlGwmsQeuZ89djx__rZ0TfMARKPpnCHbvNfw"
}

The token is generated using jwt and expires in 1hr

2) /applyJsonPatch
params- jsonData, jsonPatch
return-
{
  "success": true,
  "finalData": {
    "baz": "boo",
    "foo": "bar"
  }
}

The final Data is the result of applying the jsonPatch provided to the jsonData

3) /createThumbnail
params- imageUrl, filename(the name of the image)
return- 
{
  "success": true,
  "ThumbnailUrl": "localhost:8081/scarlett11.jpeg"
}