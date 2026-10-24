// Lesson 04 — Hash maps & sets
addViz({
  'hash-two-sum': {
    title: 'Two Sum with a dict: "have I seen what I need?"',
    code: py`
      def two_sum(nums, target):
          seen = {}                        # value → its index
          for i, x in enumerate(nums):
              need = target - x            #: I have {x}. To reach {target} I need {target} - {x} = {target - x}
              if need in seen:             #: have I seen {need} before? {'YES — at index ' + str(seen[need]) if need in seen else 'no (one O(1) dict lookup)'}
                  return [seen[need], i]
              seen[x] = i                  #: remember: value {x} is at index {i}
          return []

      print(two_sum([5, 11, 9, 2, 14, 3], 17))
    `,
    views: [
      { type: 'array', var: 'nums', pointers: ['i'] },
      { type: 'dict', var: 'seen', hot: (s) => s.v('need'), keyLabel: 'value', valLabel: 'index' },
    ],
  },
  'hash-group': {
    title: 'Grouping with a dict: same key → same group',
    code: py`
      def group_anagrams(words):
          groups = {}                         # key → list of words
          for w in words:
              key = "".join(sorted(w))        #: sort the letters of '{w}' → key '{"".join(sorted(w))}'
              if key not in groups:
                  groups[key] = []            #: first word with key '{key}' → new empty group
              groups[key].append(w)           #: add '{w}' to group '{key}'
          return list(groups.values())

      print(group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"]))
    `,
    views: [
      { type: 'array', var: 'words', pointers: { w: 'w' }, cls: (s) => { const w = s.v('w'); const ws = s.v('words') || []; const i = ws.indexOf(w); return i >= 0 ? { [i]: 'hot' } : {} } },
      { type: 'dict', var: 'groups', hot: (s) => s.v('key') },
    ],
  },
  'hash-first-unique': {
    title: 'Count first, then answer: first unique character',
    code: py`
      def first_unique(s):
          counts = {}
          for ch in s:                       # pass 1: count everything
              counts[ch] = counts.get(ch, 0) + 1
          for i, ch in enumerate(s):         # pass 2: use the counts
              if counts[ch] == 1:            #: '{ch}' appears {counts[ch]} time(s) → {'unique, this is the answer!' if counts[ch] == 1 else 'not unique'}
                  return i
          return -1

      print(first_unique("swiss"))
    `,
    views: [
      { type: 'array', var: 's', pointers: ['i'] },
      { type: 'dict', var: 'counts', hot: (s) => s.v('ch'), keyLabel: 'char', valLabel: 'count' },
    ],
  },
})

