# API Specification

## Database Models

```prisma
model User {
  id              Int      @id @default(autoincrement())
  email           String   @unique
  name            String?
  password        String
  role            String   @default("USER")
  isEmailVerified Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  Token           Token[]
  Todo            Todo[]
}

model Token {
  id          Int      @id @default(autoincrement())
  token       String
  type        String
  expires     DateTime
  blacklisted Boolean
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
  userId      Int
}

model Todo {
  id        String   @id @default(uuid())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
}
```

## Authentication APIs

---

EP: POST /auth/register
DESC: Register a new user account.
IN: body:{email:str!, password:str!, name:str}
OUT: 201:{user:{id:int, email:str, name:str?, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"400":"Invalid input or duplicate email", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/register -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
EX_RES_201: {"user":{"id":1,"email":"user@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2024-10-30T10:30:00Z","updatedAt":"2024-10-30T10:30:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2024-10-30T11:30:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2024-11-06T10:30:00Z"}}}

---

EP: POST /auth/login
DESC: Authenticate user and get access tokens.
IN: body:{email:str!, password:str!}
OUT: 200:{user:{id:int, email:str, name:str?, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"401":"Invalid email or password", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123"}'
EX_RES_200: {"user":{"id":1,"email":"user@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2024-10-30T10:30:00Z","updatedAt":"2024-10-30T10:30:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2024-10-30T11:30:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2024-11-06T10:30:00Z"}}}

---

EP: POST /auth/logout
DESC: Logout user and invalidate refresh token.
IN: body:{refreshToken:str!}
OUT: 204:{}
ERR: {"404":"Token not found", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/logout -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_204: {}

---

EP: POST /auth/refresh-tokens
DESC: Refresh access and refresh tokens.
IN: body:{refreshToken:str!}
OUT: 200:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}
ERR: {"401":"Invalid or expired refresh token", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/refresh-tokens -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_200: {"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2024-10-30T11:30:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2024-11-06T10:30:00Z"}}

---

EP: POST /auth/forgot-password
DESC: Send password reset email to user.
IN: body:{email:str!}
OUT: 204:{}
ERR: {"404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/forgot-password -H "Content-Type: application/json" -d '{"email":"user@example.com"}'
EX_RES_204: {}

---

EP: POST /auth/reset-password
DESC: Reset user password using reset token.
IN: query:{token:str!}, body:{password:str!}
OUT: 204:{}
ERR: {"401":"Password reset failed", "500":"Internal server error"}
EX_REQ: curl -X POST "/auth/reset-password?token=reset-token-here" -H "Content-Type: application/json" -d '{"password":"newPassword123"}'
EX_RES_204: {}

---

EP: POST /auth/verify-email
DESC: Verify user email address using verification token.
IN: query:{token:str!}
OUT: 204:{}
ERR: {"401":"Email verification failed", "500":"Internal server error"}
EX_REQ: curl -X POST "/auth/verify-email?token=verify-token-here"
EX_RES_204: {}

---

EP: POST /auth/send-verification-email
DESC: Send email verification email to authenticated user.
IN: headers:{Authorization:str!}
OUT: 204:{}
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/send-verification-email -H "Authorization: Bearer access-token-here"
EX_RES_204: {}

---

## User Management APIs

---

EP: POST /users
DESC: Create a new user (admin only).
IN: headers:{Authorization:str!}, body:{email:str!, password:str!, name:str!, role:str!}
OUT: 201:{id:int, email:str, name:str?, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Invalid input or duplicate email", "401":"Unauthorized", "403":"Forbidden", "500":"Internal server error"}
EX_REQ: curl -X POST /users -H "Authorization: Bearer admin-token" -H "Content-Type: application/json" -d '{"email":"newuser@example.com","password":"password123","name":"New User","role":"USER"}'
EX_RES_201: {"id":2,"email":"newuser@example.com","name":"New User","role":"USER","isEmailVerified":false,"createdAt":"2024-10-30T10:30:00Z","updatedAt":"2024-10-30T10:30:00Z"}

---

EP: GET /users
DESC: Get paginated list of users (admin only).
IN: headers:{Authorization:str!}, query:{name:str?, role:str?, sortBy:str?, limit:int?, page:int?}
OUT: 200:{results:arr[{id:int, email:str, name:str?, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}], page:int, limit:int, totalPages:int, totalResults:int}
ERR: {"401":"Unauthorized", "403":"Forbidden", "500":"Internal server error"}
EX_REQ: curl -X GET "/users?page=1&limit=10&role=USER" -H "Authorization: Bearer admin-token"
EX_RES_200: {"results":[{"id":1,"email":"user@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2024-10-30T10:30:00Z","updatedAt":"2024-10-30T10:30:00Z"}],"page":1,"limit":10,"totalPages":1,"totalResults":1}

---

EP: GET /users/:userId
DESC: Get user by ID (own profile or admin access).
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{id:int, email:str, name:str?, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"401":"Unauthorized", "403":"Forbidden", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X GET /users/1 -H "Authorization: Bearer access-token"
EX_RES_200: {"id":1,"email":"user@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2024-10-30T10:30:00Z","updatedAt":"2024-10-30T10:30:00Z"}

---

EP: PATCH /users/:userId
DESC: Update user information (own profile or admin access).
IN: headers:{Authorization:str!}, params:{userId:int!}, body:{email:str?, password:str?, name:str?}
OUT: 200:{id:int, email:str, name:str?, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Invalid input or duplicate email", "401":"Unauthorized", "403":"Forbidden", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X PATCH /users/1 -H "Authorization: Bearer access-token" -H "Content-Type: application/json" -d '{"name":"Updated Name"}'
EX_RES_200: {"id":1,"email":"user@example.com","name":"Updated Name","role":"USER","isEmailVerified":false,"createdAt":"2024-10-30T10:30:00Z","updatedAt":"2024-10-30T10:35:00Z"}

---

EP: DELETE /users/:userId
DESC: Delete user (own account or admin access).
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{}
ERR: {"401":"Unauthorized", "403":"Forbidden", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X DELETE /users/1 -H "Authorization: Bearer access-token"
EX_RES_200: {}

---

## Todo APIs

---

EP: GET /todos
DESC: Get all todos for authenticated user.
IN: headers:{Authorization:str!}
OUT: 200:{todos:arr[{id:str, title:str, completed:bool, createdAt:str, updatedAt:str}], total:int}
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X GET /todos -H "Authorization: Bearer access-token"
EX_RES_200: {"todos":[{"id":"550e8400-e29b-41d4-a716-446655440000","title":"Learn React 19","completed":false,"createdAt":"2024-10-25T10:00:00Z","updatedAt":"2024-10-25T10:00:00Z"}],"total":1}

---

EP: POST /todos
DESC: Create a new todo for authenticated user.
IN: headers:{Authorization:str!}, body:{title:str!}
OUT: 201:{id:str, title:str, completed:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Invalid input", "401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X POST /todos -H "Authorization: Bearer access-token" -H "Content-Type: application/json" -d '{"title":"New Todo Item"}'
EX_RES_201: {"id":"550e8400-e29b-41d4-a716-446655440001","title":"New Todo Item","completed":false,"createdAt":"2024-10-30T10:30:00Z","updatedAt":"2024-10-30T10:30:00Z"}

---

EP: PUT /todos/:id
DESC: Update todo by ID for authenticated user.
IN: headers:{Authorization:str!}, params:{id:str!}, body:{title:str?, completed:bool?}
OUT: 200:{id:str, title:str, completed:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Invalid input", "401":"Unauthorized", "404":"Todo not found", "500":"Internal server error"}
EX_REQ: curl -X PUT /todos/550e8400-e29b-41d4-a716-446655440000 -H "Authorization: Bearer access-token" -H "Content-Type: application/json" -d '{"completed":true}'
EX_RES_200: {"id":"550e8400-e29b-41d4-a716-446655440000","title":"Learn React 19","completed":true,"createdAt":"2024-10-25T10:00:00Z","updatedAt":"2024-10-30T10:30:00Z"}

---

EP: DELETE /todos/:id
DESC: Delete todo by ID for authenticated user.
IN: headers:{Authorization:str!}, params:{id:str!}
OUT: 204:{}
ERR: {"401":"Unauthorized", "404":"Todo not found", "500":"Internal server error"}
EX_REQ: curl -X DELETE /todos/550e8400-e29b-41d4-a716-446655440000 -H "Authorization: Bearer access-token"
EX_RES_204: {}

---

## MCP APIs

---

EP: POST /mcp
DESC: Handle MCP protocol POST requests.
IN: headers:{Authorization:str!}, body:{method:str!, params:obj?, id:str?}
OUT: 200:{result:obj?, error:obj?, id:str?}
ERR: {"401":"Unauthorized", "400":"Invalid MCP request", "500":"Internal server error"}
EX_REQ: curl -X POST /mcp -H "Authorization: Bearer mcp-token" -H "Content-Type: application/json" -d '{"method":"ping","id":"1"}'
EX_RES_200: {"result":{"status":"ok"},"id":"1"}

---

EP: GET /mcp
DESC: Handle MCP protocol GET requests.
IN: headers:{Authorization:str!}, query:{method:str?, params:str?}
OUT: 200:{result:obj?, error:obj?}
ERR: {"401":"Unauthorized", "400":"Invalid MCP request", "500":"Internal server error"}
EX_REQ: curl -X GET "/mcp?method=status" -H "Authorization: Bearer mcp-token"
EX_RES_200: {"result":{"status":"active"}}

---

EP: DELETE /mcp
DESC: Handle MCP protocol DELETE requests.
IN: headers:{Authorization:str!}, body:{method:str!, params:obj?, id:str?}
OUT: 200:{result:obj?, error:obj?, id:str?}
ERR: {"401":"Unauthorized", "400":"Invalid MCP request", "500":"Internal server error"}
EX_REQ: curl -X DELETE /mcp -H "Authorization: Bearer mcp-token" -H "Content-Type: application/json" -d '{"method":"cleanup","id":"2"}'
EX_RES_200: {"result":{"cleaned":true},"id":"2"}