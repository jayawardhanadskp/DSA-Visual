// Lesson 10 — Recursion
addViz({
  'rec-factorial': {
    title: 'factorial(4): calls go down, answers come back up',
    code: py`
      def factorial(n):
          if n <= 1:                     #: base case? n = {n} → {'YES — stop and return 1' if n <= 1 else 'no — ask a smaller question'}
              return 1
          return n * factorial(n - 1)    #: {n} × factorial({n - 1}) … this call must WAIT for factorial({n - 1}) to answer

      print(factorial(4))
    `,
    views: [{ type: 'calltree', fn: 'factorial' }],
  },
  'rec-sum': {
    title: 'Sum of a list, recursively',
    code: py`
      def total(nums):
          if not nums:                       #: is the list empty? {'yes → the sum of nothing is 0' if not nums else 'no'}
              return 0
          return nums[0] + total(nums[1:])   #: {nums[0]} + (sum of the rest: {nums[1:]})

      print(total([3, 1, 4]))
    `,
    views: [{ type: 'calltree', fn: 'total' }],
  },
  'rec-fib': {
    title: 'fib(5): two calls per call → a tree (and repeated work)',
    code: py`
      def fib(n):
          if n < 2:                          #: base case? n = {n} → {'yes, return ' + str(n) if n < 2 else 'no'}
              return n
          return fib(n - 1) + fib(n - 2)

      print(fib(5))
    `,
    views: [{ type: 'calltree', fn: 'fib' }],
    hideGlobals: true,
    wide: true,
  },
  'rec-power': {
    title: 'Fast power: halve the problem → only log n calls',
    code: py`
      def power(x, n):
          if n == 0:
              return 1
          half = power(x, n // 2)        #: x^{n} = x^{n // 2} × x^{n // 2}{' × x' if n % 2 else ''}. Compute x^{n // 2} ONCE
          if n % 2 == 0:
              return half * half
          return half * half * x

      print(power(2, 10))
    `,
    views: [{ type: 'calltree', fn: 'power' }],
  },
})

