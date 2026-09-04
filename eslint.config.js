import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // A provider and its hook live in one file here, which is the usual
      // React arrangement. The cost is that Fast Refresh reloads those files
      // instead of hot-swapping them; the rule is about developer experience,
      // not correctness.
      'react-refresh/only-export-components': [
        'error',
        { allowExportNames: ['useAuth', 'useLanguage', 'useTheme'] },
      ],
      // Every page here follows the ordinary shape: set a loading flag, await
      // the request, set the data. The compiler rule treats the first of those
      // as a cascading render because it happens before the first await.
      // Warn rather than error — the alternative is contorting every data
      // fetch in the application around a lint rule.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
])