addWidget({
  'hash-buckets': (el) => {
    const N = 8
    let buckets = Array.from({ length: N }, () => [])
    el.innerHTML = `<h4>Inside a hash table</h4>
      <p style="margin:0 0 6px;font-size:15px">A dict is an array of <b>buckets</b>. To store a key, Python turns the key into a number (its <b>hash</b>),
      then uses <code>hash % number_of_buckets</code> as the index. To find the key later it does the same math and looks in <b>one</b> bucket — no scanning.</p>
      <div class="row"><input type="text" class="key" value="cat" maxlength="12" style="width:140px" aria-label="key">
      <button class="btn primary b-put">put</button><button class="btn b-get">look up</button><button class="btn b-fill">add 6 random words</button><button class="btn b-clear">clear</button></div>
      <p class="msg"></p><div class="bk" style="display:grid;grid-template-columns:auto 1fr;gap:4px 10px;font:13px var(--mono)"></div>`
    const input = el.querySelector('.key')
    const msg = el.querySelector('.msg')
    const hash = (k) => [...k].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 100000, 7)
    const draw = (hot = -1, hotKey = null) => {
      const count = buckets.reduce((a, b) => a + b.length, 0)
      el.querySelector('.bk').innerHTML =
        buckets
          .map((b, i) => `<div style="color:var(--ink-3)">bucket ${i}</div><div class="chips" style="min-height:26px;${i === hot ? 'outline:2px solid var(--accent);border-radius:8px;' : ''}">${b.map((k) => `<span class="chip${k === hotKey ? ' hot' : ''}">${DSA.esc(k)}</span>`).join('') || '<span style="color:var(--ink-3)">—</span>'}</div>`)
          .join('') + `<div></div><div style="color:var(--ink-3)">${count} keys in ${N} buckets (load ${(count / N).toFixed(2)}). Real Python grows the table when it gets about 2/3 full, so buckets stay short.</div>`
    }
    const explain = (k) => {
      const h = hash(k)
      return `hash('${DSA.esc(k)}') = ${h} → ${h} % ${N} = <b>bucket ${h % N}</b>`
    }
    el.querySelector('.b-put').onclick = () => {
      const k = input.value.trim()
      if (!k) return
      const i = hash(k) % N
      const exists = buckets[i].includes(k)
      if (!exists) buckets[i].push(k)
      msg.innerHTML = explain(k) + (exists ? ' — already there (keys are unique).' : buckets[i].length > 1 ? ' — another key already lives there: a <b>collision</b>. Both share the bucket.' : ' — stored.')
      draw(i, k)
    }
    el.querySelector('.b-get').onclick = () => {
      const k = input.value.trim()
      const i = hash(k) % N
      const pos = buckets[i].indexOf(k)
      msg.innerHTML = explain(k) + ` — looked in only ${Math.max(1, pos + 1)} of ${buckets.reduce((a, b) => a + b.length, 0)} keys: ${pos >= 0 ? '<b>found ✅</b>' : '<b>not there ❌</b>'}`
      draw(i, k)
    }
    el.querySelector('.b-fill').onclick = () => {
      const words = ['dog', 'tea', 'kiwi', 'sun', 'moon', 'rice', 'curry', 'hopper', 'kottu', 'ocean', 'train', 'mango', 'ant', 'flutter', 'dart', 'python']
      for (let n = 0; n < 6; n++) {
        const k = words[Math.floor(Math.random() * words.length)]
        const i = hash(k) % N
        if (!buckets[i].includes(k)) buckets[i].push(k)
      }
      msg.textContent = 'Added some words. Type one of them and press "look up".'
      draw()
    }
    el.querySelector('.b-clear').onclick = () => {
      buckets = Array.from({ length: N }, () => [])
      msg.textContent = ''
      draw()
    }
    draw()
  },
})

