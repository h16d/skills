# Backend: NestJS, Database, Kavo, Zod

## NestJS

Prefer official NestJS packages and built-in framework functionality (DI, modules, controllers, providers, guards, pipes, interceptors, filters) over custom infrastructure. Don't recreate what NestJS already provides.

### Module Structure

Singular domain names, files flat inside the module (not split into `controllers/`, `services/`, etc. subfolders unless the module is genuinely large):

```text
src/
└── modules/
    └── project/
        ├── project.controller.ts
        ├── project.service.ts
        ├── project.module.ts
        ├── project.entity.ts
        ├── project.dto.ts
        ├── project.schema.ts
        ├── project.guard.ts
        ├── project.interceptor.ts
        ├── project.decorator.ts
        └── project.spec.ts
```

Only include files actually required. One module per domain/resource.

## Database (PostgreSQL + TypeORM)

- Latest stable PostgreSQL.
- UUIDv7 primary keys — prefer DB-generated UUIDv7 if Postgres supports it, otherwise generate in the application.
- Entity file names singular: `user.entity.ts`, `project.entity.ts`, `task.entity.ts` — never `users.entity.ts`.
- Migrations for all schema changes. Never `synchronize: true` outside disposable local dev.
- Add indexes for frequently queried fields. Keep naming conventions consistent.
- Use repositories and TypeORM's standard APIs. Transactions where multiple related operations must be atomic. No custom ORM abstraction without a concrete requirement.

## Kavo (CRUD)

Before hand-writing CRUD endpoints, check whether Kavo covers it. Use Kavo's NestJS/TypeORM integration:

```ts
@Kavo(Book)
```

Use Kavo for: create, find one, find many, update, delete, filtering, sorting, pagination, selection, relations, validation boundaries, CRUD configuration.

Keep custom business logic outside generic CRUD infrastructure — use NestJS services/hooks/policies for domain-specific behavior.

If Kavo isn't already installed in the project, read the Kavo skill/docs before implementing (https://kavo.js.org/).

## Zod

Prefer Zod over class-validator for new projects; don't introduce class-validator unless an existing project constraint requires it. Zod schemas are the source of truth:

```ts
import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().min(1),
});

export type CreateBookDto = z.infer<typeof createBookSchema>;
```

Don't duplicate validation rules across systems. Keep schemas in the domain module.

## DTOs

Keep beside the module: `project.dto.ts`, `project.schema.ts` — not a `dto/create-project.dto.ts` / `dto/update-project.dto.ts` split. Don't create DTO classes just because NestJS examples typically use class-validator; use Zod-inferred types instead.

## Rate Limiting

In-memory by default — not PostgreSQL. Prefer built-in framework rate-limiting; only write a custom limiter if the framework can't satisfy the requirement. If deployed with multiple instances, explicitly note that in-memory limiting is per-instance. Never silently replace it with Redis or PostgreSQL.