addProblems({
  'rec-factorial': {
    title: 'Factorial',
    level: 'Easy',
    pattern: 'Recursion',
    prompt: '<p>Return <code>n! = n × (n−1) × … × 1</code> using recursion (no loop). <code>0! = 1</code>.</p>',
    fn: 'factorial',
    starter: py`
      def factorial(n):
          # 1. base case:     when can you answer without recursion?
          # 2. smaller step:  which smaller factorial helps?
          # 3. combine
          pass
    `,
    tests: [
      { args: [0], expect: 1 },
      { args: [1], expect: 1 },
      { args: [5], expect: 120 },
      { args: [10], expect: 3628800 },
    ],
    views: [{ type: 'calltree', fn: 'factorial' }],
    hints: ['Base case: <code>n &lt;= 1</code> → 1.', '<code>return n * factorial(n - 1)</code>'],
    solution: py`
      def factorial(n):
          if n <= 1:
              return 1
          return n * factorial(n - 1)
    `,
    explain: '<p>O(n) time and O(n) space — every waiting call sits on the call stack.</p>',
  },
  'rec-digits': {
    title: 'Sum of digits',
    level: 'Easy',
    pattern: 'Recursion',
    prompt: '<p>Return the sum of the digits of a non-negative integer, recursively. <code>1234</code> → <code>10</code>. Hint: <code>n % 10</code> is the last digit, <code>n // 10</code> removes it.</p>',
    fn: 'sum_digits',
    starter: py`
      def sum_digits(n):
          pass
    `,
    tests: [
      { args: [0], expect: 0 },
      { args: [7], expect: 7 },
      { args: [1234], expect: 10 },
      { args: [9999], expect: 36 },
      { args: [1000000], expect: 1 },
    ],
    views: [{ type: 'calltree', fn: 'sum_digits' }],
    hints: ['Base case: a one-digit number (<code>n &lt; 10</code>) is its own digit sum.', '<code>return n % 10 + sum_digits(n // 10)</code>'],
    solution: py`
      def sum_digits(n):
          if n < 10:
              return n
          return n % 10 + sum_digits(n // 10)
    `,
    explain: '<p>The number of calls = number of digits = O(log₁₀ n).</p>',
  },
  'rec-reverse': {
    title: 'Reverse a string recursively',
    level: 'Easy',
    pattern: 'Recursion',
    prompt: '<p>Return <code>s</code> reversed, using recursion (no slicing with <code>[::-1]</code>, no loops).</p>',
    fn: 'reverse_string',
    starter: py`
      def reverse_string(s):
          pass
    `,
    tests: [
      { args: ['hello'], expect: 'olleh' },
      { args: [''], expect: '' },
      { args: ['a'], expect: 'a' },
      { args: ['ab'], expect: 'ba' },
    ],
    views: [{ type: 'calltree', fn: 'reverse_string' }],
    hints: ['The reverse of "hello" is (reverse of "ello") + "h".', 'Base case: an empty string (or one character) is its own reverse.'],
    solution: py`
      def reverse_string(s):
          if len(s) <= 1:
              return s
          return reverse_string(s[1:]) + s[0]
    `,
    explain: '<p>Correct, but O(n²) because every slice <code>s[1:]</code> copies the string. Good to notice in an interview: recursion on slices has a hidden cost. Passing an index instead avoids the copies.</p>',
  },
  'rec-palindrome': {
    title: 'Palindrome, recursively',
    level: 'Easy',
    pattern: 'Recursion (two ends)',
    prompt: '<p>Return <code>True</code> if <code>s</code> reads the same backwards. Use recursion with indexes: write a helper <code>check(left, right)</code>.</p>',
    fn: 'is_pal',
    starter: py`
      def is_pal(s):
          def check(left, right):
              # TODO
              pass
          return check(0, len(s) - 1)
    `,
    tests: [
      { args: ['racecar'], expect: true },
      { args: ['ab'], expect: false },
      { args: [''], expect: true },
      { args: ['a'], expect: true },
      { args: ['abca'], expect: false },
      { args: ['abba'], expect: true },
    ],
    views: [{ type: 'calltree', fn: 'check' }, { type: 'array', var: 's', pointers: ['left', 'right'] }],
    hints: ['Base case: <code>left &gt;= right</code> → True (0 or 1 characters left).', 'If <code>s[left] != s[right]</code> → False. Otherwise ask <code>check(left + 1, right - 1)</code>.'],
    solution: py`
      def is_pal(s):
          def check(left, right):
              if left >= right:
                  return True
              if s[left] != s[right]:
                  return False
              return check(left + 1, right - 1)
          return check(0, len(s) - 1)
    `,
    explain: '<p>This is the two-pointer loop from lesson 05, written as recursion. Any loop can be written as recursion and vice versa.</p>',
  },
  'rec-fib': {
    title: 'Fibonacci',
    level: 'Easy',
    pattern: 'Recursion (two branches)',
    leetcode: '509. Fibonacci Number',
    prompt: '<p><code>fib(0) = 0</code>, <code>fib(1) = 1</code>, <code>fib(n) = fib(n−1) + fib(n−2)</code>. Return <code>fib(n)</code>. The plain recursion works up to about n = 25; in lesson 17 you\'ll make it instant.</p>',
    fn: 'fib',
    starter: py`
      def fib(n):
          pass
    `,
    tests: [
      { args: [0], expect: 0 },
      { args: [1], expect: 1 },
      { args: [2], expect: 1 },
      { args: [10], expect: 55 },
      { args: [20], expect: 6765 },
    ],
    views: [{ type: 'calltree', fn: 'fib' }],
    hints: ['Two base cases: n is 0 or 1 → return n.'],
    solution: py`
      def fib(n):
          if n < 2:
              return n
          return fib(n - 1) + fib(n - 2)
    `,
    explain: '<p>O(2ⁿ) — the call tree doubles every level. fib(20) makes 21,891 calls! Lesson 17 (dynamic programming) fixes this with memory.</p>',
  },
  'rec-pow': {
    title: 'Pow(x, n)',
    level: 'Medium',
    pattern: 'Divide in half',
    leetcode: '50. Pow(x, n)',
    prompt: '<p>Return <code>x</code> to the power <code>n</code> (n can be negative, and as big as 2³¹ − 1). Don\'t use <code>**</code> or <code>pow</code>. A loop or "x × pow(x, n − 1)" is far too slow (or too deep) for the last test.</p>',
    fn: 'my_pow',
    compare: 'float',
    starter: py`
      def my_pow(x, n):
          pass
    `,
    tests: [
      { args: [2.0, 10], expect: 1024.0 },
      { args: [2.1, 3], expect: 9.261 },
      { args: [2.0, -2], expect: 0.25 },
      { args: [5.0, 0], expect: 1.0 },
      { args: [-2.0, 3], expect: -8.0 },
      { args: [1.0, 2147483647], expect: 1.0 },
    ],
    views: [{ type: 'calltree', fn: 'my_pow' }],
    hints: ['Negative n: <code>x^-n = 1 / x^n</code>.', 'x^n = (x^(n//2))², times one more x if n is odd. Compute the half <b>once</b> and store it.', 'That gives about log₂(n) ≈ 31 calls even for n = 2³¹.'],
    solution: py`
      def my_pow(x, n):
          if n < 0:
              return 1 / my_pow(x, -n)
          if n == 0:
              return 1.0
          half = my_pow(x, n // 2)
          if n % 2 == 0:
              return half * half
          return half * half * x
    `,
    explain: '<p>O(log n). Writing <code>my_pow(x, n // 2) * my_pow(x, n // 2)</code> (two calls) would bring back O(n) — always store the half.</p>',
  },
  'rec-flatten': {
    title: 'Flatten a nested list',
    level: 'Medium',
    pattern: 'Recursion on structure',
    prompt: '<p>The input is a list whose items are numbers or other (nested) lists. Return all numbers in one flat list, in order. <code>[1, [2, [3, 4]], 5]</code> → <code>[1, 2, 3, 4, 5]</code>.</p>',
    fn: 'flatten',
    starter: py`
      def flatten(nested):
          result = []
          # TODO: isinstance(item, list) tells you if item is a list
          return result
    `,
    tests: [
      { args: [[1, [2, [3, 4]], 5]], expect: [1, 2, 3, 4, 5] },
      { args: [[]], expect: [] },
      { args: [[[[]]]], expect: [] },
      { args: [[[1], [2, [3]], [[4]]]], expect: [1, 2, 3, 4] },
      { args: [[7]], expect: [7] },
    ],
    views: [{ type: 'calltree', fn: 'flatten', label: (s) => 'flatten(' + s.fmt(s.raw('nested')) + ')' }],
    hints: ['For each item: if it\'s a number, append it. If it\'s a list, flatten <i>that</i> list (recursion!) and add all its items.', '<code>result.extend(flatten(item))</code>'],
    solution: py`
      def flatten(nested):
          result = []
          for item in nested:
              if isinstance(item, list):
                  result.extend(flatten(item))
              else:
                  result.append(item)
          return result
    `,
    explain: '<p>When the <b>data</b> is recursive (lists inside lists, folders inside folders, widgets inside widgets!), the code is naturally recursive. Trees (lesson 13) are exactly this.</p>',
  },
  'rec-hanoi': {
    title: 'Tower of Hanoi',
    level: 'Medium',
    pattern: 'Trust the recursion',
    prompt: '<p>Move <code>n</code> disks from peg <code>"A"</code> to peg <code>"C"</code> using <code>"B"</code>. Only one disk moves at a time, and a bigger disk can never sit on a smaller one. Return the list of moves as <code>[from, to]</code> pairs.</p>',
    fn: 'hanoi',
    starter: py`
      def hanoi(n):
          moves = []

          def move(k, src, dst, via):
              # TODO: move k disks from src to dst
              pass

          move(n, "A", "C", "B")
          return moves
    `,
    tests: [
      { args: [0], expect: [] },
      { args: [1], expect: [['A', 'C']] },
      { args: [2], expect: [['A', 'B'], ['A', 'C'], ['B', 'C']] },
      { args: [3], expect: [['A', 'C'], ['A', 'B'], ['C', 'B'], ['A', 'C'], ['B', 'A'], ['B', 'C'], ['A', 'C']] },
    ],
    views: [{ type: 'calltree', fn: 'move' }, { type: 'array', var: 'moves' }],
    hints: [
      'Don\'t think about all the moves. Trust that <code>move(k - 1, …)</code> works.',
      'To move k disks from src to dst: move the top k−1 out of the way (src → via), move the biggest disk (src → dst), move the k−1 back on top (via → dst).',
      'Base case: k == 0 → do nothing.',
    ],
    solution: py`
      def hanoi(n):
          moves = []

          def move(k, src, dst, via):
              if k == 0:
                  return
              move(k - 1, src, via, dst)
              moves.append([src, dst])
              move(k - 1, via, dst, src)

          move(n, "A", "C", "B")
          return moves
    `,
    explain: '<p>2ⁿ − 1 moves. The famous lesson of Hanoi: you can\'t follow the whole process in your head — and you don\'t need to. Define what the function does, trust it for smaller inputs, handle the base case.</p>',
  },
})

