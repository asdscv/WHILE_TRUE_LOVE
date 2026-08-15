// CSS 회귀 검사
// -----------------------------------------------------------------
// index.css 는 섹션 단위 주석으로 나뉘어 있어서, 블록을 통째로 옮기거나 지울 때
// 인접한 공용 스타일까지 함께 날아간 적이 여러 번 있었다(버튼이 맨 링크로 보이는 증상).
// 그때마다 "셀렉터가 존재하는가"만 봐서는 못 잡는다 — 이름은 남아 있고 기본 스타일만
// 사라지기 때문이다. 그래서 아래 두 가지를 본다.
//   1) JSX 에서 쓰는 className 에 대응하는 규칙이 있는가
//   2) 핵심 컴포넌트가 "실제로 그 속성"을 갖고 있는가
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const css = readFileSync('src/index.css', 'utf8')

// ---------- 1) 없어도 되는(순수 마커) 클래스 ----------
const MARKER_ONLY = new Set([
  'account',
  'account-row__info',
  'folio__label',
  'gallery',
  'location',
  'visible',
])

// ---------- 2) 반드시 이 속성을 갖고 있어야 하는 셀렉터 ----------
// [셀렉터, 그 셀렉터를 포함한 규칙에서 반드시 보여야 하는 속성들]
const REQUIRED = [
  ['.btn-line', ['border-radius', 'border', 'display']],
  ['.nav-btn', ['border-radius', 'border', 'display']],
  ['.copy-btn', ['border-radius', 'border', 'display']],
  ['.kakaopay-btn', ['border-radius', 'border', 'display']],
  ['.submit-btn', ['border-radius', 'border']],
  ['.cal__card', ['background', 'border-radius']],
  ['.cal__grid', ['grid-template-columns']],
  ['.invite__title', ['font-size']],
  ['.bottomnav', ['position']],
  ['.gallery__grid', ['display']],
  ['.lightbox', ['position']],
  ['.transport', ['list-style']],
]

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })

const errors = []

// 1) className 커버리지
const defined = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]))
const used = new Set()
for (const file of walk('src').filter((f) => f.endsWith('.jsx'))) {
  const src = readFileSync(file, 'utf8')
  for (const m of src.matchAll(/className=[{"`]([^"`}]*)/g)) {
    for (const c of m[1].split(/[\s${}]+/)) {
      if (/^[a-zA-Z][\w-]*$/.test(c)) used.add(c)
    }
  }
}
for (const c of used) {
  if (!defined.has(c) && !MARKER_ONLY.has(c)) {
    errors.push(`className "${c}" 에 대응하는 CSS 규칙이 없습니다.`)
  }
}

// 2) 핵심 셀렉터의 속성 존재 여부
//    셀렉터가 등장하는 모든 규칙의 선언을 합쳐서 확인한다(기본 스타일 + 개별 조정).
// @media / @keyframes 처럼 중첩된 블록이 있어 정규식 한 방으로는 못 쪼갠다.
// 중괄호 깊이를 세면서 훑고, 중첩 블록은 안으로 들어가 다시 훑는다.
function parseRules(text) {
  const out = []
  let i = 0
  let sel = ''
  while (i < text.length) {
    const ch = text[i]
    if (ch === '{') {
      let depth = 1
      let j = i + 1
      while (j < text.length && depth > 0) {
        if (text[j] === '{') depth++
        else if (text[j] === '}') depth--
        j++
      }
      const body = text.slice(i + 1, j - 1)
      const name = sel.trim()
      if (name.startsWith('@')) out.push(...parseRules(body))
      else out.push({ sel: name, body })
      sel = ''
      i = j
      continue
    }
    if (ch === '}') {
      sel = ''
      i++
      continue
    }
    sel += ch
    i++
  }
  return out
}
const rules = parseRules(css.replace(/\/\*[\s\S]*?\*\//g, ''))
for (const [selector, props] of REQUIRED) {
  const body = rules
    .filter((r) =>
      r.sel
        .split(',')
        .some((s) => s.trim() === selector || s.trim().startsWith(`${selector}:`)),
    )
    .map((r) => r.body)
    .join(';')
  if (!body) {
    errors.push(`${selector} 규칙이 통째로 없습니다.`)
    continue
  }
  for (const prop of props) {
    if (!new RegExp(`(^|;|\\s)${prop}\\s*:`).test(body)) {
      errors.push(`${selector} 에 ${prop} 선언이 없습니다. (공용 스타일 블록이 지워졌는지 확인)`)
    }
  }
}

if (errors.length) {
  console.error('\nCSS 검사 실패:')
  for (const e of errors) console.error(`  · ${e}`)
  console.error('')
  process.exit(1)
}
console.log('CSS 검사 통과')
