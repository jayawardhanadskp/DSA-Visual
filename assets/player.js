/* player.js — replays a traced Python run step by step and draws the data structures. */
(function () {
  'use strict'
  const { esc, fmt, plain, highlightLines } = DSA
  const PCLS = ['', 'p1', 'p2', 'p3', '', 'p1', 'p2', 'p3']

  // ───────── reading values from one step ─────────
  function access(step) {
    if (!step) return null
    const frames = step.s
    const heap = step.h
    const a = {
      step,
      heap,
      frames,
      raw(name) {
        for (let i = frames.length - 1; i >= 0; i--) if (name in frames[i].vars) return frames[i].vars[name]
        return undefined
      },
      rawTop(name) {
        const f = frames[frames.length - 1]
        return f ? f.vars[name] : undefined
      },
      has(name) {
        return a.raw(name) !== undefined
      },
      v(name) {
        const r = a.raw(name)
        return r === undefined ? undefined : plain(r, heap)
      },
      all(name) {
        return frames.filter((f) => name in f.vars).map((f) => f.vars[name])
      },
      entry(r) {
        return r && typeof r === 'object' && r.ref !== undefined ? heap[r.ref] : undefined
      },
      fmt(r) {
        return fmt(r, heap)
      },
      field(r, f) {
        const e = a.entry(r)
        return e && e.t === 'obj' ? e.v[f] : undefined
      },
      line: step.l,
      fn: frames.length ? frames[frames.length - 1].fn : '',
    }
    return a
  }

  const isInt = (x) => typeof x === 'number' && Number.isInteger(x)
  const title = (label, extra = '') => `<div class="view-title"><b>${esc(label)}</b>${extra}</div>`
  const cellText = (x, heap) => (typeof x === 'string' ? x : fmt(x, heap))
  function pair(s, spec) {
    if (!spec) return null
    if (typeof spec === 'function') return spec(s)
    const get = (p) => (typeof p === 'number' ? p : s.v(p))
    const lo = get(spec[0])
    const hi = get(spec[1])
    return isInt(lo) && isInt(hi) ? [lo, hi] : null
  }
  function ptrList(p) {
    if (!p) return []
    if (Array.isArray(p)) return p.map((n) => [n, n])
    return Object.entries(p)
  }

  // ───────── views ─────────
  const VIEWS = {}

  // Array / string / list as boxes (or bars)
  VIEWS.array = {
    render(o, s, prev) {
      const label = o.label || (typeof o.var === 'string' ? o.var : '')
      const seq = (acc) => {
        if (!acc) return null
        if (typeof o.var === 'function') {
          const arr = o.var(acc)
          return Array.isArray(arr) ? arr.map((x) => ({ text: typeof x === 'string' ? x : DSA.pyRepr(x), value: x })) : null
        }
        const raw = acc.raw(o.var)
        if (typeof raw === 'string') return [...raw].map((ch) => ({ text: ch, value: ch }))
        const e = acc.entry(raw)
        if (!e || !Array.isArray(e.v)) return null
        return e.v.map((x) => ({ text: cellText(x, acc.heap), value: plain(x, acc.heap) }))
      }
      const cells = seq(s)
      if (!cells && typeof o.var === 'function') return ''
      if (!cells) return title(label) + `<div class="empty-note">${o.var && typeof o.var === 'string' && s.has(o.var) ? esc(o.var) + ' = ' + esc(s.fmt(s.raw(o.var))) : 'not created yet'}</div>`
      const before = seq(prev)
      const ptrs = {}
      let lo = 0
      let hi = cells.length - 1
      ptrList(o.pointers).forEach(([name, lab], k) => {
        const v = typeof name === 'function' ? name(s) : s.v(name)
        if (!isInt(v) || v < -1 || v > cells.length) return
        ;(ptrs[v] = ptrs[v] || []).push(`<span class="${PCLS[k]}">${esc(lab)}</span>`)
        lo = Math.min(lo, v)
        hi = Math.max(hi, v)
      })
      const range = pair(s, o.range)
      const win = pair(s, o.window)
      const extra = o.cls ? o.cls(s) || {} : {}
      let max = 1
      let min = 0
      if (o.bars) cells.forEach((c) => typeof c.value === 'number' && ((max = Math.max(max, c.value)), (min = Math.min(min, c.value))))
      let html = ''
      for (let i = lo; i <= hi; i++) {
        const c = cells[i]
        const cls = ['arr-cell']
        if (!c) cls.push('ghost')
        else {
          if (range && i >= range[0] && i <= range[1]) cls.push('in-range')
          else if (range && o.dim !== false) cls.push('dim')
          if (win && i >= win[0] && i <= win[1]) cls.push('in-window')
          if (extra[i]) cls.push(extra[i])
          if (before && before.length === cells.length && before[i] && before[i].text !== c.text) cls.push('changed')
        }
        let style = ''
        if (o.bars && c && typeof c.value === 'number') style = ` style="height:${Math.round(26 + ((c.value - min) / (max - min || 1)) * 130)}px"`
        html += `<div class="${cls.join(' ')}"><div class="arr-ptrs">${(ptrs[i] || []).join('')}</div><div class="arr-box"${style}>${c ? esc(c.text) : ''}</div>${o.index === false ? '' : `<div class="arr-idx">${o.indexLabels ? esc(o.indexLabels[i] ?? i) : i}</div>`}</div>`
      }
      const lenNote = o.showLen ? ` <span>len ${cells.length}</span>` : ''
      return title(label, lenNote) + (cells.length || lo < hi ? `<div class="arr${o.bars ? ' bars' : ''}">${html}</div>` : '<div class="empty-note">[] (empty)</div>')
    },
  }

  // 2-D list as a grid / DP table
  VIEWS.grid = {
    render(o, s, prev) {
      const label = o.label || o.var
      const get = (acc) => {
        if (!acc) return null
        if (typeof o.var === 'function') return o.var(acc)
        const e = acc.entry(acc.raw(o.var))
        if (!e || !Array.isArray(e.v)) return null
        return e.v.map((row) => {
          const re = acc.entry(row)
          return re && Array.isArray(re.v) ? re.v.map((x) => ({ text: cellText(x, acc.heap), value: plain(x, acc.heap) })) : typeof row === 'string' ? [...row].map((ch) => ({ text: ch, value: ch })) : []
        })
      }
      const rows = get(s)
      if (!rows) return title(label) + '<div class="empty-note">not created yet</div>'
      const before = get(prev)
      const marks = {}
      if (o.pointer) {
        const r = s.v(o.pointer[0])
        const c = s.v(o.pointer[1])
        if (isInt(r) && isInt(c)) marks[r + ',' + c] = 'hot'
      }
      if (o.marks) (o.marks(s) || []).forEach(([r, c, cls]) => (marks[r + ',' + c] = marks[r + ',' + c] || cls))
      const cols = Math.max(0, ...rows.map((r) => r.length))
      const colLabels = typeof o.colLabels === 'function' ? o.colLabels(s) : o.colLabels
      const rowLabels = typeof o.rowLabels === 'function' ? o.rowLabels(s) : o.rowLabels
      let html = '<table class="grid">'
      if (colLabels || o.indexes) {
        html += '<tr><th></th>' + Array.from({ length: cols }, (_, c) => `<th>${esc(colLabels ? colLabels[c] ?? '' : c)}</th>`).join('') + '</tr>'
      }
      rows.forEach((row, r) => {
        html += '<tr>'
        if (colLabels || rowLabels || o.indexes) html += `<th>${esc(rowLabels ? rowLabels[r] ?? '' : r)}</th>`
        for (let c = 0; c < cols; c++) {
          const cell = row[c]
          const cls = []
          if (cell && o.classMap && o.classMap[cell.text]) cls.push(o.classMap[cell.text])
          if (marks[r + ',' + c]) cls.push(marks[r + ',' + c])
          if (before && before[r] && before[r][c] && cell && before[r][c].text !== cell.text) cls.push('changed')
          const text = cell ? (o.hideValues && o.hideValues.includes(cell.text) ? '' : cell.text) : ''
          html += `<td class="${cls.join(' ')}">${esc(text)}</td>`
        }
        html += '</tr>'
      })
      return title(label) + html + '</table>'
    },
  }

  VIEWS.dict = {
    render(o, s, prev) {
      const label = o.label || o.var
      const raw = s.raw(o.var)
      const e = s.entry(raw)
      if (!e || e.t !== 'dict') return title(label) + `<div class="empty-note">${raw === undefined ? 'not created yet' : esc(s.fmt(raw))}</div>`
      const pe = prev && prev.entry(prev.raw(o.var))
      const old = new Map(pe && pe.t === 'dict' ? pe.v.map(([k, x]) => [fmt(k, prev.heap), fmt(x, prev.heap)]) : [])
      const hot = o.hot ? o.hot(s) : undefined
      const hotKey = hot === undefined ? null : DSA.pyRepr(hot)
      if (!e.v.length) return title(label) + '<div class="empty-note">{} (empty)</div>'
      const rows = e.v
        .map(([k, x]) => {
          const ks = fmt(k, s.heap)
          const xs = fmt(x, s.heap)
          const cls = []
          if (pe && old.get(ks) !== xs) cls.push('changed')
          if (hotKey !== null && hotKey === ks) cls.push('hot')
          return `<tr class="${cls.join(' ')}"><td>${esc(ks)}</td><td>${esc(xs)}</td></tr>`
        })
        .join('')
      return title(label, e.cls ? ` <span>(${e.cls})</span>` : '') + `<table class="kv"><tr><th>${esc(o.keyLabel || 'key')}</th><th>${esc(o.valLabel || 'value')}</th></tr>${rows}</table>`
    },
  }

  VIEWS.set = {
    render(o, s, prev) {
      const label = o.label || o.var
      const e = s.entry(s.raw(o.var))
      if (!e) return title(label) + '<div class="empty-note">not created yet</div>'
      const pe = prev && prev.entry(prev.raw(o.var))
      const old = new Set(pe ? pe.v.map((x) => fmt(x, prev.heap)) : [])
      const hot = o.hot ? DSA.pyRepr(o.hot(s)) : null
      if (!e.v.length) return title(label) + '<div class="empty-note">set() (empty)</div>'
      return (
        title(label) +
        '<div class="chips">' +
        e.v.map((x) => {
          const t = fmt(x, s.heap)
          return `<span class="chip${pe && !old.has(t) ? ' changed' : ''}${hot === t ? ' hot' : ''}">${esc(t)}</span>`
        }).join('') +
        '</div>'
      )
    },
  }

  VIEWS.stack = {
    render(o, s, prev) {
      const label = o.label || o.var
      const e = s.entry(s.raw(o.var))
      if (!e) return title(label) + '<div class="empty-note">not created yet</div>'
      const pe = prev && prev.entry(prev.raw(o.var))
      const n = e.v.length
      const items = e.v
        .map((x, i) => {
          const changed = pe && (i >= pe.v.length || fmt(pe.v[i], prev.heap) !== fmt(x, s.heap))
          return `<div class="item${i === n - 1 ? ' top' : ''}${changed ? ' changed' : ''}">${esc(fmt(x, s.heap))}${i === n - 1 ? ' ← top' : ''}</div>`
        })
        .join('')
      return title(label, ' <span>(stack)</span>') + `<div class="stack">${items || '<div class="empty-note">empty</div>'}</div>`
    },
  }

  VIEWS.queue = {
    render(o, s, prev) {
      const label = o.label || o.var
      const e = s.entry(s.raw(o.var))
      if (!e) return title(label) + '<div class="empty-note">not created yet</div>'
      const pe = prev && prev.entry(prev.raw(o.var))
      const oldSet = new Set(pe ? pe.v.map((x) => fmt(x, prev.heap)) : [])
      const items = e.v.map((x) => `<div class="item${pe && !oldSet.has(fmt(x, s.heap)) ? ' changed' : ''}">${esc(fmt(x, s.heap))}</div>`).join('')
      return title(label, ` <span>(${o.kind || 'queue'})</span>`) + `<div class="queue"><span class="end">${o.frontLabel || 'front →'}</span>${items || '<span class="empty-note">empty</span>'}<span class="end">${o.backLabel || '← back'}</span></div>`
    },
  }

  VIEWS.html = {
    render(o, s, prev) {
      return o.render(s, prev) || ''
    },
  }

  // ───────── SVG helpers ─────────
  const svgWrap = (w, h, body, label) =>
    (label ? title(label) : '') +
    `<div class="svgview"><svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z"/></marker>' +
    '<marker id="ah-hot" class="hot" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z"/></marker></defs>' +
    body +
    '</svg></div>'

  function shorten(x1, y1, x2, y2, r1, r2) {
    const dx = x2 - x1
    const dy = y2 - y1
    const d = Math.hypot(dx, dy) || 1
    return [x1 + (dx / d) * r1, y1 + (dy / d) * r1, x2 - (dx / d) * r2, y2 - (dy / d) * r2]
  }

  // ───────── linked list ─────────
  VIEWS.linked = {
    prepare(o, steps) {
      const pos = new Map()
      const rows = o.rows || [o.vars]
      const nextKey = o.next || 'next'
      const counters = rows.map((_, r) => (o.rowStart || [])[r] || 0)
      steps.forEach((step) => {
        const s = access(step)
        rows.forEach((names, r) => {
          names.forEach((name) => {
            s.all(name).forEach((raw) => {
              let guard = 0
              while (raw && raw.ref !== undefined && guard++ < 200) {
                const e = s.heap[raw.ref]
                if (!e || e.t !== 'obj') break
                if (!pos.has(raw.ref)) pos.set(raw.ref, { x: counters[r]++, y: r })
                raw = e.v[nextKey]
              }
            })
          })
        })
      })
      return { pos, rowCount: rows.length, width: Math.max(1, ...counters) }
    },
    render(o, s, prev, prep) {
      const W = 46
      const H = 32
      const GX = 78
      const GY = 96
      const nextKey = o.next || 'next'
      const valKey = o.val || 'val'
      const names = (o.rows || [o.vars]).flat()
      const X = (p) => 20 + p.x * GX
      const Y = (p) => 22 + p.y * GY
      const labels = new Map()
      const noneLabels = []
      names.forEach((name, k) => {
        const top = s.raw(name)
        if (top === undefined) return
        if (top === null) noneLabels.push([name, k])
        else if (top.ref !== undefined) (labels.get(top.ref) || labels.set(top.ref, []).get(top.ref)).push([name, k])
      })
      let body = ''
      let maxX = prep.width
      // nodes that exist at this step (reachable from any pointer)
      const visible = new Set()
      names.forEach((name) =>
        s.all(name).forEach((raw) => {
          let guard = 0
          while (raw && raw.ref !== undefined && !visible.has(raw.ref) && guard++ < 200) {
            const e = s.heap[raw.ref]
            if (!e || e.t !== 'obj') break
            visible.add(raw.ref)
            raw = e.v[nextKey]
          }
        }),
      )
      visible.forEach((id) => {
        const p = prep.pos.get(id)
        if (!p) return
        const e = s.heap[id]
        const nx = e.v[nextKey]
        const x = X(p)
        const y = Y(p)
        if (nx && nx.ref !== undefined && prep.pos.has(nx.ref)) {
          const q = prep.pos.get(nx.ref)
          const tx = X(q)
          const ty = Y(q)
          if (q.y === p.y && q.x === p.x + 1) {
            body += `<line class="edge" x1="${x + W}" y1="${y + H / 2}" x2="${tx - 2}" y2="${ty + H / 2}" marker-end="url(#ah)"/>`
          } else if (q.y === p.y) {
            const back = q.x < p.x
            const dy = back ? H + 26 + Math.abs(q.x - p.x) * 4 : -26 - Math.abs(q.x - p.x) * 4
            const sy = back ? y + H : y
            body += `<path class="edge" d="M${x + W / 2} ${sy} C ${x + W / 2} ${sy + dy}, ${tx + W / 2} ${sy + dy}, ${tx + W / 2} ${sy}" marker-end="url(#ah)"/>`
          } else {
            const [a, b, c, d] = shorten(x + W / 2, y + H / 2, tx + W / 2, ty + H / 2, 22, 22)
            body += `<line class="edge" x1="${a}" y1="${b}" x2="${c}" y2="${d}" marker-end="url(#ah)"/>`
          }
        } else if (nx === null) {
          body += `<text class="none" x="${x + W + 6}" y="${y + H / 2 + 4}">∅</text>`
        }
      })
      visible.forEach((id) => {
        const p = prep.pos.get(id)
        if (!p) return
        const e = s.heap[id]
        const x = X(p)
        const y = Y(p)
        const labs = labels.get(id) || []
        const cls = labs.length ? (labs.some(([, k]) => k === 0) ? 'node onstack' : 'node cur') : 'node'
        body += `<g class="${cls}"><rect x="${x}" y="${y}" width="${W}" height="${H}" rx="7"/><text x="${x + W / 2}" y="${y + H / 2}">${esc(cellText(e.v[valKey], s.heap))}</text></g>`
        labs.forEach(([name, k], j) => {
          body += `<text class="lbl ${PCLS[k]}" x="${x + W / 2}" y="${y + H + 16 + j * 14}">${esc(name)}</text>`
        })
      })
      if (noneLabels.length) {
        const x = X({ x: maxX })
        body += `<text class="none" x="${x + 8}" y="${Y({ y: 0 }) + H / 2 + 4}">None</text>`
        noneLabels.forEach(([name, k], j) => {
          body += `<text class="lbl ${PCLS[k]}" x="${x + 22}" y="${Y({ y: 0 }) + H + 16 + j * 14}">${esc(name)}</text>`
        })
        maxX += 1
      }
      if (!visible.size && !noneLabels.length) return title(o.label || 'linked list') + '<div class="empty-note">no nodes yet</div>'
      return svgWrap(40 + maxX * GX, prep.rowCount * GY + 30, body, o.label || 'linked list')
    },
  }

  // ───────── binary tree (objects with left/right) ─────────
  function layoutTree(s, rootRaw, o) {
    const L = o.left || 'left'
    const R = o.right || 'right'
    const nodes = []
    let idx = 0
    let maxDepth = 0
    const walk = (raw, depth, parent) => {
      if (!raw || raw.ref === undefined || depth > 12) return
      const e = s.heap[raw.ref]
      if (!e || e.t !== 'obj') return
      walk(e.v[L], depth + 1, raw.ref)
      nodes.push({ id: raw.ref, x: idx++, depth, parent, val: e.v[o.val || 'val'] })
      maxDepth = Math.max(maxDepth, depth)
      walk(e.v[R], depth + 1, raw.ref)
    }
    walk(rootRaw, 0, null)
    return { nodes, maxDepth }
  }

  VIEWS.tree = {
    render(o, s) {
      const label = o.label || o.var
      const rootRaw = typeof o.var === 'function' ? o.var(s) : s.raw(o.var)
      if (rootRaw === undefined) return title(label) + '<div class="empty-note">not created yet</div>'
      if (rootRaw === null) return title(label) + '<div class="empty-note">None (empty tree)</div>'
      const { nodes, maxDepth } = layoutTree(s, rootRaw, o)
      const GX = o.gap || 44
      const GY = 62
      const byId = new Map(nodes.map((n) => [n.id, n]))
      const X = (n) => 24 + n.x * GX
      const Y = (n) => 26 + n.depth * GY
      const cur = new Map()
      const onstack = new Set()
      ptrList(o.pointers).forEach(([name, lab], k) => {
        const all = s.all(name)
        all.forEach((raw, j) => {
          if (!raw || raw.ref === undefined || !byId.has(raw.ref)) return
          if (j === all.length - 1 && s.rawTop(name) !== undefined) (cur.get(raw.ref) || cur.set(raw.ref, []).get(raw.ref)).push([lab, k])
          else onstack.add(raw.ref)
        })
      })
      const visitedVals = o.visited ? (typeof o.visited === 'function' ? o.visited(s) : s.v(o.visited)) || [] : []
      const visited = new Set((Array.isArray(visitedVals) ? visitedVals : [...visitedVals.keys()]).map((v) => (v && v.__id ? 'id' + v.__id : JSON.stringify(v))))
      const extra = o.cls ? o.cls(s) || {} : {}
      let body = ''
      nodes.forEach((n) => {
        if (n.parent !== null) {
          const p = byId.get(n.parent)
          const [a, b, c, d] = shorten(X(p), Y(p), X(n), Y(n), 17, 17)
          body += `<line class="edge" x1="${a}" y1="${b}" x2="${c}" y2="${d}"/>`
        }
      })
      nodes.forEach((n) => {
        const valText = cellText(n.val, s.heap)
        let cls = 'node'
        if (cur.has(n.id)) cls += ' cur'
        else if (extra[valText]) cls += ' ' + extra[valText]
        else if (onstack.has(n.id)) cls += ' onstack'
        else if (visited.has(JSON.stringify(plain(n.val, s.heap))) || visited.has('id' + n.id)) cls += ' visited'
        body += `<g class="${cls}"><circle cx="${X(n)}" cy="${Y(n)}" r="17"/><text x="${X(n)}" y="${Y(n)}">${esc(valText)}</text></g>`
        ;(cur.get(n.id) || []).forEach(([lab, k], j) => {
          body += `<text class="lbl ${PCLS[k]}" x="${X(n) + 20}" y="${Y(n) - 18 - j * 13}" text-anchor="start" style="text-anchor:start">${esc(lab)}</text>`
        })
      })
      return svgWrap(Math.max(80, 48 + (nodes.length - 1) * GX + 30), 52 + maxDepth * GY + 10, body, label)
    },
  }

  // ───────── array shown as a binary heap tree ─────────
  VIEWS.heaptree = {
    render(o, s) {
      const label = o.label || o.var
      const e = s.entry(s.raw(o.var))
      if (!e) return title(label) + '<div class="empty-note">not created yet</div>'
      const n = e.v.length
      if (!n) return title(label + ' as a tree') + '<div class="empty-note">empty heap</div>'
      const levels = Math.floor(Math.log2(n)) + 1
      const W = Math.max(200, Math.pow(2, levels - 1) * 52)
      const pos = (i) => {
        const lvl = Math.floor(Math.log2(i + 1))
        const first = Math.pow(2, lvl) - 1
        const count = Math.pow(2, lvl)
        return [((i - first + 0.5) * W) / count + 10, 24 + lvl * 58]
      }
      const marks = {}
      ptrList(o.pointers).forEach(([name, lab], k) => {
        const v = s.v(name)
        if (isInt(v) && v >= 0 && v < n) (marks[v] = marks[v] || []).push([lab, k])
      })
      let body = ''
      for (let i = 1; i < n; i++) {
        const [x1, y1] = pos(Math.floor((i - 1) / 2))
        const [x2, y2] = pos(i)
        const [a, b, c, d] = shorten(x1, y1, x2, y2, 17, 17)
        body += `<line class="edge" x1="${a}" y1="${b}" x2="${c}" y2="${d}"/>`
      }
      for (let i = 0; i < n; i++) {
        const [x, y] = pos(i)
        const t = cellText(e.v[i], s.heap)
        body += `<g class="node${marks[i] ? ' cur' : i === 0 ? ' visited' : ''}"><circle cx="${x}" cy="${y}" r="17"/><text x="${x}" y="${y}" style="font-size:${t.length > 4 ? 10 : 13}px">${esc(t)}</text></g>`
        body += `<text class="none" x="${x}" y="${y + 30}" text-anchor="middle" style="text-anchor:middle">${i}</text>`
        ;(marks[i] || []).forEach(([lab, k], j) => (body += `<text class="lbl ${PCLS[k]}" x="${x + 21}" y="${y - 16 - j * 13}" style="text-anchor:start">${esc(lab)}</text>`))
      }
      return svgWrap(W + 20, levels * 58 + 18, body, label + ' as a tree')
    },
  }

  // ───────── graph (adjacency dict + fixed positions) ─────────
  VIEWS.graph = {
    render(o, s) {
      const label = o.label || o.var || 'graph'
      let adj
      if (typeof o.var === 'function') adj = o.var(s)
      else if (o.var) adj = s.v(o.var)
      if (o.edges) {
        adj = new Map()
        o.edges.forEach(([a, b, w]) => {
          if (!adj.has(a)) adj.set(a, [])
          adj.get(a).push(w === undefined ? b : [b, w])
        })
      }
      if (!(adj instanceof Map)) return title(label) + '<div class="empty-note">not created yet</div>'
      const pos = o.pos
      const key = (k) => String(k)
      const asSet = (spec) => {
        if (!spec) return new Set()
        const v = typeof spec === 'function' ? spec(s) : s.v(spec)
        if (v === undefined || v === null) return new Set()
        const items = v instanceof Map ? [...v.keys()] : Array.isArray(v) ? v : [v]
        return new Set(items.map((x) => key(Array.isArray(x) ? x[x.length - 1] : x)))
      }
      const current = asSet(o.current)
      const visited = asSet(o.visited)
      const frontier = asSet(o.frontier)
      const done = asSet(o.done)
      const nodeLabels = o.labels ? o.labels(s) || {} : {}
      const hotEdge = o.hotEdge ? o.hotEdge(s) : null
      let body = ''
      const seen = new Set()
      for (const [a, list] of adj) {
        ;(list || []).forEach((item) => {
          const [b, w] = Array.isArray(item) ? item : [item, undefined]
          const pa = pos[key(a)]
          const pb = pos[key(b)]
          if (!pa || !pb) return
          const id = o.directed ? key(a) + '>' + key(b) : [key(a), key(b)].sort().join('-')
          if (seen.has(id)) return
          seen.add(id)
          const hot = hotEdge && ((key(hotEdge[0]) === key(a) && key(hotEdge[1]) === key(b)) || (!o.directed && key(hotEdge[0]) === key(b) && key(hotEdge[1]) === key(a)))
          const [x1, y1, x2, y2] = shorten(pa[0], pa[1], pb[0], pb[1], 19, o.directed ? 21 : 19)
          body += `<line class="edge${hot ? ' hot' : ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${o.directed ? ` marker-end="url(#${hot ? 'ah-hot' : 'ah'})"` : ''}/>`
          if (w !== undefined) {
            const mx = (pa[0] + pb[0]) / 2
            const my = (pa[1] + pb[1]) / 2
            body += `<text class="wt" x="${mx}" y="${my - 5}" style="text-anchor:middle">${esc(w)}</text>`
          }
        })
      }
      Object.entries(pos).forEach(([k, [x, y]]) => {
        let cls = 'node'
        if (current.has(k)) cls += ' cur'
        else if (done.has(k)) cls += ' visited'
        else if (frontier.has(k)) cls += ' frontier'
        else if (visited.has(k)) cls += ' visited'
        body += `<g class="${cls}"><circle cx="${x}" cy="${y}" r="18"/><text x="${x}" y="${y}">${esc(k)}</text></g>`
        if (nodeLabels[k] !== undefined) body += `<text class="ret" x="${x}" y="${y + 32}" style="text-anchor:middle">${esc(nodeLabels[k])}</text>`
      })
      const w = Math.max(...Object.values(pos).map((p) => p[0])) + 40
      const h = Math.max(...Object.values(pos).map((p) => p[1])) + 44
      return svgWrap(w, h, body, label)
    },
  }

  // ───────── recursion call tree (built from call/return steps) ─────────
  VIEWS.calltree = {
    prepare(o, steps) {
      const fns = new Set([].concat(o.fn))
      const nodes = []
      const stack = []
      const activeAt = []
      steps.forEach((step, i) => {
        const fr = step.s[step.s.length - 1]
        if (step.k === 'call' && fr && fns.has(fr.fn)) {
          const s = access(step)
          let label
          if (typeof o.label === 'function') label = o.label(s)
          else label = fr.fn + '(' + Object.entries(fr.vars).filter(([k]) => k !== 'self' && !(o.skipArgs || []).includes(k)).map(([, v]) => fmt(v, step.h)).join(', ') + ')'
          const node = { label, parent: stack.length ? stack[stack.length - 1] : null, children: [], start: i, end: Infinity, ret: null }
          if (node.parent !== null) nodes[node.parent].children.push(nodes.length)
          stack.push(nodes.length)
          nodes.push(node)
        } else if (step.k === 'return' && fr && fns.has(fr.fn) && stack.length) {
          const id = stack.pop()
          nodes[id].end = i
          nodes[id].ret = o.showReturn === false ? null : fmt(step.r, step.h)
        }
        activeAt.push(stack.slice())
      })
      // layout: leaves left → right, parents centred over children
      let leaf = 0
      const widths = nodes.map((n) => Math.max(56, n.label.length * 7.4 + 14))
      const place = (id, depth) => {
        const n = nodes[id]
        n.depth = depth
        if (!n.children.length) {
          n.x = leaf + widths[id] / 2
          leaf += widths[id] + 8
        } else {
          n.children.forEach((c) => place(c, depth + 1))
          const first = nodes[n.children[0]]
          const last = nodes[n.children[n.children.length - 1]]
          n.x = (first.x + last.x) / 2
          const need = n.x - widths[id] / 2
          if (need < 0) n.x -= need
        }
      }
      nodes.forEach((n, id) => n.parent === null && place(id, 0))
      const maxDepth = Math.max(0, ...nodes.map((n) => n.depth))
      return { nodes, activeAt, widths, width: leaf, maxDepth }
    },
    render(o, s, prev, prep, i) {
      const { nodes, activeAt, widths } = prep
      const treeTitle = typeof o.label === 'string' ? o.label : 'call tree'
      if (!nodes.length) return title(treeTitle) + '<div class="empty-note">no calls yet</div>'
      const active = activeAt[i] || []
      const activeSet = new Set(active)
      const top = active[active.length - 1]
      const GY = 58
      const Y = (n) => 22 + n.depth * GY
      let body = ''
      nodes.forEach((n, id) => {
        if (n.parent === null) return
        const p = nodes[n.parent]
        const shown = n.start <= i
        body += `<line class="edge${shown ? (activeSet.has(id) ? ' hot' : '') : ' faint'}" x1="${p.x}" y1="${Y(p) + 13}" x2="${n.x}" y2="${Y(n) - 13}"/>`
      })
      nodes.forEach((n, id) => {
        const shown = n.start <= i
        const returned = n.end <= i
        let cls = 'node'
        if (!shown) cls += ' ghost'
        else if (id === top) cls += ' cur'
        else if (activeSet.has(id)) cls += ' onstack'
        else if (returned) cls += ' visited'
        const w = widths[id]
        body += `<g class="${cls}"><rect x="${n.x - w / 2}" y="${Y(n) - 13}" width="${w}" height="26" rx="13"/><text x="${n.x}" y="${Y(n)}" style="font-size:12px">${esc(shown || o.preview !== false ? n.label : '')}</text></g>`
        if (returned && n.ret !== null) body += `<text class="ret" x="${n.x}" y="${Y(n) + 25}">→ ${esc(n.ret)}</text>`
      })
      return svgWrap(prep.width + 10, 40 + prep.maxDepth * GY + 26, body, treeTitle)
    },
  }

  // ───────── trie (objects with a children dict + an end flag) ─────────
  VIEWS.trie = {
    render(o, s) {
      const label = o.label || o.var
      const rootRaw = s.raw(o.var)
      if (!rootRaw || rootRaw.ref === undefined) return title(label) + '<div class="empty-note">not created yet</div>'
      const CH = o.children || 'children'
      const END = o.end || 'is_end'
      const nodes = []
      let leaf = 0
      const walk = (raw, depth, parent, ch) => {
        const e = s.heap[raw.ref]
        if (!e || e.t !== 'obj' || depth > 14) return null
        const node = { id: raw.ref, depth, parent, ch, end: e.v[END] === true, kids: [] }
        nodes.push(node)
        const kids = s.heap[(e.v[CH] || {}).ref]
        if (kids && kids.t === 'dict' && kids.v.length) {
          kids.v.forEach(([k, child]) => {
            const c = walk(child, depth + 1, node, k)
            if (c) node.kids.push(c)
          })
          node.x = (node.kids[0].x + node.kids[node.kids.length - 1].x) / 2
        } else node.x = leaf++
        return node
      }
      walk(rootRaw, 0, null, '')
      const cur = new Map()
      ptrList(o.pointers).forEach(([name, lab], k) => {
        const r = s.rawTop(name) ?? s.raw(name)
        if (r && r.ref !== undefined) (cur.get(r.ref) || cur.set(r.ref, []).get(r.ref)).push([lab, k])
      })
      const GX = 40
      const GY = 52
      const X = (n) => 24 + n.x * GX
      const Y = (n) => 22 + n.depth * GY
      let body = ''
      nodes.forEach((n) => {
        if (!n.parent) return
        const [a, b, c, d] = shorten(X(n.parent), Y(n.parent), X(n), Y(n), 13, 13)
        body += `<line class="edge" x1="${a}" y1="${b}" x2="${c}" y2="${d}"/><text class="wt" x="${(X(n.parent) + X(n)) / 2 - 7}" y="${(Y(n.parent) + Y(n)) / 2 + 2}" style="font-weight:700;font-size:13px">${esc(n.ch)}</text>`
      })
      nodes.forEach((n) => {
        const cls = cur.has(n.id) ? 'node cur' : n.end ? 'node visited' : 'node'
        body += `<g class="${cls}"><circle cx="${X(n)}" cy="${Y(n)}" r="12"/>${n.end ? `<text x="${X(n)}" y="${Y(n)}" style="font-size:10px">✓</text>` : ''}</g>`
        ;(cur.get(n.id) || []).forEach(([lab, k], j) => (body += `<text class="lbl ${PCLS[k]}" x="${X(n) + 15}" y="${Y(n) - 12 - j * 13}" style="text-anchor:start">${esc(lab)}</text>`))
      })
      const maxDepth = Math.max(...nodes.map((n) => n.depth))
      return svgWrap(Math.max(120, 48 + Math.max(0, leaf - 1) * GX + 40), 44 + maxDepth * GY + 12, body, label + ' (✓ = a word ends here)')
    },
  }

  // ───────── intervals on a number line ─────────
  VIEWS.intervals = {
    render(o, s) {
      const groups = o.vars.map((g) => (typeof g === 'string' ? { var: g } : g)).map((g) => ({ ...g, items: s.v(g.var) }))
      const all = groups.flatMap((g) => (Array.isArray(g.items) ? g.items : [])).filter((x) => Array.isArray(x) && x.length >= 2)
      if (!all.length) return title(o.label || 'intervals') + '<div class="empty-note">no intervals yet</div>'
      const min = o.min ?? Math.min(...all.map((x) => x[0]))
      const max = o.max ?? Math.max(...all.map((x) => x[1]))
      const W = 440
      const sc = W / (max - min || 1)
      const X = (v) => 70 + (v - min) * sc
      let y = 8
      let body = ''
      groups.forEach((g, gi) => {
        body += `<text class="lbl" x="4" y="${y + 12}" style="text-anchor:start;fill:var(--ink-2)">${esc(g.label || g.var)}</text>`
        const items = Array.isArray(g.items) ? g.items : []
        const hot = g.pointer ? s.v(g.pointer) : undefined
        if (!items.length) {
          body += `<text class="none" x="70" y="${y + 12}">(empty)</text>`
          y += 22
        }
        items.forEach((iv, i) => {
          if (!Array.isArray(iv)) return
          const cls = i === hot ? 'node cur' : gi > 0 ? 'node visited' : 'node'
          body += `<g class="${cls}"><rect x="${X(iv[0])}" y="${y}" width="${Math.max(4, (iv[1] - iv[0]) * sc)}" height="16" rx="4"/></g><text class="wt" x="${X(iv[1]) + 6}" y="${y + 12}" style="text-anchor:start">[${iv[0]}, ${iv[1]}]</text>`
          y += 21
        })
        y += 8
      })
      const step = max - min <= 24 ? 1 : max - min <= 60 ? 5 : 10
      let grid = ''
      for (let v = Math.ceil(min / step) * step; v <= max; v += step) grid += `<line class="edge faint" x1="${X(v)}" y1="0" x2="${X(v)}" y2="${y}"/><text class="none" x="${X(v)}" y="${y + 12}" style="text-anchor:middle">${v}</text>`
      return svgWrap(W + 150, y + 18, grid + body, o.label || 'intervals')
    },
  }

  // ───────── variables & call stack panel ─────────
  function framesHTML(s, prev, def) {
    const hide = new Set(def.hide || [])
    const frames = s.frames
    const html = frames
      .map((f, idx) => {
        const isTop = idx === frames.length - 1
        const pf = prev && prev.frames[idx] && prev.frames[idx].fn === f.fn ? prev.frames[idx] : null
        const vars = Object.entries(f.vars).filter(([k]) => !hide.has(k))
        if (f.fn === 'global' && def.hideGlobals) return ''
        const rows = vars
          .map(([k, v]) => {
            const t = fmt(v, s.heap)
            const changed = pf && (!(k in pf.vars) || fmt(pf.vars[k], prev.heap) !== t)
            return `<span class="k">${esc(k)}</span><span class="v${changed ? ' changed' : ''}">${esc(t)}</span>`
          })
          .join('')
        const ret = isTop && s.step.k === 'return' && 'r' in s.step && f.fn !== 'global' ? `<div class="ret-val">↩ returns ${esc(fmt(s.step.r, s.heap))}</div>` : ''
        return `<div class="frame${isTop ? ' top' : ''}"><div class="fname"><span>${esc(f.fn === 'global' ? 'global variables' : f.fn + '()')}</span><span>${isTop && frames.length > 1 ? 'running ▸' : ''}</span></div><div class="vars">${rows || '<span class="k">—</span><span></span>'}</div>${ret}</div>`
      })
      .join('')
    if (!html) return ''
    return `<div class="view-title"><b>${frames.length > 2 ? 'call stack' : 'variables'}</b>${frames.length > 2 ? ' <span>(newest call on top)</span>' : ''}</div><div class="frames">${html}</div>`
  }

  // ───────── the player ─────────
  const SPEEDS = { '0.5×': 1300, '1×': 750, '2×': 380, '4×': 160 }

  class Player {
    constructor(root, id, def, trace) {
      this.root = root
      this.id = id
      this.def = def
      this.original = trace
      this.score = { right: 0, total: 0 }
      this.predict = false
      this.timer = null
      this.maxH = 0
      root.classList.add('viz')
      if (def.wide) root.classList.add('wide-stage')
      root.tabIndex = 0
      root.innerHTML = `
        <div class="viz-head"><h4>${esc(def.title || id)}</h4>
          <button class="btn b-predict" title="Guess which line runs next before you see it">🧠 Predict mode</button>
          <button class="btn b-edit" title="Change the code or the input and watch your version">✏️ Edit &amp; visualize</button>
        </div>
        <div class="viz-body">
          <div class="viz-code"><div class="codeview"></div><div class="viz-out" hidden></div></div>
          <div class="viz-stage"></div>
        </div>
        <div class="viz-note"></div>
        <div class="viz-controls">
          <button class="btn b-first" title="First step">⏮</button>
          <button class="btn b-prev" title="Back (←)">◀ Back</button>
          <button class="btn primary b-next" title="Next (→)">Next ▶</button>
          <button class="btn b-last" title="Last step">⏭</button>
          <button class="btn b-play">▶ Play</button>
          <select class="b-speed" title="Speed">${Object.keys(SPEEDS).map((k) => `<option${k === '1×' ? ' selected' : ''}>${k}</option>`).join('')}</select>
          <input type="range" class="b-range" min="0" value="0" aria-label="step">
          <span class="viz-score" hidden></span>
        </div>`
      this.q = (sel) => root.querySelector(sel)
      this.codeEl = this.q('.codeview')
      this.stageEl = this.q('.viz-stage')
      this.noteEl = this.q('.viz-note')
      this.outEl = this.q('.viz-out')
      this.rangeEl = this.q('.b-range')
      this.q('.b-first').onclick = () => this.go(0)
      this.q('.b-prev').onclick = () => this.go(this.i - 1)
      this.q('.b-next').onclick = () => this.next()
      this.q('.b-last').onclick = () => this.go(this.steps.length - 1)
      this.q('.b-play').onclick = () => this.togglePlay()
      this.q('.b-predict').onclick = () => this.togglePredict()
      this.q('.b-edit').onclick = () => this.editMode()
      this.rangeEl.oninput = () => this.go(+this.rangeEl.value)
      this.codeEl.addEventListener('click', (ev) => this.onCodeClick(ev))
      root.addEventListener('keydown', (ev) => {
        if (ev.target.closest('textarea, input, select')) return
        if (ev.key === 'ArrowRight') (this.next(), ev.preventDefault())
        if (ev.key === 'ArrowLeft') (this.go(this.i - 1), ev.preventDefault())
      })
      this.setTrace(trace)
    }

    setTrace(trace) {
      this.trace = trace
      this.steps = trace.steps.length ? trace.steps : [{ l: 0, k: 'line', s: [], h: {}, o: '' }]
      this.lines = highlightLines(trace.code)
      this.preps = (this.def.views || []).map((v) => (VIEWS[v.type] && VIEWS[v.type].prepare ? VIEWS[v.type].prepare(v, this.steps) : null))
      this.codeEl.innerHTML = this.lines.map((h, i) => `<div class="ln" data-l="${i + 1}"><span class="mk"></span><span class="no">${i + 1}</span><span>${h || ' '}</span></div>`).join('')
      this.rangeEl.max = this.steps.length - 1
      this.maxH = 0
      this.stageEl.style.minHeight = ''
      this.go(0)
    }

    go(i) {
      i = Math.max(0, Math.min(this.steps.length - 1, i))
      this.i = i
      this.render()
    }

    next() {
      if (this.i >= this.steps.length - 1) return this.stop()
      if (this.waiting) return
      if (this.predict && !this.pendingGo) {
        const target = this.targetLine()
        if (target) {
          this.waiting = { target, tries: 0 }
          this.renderNote()
          return
        }
      }
      this.go(this.i + 1)
    }

    targetLine() {
      // the next step that is a new line (skip return events, they stay on the same line)
      const nxt = this.steps[this.i + 1]
      if (!nxt || nxt.k === 'return' || nxt.k === 'exc') return null
      return nxt.l
    }

    onCodeClick(ev) {
      if (!this.waiting) return
      const ln = ev.target.closest('.ln')
      if (!ln) return
      const l = +ln.dataset.l
      const w = this.waiting
      if (l === w.target) {
        if (w.tries === 0) this.score.right++
        this.score.total++
        ln.classList.add('right')
        this.waiting = null
        setTimeout(() => this.go(this.i + 1), 250)
      } else {
        w.tries++
        ln.classList.remove('wrong')
        void ln.offsetWidth
        ln.classList.add('wrong')
        if (w.tries >= 2) {
          this.score.total++
          const correct = this.codeEl.querySelector(`.ln[data-l="${w.target}"]`)
          if (correct) correct.classList.add('right')
          this.waiting = null
          this.noteEl.innerHTML = `<span class="count">🧠</span><span>Not quite — it was line ${w.target}. Look at why, then press Next.</span>`
          this.pendingGo = true
          return
        }
        this.renderNote()
      }
      this.updateScore()
    }

    togglePredict() {
      this.predict = !this.predict
      this.waiting = null
      this.stop()
      this.q('.b-predict').classList.toggle('on', this.predict)
      this.codeEl.classList.toggle('predicting', this.predict)
      this.q('.b-play').disabled = this.predict
      this.updateScore()
      this.renderNote()
    }

    updateScore() {
      const el = this.q('.viz-score')
      el.hidden = !this.predict
      el.textContent = `🧠 ${this.score.right} / ${this.score.total} first-try`
    }

    togglePlay() {
      if (this.timer) return this.stop()
      if (this.i >= this.steps.length - 1) this.go(0)
      this.q('.b-play').textContent = '⏸ Pause'
      const tick = () => {
        if (this.i >= this.steps.length - 1) return this.stop()
        this.go(this.i + 1)
        this.timer = setTimeout(tick, SPEEDS[this.q('.b-speed').value] || 700)
      }
      this.timer = setTimeout(tick, 200)
    }

    stop() {
      clearTimeout(this.timer)
      this.timer = null
      this.q('.b-play').textContent = '▶ Play'
    }

    render() {
      const step = this.steps[this.i]
      const prevStep = this.i > 0 ? this.steps[this.i - 1] : null
      const s = access(step)
      const prev = access(prevStep)
      this.pendingGo = false
      // code highlight
      this.codeEl.querySelectorAll('.ln').forEach((el) => (el.className = 'ln'))
      const cur = this.codeEl.querySelector(`.ln[data-l="${step.l}"]`)
      if (cur) {
        cur.classList.add('cur')
        cur.querySelector('.mk').textContent = step.k === 'return' ? '↩' : '➜'
        const box = this.codeEl
        const top = cur.offsetTop - box.offsetTop
        if (top < box.scrollTop || top > box.scrollTop + box.clientHeight - 30) box.scrollTop = top - box.clientHeight / 2
      }
      this.codeEl.querySelectorAll('.mk').forEach((m) => m.parentElement !== cur && (m.textContent = ''))
      // stage
      const views = (this.def.views || [])
        .map((v, k) => {
          const view = VIEWS[v.type]
          if (!view) return `<div class="empty-note">unknown view ${esc(v.type)}</div>`
          try {
            const html = view.render(v, s, prev, this.preps[k], this.i)
            return html ? `<div class="view">${html}</div>` : ''
          } catch (err) {
            console.error(err)
            return `<div class="empty-note">(can't draw ${esc(v.label || v.var || v.type)} here)</div>`
          }
        })
        .join('')
      const frames = this.def.vars === false ? '' : framesHTML(s, prev, this.def)
      this.stageEl.innerHTML = views + (frames ? `<div class="view">${frames}</div>` : '')
      const h = this.stageEl.offsetHeight
      if (h > this.maxH) {
        this.maxH = h
        this.stageEl.style.minHeight = h + 'px'
      }
      // output
      this.outEl.hidden = !step.o
      this.outEl.textContent = step.o || ''
      this.outEl.scrollTop = this.outEl.scrollHeight
      this.rangeEl.value = this.i
      this.renderNote()
    }

    renderNote() {
      const step = this.steps[this.i]
      const last = this.i === this.steps.length - 1
      let text
      if (this.waiting) text = '🧠 <b>Which line runs next?</b> Click it in the code.' + (this.waiting.tries ? ' Try again 🙂' : '')
      else if (last && this.trace.error) text = '❌ ' + esc(this.trace.error)
      else if (last && this.trace.truncated) text = '⏹ Stopped after ' + this.steps.length + ' steps (to keep things fast). Use a smaller input.'
      else if (step.n) text = esc(step.n)
      else if (step.l && this.lines[step.l - 1] !== undefined) text = `Line ${step.l}: <code>${esc(this.trace.code.split('\n')[step.l - 1].trim())}</code>`
      else text = 'Ready'
      this.noteEl.className = 'viz-note' + (last && this.trace.error ? ' err' : '')
      this.noteEl.innerHTML = `<span class="count">${this.i + 1}/${this.steps.length}</span><span>${text}</span>`
    }

    // ───── edit & visualize your own code ─────
    editMode() {
      this.stop()
      if (this.editing) return
      this.editing = true
      const codeBox = this.q('.viz-code')
      const wrap = document.createElement('div')
      wrap.className = 'viz-editwrap'
      wrap.style.cssText = 'display:flex;flex-direction:column;flex:1;min-height:0'
      this.codeEl.hidden = true
      codeBox.insertBefore(wrap, this.codeEl)
      const ed = new DSA.Editor(wrap, this.trace.code, { onRun: () => run() })
      const bar = document.createElement('div')
      bar.className = 'p-actions'
      bar.innerHTML = '<button class="btn primary e-run">▶ Run &amp; visualize</button><button class="btn e-cancel">Cancel</button><button class="btn e-reset">↺ Original code</button><span class="status py-loading"></span>'
      wrap.appendChild(bar)
      const status = bar.querySelector('.status')
      const close = () => {
        wrap.remove()
        this.codeEl.hidden = false
        this.editing = false
      }
      const run = async () => {
        status.textContent = DSA.Py.ready ? 'Running…' : 'Loading Python in your browser (first time takes a few seconds)…'
        try {
          const trace = await DSA.Py.trace(ed.value)
          close()
          this.setTrace(trace)
          if (trace.error) this.go(this.steps.length - 1)
        } catch (err) {
          status.textContent = '⚠️ ' + err.message
        }
      }
      bar.querySelector('.e-run').onclick = run
      bar.querySelector('.e-cancel').onclick = close
      bar.querySelector('.e-reset').onclick = () => {
        close()
        this.setTrace(this.original)
      }
      ed.focus()
    }
  }

  DSA.Player = Player
  DSA.access = access
  DSA.VIEWS = VIEWS
})()
