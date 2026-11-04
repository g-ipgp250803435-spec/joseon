const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '..')
const exists = p => fs.existsSync(path.join(root, p))
const read = p => fs.readFileSync(path.join(root, p), 'utf8')

test('Vite entry loads modular React rather than embedded standalone JavaScript', () => {
  const html = read('index.html')
  assert.match(html, /type="module" src="\/src\/main\.tsx"/)
  assert.doesNotMatch(html, /__bundler\/manifest|__bundler\/template|text\/babel|<script[^>]*>\s*function/)
  const config = read('vite.config.ts')
  assert.match(config, /plugin-react/)
  assert.doesNotMatch(config, /singlefile/)
  for (const p of ['src/App.tsx','src/main.tsx','src/game/store.ts','src/game/storage.ts','src/game/data.ts','src/game/premium.ts','src/game/ambience.ts']) assert.ok(exists(p), `Missing ${p}`)
})

test('all local TypeScript and CSS imports have corresponding files', () => {
  const scan = p => {
    const text = read(p)
    for (const m of text.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)) {
      const target = path.join(path.dirname(p), m[1])
      const candidates = [target,target+'.ts',target+'.tsx',target+'.js',target+'.css',path.join(target,'index.ts')]
      assert.ok(candidates.some(exists), `Broken import ${m[1]} in ${p}`)
    }
  }
  scan('src/App.tsx'); scan('src/main.tsx')
  for (const p of fs.readdirSync(path.join(root,'src/game')).filter(f=>f.endsWith('.ts'))) scan('src/game/'+p)
})

test('every character and each CSS scene URL is included in the public assets', () => {
  const { npcs } = require('../.test-build/data.js')
  for (const npc of npcs) assert.ok(exists(`public/art/portraits/${npc.id}.svg`),`No art for ${npc.id}`)
  for (const gender of ['male','female']) for (let i=0; i<6; i++) assert.ok(exists(`public/art/portraits/player-${gender}-${i}.svg`),`Player portrait ${gender}/${i} missing`)
  for (const p of ['src/style.css','src/premium.css']) {
    for (const match of read(p).matchAll(/url\(['"]?(\/art\/[^)'" ]+)/g)) assert.ok(exists('public'+match[1]),`Missing CSS asset ${match[1]} in ${p}`)
  }
  assert.ok(exists('public/art/hanseong-map.svg'))
  assert.ok(exists('public/favicon.svg'))
})

test('Vercel and GitHub automation use the same reproducible multi-file build', () => {
  const pkg = JSON.parse(read('package.json'))
  const vercel = JSON.parse(read('vercel.json'))
  assert.equal(pkg.type,'module')
  for (const name of ['react','react-dom','zustand','zod','lucide-react']) assert.ok(pkg.dependencies[name],`Missing ${name}`)
  for (const name of ['vite','typescript','@vitejs/plugin-react']) assert.ok(pkg.devDependencies[name],`Missing ${name}`)
  assert.match(pkg.scripts.build,/tsc -b && vite build/)
  assert.equal(vercel.framework,'vite')
  assert.equal(vercel.outputDirectory,'dist')
  assert.equal(vercel.buildCommand,'npm run build')
  const workflow = read('.github/workflows/quality.yml')
  assert.match(workflow,/npm run test/)
  assert.match(workflow,/npm run build/)
  assert.ok(exists('README.md'))
  assert.ok(exists('docs/DEPLOY_VERCEL.md'))
})
