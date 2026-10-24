/* python.js — code editor, Python-in-the-browser (Pyodide), practice problems. */
(function () {
  'use strict'
  const { esc, highlight, pyRepr, Store } = DSA

  // ───────── a small code editor (textarea + highlighted copy behind it) ─────────
  class Editor {
    constructor(parent, code, opts = {}) {
      this.opts = opts
      const el = document.createElement('div')
      el.className = 'editor'
      el.innerHTML = '<div class="ed-gutter"></div><div class="ed-wrap"><pre class="ed-hl" aria-hidden="true"><code></code></pre><textarea class="ed-ta" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="Python code"></textarea></div>'
      parent.appendChild(el)
      this.el = el
      this.ta = el.querySelector('textarea')
      this.hl = el.querySelector('code')
      this.pre = el.querySelector('pre')
      this.gutter = el.querySelector('.ed-gutter')
      this.ta.value = code
      this.ta.addEventListener('input', () => this.sync(true))
      this.ta.addEventListener('scroll', () => (this.pre.scrollLeft = this.ta.scrollLeft))
      this.ta.addEventListener('keydown', (e) => this.onKey(e))
      this.sync(false)
    }
    get value() {
      return this.ta.value
    }
    set value(v) {
      this.ta.value = v
      this.sync(true)
    }
    focus() {
      this.ta.focus()
    }
    sync(changed) {
      const v = this.ta.value
      this.hl.innerHTML = highlight(v) + '\n'
      const n = v.split('\n').length
      this.gutter.textContent = Array.from({ length: n }, (_, i) => i + 1).join('\n')
      this.ta.style.height = 'auto'
      this.ta.style.height = Math.max(this.ta.scrollHeight, 60) + 'px'
      this.pre.scrollLeft = this.ta.scrollLeft
      if (changed && this.opts.onChange) this.opts.onChange(v)
    }
    insert(text) {
      if (!document.execCommand('insertText', false, text)) {
        this.ta.setRangeText(text, this.ta.selectionStart, this.ta.selectionEnd, 'end')
        this.sync(true)
      }
    }
    lineRange() {
      const v = this.ta.value
      const start = v.lastIndexOf('\n', this.ta.selectionStart - 1) + 1
      let end = v.indexOf('\n', this.ta.selectionEnd - (this.ta.selectionEnd > this.ta.selectionStart && v[this.ta.selectionEnd - 1] === '\n' ? 1 : 0))
      if (end === -1) end = v.length
      return [start, end]
    }
    replaceLines(fn) {
      const [start, end] = this.lineRange()
      const lines = this.ta.value.slice(start, end).split('\n')
      const out = lines.map(fn).join('\n')
      this.ta.setSelectionRange(start, end)
      this.insert(out)
      this.ta.setSelectionRange(start, start + out.length)
    }
    onKey(e) {
      const ta = this.ta
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key === 'Enter') {
        e.preventDefault()
        if (this.opts.onRun) this.opts.onRun()
        return
      }
      if (mod && e.key === '/') {
        e.preventDefault()
        const [start, end] = this.lineRange()
        const lines = ta.value.slice(start, end).split('\n')
        const allComment = lines.filter((l) => l.trim()).every((l) => l.trim().startsWith('#'))
        this.replaceLines((l) => (!l.trim() ? l : allComment ? l.replace(/^(\s*)# ?/, '$1') : l.replace(/^(\s*)/, '$1# ')))
        return
      }
      if (e.key === 'Tab') {
        e.preventDefault()
        const multi = ta.value.slice(ta.selectionStart, ta.selectionEnd).includes('\n')
        if (e.shiftKey) this.replaceLines((l) => l.replace(/^ {1,4}/, ''))
        else if (multi) this.replaceLines((l) => (l ? '    ' + l : l))
        else this.insert('    ')
        return
      }
      if (e.key === 'Enter' && !e.shiftKey && !mod && !e.isComposing) {
        e.preventDefault()
        const v = ta.value
        const lineStart = v.lastIndexOf('\n', ta.selectionStart - 1) + 1
        const before = v.slice(lineStart, ta.selectionStart)
        let indent = before.match(/^ */)[0]
        if (/:\s*(#.*)?$/.test(before)) indent += '    '
        else if (/^\s*(return|pass|break|continue|raise)\b/.test(before)) indent = indent.slice(4)
        this.insert('\n' + indent)
        return
      }
      if (e.key === 'Backspace' && ta.selectionStart === ta.selectionEnd) {
        const v = ta.value
        const lineStart = v.lastIndexOf('\n', ta.selectionStart - 1) + 1
        const before = v.slice(lineStart, ta.selectionStart)
        if (before.length && /^ +$/.test(before)) {
          e.preventDefault()
          const remove = before.length % 4 || 4
          ta.setSelectionRange(ta.selectionStart - remove, ta.selectionStart)
          this.insert('')
        }
      }
    }
  }

  // ───────── Python in the browser ─────────
  const PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/'
  const RUNNER = `
import io, sys, json, traceback
sys.path.insert(0, "/home/pyodide")
import _check, dsa_tracer

def _dsa_run(src, name, tests_json, compare, convert_json, inplace):
    ns = {"__name__": "__solution__", "ListNode": _check.ListNode, "TreeNode": _check.TreeNode}
    buf = io.StringIO()
    old = sys.stdout
    sys.stdout = buf
    try:
        try:
            exec(compile(src, "<your code>", "exec"), ns)
        except SyntaxError as e:
            return json.dumps({"fatal": f"SyntaxError on line {e.lineno}: {e.msg}", "out": buf.getvalue()})
        except Exception as e:
            line = ""
            for fr in traceback.extract_tb(e.__traceback__):
                if fr.filename == "<your code>":
                    line = f" (line {fr.lineno})"
            return json.dumps({"fatal": f"{type(e).__name__}: {e}{line}", "out": buf.getvalue()})
        res = json.loads(_check.run_all(ns, name, json.loads(tests_json), compare,
                                        json.loads(convert_json) if convert_json else None, inplace))
        res["out"] = buf.getvalue()[:4000]
        return json.dumps(res)
    finally:
        sys.stdout = old

def _dsa_exec(src):
    buf = io.StringIO()
    old_out, old_trace = sys.stdout, sys.gettrace()
    sys.stdout = buf
    error = None
    try:
        code = compile(src, "<your code>", "exec")
        sys.settrace(_check._guard(5_000_000))
        exec(code, {"__name__": "__main__"})
    except SyntaxError as e:
        error = f"SyntaxError on line {e.lineno}: {e.msg}"
    except Exception as e:
        line = ""
        for fr in traceback.extract_tb(e.__traceback__):
            if fr.filename == "<your code>":
                line = f" (line {fr.lineno})"
        error = f"{type(e).__name__}: {e}{line}"
    finally:
        sys.settrace(old_trace)
        sys.stdout = old_out
    return json.dumps({"out": buf.getvalue()[:20000], "error": error})
`

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = src
      s.onload = resolve
      s.onerror = () => reject(new Error('download failed'))
      document.head.appendChild(s)
    })
  }

  const Py = {
    ready: false,
    promise: null,
    load() {
      if (!this.promise) {
        this.promise = (async () => {
          if (!window.loadPyodide) await loadScript(PYODIDE + 'pyodide.js')
          const pyodide = await window.loadPyodide({ indexURL: PYODIDE })
          pyodide.FS.mkdirTree('/home/pyodide')
          pyodide.FS.writeFile('/home/pyodide/_check.py', DSA.PY_SRC.check)
          pyodide.FS.writeFile('/home/pyodide/dsa_tracer.py', DSA.PY_SRC.tracer)
          pyodide.runPython(RUNNER)
          this.py = pyodide
          this.ready = true
          document.querySelectorAll('.py-loading').forEach((el) => el.textContent === 'Loading Python…' && (el.textContent = ''))
          return pyodide
        })().catch((err) => {
          this.promise = null
          console.error(err)
          throw new Error("Couldn't load Python. It runs inside the browser and is downloaded once (~10 MB) — check your internet connection and try again.")
        })
      }
      return this.promise
    },
    async trace(code, maxSteps = 1000) {
      const py = await this.load()
      const fn = py.globals.get('dsa_tracer').run
      try {
        return JSON.parse(fn(code, maxSteps))
      } finally {
        fn.destroy && fn.destroy()
      }
    },
    async exec(code) {
      const py = await this.load()
      const run = py.globals.get('_dsa_exec')
      try {
        return JSON.parse(run(code))
      } finally {
        run.destroy && run.destroy()
      }
    },
    async test(code, p) {
      const py = await this.load()
      const run = py.globals.get('_dsa_run')
      try {
        return JSON.parse(run(code, p.fn, JSON.stringify(p.tests), p.compare || 'exact', p.convert ? JSON.stringify(p.convert) : '', p.inplace ?? undefined))
      } finally {
        run.destroy && run.destroy()
      }
    },
  }

  // ───────── practice problems ─────────
  function paramNames(p) {
    const m = p.starter.match(new RegExp('def\\s+' + p.fn + '\\s*\\(([^)]*)\\)'))
    if (!m) return []
    return m[1].split(',').map((x) => x.split(/[:=]/)[0].trim()).filter((x) => x && x !== 'self')
  }

  function exampleText(p, t) {
    if (t.ops) return `${pyRepr(t.ops)}\n${pyRepr(t.args)}\n→ ${pyRepr(t.expect)}`
    const names = paramNames(p)
    const args = t.args.map((a, i) => (names[i] ? names[i] + ' = ' : '') + pyRepr(a)).join(', ')
    const out = t.anyOf ? t.anyOf.map(pyRepr).join('  or  ') : pyRepr(t.expect)
    return `${p.fn}(${args})\n→ ${out}${p.inplace !== undefined && p.inplace !== null ? '   (the list after your function changes it)' : ''}`
  }

  function lessonOfPage() {
    const m = location.pathname.match(/(\d\d)-[^/]*\.html$/)
    return m ? m[1] : ''
  }

  function mountProblem(el, pid) {
    const p = DSA.problems[pid]
    if (!p) {
      el.innerHTML = `<p>Missing problem ${esc(pid)}</p>`
      return
    }
    el.classList.add('problem')
    el.id = 'p-' + pid
    const number = el.dataset.n ? `${el.dataset.n}. ` : ''
    const examples = p.tests.slice(0, p.examples || 2).map((t) => exampleText(p, t)).join('\n\n')
    el.innerHTML = `
      <div class="p-head">
        <h4>${number}${esc(p.title)}</h4>
        <span class="badge ${String(p.level).toLowerCase()}">${esc(p.level)}</span>
        ${p.pattern ? `<span class="badge pattern">${esc(p.pattern)}</span>` : ''}
        <span class="solved"></span>
      </div>
      <div class="p-body">${p.prompt}
        <div class="examples">${esc(examples)}</div>
        ${p.leetcode ? `<p style="font-size:14px;color:var(--ink-3)">Same idea on LeetCode: ${esc(p.leetcode)}</p>` : ''}
      </div>
      <div class="p-edit"></div>
      <div class="p-actions">
        <button class="btn primary a-run">▶ Run tests</button>
        <button class="btn a-hint">💡 Hint</button>
        <button class="btn a-watch" title="Step through your code on the first test">🎬 Watch my code</button>
        <button class="btn a-sol">👀 Solution</button>
        <button class="btn a-reset" title="Start again from the starter code">↺ Start fresh</button>
        <span class="status py-loading"></span>
      </div>
      <div class="p-banner" hidden></div>
      <div class="p-results"></div>
      <div class="p-watch"></div>
      <div class="p-extra"><div class="p-hints"></div><div class="p-solution"></div></div>`
    const q = (s) => el.querySelector(s)
    const status = q('.status')
    const ed = new Editor(q('.p-edit'), Store.getCode(pid) ?? p.starter, {
      onRun: () => runTests(),
      onChange: (v) => Store.setCode(pid, v === p.starter ? null : v),
    })

    const refreshSolved = () => {
      const rec = Store.problem(pid)
      const badge = q('.solved')
      if (!rec) badge.textContent = ''
      else if (rec.due <= Date.now()) badge.textContent = '🔁 review due — solve it again from scratch'
      else badge.textContent = '✓ solved'
    }
    refreshSolved()

    async function runTests() {
      status.textContent = Py.ready ? 'Running…' : 'Loading Python…'
      q('.a-run').disabled = true
      try {
        const res = await Py.test(ed.value, p)
        status.textContent = ''
        showResults(res)
      } catch (err) {
        status.textContent = '⚠️ ' + err.message
      } finally {
        q('.a-run').disabled = false
      }
    }

    function showResults(res) {
      const banner = q('.p-banner')
      const list = q('.p-results')
      banner.hidden = false
      if (res.fatal) {
        banner.className = 'p-banner fail'
        banner.textContent = '❌ ' + res.fatal
        list.innerHTML = res.out ? `<div class="test-row">printed:\n${esc(res.out)}</div>` : ''
        return
      }
      const results = res.results
      const passed = results.filter((r) => r.ok).length
      let rows = results
        .map((r, i) => {
          if (r.ok) return `<div class="test-row ok">✅ <b>Test ${i + 1}</b>  ${esc(r.input)}  →  ${esc(r.got)}</div>`
          return `<div class="test-row fail">❌ <b>Test ${i + 1}</b>\ninput:    ${esc(r.input)}\nexpected: ${esc(r.expected)}\n${r.error ? 'error:    ' + esc(r.error) : 'got:      ' + esc(r.got)}</div>`
        })
        .join('')
      if (res.out) rows += `<div class="test-row">your print() output:\n${esc(res.out)}</div>`
      list.innerHTML = rows
      if (passed === results.length) {
        const kind = Store.solved(pid, { title: p.title, lesson: lessonOfPage(), page: location.pathname.split('/').pop() })
        const rec = Store.problem(pid)
        const days = Math.round((rec.due - Date.now()) / 86400000)
        banner.className = 'p-banner'
        banner.innerHTML =
          kind === 'review'
            ? `🎉 All ${passed} tests pass — review done! Next review in ${days} days.`
            : kind === 'first'
              ? `🎉 All ${passed} tests pass! I'll remind you to solve it again from scratch in ${days} day${days === 1 ? '' : 's'} (that's how it sticks). Now say out loud: <i>what was the pattern, and why does it work?</i>`
              : `🎉 All ${passed} tests pass!`
        refreshSolved()
        DSA.refreshNav && DSA.refreshNav()
      } else {
        banner.className = 'p-banner fail'
        banner.textContent = `${passed} / ${results.length} tests pass. Read the first ❌ — or press 🎬 Watch my code to see what your code really does.`
      }
    }

    // hints, one at a time
    let shown = 0
    const hintBtn = q('.a-hint')
    const updateHintBtn = () => {
      const left = (p.hints || []).length - shown
      hintBtn.textContent = left > 0 ? `💡 Hint (${left} left)` : '💡 No more hints'
      hintBtn.disabled = left <= 0
    }
    updateHintBtn()
    hintBtn.onclick = () => {
      if (shown >= (p.hints || []).length) return
      const div = document.createElement('div')
      div.className = 'hint'
      div.innerHTML = `<b>Hint ${shown + 1}:</b> ${p.hints[shown]}`
      q('.p-hints').appendChild(div)
      shown++
      updateHintBtn()
    }

    // solution, after a second click
    const solBtn = q('.a-sol')
    let armed = false
    solBtn.onclick = () => {
      if (q('.p-solution').innerHTML) {
        q('.p-solution').innerHTML = ''
        solBtn.textContent = '👀 Solution'
        return
      }
      if (!armed) {
        armed = true
        solBtn.textContent = 'Struggled for 15+ min? Click again'
        setTimeout(() => {
          armed = false
          if (!q('.p-solution').innerHTML) solBtn.textContent = '👀 Solution'
        }, 4000)
        return
      }
      armed = false
      q('.p-solution').innerHTML = `<div class="solution"><h4>Solution</h4><pre><code>${highlight(p.solution)}</code></pre>${p.explain || ''}<p style="font-size:14px;color:var(--ink-2)">Now close it, press ↺ Start fresh, and type it yourself without looking. Reading ≠ knowing.</p></div>`
      solBtn.textContent = '🙈 Hide solution'
    }

    q('.a-reset').onclick = () => {
      if (q('.a-reset').dataset.armed) {
        ed.value = p.starter
        Store.setCode(pid, null)
        q('.a-reset').textContent = '↺ Start fresh'
        delete q('.a-reset').dataset.armed
        q('.p-results').innerHTML = ''
        q('.p-banner').hidden = true
        return
      }
      q('.a-reset').dataset.armed = '1'
      q('.a-reset').textContent = 'Erase my code? Click again'
      setTimeout(() => {
        delete q('.a-reset').dataset.armed
        q('.a-reset').textContent = '↺ Start fresh'
      }, 3500)
    }

    q('.a-run').onclick = runTests

    // watch my code on test 1
    q('.a-watch').onclick = async () => {
      const t = p.tests[0]
      if (t.ops) {
        status.textContent = 'Watch mode is for function problems — add print() calls and press Run instead.'
        return
      }
      const kinds = (p.convert && p.convert.args) || []
      const args = t.args.map((a, i) => {
        if (kinds[i] === 'linked') return `build_linked(${pyRepr(a)})`
        if (kinds[i] === 'tree') return `build_tree(${pyRepr(a)})`
        if (kinds[i] === 'cycle') return `build_cycle(${pyRepr(a[0])}, ${pyRepr(a[1])})`
        return pyRepr(a)
      })
      const code = ed.value.replace(/\s+$/, '') + `\n\n\n# ── test 1 ──\nfrom _check import ListNode, TreeNode, build_linked, build_tree, build_cycle\nresult = ${p.fn}(${args.join(', ')})\nprint(result)\n`
      status.textContent = Py.ready ? 'Running…' : 'Loading Python…'
      try {
        const trace = await Py.trace(code, 1500)
        status.textContent = ''
        const box = q('.p-watch')
        box.innerHTML = '<div style="padding:0 16px"><div class="w"></div><button class="btn w-close">Close</button></div>'
        const holder = box.querySelector('.w')
        const player = new DSA.Player(holder, 'watch', { title: `Your code on test 1 (expected ${pyRepr(t.anyOf ? t.anyOf[0] : t.expect)})`, views: p.views || [] }, trace)
        player.q('.b-edit').hidden = true
        box.querySelector('.w-close').onclick = () => (box.innerHTML = '')
        holder.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      } catch (err) {
        status.textContent = '⚠️ ' + err.message
      }
    }
  }

  // ───────── a free-play Python box (no tests) ─────────
  function mountPlayground(el) {
    const code = dedent(el.textContent)
    el.textContent = ''
    el.classList.add('problem')
    el.innerHTML = '<div class="p-edit" style="padding-top:12px"></div><div class="p-actions"><button class="btn primary a-run">▶ Run</button><button class="btn a-viz">🎬 Run step by step</button><span class="status py-loading"></span></div><pre class="out" hidden style="margin:0 16px 14px"></pre><div class="p-watch"></div>'
    const ed = new Editor(el.querySelector('.p-edit'), code, { onRun: () => run() })
    const status = el.querySelector('.status')
    const out = el.querySelector('.out')
    async function run() {
      status.textContent = Py.ready ? 'Running…' : 'Loading Python…'
      try {
        const res = await Py.exec(ed.value)
        status.textContent = ''
        out.hidden = false
        out.textContent = (res.out || '') + (res.error ? '\n❌ ' + res.error : '') + (!res.out && !res.error ? '(nothing printed — use print())' : '')
      } catch (err) {
        status.textContent = '⚠️ ' + err.message
      }
    }
    el.querySelector('.a-run').onclick = run
    el.querySelector('.a-viz').onclick = async () => {
      status.textContent = Py.ready ? 'Running…' : 'Loading Python…'
      try {
        const trace = await Py.trace(ed.value, 800)
        status.textContent = ''
        const box = el.querySelector('.p-watch')
        box.innerHTML = '<div style="padding:0 16px 12px"><div class="w"></div><button class="btn w-close">Close</button></div>'
        const player = new DSA.Player(box.querySelector('.w'), 'play', { title: 'Your code, step by step', views: [] }, trace)
        player.q('.b-edit').hidden = true
        box.querySelector('.w-close').onclick = () => (box.innerHTML = '')
      } catch (err) {
        status.textContent = '⚠️ ' + err.message
      }
    }
  }

  Object.assign(DSA, { Editor, Py, mountProblem, mountPlayground })
})()