addQuiz({
  'rec-quiz': [
    { q: 'What happens without a base case?', code: 'def count(n):\n    return count(n - 1)', options: ['It returns 0', 'RecursionError: maximum recursion depth exceeded', 'Infinite loop forever', 'SyntaxError'], answer: 1, why: 'Each call waits on the call stack; Python stops at about 1000 levels.' },
    { q: 'What does this print?', code: 'def f(n):\n    if n == 0:\n        return\n    print(n)\n    f(n - 1)\n    print(n)\nf(2)', options: ['2 1 1 2', '2 1 2 1', '1 2 2 1', '2 1'], answer: 0, why: 'Code before the recursive call runs on the way down (2, 1); code after it runs on the way back up (1, 2). Step through it with ✏️ Edit &amp; visualize if unsure!' },
    { q: 'What is the space complexity of <code>factorial(n)</code> (recursive)?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, why: 'n calls wait on the call stack at the same time.' },
    { q: 'Why is naive <code>fib(n)</code> so slow?', options: ['Recursion is slow in Python', 'It solves the same sub-problems again and again (O(2ⁿ) calls)', 'Integer addition is slow', 'It isn\'t slow'], answer: 1, why: 'Look at the call tree: fib(3) is computed twice, fib(2) three times… Memoization (lesson 17) fixes it.' },
    { q: 'The 3 questions for writing any recursive function are…', options: ['loop, condition, return', 'base case, smaller sub-problem, how to combine', 'input, output, print', 'stack, queue, heap'], answer: 1, why: 'Answer these three and the code almost writes itself.' },
  ],
})