addProblems({
  'hash-two-sum': {
    title: 'Two Sum',
    level: 'Easy',
    pattern: 'dict: value → index',
    leetcode: '1. Two Sum',
    prompt: '<p>Return the indexes <code>[i, j]</code> (<code>i &lt; j</code>) of the two numbers in <code>nums</code> that add up to <code>target</code>. There is exactly one answer. The list is <b>not</b> sorted. Aim for O(n).</p>',
    fn: 'two_sum',
    starter: py`
      def two_sum(nums, target):
          # TODO: one pass with a dict
          return []
    `,
    tests: [
      { args: [[2, 7, 11, 15], 9], expect: [0, 1] },
      { args: [[3, 2, 4], 6], expect: [1, 2] },
      { args: [[3, 3], 6], expect: [0, 1] },
      { args: [[5, 11, 9, 2, 14, 3], 17], expect: [4, 5] },
      { args: [[-1, -2, -3, -4, -5], -8], expect: [2, 4] },
      { args: [{ __py__: 'list(range(100_000))' }, 199997], expect: [99998, 99999] },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['i'] }, { type: 'dict', var: 'seen' }],
    hints: ['For each number <code>x</code>, the partner you need is <code>target - x</code>.', 'Keep a dict <code>seen</code> that maps a value to its index. Check for the partner <b>before</b> you add <code>x</code> (so you don\'t use the same element twice).'],
    solution: py`
      def two_sum(nums, target):
          seen = {}
          for i, x in enumerate(nums):
              need = target - x
              if need in seen:
                  return [seen[need], i]
              seen[x] = i
          return []
    `,
    explain: '<p>O(n) time, O(n) space. The most famous interview question — and the template for "complement" problems: <i>for each x, did I already see the thing that completes it?</i></p>',
  },
  'hash-anagram': {
    title: 'Valid anagram',
    level: 'Easy',
    pattern: 'Counting',
    leetcode: '242. Valid Anagram',
    prompt: '<p>Return <code>True</code> if <code>t</code> uses exactly the same letters as <code>s</code> (same counts), in any order.</p>',
    fn: 'is_anagram',
    starter: py`
      def is_anagram(s, t):
          # TODO
          return False
    `,
    tests: [
      { args: ['anagram', 'nagaram'], expect: true },
      { args: ['rat', 'car'], expect: false },
      { args: ['a', 'ab'], expect: false },
      { args: ['', ''], expect: true },
      { args: ['listen', 'silent'], expect: true },
      { args: ['aacc', 'ccac'], expect: false },
    ],
    hints: ['Count the letters of both strings and compare the two dicts.', '<code>from collections import Counter</code> → <code>Counter(s) == Counter(t)</code>. Try writing it with a plain dict first.'],
    solution: py`
      def is_anagram(s, t):
          if len(s) != len(t):
              return False
          counts = {}
          for ch in s:
              counts[ch] = counts.get(ch, 0) + 1
          for ch in t:
              if counts.get(ch, 0) == 0:
                  return False
              counts[ch] -= 1
          return True
    `,
    explain: '<p>O(n) time. <code>sorted(s) == sorted(t)</code> also works but is O(n log n). In an interview, mention both.</p>',
  },
  'hash-first-unique': {
    title: 'First unique character',
    level: 'Easy',
    pattern: 'Count, then scan',
    leetcode: '387. First Unique Character in a String',
    prompt: '<p>Return the index of the first character in <code>s</code> that appears exactly once, or <code>-1</code>.</p>',
    fn: 'first_uniq_char',
    starter: py`
      def first_uniq_char(s):
          # TODO
          return -1
    `,
    tests: [
      { args: ['leetcode'], expect: 0 },
      { args: ['loveleetcode'], expect: 2 },
      { args: ['aabb'], expect: -1 },
      { args: ['z'], expect: 0 },
      { args: ['swiss'], expect: 1 },
    ],
    hints: ['Two passes: first count every character, then find the first one with count 1.'],
    solution: py`
      def first_uniq_char(s):
          counts = {}
          for ch in s:
              counts[ch] = counts.get(ch, 0) + 1
          for i, ch in enumerate(s):
              if counts[ch] == 1:
                  return i
          return -1
    `,
    explain: '<p>"Count first, then answer" — two O(n) passes are still O(n).</p>',
  },
  'hash-ransom': {
    title: 'Ransom note',
    level: 'Easy',
    pattern: 'Counting',
    leetcode: '383. Ransom Note',
    prompt: '<p>Can you build <code>note</code> by cutting letters out of <code>magazine</code>? Each magazine letter can be used once.</p>',
    fn: 'can_construct',
    starter: py`
      def can_construct(note, magazine):
          # TODO
          return False
    `,
    tests: [
      { args: ['a', 'b'], expect: false },
      { args: ['aa', 'ab'], expect: false },
      { args: ['aa', 'aab'], expect: true },
      { args: ['', 'x'], expect: true },
      { args: ['abc', 'cbaxyz'], expect: true },
    ],
    hints: ['Count the magazine letters. Then "spend" them for each letter of the note.', 'If a count would go below 0, return <code>False</code>.'],
    solution: py`
      def can_construct(note, magazine):
          available = {}
          for ch in magazine:
              available[ch] = available.get(ch, 0) + 1
          for ch in note:
              if available.get(ch, 0) == 0:
                  return False
              available[ch] -= 1
          return True
    `,
    explain: '<p>O(n + m). With Counter: <code>return not (Counter(note) - Counter(magazine))</code>.</p>',
  },
  'hash-isomorphic': {
    title: 'Isomorphic strings',
    level: 'Easy',
    pattern: 'Two-way mapping',
    leetcode: '205. Isomorphic Strings',
    prompt: '<p><code>s</code> and <code>t</code> (same length) are isomorphic if you can replace characters in <code>s</code> to get <code>t</code>, where each character always maps to the same character, and no two characters map to the same one. <code>"egg"/"add"</code> → <code>True</code>, <code>"foo"/"bar"</code> → <code>False</code>.</p>',
    fn: 'is_isomorphic',
    starter: py`
      def is_isomorphic(s, t):
          # TODO
          return False
    `,
    tests: [
      { args: ['egg', 'add'], expect: true },
      { args: ['foo', 'bar'], expect: false },
      { args: ['paper', 'title'], expect: true },
      { args: ['badc', 'baba'], expect: false },
      { args: ['ab', 'aa'], expect: false },
      { args: ['', ''], expect: true },
    ],
    hints: ['Keep a dict <code>s_to_t</code>. If a character was mapped before, it must map to the same thing now.', 'One dict is not enough: <code>"ab" → "aa"</code> maps a→a and b→a. Also keep <code>t_to_s</code> (or a set of used targets).'],
    solution: py`
      def is_isomorphic(s, t):
          s_to_t, t_to_s = {}, {}
          for a, b in zip(s, t):
              if s_to_t.get(a, b) != b or t_to_s.get(b, a) != a:
                  return False
              s_to_t[a] = b
              t_to_s[b] = a
          return True
    `,
    explain: '<p><code>d.get(a, b) != b</code> reads: "if a already maps to something, is it b?". O(n).</p>',
  },
  'hash-group-anagrams': {
    title: 'Group anagrams',
    level: 'Medium',
    pattern: 'dict: key → group',
    leetcode: '49. Group Anagrams',
    prompt: '<p>Group the words that are anagrams of each other. Return a list of groups (any order of groups, any order inside a group).</p>',
    fn: 'group_anagrams',
    compare: 'nested',
    starter: py`
      def group_anagrams(words):
          # TODO: what key do all anagrams share?
          return []
    `,
    tests: [
      { args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expect: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']] },
      { args: [['']], expect: [['']] },
      { args: [['a']], expect: [['a']] },
      { args: [['abc', 'bca', 'xyz']], expect: [['abc', 'bca'], ['xyz']] },
    ],
    views: [{ type: 'dict', var: 'groups' }],
    hints: ['Anagrams become the same string when you sort their letters.', 'Use that sorted string as a dict key; the value is a list of words. <code>defaultdict(list)</code> saves you the "if key not in" check.'],
    solution: py`
      from collections import defaultdict

      def group_anagrams(words):
          groups = defaultdict(list)
          for w in words:
              groups["".join(sorted(w))].append(w)
          return list(groups.values())
    `,
    explain: '<p>O(n · k log k) for n words of length k. Faster key: the 26 letter counts as a tuple — <code>tuple(counts)</code> — which is O(k). Remember: lists can\'t be dict keys, tuples can.</p>',
  },
  'hash-top-k': {
    title: 'Top K frequent elements',
    level: 'Medium',
    pattern: 'Count + sort (or bucket)',
    leetcode: '347. Top K Frequent Elements',
    prompt: '<p>Return the <code>k</code> most frequent values in <code>nums</code> (any order). The answer is unique.</p>',
    fn: 'top_k_frequent',
    compare: 'sorted',
    starter: py`
      def top_k_frequent(nums, k):
          # TODO
          return []
    `,
    tests: [
      { args: [[1, 1, 1, 2, 2, 3], 2], expect: [1, 2] },
      { args: [[1], 1], expect: [1] },
      { args: [[4, 4, 5, 5, 5, 6], 1], expect: [5] },
      { args: [[7, 8, 7, 9, 8, 7], 2], expect: [7, 8] },
    ],
    hints: ['Count first (dict or Counter).', 'Sort the values by their count, biggest first: <code>sorted(counts, key=counts.get, reverse=True)</code>, then take <code>[:k]</code>.', 'O(n) bonus: "bucket sort" — make a list where index = count, holding the values with that count.'],
    solution: py`
      def top_k_frequent(nums, k):
          counts = {}
          for x in nums:
              counts[x] = counts.get(x, 0) + 1
          buckets = [[] for _ in range(len(nums) + 1)]   # buckets[c] = values seen c times
          for x, c in counts.items():
              buckets[c].append(x)
          result = []
          for c in range(len(nums), 0, -1):
              for x in buckets[c]:
                  result.append(x)
                  if len(result) == k:
                      return result
          return result
    `,
    explain: '<p>Bucket version: O(n). Sorting version: O(n log n) — also fine to say first. <code>Counter(nums).most_common(k)</code> is the one-line answer (lesson 14 shows the heap way).</p>',
  },
  'hash-consecutive': {
    title: 'Longest consecutive sequence',
    level: 'Medium',
    pattern: 'set + "start of a run"',
    leetcode: '128. Longest Consecutive Sequence',
    prompt: '<p>Return the length of the longest run of consecutive integers (like 1, 2, 3, 4) that can be made from the values in <code>nums</code>, in any order. Must be O(n) — the big test has 100,001 values.</p>',
    fn: 'longest_consecutive',
    starter: py`
      def longest_consecutive(nums):
          # TODO
          return 0
    `,
    tests: [
      { args: [[100, 4, 200, 1, 3, 2]], expect: 4 },
      { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expect: 9 },
      { args: [[]], expect: 0 },
      { args: [[1, 2, 0, 1]], expect: 3 },
      { args: [[9]], expect: 1 },
      { args: [{ __py__: 'list(range(0, 200_000, 2)) + [1]' }], expect: 3 },
    ],
    hints: ['Put everything in a set so "is x + 1 here?" is O(1).', 'Only start counting from a number that is the <b>start</b> of a run: <code>x - 1 not in nums_set</code>.', 'From each start, count up while <code>x + 1</code> is in the set. Each number is counted once in total → O(n).'],
    solution: py`
      def longest_consecutive(nums):
          values = set(nums)
          best = 0
          for x in values:
              if x - 1 not in values:        # x starts a run
                  length = 1
                  while x + length in values:
                      length += 1
                  best = max(best, length)
          return best
    `,
    explain: '<p>The nested <code>while</code> looks like O(n²), but it only runs from run starts, so every number is visited at most twice → O(n). Spotting this is a classic interview moment.</p>',
  },
})

