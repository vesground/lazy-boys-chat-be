USER API

POST /api/v1/users

{
  name: {string},
  photo: {url},
  createdAt: {timestamp},
  updateAt: {timestamp}
}


GET /api/v1/users?name='username'

GET /api/v1/users/:id

PUT /api/v1/users/:id

DELETE /api/v1/users/:id
