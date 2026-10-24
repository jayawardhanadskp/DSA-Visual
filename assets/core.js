/* core.js — shared helpers: lesson list, registry, Python highlighter, value formatting, progress. */
(function () {
  'use strict'

  // tab icon (inline, so there is no favicon.ico request); skipped in the build's sandbox
  if (typeof document !== 'undefined') document.head.insertAdjacentHTML('beforeend', `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#3b6fd8"/><text x="16" y="22" font-size="16" font-family="monospace" text-anchor="middle" fill="#fff">{}</text></svg>')}">`)

  // ───────── the course ─────────
  const COURSE = [
    { id: '00', file: '00-start-here.html', title: 'Start here: the method', stage: 'Stage 1 · Foundations', blurb: 'Why DSA felt hard, and the 5-step method this course uses' },
    { id: '01', file: '01-python-for-dsa.html', title: 'Python for DSA (from Dart)', stage: 'Stage 1 · Foundations', blurb: 'Lists, dicts, sets, loops, functions, classes, references' },
    { id: '02', file: '02-big-o.html', title: 'Big-O: how fast is my code?', stage: 'Stage 1 · Foundations', blurb: 'Count steps, spot O(1), O(n), O(n²), O(log n)' },
    { id: '03', file: '03-arrays-strings.html', title: 'Arrays & strings', stage: 'Stage 2 · Arrays & hashing', blurb: 'Memory, indexing, shifting, one-pass scans' },
    { id: '04', file: '04-hashing.html', title: 'Hash maps & sets', stage: 'Stage 2 · Arrays & hashing', blurb: 'O(1) lookups, counting, "have I seen this?"' },
    { id: '05', file: '05-two-pointers.html', title: 'Two pointers', stage: 'Stage 2 · Arrays & hashing', blurb: 'Two indexes walking towards each other or together' },
    { id: '06', file: '06-sliding-window.html', title: 'Sliding window', stage: 'Stage 2 · Arrays & hashing', blurb: 'Best sub-array / substring in one pass' },
    { id: '07', file: '07-prefix-sums.html', title: 'Prefix sums', stage: 'Stage 2 · Arrays & hashing', blurb: 'Any range sum in O(1)' },
    { id: '08', file: '08-stacks-queues.html', title: 'Stacks & queues', stage: 'Stage 3 · Linear structures', blurb: 'LIFO, FIFO, brackets, monotonic stack' },
    { id: '09', file: '09-linked-lists.html', title: 'Linked lists', stage: 'Stage 3 · Linear structures', blurb: 'Nodes and pointers, reverse, fast & slow' },
    { id: '10', file: '10-recursion.html', title: 'Recursion', stage: 'Stage 4 · Recursion & searching', blurb: 'The call stack, base cases, trusting the function' },
    { id: '11', file: '11-sorting.html', title: 'Sorting', stage: 'Stage 4 · Recursion & searching', blurb: 'Insertion, merge, quick sort and Python\'s sort' },
    { id: '12', file: '12-binary-search.html', title: 'Binary search', stage: 'Stage 4 · Recursion & searching', blurb: 'Halve the search space every step' },
    { id: '13', file: '13-trees.html', title: 'Trees & BST', stage: 'Stage 5 · Trees & graphs', blurb: 'DFS, BFS, traversals, binary search trees' },
    { id: '14', file: '14-heaps.html', title: 'Heaps & priority queues', stage: 'Stage 5 · Trees & graphs', blurb: 'Always get the smallest (or largest) fast' },
    { id: '15', file: '15-graphs.html', title: 'Graphs', stage: 'Stage 5 · Trees & graphs', blurb: 'BFS, DFS, grids, topological sort, Dijkstra, union-find' },
    { id: '16', file: '16-backtracking.html', title: 'Backtracking', stage: 'Stage 6 · Advanced techniques', blurb: 'Choose → explore → un-choose' },
    { id: '17', file: '17-dynamic-programming.html', title: 'Dynamic programming', stage: 'Stage 6 · Advanced techniques', blurb: 'Recursion + memory, then tables' },
    { id: '18', file: '18-greedy-intervals.html', title: 'Greedy & intervals', stage: 'Stage 6 · Advanced techniques', blurb: 'Take the best choice now; sort and sweep' },
    { id: '19', file: '19-tries-bits.html', title: 'Tries & bit tricks', stage: 'Stage 6 · Advanced techniques', blurb: 'Prefix trees and thinking in binary' },
    { id: '20', file: '20-pattern-playbook.html', title: 'Pattern playbook & interview mode', stage: 'Stage 7 · Interview mode', blurb: 'Recognise the pattern, mixed practice, LeetCode plan' },
  ]

  // ───────── registry (lesson data files call these) ─────────
  const DSA = {
    COURSE,
    viz: {},
    traces: {},
    problems: {},
    quizzes: {},
    widgets: {},
    tables: {},
  }

  function dedent(text) {
    text = text.replace(/^\n/, '').replace(/\s+$/, '')
    const lines = text.split('\n')
    const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length)
    const min = indents.length ? Math.min(...indents) : 0
    return lines.map((l) => l.slice(min)).join('\n')
  }

  /** py`...` — a raw template string for Python code (backslashes stay as typed). */
  function py(strings, ...vals) {
    return dedent(String.raw(strings, ...vals))
  }

  const addViz = (o) => Object.assign(DSA.viz, o)
  const addTraces = (o) => Object.assign(DSA.traces, o)
  const addProblems = (o) => Object.assign(DSA.problems, o)
  const addQuiz = (o) => Object.assign(DSA.quizzes, o)
  const addWidget = (o) => Object.assign(DSA.widgets, o)

  // ───────── Python syntax highlighter ─────────
  const KW = new Set('and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case'.split(' '))
  const BI = new Set('print len range enumerate zip sorted reversed sum min max abs list dict set tuple str int float bool map filter any all isinstance type input ord chr divmod pow round iter next super open hash id repr object heapq deque Counter defaultdict bisect math inf'.split(' '))
  const CONST = new Set(['True', 'False', 'None'])
  const TOKEN = /(#.*)|("""[\s\S]*?"""|'''[\s\S]*?'''|[rbfRBF]{0,2}"(?:\\.|[^"\\\n])*"?|[rbfRBF]{0,2}'(?:\\.|[^'\\\n])*'?)|(\b\d[\d_]*(?:\.\d+)?(?:e-?\d+)?\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z_\d#'"]+)/g

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  /** Returns an array of HTML strings, one per source line. */
  function highlightLines(src) {
    const out = ['']
    let prevWord = ''
    let m
    TOKEN.lastIndex = 0
    const push = (text, cls) => {
      const parts = text.split('\n')
      parts.forEach((part, i) => {
        if (i > 0) out.push('')
        if (part) out[out.length - 1] += cls ? `<span class="${cls}">${esc(part)}</span>` : esc(part)
      })
    }
    while ((m = TOKEN.exec(src))) {
      const [text, com, str, num, word] = m
      if (com) push(text, 'tk-com')
      else if (str) push(text, 'tk-str')
      else if (num) push(text, 'tk-num')
      else if (word) {
        let cls = ''
        if (prevWord === 'def' || prevWord === 'class') cls = 'tk-fn'
        else if (KW.has(word)) cls = 'tk-kw'
        else if (CONST.has(word)) cls = 'tk-const'
        else if (word === 'self') cls = 'tk-self'
        else if (BI.has(word)) cls = 'tk-bi'
        push(text, cls)
        prevWord = word
        continue
      } else push(text, '')
      if (!/^[ \t]+$/.test(text)) prevWord = ''
    }
    return out
  }

  const highlight = (src) => highlightLines(src).join('\n')

  // ───────── formatting traced values the Python way ─────────
  function pyStr(s) {
    return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'"
  }

  /** Format a value from a trace step: v is a primitive, {f:'inf'} or {ref:n}. */
  function fmt(v, heap, depth = 0, seen = new Set()) {
    if (v === null || v === undefined) return 'None'
    if (v === true) return 'True'
    if (v === false) return 'False'
    if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(+v.toFixed(6))
    if (typeof v === 'string') return pyStr(v)
    if (v.f) return v.f
    if (v.ref === undefined) return '?'
    const e = heap[v.ref]
    if (!e) return '…'
    if (seen.has(v.ref) || depth > 4) return e.t === 'obj' ? `${e.cls}(…)` : '[…]'
    seen = new Set(seen).add(v.ref)
    const inner = (x) => fmt(x, heap, depth + 1, seen)
    switch (e.t) {
      case 'list': return '[' + e.v.map(inner).join(', ') + ']'
      case 'tuple': return '(' + e.v.map(inner).join(', ') + (e.v.length === 1 ? ',)' : ')')
      case 'deque': return 'deque([' + e.v.map(inner).join(', ') + '])'
      case 'set': return e.v.length ? '{' + e.v.map(inner).join(', ') + '}' : 'set()'
      case 'dict': {
        const body = '{' + e.v.map(([k, x]) => inner(k) + ': ' + inner(x)).join(', ') + '}'
        return e.cls ? `${e.cls}(${body})` : body
      }
      case 'obj': {
        const f = e.v
        if ('val' in f) {
          return `${e.cls}(${inner(f.val)})`
        }
        return `${e.cls}(` + Object.entries(f).map(([k, x]) => `${k}=${inner(x)}`).join(', ') + ')'
      }
      default: return e.repr || '?'
    }
  }

  /** Convert a traced value to plain JS (lists → arrays, dicts → Map-like [k,v] arrays, objects → {id, cls, ...}). */
  function plain(v, heap, depth = 0) {
    if (v === null || v === undefined || typeof v !== 'object') return v
    if (v.f) return v.f === 'inf' ? Infinity : v.f === '-inf' ? -Infinity : NaN
    const e = heap[v.ref]
    if (!e || depth > 40) return undefined
    switch (e.t) {
      case 'list': case 'tuple': case 'deque': case 'set':
        return e.v.map((x) => plain(x, heap, depth + 1))
      case 'dict': {
        const out = new Map()
        e.v.forEach(([k, x]) => out.set(plain(k, heap, depth + 1), plain(x, heap, depth + 1)))
        return out
      }
      case 'obj': return { __id: v.ref, __cls: e.cls }
      default: return e.repr
    }
  }

  /** Format a plain JSON value (from test data) the Python way. */
  function pyRepr(v) {
    if (v === null || v === undefined) return 'None'
    if (v === true) return 'True'
    if (v === false) return 'False'
    if (typeof v === 'number') return String(v)
    if (typeof v === 'string') return pyStr(v)
    if (Array.isArray(v)) return '[' + v.map(pyRepr).join(', ') + ']'
    if (typeof v === 'object' && v.__py__) return v.__py__
    if (typeof v === 'object') return '{' + Object.entries(v).map(([k, x]) => pyStr(k) + ': ' + pyRepr(x)).join(', ') + '}'
    return String(v)
  }

  // ───────── progress (stays in this browser) ─────────
  const KEY = 'dsa-python-visual:v1'
  const DAY = 24 * 3600 * 1000
  const REVIEW_DAYS = [1, 3, 7, 21, 60]

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {}
    } catch {
      return {}
    }
  }
  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data))
    } catch {
      /* private mode: progress just isn't saved */
    }
  }

  const Store = {
    get() {
      const d = load()
      d.lessons = d.lessons || {}
      d.problems = d.problems || {}
      d.code = d.code || {}
      return d
    },
    setLessonDone(id, done) {
      const d = Store.get()
      if (done) d.lessons[id] = Date.now()
      else delete d.lessons[id]
      save(d)
    },
    isLessonDone(id) {
      return !!Store.get().lessons[id]
    },
    getCode(pid) {
      return Store.get().code[pid]
    },
    setCode(pid, code) {
      const d = Store.get()
      if (code == null) delete d.code[pid]
      else d.code[pid] = code
      save(d)
    },
    problem(pid) {
      return Store.get().problems[pid]
    },
    /** Called when all tests pass. Returns 'first' | 'review' | 'again'. */
    solved(pid, info) {
      const d = Store.get()
      const now = Date.now()
      const p = d.problems[pid]
      let kind
      if (!p) {
        d.problems[pid] = { ...info, first: now, stage: 0, due: now + REVIEW_DAYS[0] * DAY }
        kind = 'first'
      } else if (now >= p.due) {
        p.stage = Math.min(p.stage + 1, REVIEW_DAYS.length - 1)
        p.due = now + REVIEW_DAYS[p.stage] * DAY
        p.last = now
        kind = 'review'
      } else kind = 'again'
      save(d)
      return kind
    },
    dueReviews() {
      const now = Date.now()
      return Object.entries(Store.get().problems)
        .filter(([, p]) => p.due <= now)
        .map(([pid, p]) => ({ pid, ...p }))
        .sort((a, b) => a.due - b.due)
    },
    reset() {
      save({})
    },
  }

  Object.assign(window, { DSA, py, dedent, addViz, addTraces, addProblems, addQuiz, addWidget })
  Object.assign(DSA, { highlightLines, highlight, esc, fmt, plain, pyRepr, pyStr, Store, REVIEW_DAYS })
})()