addQuiz({
  'hash-quiz': [
    { q: 'Why is <code>key in my_dict</code> O(1) on average?', options: ['Dicts are sorted', 'The hash of the key tells Python which bucket to look in', 'Python caches the last lookup', 'Dicts are small'], answer: 1, why: 'hash(key) % number_of_buckets → one bucket. Buckets stay short because the table grows.' },
    { q: 'Which of these can be a dict key or a set item?', options: ['<code>[1, 2]</code>', '<code>{1: 2}</code>', '<code>(1, 2)</code>', '<code>{1, 2}</code>'], answer: 2, why: 'Keys must be hashable (immutable). Tuples, strings and numbers are; lists, dicts and sets are not.' },
    { q: 'In Two Sum, why do we check <code>need in seen</code> <b>before</b> <code>seen[x] = i</code>?', options: ['It is faster', 'So an element is never paired with itself', 'Python requires it', 'It doesn\'t matter'], answer: 1, why: 'With target 6 and x = 3, adding first would find 3 in <code>seen</code> — itself. Checking first only finds <i>earlier</i> elements.' },
    { q: 'You see "find pairs", "seen before", "count", "group by", "duplicates", unsorted input. Which tool first?', options: ['Two pointers', 'A dict or set', 'Sorting', 'Recursion'], answer: 1, why: 'These are the classic hashing signals.' },
    { q: 'What is the worst case for a dict lookup?', options: ['O(1) always', 'O(n), if many keys land in the same bucket', 'O(log n)', 'O(n²)'], answer: 1, why: 'With terrible luck (or a bad hash) everything collides. In practice and in interviews we say O(1) average.' },
  ],
})
