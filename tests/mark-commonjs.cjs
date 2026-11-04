// TypeScript emits CommonJS for the zero-dependency rules tests.
require('node:fs').writeFileSync('.test-build/package.json', '{"type":"commonjs"}\n')
