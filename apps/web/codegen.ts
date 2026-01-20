import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
  documents: ['graphql/**/*.graphql'],
  generates: {
    './graphql/generated/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
