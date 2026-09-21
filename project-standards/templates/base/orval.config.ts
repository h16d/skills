import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: 'http://localhost:3000/docs-json',
    output: {
      target: 'apps/web/src/api/generated.ts',
      client: 'react-query',
      mode: 'tags-split',
    },
  },
});
