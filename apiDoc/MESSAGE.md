MESSAGE API

POST /api/v1/messages/

{
  content: {string},
  from: {objectID},
  to: {objectID},
  createdAt: {timestamp},
  updateAt: {timestamp}
}

GET /api/v1/messages?from='username'&to='username'
