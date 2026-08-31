import { readFileSync, existsSync, writeFileSync } from 'fs'

const names = [
  'menu','x','twitter','youtube','instagram','log-out','user','shield','palette','check',
  'mail','external-link','server','zap','users','clock','map','calendar','search','copy',
  'alert-circle','terminal','download','newspaper','trophy','skull','target','trending-up',
  'crosshair','history','refresh-cw','map-pin','info','alert-triangle','check-circle',
  'check-circle-2','circle','wifi-off','plus','edit','trash-2','eye','eye-off','save',
  'database','crown','home','arrow-left','lock','settings','log-in','chevron-down'
]

const dir = 'node_modules/lucide-react/dist/esm/icons/'
const missing = []
const out = {}

for (const name of names) {
  const file = dir + name + '.js'
  if (!existsSync(file)) { missing.push(name); continue }
  let src = readFileSync(file, 'utf8')
  // Some names are aliases that simply re-export another icon module.
  const alias = src.match(/export \{ default \} from '\.\/([a-z0-9-]+)\.js'/)
  if (alias) src = readFileSync(dir + alias[1] + '.js', 'utf8')
  const m = src.match(/createLucideIcon\("[^"]+",\s*(\[[\s\S]*?\])\);/)
  if (!m) { missing.push(name + ' (unparsed)'); continue }
  // The array literal uses unquoted keys -> evaluate it as JS.
  const nodes = eval(m[1])
  out[name] = nodes.map(([tag, attrs]) => {
    const a = Object.entries(attrs)
      .filter(([k]) => k !== 'key')
      .map(([k, v]) => `${k.replace(/[A-Z]/g, c => '-' + c.toLowerCase())}="${v}"`)
      .join(' ')
    return `<${tag} ${a}/>`
  }).join('')
}

if (missing.length) console.error('MISSING:', missing.join(', '))

const php = `<?php
/**
 * Art of Rust - Icon paths
 *
 * Inline SVG bodies for the icons used across the site, extracted verbatim from
 * lucide-react v0.294.0 (ISC licensed) so the artwork matches the previous build
 * exactly. Rendered through icon() in helpers.php.
 *
 * GENERATED FILE - see tools/gen-icons.mjs. Do not edit by hand.
 */

if (!defined('AOR_APP')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

const ICON_PATHS = [
${Object.entries(out).map(([k, v]) => `    ${JSON.stringify(k)} => ${JSON.stringify(v)},`).join('\n')}
];
`
writeFileSync('app/icons.php', php)
console.log('wrote app/icons.php with', Object.keys(out).length, 'icons')
