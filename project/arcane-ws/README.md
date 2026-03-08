# ArcaneQuest - ChatApp

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev
```

This project was created using `bun init` in bun v1.3.9. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## TechStack

Bun + Elysia, drizzle ORM, reactjs,

## Relational Diagram

![ERD-ws-chat-app](./public/assets/db-diagram.jpg)

## Endpoint

### AuthApi

- post => /auth/register
- post => /auth/login
- patch => /auth/logout
- post => /auth/refresh

### UserApi

- get => /users
- patch => /users
- delete => /users
- get => /users/active

### ChatApi

- get => /chat/
- post => /chat/
- patch => /chat/
- delete => /chat/

### ChatGroupApi

- get => /group/chat
- post => /group/chat
- patch => /group/chat
- delete => /group/chat
