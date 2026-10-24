/* app.js — page shell (navigation, theme, progress) and mounting of all interactive blocks. */
(function () {
  'use strict'
  const { COURSE, esc, highlight, fmt, Store } = DSA
  const BASE = document.currentScript.src.replace(/assets\/app\.js.*$/, '')
  const lessonUrl = (l) => BASE + 'lessons/' + l.file

  // ───────── theme ─────────
  const THEME_KEY = 'dsa-theme'
  function applyTheme(t) {
    if (t) document.documentElement.dataset.theme = t
    else delete document.documentElement.dataset.theme
  }
  try {
    applyTheme(localStorage.getItem(THEME_KEY))
  } catch {}
  function toggleTheme() {
    const dark = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches
    const next = dark ? 'light' : 'dark'
    applyTheme(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {}
  }

  // ───────── shell ─────────
  const current = document.body.dataset.lesson
  const idx = COURSE.findIndex((l) => l.id === current)
  const lesson = COURSE[idx]

  function navHTML() {
    let stage = ''
    let html = `<a href="${BASE}index.html" class="${current ? '' : 'current'}"><span class="num">⌂</span>Home &amp; roadmap</a>`
    COURSE.forEach((l) => {
      if (l.stage !== stage) {
        stage = l.stage
        html += `<h4>${esc(stage)}</h4>`
      }
      html += `<a href="${lessonUrl(l)}" class="${l.id === current ? 'current' : ''}"><span class="num">${l.id}</span><span>${esc(l.title)}</span>${Store.isLessonDone(l.id) ? '<span class="done">✓</span>' : ''}</a>`
    })
    return html
  }

  function buildShell() {
    const main = document.querySelector('main')
    const top = document.createElement('header')
    top.className = 'topbar'
    const prev = COURSE[idx - 1]
    const next = COURSE[idx + 1]
    top.innerHTML = `
      <button class="icon-btn nav-toggle" aria-label="Lessons">☰</button>
      <a class="brand" href="${BASE}index.html">DSA <span>×</span> Python</a>
      <span class="lesson-name">${lesson ? esc(lesson.id + ' · ' + lesson.title) : ''}</span>
      <span class="spacer"></span>
      ${prev ? `<a class="icon-btn" href="${lessonUrl(prev)}" title="Previous: ${esc(prev.title)}" style="text-decoration:none">←</a>` : ''}
      ${next ? `<a class="icon-btn" href="${lessonUrl(next)}" title="Next: ${esc(next.title)}" style="text-decoration:none">→</a>` : ''}
      <button class="icon-btn theme-toggle" title="Light / dark">◐</button>`
    const layout = document.createElement('div')
    layout.className = 'layout'
    const nav = document.createElement('nav')
    nav.className = 'sidenav'
    nav.innerHTML = navHTML()
    document.body.insertBefore(top, main)
    document.body.insertBefore(layout, main)
    layout.appendChild(nav)
    layout.appendChild(main)
    top.querySelector('.theme-toggle').onclick = toggleTheme
    top.querySelector('.nav-toggle').onclick = () => document.body.classList.toggle('nav-open')
    main.addEventListener('click', () => document.body.classList.remove('nav-open'))
    DSA.refreshNav = () => (nav.innerHTML = navHTML())

    if (lesson) {
      const content = main.querySelector('.content') || main
      const done = document.createElement('label')
      done.className = 'done-row'
      done.innerHTML = `<input type="checkbox" ${Store.isLessonDone(lesson.id) ? 'checked' : ''}> <span><b>I finished this lesson</b> — I watched every visualizer, predicted the steps, and solved the practice problems.</span>`
      done.querySelector('input').onchange = (e) => {
        Store.setLessonDone(lesson.id, e.target.checked)
        DSA.refreshNav()
      }
      content.appendChild(done)
      const foot = document.createElement('div')
      foot.className = 'lesson-footer'
      foot.innerHTML =
        (prev ? `<a href="${lessonUrl(prev)}"><small>← Previous</small>${esc(prev.id + ' · ' + prev.title)}</a>` : `<a href="${BASE}index.html"><small>← Back</small>Home &amp; roadmap</a>`) +
        (next ? `<a class="next" href="${lessonUrl(next)}"><small>Next →</small>${esc(next.id + ' · ' + next.title)}</a>` : `<a class="next" href="${BASE}index.html"><small>Done 🎉</small>Home &amp; review list</a>`)
      content.appendChild(foot)
      document.title = `${lesson.id} · ${lesson.title} — DSA with Python`
    }
  }

  // ───────── quizzes ─────────
  function mountQuiz(el, id) {
    const qs = DSA.quizzes[id]
    if (!qs) return
    el.classList.add('quiz')
    let answered = 0
    let right = 0
    el.innerHTML =
      '<h4>✅ Check yourself</h4>' +
      qs
        .map(
          (q, i) => `<div class="q" data-i="${i}"><p>${i + 1}. ${q.q}</p>${q.code ? `<pre><code>${highlight(q.code)}</code></pre>` : ''}<div class="opts">${q.options
            .map((o, j) => `<button class="opt" data-j="${j}">${o}</button>`)
            .join('')}</div><div class="why" hidden></div></div>`,
        )
        .join('') +
      '<div class="score" hidden></div>'
    el.querySelectorAll('.q').forEach((qEl) => {
      const q = qs[+qEl.dataset.i]
      qEl.querySelectorAll('.opt').forEach((btn) => {
        btn.onclick = () => {
          const j = +btn.dataset.j
          qEl.querySelectorAll('.opt').forEach((b) => (b.disabled = true))
          btn.classList.add(j === q.answer ? 'right' : 'wrong')
          qEl.querySelector(`.opt[data-j="${q.answer}"]`).classList.add('right')
          const why = qEl.querySelector('.why')
          why.hidden = false
          why.innerHTML = (j === q.answer ? '✅ ' : '❌ ') + (q.why || '')
          answered++
          if (j === q.answer) right++
          if (answered === qs.length) {
            const sc = el.querySelector('.score')
            sc.hidden = false
            sc.textContent = `Score: ${right} / ${qs.length}` + (right === qs.length ? ' — perfect 🎉' : ' — re-read the ❌ explanations, they are the lesson.')
          }
        }
      })
    })
  }

  // ───────── trace tables: fill in the variables yourself, checked against the real run ─────────
  function mountTraceTable(el) {
    const vizId = el.dataset.tracetable
    const trace = DSA.traces[vizId]
    if (!trace) return
    const line = +el.dataset.line
    const vars = el.dataset.vars.split(',').map((s) => s.trim())
    const max = +(el.dataset.max || 8)
    const rows = trace.steps.filter((s) => s.l === line && s.k === 'line').slice(0, max)
    const expected = rows.map((step) => {
      const a = DSA.access(step)
      return vars.map((v) => {
        const r = a.raw(v)
        return r === undefined ? '-' : fmt(r, step.h)
      })
    })
    const norm = (t) => String(t).replace(/\s+/g, '').replace(/"/g, "'").toLowerCase()
    el.classList.add('ttable')
    el.innerHTML = `<h4 style="margin-top:0">🧠 Trace it yourself</h4><p style="margin-top:0">${el.dataset.intro || `Every time line <b>${line}</b> is about to run, what are the values? Fill the table on paper or here, <i>then</i> check. (Use the ▶ visualizer above only after you try.)`}</p>
      <table><tr><th>#</th>${vars.map((v) => `<th><code>${esc(v)}</code></th>`).join('')}</tr>${expected
        .map((row, i) => `<tr><td>${i + 1}</td>${row.map((val, j) => `<td>${i === 0 ? `<code>${esc(val)}</code>` : `<input data-r="${i}" data-c="${j}" aria-label="${esc(vars[j])} row ${i + 1}">`}</td>`).join('')}</tr>`)
        .join('')}</table>
      <div class="acts"><button class="btn primary t-check">Check</button><button class="btn t-show">Show answers</button><span class="t-msg"></span></div>`
    el.querySelector('.t-check').onclick = () => {
      let ok = 0
      let total = 0
      el.querySelectorAll('input').forEach((inp) => {
        total++
        const good = norm(inp.value) === norm(expected[+inp.dataset.r][+inp.dataset.c])
        inp.classList.toggle('right', good)
        inp.classList.toggle('wrong', !good)
        if (good) ok++
      })
      el.querySelector('.t-msg').textContent = ok === total ? '🎉 All correct — you can run this code in your head!' : `${ok} / ${total} correct. Red boxes: step through the visualizer to see why.`
    }
    el.querySelector('.t-show').onclick = () =>
      el.querySelectorAll('input').forEach((inp) => {
        inp.value = expected[+inp.dataset.r][+inp.dataset.c]
        inp.classList.remove('wrong')
      })
  }

  // ───────── mount everything ─────────
  function mount() {
    buildShell()
    document.querySelectorAll('pre > code:not(.plain)').forEach((c) => {
      if (c.closest('.viz, .problem, .quiz')) return
      c.innerHTML = highlight(c.textContent.replace(/^\n/, '').replace(/\s+$/, ''))
    })
    document.querySelectorAll('[data-viz]').forEach((el) => {
      const id = el.dataset.viz
      const def = DSA.viz[id]
      const trace = DSA.traces[id]
      if (!def || !trace) {
        el.innerHTML = `<p class="callout warn">Visualizer “${esc(id)}” is missing — run <code>node tools/build.mjs</code>.</p>`
        return
      }
      new DSA.Player(el, id, def, trace)
    })
    document.querySelectorAll('[data-problem]').forEach((el) => DSA.mountProblem(el, el.dataset.problem))
    document.querySelectorAll('[data-quiz]').forEach((el) => mountQuiz(el, el.dataset.quiz))
    document.querySelectorAll('[data-tracetable]').forEach(mountTraceTable)
    document.querySelectorAll('[data-widget]').forEach((el) => {
      const w = DSA.widgets[el.dataset.widget]
      if (w) {
        el.classList.add('widget')
        w(el)
      }
    })
    document.querySelectorAll('pre.playground').forEach((el) => DSA.mountPlayground(el))
    if (location.hash) {
      const target = document.querySelector(location.hash)
      if (target) setTimeout(() => target.scrollIntoView(), 50)
    }
    if (DSA.onHome) DSA.onHome({ BASE, lessonUrl })
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount)
  else mount()
})()
