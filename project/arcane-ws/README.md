# ArcaneQuest - websocket ChatApp

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

Bun + Elysia, Drizzle ORM

## Relational Diagram

![ERD-ws-chat-app](./assets/db-diagram.jpg)

## Endpoint

### AuthApi

- post => v1/auth/register
- post => v1/auth/login
- patch => v1/auth/session/logout
- post => v1/auth/session/refresh

### UserApi

- get => v1/users
- patch => v1/users
- delete => v1/users
- get => v1/users/active

### ChatApi

- get => v1/chat/
- post => v1/chat/
- patch => v1/chat/
- delete => v1/chat/

### ChatGroupApi

- get => v1/group/chat
- post => v1/group/chat
- patch => v1/group/chat
- delete => v1/group/chat
