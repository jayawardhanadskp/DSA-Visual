// Lesson 02 — Big-O
addViz({
  'bigo-linear': {
    title: 'O(n): one look per element',
    code: py`
      def find(nums, target):
          steps = 0
          for x in nums:
              steps += 1
              if x == target:          #: step {steps}: is {x} == {target}? {'yes!' if x == target else 'no'}
                  return steps
          return steps

      print(find([4, 8, 15, 16, 23, 42], 42))
    `,
    views: [{ type: 'array', var: 'nums' }],
  },
  'bigo-nested': {
    title: 'O(n²): a loop inside a loop',
    code: py`
      def all_pairs(nums):
          steps = 0
          n = len(nums)
          for i in range(n):
              for j in range(n):
                  steps += 1            #: pair (i={i}, j={j}) → this is step {steps + 1} of {n}×{n} = {n * n}
          return steps

      print(all_pairs([7, 3, 9, 4]))
    `,
    views: [{ type: 'array', var: 'nums', pointers: ['i', 'j'] }],
  },
  'bigo-halving': {
    title: 'O(log n): cut the problem in half every step',
    code: py`
      def halvings(n):
          steps = 0
          while n > 1:
              n = n // 2              #: {n} // 2 = {n // 2}
              steps += 1
          return steps

      print(halvings(64))
      print(halvings(1_000_000))
    `,
    maxSteps: 200,
    views: [],
  },
})

