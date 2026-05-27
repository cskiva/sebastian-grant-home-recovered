import nextPlugin from '@next/eslint-plugin-next'

export default [
  {
    ignores: ['**/payload-types.ts', '.next/**', 'node_modules/**'],
  },
  nextPlugin.configs['core-web-vitals'],
]
