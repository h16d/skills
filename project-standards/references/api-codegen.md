# API Codegen: Swagger + Orval

Use NestJS Swagger to generate an OpenAPI spec from the API, and Orval to generate typed frontend models/client code from that spec. Don't hand-write frontend types or fetch wrappers for endpoints Orval can generate.

## Backend: Swagger

Use `@nestjs/swagger`. Decorate controllers/DTOs so the generated spec is accurate — don't leave endpoints undocumented.

```ts
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder().setTitle('API').setVersion('1.0').build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('docs', app, document);
```

- Since DTOs are Zod schemas (see [backend.md](backend.md)), generate Swagger schemas from Zod with `nestjs-zod` (`patchNestJsSwagger()` + `createZodDto`) rather than duplicating shapes in decorator-based classes.
- Serve the raw spec at a stable path (e.g. `/docs-json`) — Orval reads from this, not from `/docs`.
- Keep the spec buildable without a running database; codegen must work in CI from a clean checkout.

## Frontend: Orval

Generate models and a typed client into the frontend app from the served OpenAPI spec. Start from `templates/base/orval.config.ts` and adjust the `input`/`target` paths for the project.

- Prefer the `react-query` client for React apps — it pairs generated hooks with the fetching layer instead of hand-rolled `useEffect` calls.
- Commit generated output, or regenerate it in CI before build/test — pick one and be consistent; don't let it silently drift from the backend.
- Never hand-edit generated files. If output needs shaping, adjust the Orval config or the backend Swagger decorators, not the generated file.
- Add an npm script (`generate:api` or similar) that runs Orval, and re-run it whenever backend DTOs/routes change.

## Definition of Done

After changing an endpoint's shape: re-run Orval, verify the frontend typechecks against the new generated types, and commit both the backend change and the regenerated output together.