addWidget({
  'bigo-table': (el) => {
    const fns = [
      ['O(1)', () => 1],
      ['O(log n)', (n) => Math.max(1, Math.log2(n))],
      ['O(n)', (n) => n],
      ['O(n log n)', (n) => n * Math.max(1, Math.log2(n))],
      ['O(n²)', (n) => n * n],
      ['O(2ⁿ)', (n) => Math.pow(2, n)],
    ]
    const PER_SEC = 1e7 // rough: simple Python steps per second
    const sizes = [10, 20, 100, 1000, 10000, 100000, 1000000]
    el.innerHTML = `<h4>How many steps for n items? (and how long in Python)</h4>
      <div class="row"><label>n = <b class="nval"></b></label><input type="range" min="0" max="${sizes.length - 1}" value="3" class="slider" style="flex:1;min-width:180px"></div>
      <table style="display:table"><tr><th>Big-O</th><th>steps</th><th>time (≈10 million steps/sec)</th><th style="width:40%"></th></tr><tbody></tbody></table>
      <p class="msg" style="font-size:14px;color:var(--ink-2)">Move the slider. At n = 1,000,000 an O(n²) solution needs ~28 hours. That's why LeetCode says "Time Limit Exceeded".</p>`
    const slider = el.querySelector('.slider')
    const fmtNum = (x) => (x >= 1e15 ? x.toExponential(1) : Math.round(x).toLocaleString('en-US'))
    const fmtTime = (sec) => {
      if (!isFinite(sec) || sec > 3.15e9) return 'longer than the universe 🤯'
      if (sec < 1e-3) return 'instant'
      if (sec < 1) return Math.round(sec * 1000) + ' ms'
      if (sec < 120) return sec.toFixed(1) + ' s'
      if (sec < 7200) return Math.round(sec / 60) + ' min'
      if (sec < 172800) return Math.round(sec / 3600) + ' hours'
      if (sec < 3.15e7) return Math.round(sec / 86400) + ' days'
      return Math.round(sec / 3.15e7).toLocaleString('en-US') + ' years'
    }
    const draw = () => {
      const n = sizes[+slider.value]
      el.querySelector('.nval').textContent = n.toLocaleString('en-US')
      el.querySelector('tbody').innerHTML = fns
        .map(([name, f]) => {
          const steps = f(n)
          const sec = steps / PER_SEC
          const width = Math.min(100, (Math.log10(Math.max(steps, 1)) / 15) * 100)
          const color = sec < 1 ? 'var(--good)' : sec < 60 ? 'var(--warn)' : 'var(--bad)'
          return `<tr><td><b>${name}</b></td><td style="font-family:var(--mono)">${fmtNum(steps)}</td><td>${fmtTime(sec)}</td><td><div style="height:12px;width:${width}%;background:${color};border-radius:6px"></div></td></tr>`
        })
        .join('')
    }
    slider.oninput = draw
    draw()
  },
  'bigo-chart': (el) => {
    const curves = [
      ['n²', (n) => n * n, 'var(--bad)'],
      ['n log n', (n) => n * Math.log2(Math.max(n, 1)), 'var(--warn)'],
      ['n', (n) => n, 'var(--accent)'],
      ['log n', (n) => Math.log2(Math.max(n, 1)), 'var(--good)'],
      ['1', () => 1, 'var(--teal)'],
    ]
    el.innerHTML = `<h4>Growth curves</h4><div class="row"><label>show n up to <b class="mx"></b></label><input type="range" min="5" max="100" value="20" class="slider" style="flex:1;min-width:180px"></div><div class="svgview"></div><p class="msg" style="font-size:14px;color:var(--ink-2)">For tiny n all curves look similar. Make n bigger and watch n² fly away — Big-O is about what happens when n gets <b>big</b>.</p>`
    const slider = el.querySelector('.slider')
    const draw = () => {
      const N = +slider.value
      el.querySelector('.mx').textContent = N
      const W = 520
      const H = 240
      const maxY = N * N
      const X = (n) => 40 + (n / N) * (W - 110)
      const Y = (v) => H - 24 - (Math.min(v, maxY) / maxY) * (H - 40)
      let body = `<line class="edge" x1="40" y1="${H - 24}" x2="${W - 60}" y2="${H - 24}"/><line class="edge" x1="40" y1="10" x2="40" y2="${H - 24}"/><text class="none" x="${W - 60}" y="${H - 6}" style="text-anchor:end">n = ${N}</text><text class="none" x="4" y="16">steps</text>`
      curves.forEach(([name, f, color]) => {
        let d = ''
        for (let n = 1; n <= N; n += Math.max(1, N / 80)) d += (d ? ' L' : 'M') + X(n).toFixed(1) + ' ' + Y(f(n)).toFixed(1)
        body += `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.5"/><text x="${X(N) + 6}" y="${Y(f(N)) + 4}" style="fill:${color};font-size:12px;font-weight:700">${name}</text>`
      })
      el.querySelector('.svgview').innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`
    }
    slider.oninput = draw
    draw()
  },
})

addProblems({
  'bo-sum-to-n': {
    title: 'Sum from 1 to n — make it O(1)',
    level: 'Easy',
    pattern: 'Math instead of a loop',
    prompt: `<p>Return <code>1 + 2 + … + n</code>. The last test uses <code>n = 10**12</code> (a trillion). A loop would need a trillion steps — find the formula.</p>`,
    fn: 'sum_to_n',
    starter: py`
      def sum_to_n(n):
          total = 0
          for i in range(1, n + 1):   # correct, but O(n) — too slow for the last test
              total += i
          return total
    `,
    tests: [
      { args: [1], expect: 1 },
      { args: [10], expect: 55 },
      { args: [100], expect: 5050 },
      { args: [0], expect: 0 },
      { args: [{ __py__: '10**12' }], expect: { __py__: '500000000000500000000000' } },
    ],
    hints: ['Write 1 + 2 + … + 10 on one line, and 10 + 9 + … + 1 under it. Add the columns. What do you see?', 'Every column adds up to n + 1, and there are n columns. That is twice the answer.', '<code>return n * (n + 1) // 2</code> (use <code>//</code> to stay an int).'],
    solution: py`
      def sum_to_n(n):
          return n * (n + 1) // 2
    `,
    explain: '<p>O(1): the same work for n = 10 or n = 10¹². Sometimes the best "algorithm" is a formula.</p>',
  },
  'bo-has-dup': {
    title: 'Has a duplicate? — make it O(n)',
    level: 'Easy',
    pattern: 'Set lookup',
    leetcode: '217. Contains Duplicate',
    prompt: `<p>Return <code>True</code> if any value appears at least twice in <code>nums</code>. The starter is O(n²) and is <b>too slow</b> for the big tests (100,000 numbers). Use a <code>set</code> (lesson 01): checking <code>x in seen</code> is O(1).</p>`,
    fn: 'has_duplicate',
    starter: py`
      def has_duplicate(nums):
          # O(n^2): compares every pair — too slow for big inputs
          for i in range(len(nums)):
              for j in range(i + 1, len(nums)):
                  if nums[i] == nums[j]:
                      return True
          return False
    `,
    tests: [
      { args: [[1, 2, 3, 1]], expect: true },
      { args: [[1, 2, 3, 4]], expect: false },
      { args: [[]], expect: false },
      { args: [{ __py__: 'list(range(100_000))' }], expect: false },
      { args: [{ __py__: 'list(range(100_000)) + [99_999]' }], expect: true },
    ],
    hints: ['Keep a set of numbers you have already seen.', 'For each x: if <code>x in seen</code> → True. Otherwise <code>seen.add(x)</code>.'],
    solution: py`
      def has_duplicate(nums):
          seen = set()
          for x in nums:
              if x in seen:
                  return True
              seen.add(x)
          return False
    `,
    explain: '<p>Time O(n), space O(n). We traded memory for speed — a very common trade in DSA. (One-liner: <code>len(set(nums)) != len(nums)</code>.)</p>',
  },
  'bo-common': {
    title: 'Common elements — make it fast',
    level: 'Easy',
    pattern: 'Set lookup',
    leetcode: '349. Intersection of Two Arrays',
    prompt: '<p>Return the sorted list of the different values that appear in <b>both</b> <code>a</code> and <code>b</code>. The big test has 20,000 and 8,000 numbers.</p>',
    fn: 'common_elements',
    starter: py`
      def common_elements(a, b):
          result = []
          for x in a:                  # O(n * m): every x is compared with every y
              for y in b:
                  if x == y and x not in result:
                      result.append(x)
          return sorted(result)
    `,
    tests: [
      { args: [[1, 2, 2, 1], [2, 2]], expect: [2] },
      { args: [[4, 9, 5], [9, 4, 9, 8, 4]], expect: [4, 9] },
      { args: [[1, 2], [3]], expect: [] },
      { args: [{ __py__: 'list(range(0, 40_000, 2))' }, { __py__: 'list(range(0, 40_000, 5))' }], expect: { __py__: 'list(range(0, 40_000, 10))' } },
    ],
    hints: ['Turn one or both lists into sets first.', '<code>set(a) &amp; set(b)</code> is the intersection. Then <code>sorted(...)</code>.'],
    solution: py`
      def common_elements(a, b):
          return sorted(set(a) & set(b))
    `,
    explain: '<p>Building the sets is O(n + m), the intersection is O(min(n, m)), sorting the k results is O(k log k).</p>',
  },
  'bo-first-repeat': {
    title: 'First repeated character',
    level: 'Easy',
    pattern: 'Set lookup',
    prompt: '<p>Return the first character in <code>s</code> that appears for the <b>second</b> time while reading left to right, or <code>None</code> if no character repeats. <code>"abcbad"</code> → <code>"b"</code>.</p>',
    fn: 'first_repeat',
    starter: py`
      def first_repeat(s):
          # TODO: O(n)
          return None
    `,
    tests: [
      { args: ['abcbad'], expect: 'b' },
      { args: ['abc'], expect: null },
      { args: ['aa'], expect: 'a' },
      { args: [''], expect: null },
      { args: ['xyzzyx'], expect: 'z' },
    ],
    hints: ['Same as "has duplicate": remember what you have seen.', 'Return the character at the moment you see it for the second time.'],
    solution: py`
      def first_repeat(s):
          seen = set()
          for ch in s:
              if ch in seen:
                  return ch
              seen.add(ch)
          return None
    `,
    explain: '<p>O(n) time. The set can hold at most the size of the alphabet, so you could also call the space O(1) for lowercase letters.</p>',
  },
})

addQuiz({
  'bigo-quiz': [
    { q: 'What is the time complexity?', code: 'for x in nums:\n    print(x)\nfor y in nums:\n    print(y)', options: ['O(n)', 'O(n²)', 'O(2n²)', 'O(log n)'], answer: 0, why: 'Two loops one <i>after</i> the other: n + n = 2n → drop the constant → O(n). Loops <b>add</b> when they are in sequence.' },
    { q: 'And this one?', code: 'for x in nums:\n    for y in nums:\n        print(x, y)', options: ['O(n)', 'O(2n)', 'O(n²)', 'O(n³)'], answer: 2, why: 'A loop <i>inside</i> a loop: n × n. Loops <b>multiply</b> when nested.' },
    { q: 'And this one?', code: 'i = 1\nwhile i < n:\n    i = i * 2', options: ['O(n)', 'O(log n)', 'O(n / 2)', 'O(1)'], answer: 1, why: 'i doubles: 1, 2, 4, 8 … it reaches n after about log₂(n) steps.' },
    { q: 'And this one? (k is a different input)', code: 'for x in a:          # len(a) = n\n    for i in range(k):\n        print(x, i)', options: ['O(n²)', 'O(n + k)', 'O(n · k)', 'O(k)'], answer: 2, why: 'Different inputs get different letters. Nested → multiply: O(n · k).' },
    { q: 'Which line is O(n), not O(1)?', options: ['<code>nums.append(5)</code>', '<code>nums[3]</code>', '<code>5 in nums</code> (nums is a list)', '<code>5 in seen</code> (seen is a set)'], answer: 2, why: '<code>in</code> on a <b>list</b> checks every element. On a set/dict it uses the hash: O(1).' },
    { q: 'What is the time complexity?', code: 'for x in nums:\n    if x in nums:   # nums is a list\n        count += 1', options: ['O(n)', 'O(n²)', 'O(1)', 'O(n log n)'], answer: 1, why: 'The hidden loop! <code>x in nums</code> is O(n), done n times → O(n²). Always ask what each line costs.' },
    { q: 'LeetCode says <code>1 &lt;= n &lt;= 10^5</code>. Which solution is probably needed?', options: ['O(n²) is fine', 'O(n) or O(n log n)', 'O(2ⁿ)', 'O(n³)'], answer: 1, why: '10⁵² = 10¹⁰ steps — far too slow. Use the "constraints → complexity" table in section 6.' },
    { q: 'What is the <b>space</b> complexity?', code: 'def squares(nums):\n    return [x * x for x in nums]', options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'], answer: 1, why: 'It builds a new list with n items. (Many people say the output doesn\'t count — then it\'s O(1) "extra" space. Say which one you mean.)' },
  ],
})
