// Lesson 01 — Python for DSA
const L01_COLORS = ['var(--accent)', 'var(--purple)', 'var(--teal)', 'var(--warn)', 'var(--good)', 'var(--bad)']

/** Shows which names point to which object — the key idea behind Python references. */
function l01RefsView(names) {
  return {
    type: 'html',
    render: (s) => {
      const rows = names
        .filter((n) => s.has(n))
        .map((n) => {
          const r = s.raw(n)
          if (r && r.ref !== undefined) {
            const color = L01_COLORS[r.ref % L01_COLORS.length]
            return `<tr><td><b>${DSA.esc(n)}</b></td><td style="color:${color};font-weight:700">→ object #${r.ref}</td><td>${DSA.esc(s.fmt(r))}</td></tr>`
          }
          return `<tr><td><b>${DSA.esc(n)}</b></td><td style="color:var(--ink-3)">value</td><td>${DSA.esc(s.fmt(r))}</td></tr>`
        })
        .join('')
      return `<div class="view-title"><b>names → objects</b> <span>(same # = the same object in memory)</span></div><table class="kv"><tr><th>name</th><th>points to</th><th>value</th></tr>${rows}</table>`
    },
  }
}

addViz({
  'py-loops': {
    title: 'for loops: range, enumerate',
    code: py`
      fruits = ["apple", "kiwi", "mango"]

      for i in range(len(fruits)):         #: range(len(fruits)) = range(3) gives 0, 1, 2 — the 3 is NOT included
          print(i, fruits[i])

      for i, fruit in enumerate(fruits):   #: enumerate gives (index, value) pairs
          print(i, fruit)

      for fruit in reversed(fruits):       #: reversed() walks from the end
          print(fruit)
    `,
    views: [{ type: 'array', var: 'fruits', pointers: ['i'] }],
  },
  'py-references': {
    title: 'Names are labels on objects (references)',
    code: py`
      a = [1, 2, 3]
      b = a              #: b = a does NOT copy. b is a second label on the SAME list
      b.append(4)        #: append through b ... look at a!
      c = a.copy()       #: .copy() makes a NEW list
      c.append(99)       #: only c changes now
      x = 5
      y = x
      y += 1             #: ints can't change; y += 1 makes y point to a NEW int. x stays 5
      print(a, b, c, x, y)
    `,
    views: [l01RefsView(['a', 'b', 'c', 'x', 'y'])],
    vars: false,
  },
  'py-grid-trap': {
    title: 'The 2-D list trap',
    code: py`
      bad = [[0] * 3] * 3                  #: [[0]*3] * 3 copies the REFERENCE to one row, 3 times
      bad[0][0] = 7                        #: change row 0 ... every row changes, because all rows are the same list!
      good = [[0] * 3 for _ in range(3)]   #: the comprehension runs [0]*3 three times → 3 different rows
      good[0][0] = 7                       #: only row 0 changes
      print(bad)
      print(good)
    `,
    views: [
      { type: 'grid', var: 'bad', indexes: true },
      { type: 'grid', var: 'good', indexes: true },
      {
        type: 'html',
        render: (s) => {
          const out = []
          for (const name of ['bad', 'good']) {
            const e = s.entry(s.raw(name))
            if (!e) continue
            out.push(`<div style="font:13px var(--mono)"><b>${name}</b> rows → ${e.v.map((r) => `<span style="color:${L01_COLORS[r.ref % L01_COLORS.length]};font-weight:700">#${r.ref}</span>`).join(', ')}</div>`)
          }
          return out.length ? '<div class="view-title"><b>which list is each row?</b></div>' + out.join('') : ''
        },
      },
    ],
    vars: false,
  },
  'py-mutate-arg': {
    title: 'Functions get references too',
    code: py`
      def add_item(items, x):
          items.append(x)    #: items is the caller's list → the caller sees this change
          x = 100            #: this only re-labels the LOCAL name x
          return None

      nums = [1, 2]
      n = 5
      add_item(nums, n)
      print(nums, n)
    `,
    views: [l01RefsView(['nums', 'n', 'items', 'x'])],
  },
  'py-dict-count': {
    title: 'Counting with a dict',
    code: py`
      word = "banana"
      counts = {}
      for ch in word:
          counts[ch] = counts.get(ch, 0) + 1    #: counts['{ch}'] = {counts.get(ch, 0)} + 1 = {counts.get(ch, 0) + 1}
      print(counts)
    `,
    views: [
      { type: 'array', var: 'word' },
      { type: 'dict', var: 'counts', hot: (s) => s.v('ch'), keyLabel: 'char', valLabel: 'count' },
    ],
  },
  'py-class-node': {
    title: 'A class and objects that point to each other',
    code: py`
      class Node:
          def __init__(self, val, next=None):
              self.val = val
              self.next = next

      third = Node(3)
      second = Node(2, third)
      first = Node(1, second)

      node = first
      while node is not None:     #: node is {'None → stop' if node is None else 'Node(' + str(node.val) + ') → keep going'}
          print(node.val)
          node = node.next        #: follow the arrow: node = node.next
    `,
    views: [{ type: 'linked', vars: ['node', 'first', 'second', 'third'], label: 'objects in memory' }],
  },
})

addProblems({
  'py-vowels': {
    title: 'Count vowels',
    level: 'Easy',
    pattern: 'Loop + condition',
    prompt: '<p>Return how many vowels (<code>a e i o u</code>, upper or lower case) are in the string <code>s</code>.</p>',
    fn: 'count_vowels',
    starter: py`
      def count_vowels(s):
          # TODO: loop over the characters of s
          pass
    `,
    tests: [
      { args: ['hello'], expect: 2 },
      { args: ['PYTHON'], expect: 1 },
      { args: [''], expect: 0 },
      { args: ['Queue Up'], expect: 5 },
      { args: ['rhythm'], expect: 0 },
    ],
    hints: ['<code>for ch in s:</code> loops over characters.', '<code>ch.lower() in "aeiou"</code> is <code>True</code> for a vowel.'],
    solution: py`
      def count_vowels(s):
          count = 0
          for ch in s:
              if ch.lower() in "aeiou":
                  count += 1
          return count
    `,
    explain: '<p>One-liner version: <code>return sum(1 for ch in s if ch.lower() in "aeiou")</code>. Both are O(n).</p>',
  },
  'py-minmax': {
    title: 'Smallest and largest',
    level: 'Easy',
    pattern: '"So far" variables',
    prompt: '<p>Return a list <code>[smallest, largest]</code> of the numbers in <code>nums</code> (it has at least one number). Don\'t use <code>min()</code> or <code>max()</code> — use one loop.</p>',
    fn: 'smallest_and_largest',
    starter: py`
      def smallest_and_largest(nums):
          # TODO
          return [0, 0]
    `,
    tests: [
      { args: [[3, 9, 2, 12, 5]], expect: [2, 12] },
      { args: [[7]], expect: [7, 7] },
      { args: [[-1, -8, -3]], expect: [-8, -1] },
      { args: [[4, 4, 4]], expect: [4, 4] },
    ],
    hints: ['Start both "so far" values at <code>nums[0]</code> (not at 0 — what if every number is negative?).', 'For each number, update <code>low</code> if it is smaller and <code>high</code> if it is bigger.'],
    solution: py`
      def smallest_and_largest(nums):
          low = high = nums[0]
          for x in nums:
              if x < low:
                  low = x
              if x > high:
                  high = x
          return [low, high]
    `,
    explain: '<p>Starting at <code>nums[0]</code> (or <code>float("inf")</code> / <code>float("-inf")</code>) avoids the "everything is negative" bug.</p>',
  },
  'py-reverse-words': {
    title: 'Reverse the words',
    level: 'Easy',
    pattern: 'split / join',
    prompt: '<p>Given a sentence with words separated by single spaces, return the words in reverse order. <code>"I love Python"</code> → <code>"Python love I"</code>.</p>',
    fn: 'reverse_words',
    starter: py`
      def reverse_words(sentence):
          # TODO: split → reverse → join
          return sentence
    `,
    tests: [
      { args: ['I love Python'], expect: 'Python love I' },
      { args: ['hello'], expect: 'hello' },
      { args: ['a b c d'], expect: 'd c b a' },
    ],
    hints: ['<code>sentence.split()</code> gives a list of words.', '<code>words[::-1]</code> is the reversed list; <code>" ".join(list)</code> glues strings together with spaces.'],
    solution: py`
      def reverse_words(sentence):
          words = sentence.split()
          return " ".join(words[::-1])
    `,
    explain: '<p><code>split</code>, slicing and <code>join</code> are everywhere in string problems. Dart: <code>sentence.split(" ").reversed.join(" ")</code>.</p>',
  },
  'py-even-squares': {
    title: 'Squares of the even numbers',
    level: 'Easy',
    pattern: 'List comprehension',
    prompt: '<p>Return a list with the square of every <b>even</b> number in <code>nums</code>, in the same order. Try writing it as <b>one</b> list comprehension.</p>',
    fn: 'even_squares',
    starter: py`
      def even_squares(nums):
          # TODO: [ ... for x in nums if ... ]
          return []
    `,
    tests: [
      { args: [[1, 2, 3, 4]], expect: [4, 16] },
      { args: [[]], expect: [] },
      { args: [[5, 7]], expect: [] },
      { args: [[-2, 0, 10]], expect: [4, 0, 100] },
    ],
    hints: ['Shape: <code>[expression for x in nums if condition]</code>.', '<code>[x * x for x in nums if x % 2 == 0]</code>'],
    solution: py`
      def even_squares(nums):
          return [x * x for x in nums if x % 2 == 0]
    `,
    explain: '<p>Dart equivalent: <code>nums.where((x) =&gt; x.isEven).map((x) =&gt; x * x).toList()</code>.</p>',
  },
  'py-char-count': {
    title: 'Character counts',
    level: 'Easy',
    pattern: 'dict counting',
    prompt: '<p>Return a dict that maps each character of <code>s</code> to how many times it appears.</p>',
    fn: 'char_count',
    starter: py`
      def char_count(s):
          counts = {}
          # TODO
          return counts
    `,
    tests: [
      { args: ['banana'], expect: { b: 1, a: 3, n: 2 } },
      { args: [''], expect: {} },
      { args: ['aaa'], expect: { a: 3 } },
      { args: ['abcab'], expect: { a: 2, b: 2, c: 1 } },
    ],
    hints: ['Watch the "Counting with a dict" visualizer again.', '<code>counts[ch] = counts.get(ch, 0) + 1</code>'],
    solution: py`
      def char_count(s):
          counts = {}
          for ch in s:
              counts[ch] = counts.get(ch, 0) + 1
          return counts
    `,
    explain: '<p>Shortcut you\'ll use a lot: <code>from collections import Counter</code> then <code>Counter(s)</code> does exactly this.</p>',
  },
  'py-unique-sorted': {
    title: 'Unique values, sorted',
    level: 'Easy',
    pattern: 'set + sorted',
    prompt: '<p>Return the different values of <code>nums</code>, sorted from small to big.</p>',
    fn: 'unique_sorted',
    starter: py`
      def unique_sorted(nums):
          # TODO
          return nums
    `,
    tests: [
      { args: [[3, 1, 3, 2, 1]], expect: [1, 2, 3] },
      { args: [[]], expect: [] },
      { args: [[5, 5, 5]], expect: [5] },
      { args: [[10, -1, 7]], expect: [-1, 7, 10] },
    ],
    hints: ['<code>set(nums)</code> removes duplicates (but a set has no order).', '<code>sorted(...)</code> returns a new sorted <b>list</b>.'],
    solution: py`
      def unique_sorted(nums):
          return sorted(set(nums))
    `,
    explain: '<p><code>set()</code> is O(n), <code>sorted()</code> is O(k log k) for k unique values.</p>',
  },
  'py-second-largest': {
    title: 'Second largest (different) value',
    level: 'Easy',
    pattern: '"So far" variables',
    prompt: '<p>Return the second largest <b>different</b> value in <code>nums</code>, or <code>None</code> if there isn\'t one. <code>[5, 1, 5, 3]</code> → <code>3</code>. Try it in one pass, without sorting.</p>',
    fn: 'second_largest',
    starter: py`
      def second_largest(nums):
          # TODO: keep two "so far" variables: first and second
          return None
    `,
    tests: [
      { args: [[5, 1, 5, 3]], expect: 3 },
      { args: [[1, 2]], expect: 1 },
      { args: [[7, 7, 7]], expect: null },
      { args: [[]], expect: null },
      { args: [[-3, -1, -2]], expect: -2 },
      { args: [[2, 9, 4, 9, 8]], expect: 8 },
    ],
    hints: [
      'Use <code>first = second = None</code> (or <code>float("-inf")</code>).',
      'For each x: if x is bigger than <code>first</code>, the old first becomes second. Else if x is between them (and not equal to first), it becomes second.',
      'Careful with equal values: <code>x == first</code> should change nothing.',
    ],
    solution: py`
      def second_largest(nums):
          first = second = None
          for x in nums:
              if first is None or x > first:
                  second = first
                  first = x
              elif x != first and (second is None or x > second):
                  second = x
          return second
    `,
    explain: '<p>Using <code>None</code> as "nothing yet" and checking with <code>is None</code> is very Pythonic. O(n) time, O(1) space.</p>',
  },
  'py-transpose': {
    title: 'Transpose a matrix',
    level: 'Easy',
    pattern: '2-D lists',
    prompt: '<p>Return the transpose of <code>matrix</code>: row <code>r</code>, column <code>c</code> moves to row <code>c</code>, column <code>r</code>. The matrix can be non-square.</p>',
    fn: 'transpose',
    starter: py`
      def transpose(matrix):
          rows, cols = len(matrix), len(matrix[0])
          # TODO: build a cols x rows result (careful with the 2-D list trap!)
          return []
    `,
    tests: [
      { args: [[[1, 2, 3], [4, 5, 6]]], expect: [[1, 4], [2, 5], [3, 6]] },
      { args: [[[1]]], expect: [[1]] },
      { args: [[[1, 2], [3, 4]]], expect: [[1, 3], [2, 4]] },
    ],
    hints: ['Create the result with a comprehension: <code>[[0] * rows for _ in range(cols)]</code>.', 'Two loops: <code>result[c][r] = matrix[r][c]</code>.'],
    solution: py`
      def transpose(matrix):
          rows, cols = len(matrix), len(matrix[0])
          result = [[0] * rows for _ in range(cols)]
          for r in range(rows):
              for c in range(cols):
                  result[c][r] = matrix[r][c]
          return result
    `,
    explain: '<p>Pythonic one-liner: <code>[list(col) for col in zip(*matrix)]</code> — <code>zip(*m)</code> groups the 1st items, the 2nd items, …</p>',
  },
  'py-wallet': {
    title: 'Design a Wallet class',
    level: 'Easy',
    pattern: 'Classes',
    prompt: `<p>Write a class <code>Wallet</code>:</p><ul>
      <li><code>Wallet(start)</code> creates a wallet with <code>start</code> money,</li>
      <li><code>deposit(amount)</code> adds money (returns nothing),</li>
      <li><code>withdraw(amount)</code> takes money out and returns <code>True</code>, or returns <code>False</code> (and changes nothing) if there isn't enough,</li>
      <li><code>balance()</code> returns the money in the wallet.</li></ul>
      <p>The tests use LeetCode's "design" format: a list of method names and a list of their arguments. The first one creates the object.</p>`,
    fn: 'Wallet',
    starter: py`
      class Wallet:
          def __init__(self, start):
              # TODO: store the money on self
              pass

          def deposit(self, amount):
              pass

          def withdraw(self, amount):
              pass

          def balance(self):
              pass
    `,
    tests: [
      { ops: ['Wallet', 'deposit', 'withdraw', 'withdraw', 'balance'], args: [[10], [5], [20], [3], []], expect: [null, null, false, true, 12] },
      { ops: ['Wallet', 'balance', 'withdraw', 'balance'], args: [[0], [], [1], []], expect: [null, 0, false, 0] },
      { ops: ['Wallet', 'withdraw', 'balance'], args: [[50], [50], []], expect: [null, true, 0] },
    ],
    hints: ['In <code>__init__</code>: <code>self.money = start</code>. Every method reads and changes <code>self.money</code>.', '<code>withdraw</code>: <code>if amount &gt; self.money: return False</code>, otherwise subtract and <code>return True</code>.'],
    solution: py`
      class Wallet:
          def __init__(self, start):
              self.money = start

          def deposit(self, amount):
              self.money += amount

          def withdraw(self, amount):
              if amount > self.money:
                  return False
              self.money -= amount
              return True

          def balance(self):
              return self.money
    `,
    explain: '<p>Dart → Python: the constructor is <code>__init__</code>, and you write <code>self.</code> everywhere (Dart lets you skip <code>this.</code>). Every method takes <code>self</code> as its first parameter.</p>',
  },
})

addQuiz({
  'py-quiz': [
    { q: 'What does this print?', code: 'nums = [10, 20, 30, 40, 50]\nprint(nums[1:3], nums[-1])', options: ['<code>[20, 30] 50</code>', '<code>[20, 30, 40] 50</code>', '<code>[10, 20, 30] 40</code>', '<code>[20, 30] 10</code>'], answer: 0, why: 'A slice <code>[start:stop]</code> includes start and excludes stop. <code>-1</code> is the last element.' },
    { q: 'What is <code>7 // 2</code> and <code>7 % 2</code>?', options: ['3.5 and 1', '3 and 1', '3 and 0.5', '4 and 1'], answer: 1, why: '<code>//</code> is whole-number division (Dart: <code>~/</code>), <code>%</code> is the remainder. You\'ll use <code>mid = (lo + hi) // 2</code> a lot.' },
    { q: 'What does this print?', code: 'a = [1, 2]\nb = a\nb.append(3)\nprint(a)', options: ['<code>[1, 2]</code>', '<code>[1, 2, 3]</code>', 'An error', '<code>[3]</code>'], answer: 1, why: '<code>b = a</code> doesn\'t copy. Both names point to the same list.' },
    { q: 'Which values does <code>range(2, 10, 3)</code> give?', options: ['2, 5, 8', '2, 5, 8, 11', '3, 6, 9', '2, 3, 4 … 10'], answer: 0, why: 'Start at 2, step 3, stop <i>before</i> 10.' },
    { q: '<code>counts</code> is a dict. Which line adds 1 to the count of <code>ch</code>, even if <code>ch</code> is not in the dict yet?', options: ['<code>counts[ch] += 1</code>', '<code>counts[ch] = counts.get(ch, 0) + 1</code>', '<code>counts.add(ch)</code>', '<code>counts.append(ch)</code>'], answer: 1, why: '<code>counts[ch] += 1</code> raises <code>KeyError</code> when <code>ch</code> is new. <code>.get(ch, 0)</code> returns 0 for a missing key.' },
    { q: 'Which is the right way to check for "no value"?', options: ['<code>if x == null:</code>', '<code>if x is None:</code>', '<code>if x === None:</code>', '<code>if not defined(x):</code>'], answer: 1, why: 'Python\'s <code>null</code> is <code>None</code>, and you compare with <code>is</code>.' },
    { q: 'You need a 3×3 grid of zeros. Which line is correct?', options: ['<code>[[0] * 3] * 3</code>', '<code>[[0] * 3 for _ in range(3)]</code>', 'Both are fine', '<code>[0, 0, 0] * 3</code>'], answer: 1, why: 'The first one has 3 references to <b>one</b> row (see the trap visualizer).' },
  ],
})
