// Lesson 08 — Stacks & queues
addViz({
  'st-parens': {
    title: 'Stack: matching brackets',
    code: py`
      def is_valid(s):
          pairs = {")": "(", "]": "[", "}": "{"}
          stack = []
          for i, ch in enumerate(s):
              if ch in "([{":
                  stack.append(ch)                          #: '{ch}' opens something → push it on the stack
              else:
                  if not stack or stack[-1] != pairs[ch]:   #: '{ch}' closes. The top of the stack is {repr(stack[-1]) if stack else 'nothing'} → {'it matches ✓' if stack and stack[-1] == pairs[ch] else 'NO MATCH ✗'}
                      return False
                  stack.pop()                               #: matched → pop '{stack[-1]}' off the stack
          return len(stack) == 0                            #: anything still open? {len(stack)} item(s) left → {'valid' if not stack else 'invalid'}

      print(is_valid("{[()()]}"))
    `,
    views: [
      { type: 'array', var: 's', pointers: ['i'] },
      { type: 'stack', var: 'stack' },
    ],
  },
  'st-temps': {
    title: 'Monotonic stack: days until a warmer day',
    code: py`
      def daily_temperatures(temps):
          answer = [0] * len(temps)
          stack = []                                     # indexes of days still waiting for a warmer day
          for i, t in enumerate(temps):
              while stack and temps[stack[-1]] < t:      #: {('is today (' + str(t) + '°) warmer than day ' + str(stack[-1]) + ' (' + str(temps[stack[-1]]) + '°)? ' + ('YES → day ' + str(stack[-1]) + ' found its answer' if temps[stack[-1]] < t else 'no → stop')) if stack else 'stack is empty → nothing is waiting'}
                  j = stack.pop()
                  answer[j] = i - j                      #: day {j} waited {i} − {j} = {i - j} day(s)
              stack.append(i)                            #: day {i} ({t}°) now waits on the stack
          return answer

      print(daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]))
    `,
    views: [
      { type: 'array', var: 'temps', pointers: ['i', 'j'], cls: (s) => Object.fromEntries((s.v('stack') || []).map((k) => [k, 'hot'])), bars: true },
      { type: 'stack', var: 'stack', label: 'stack (day indexes, temperatures go down from bottom to top)' },
      { type: 'array', var: 'answer' },
    ],
    wide: true,
  },
  'q-round-robin': {
    title: 'Queue: first in, first out (round robin)',
    code: py`
      from collections import deque

      def round_robin(jobs, slice_size):
          queue = deque(jobs)                            # items are (name, time_left)
          order = []
          while queue:
              name, left = queue.popleft()               #: take {queue[0][0]!r} from the FRONT (O(1) with deque)
              if left > slice_size:
                  queue.append((name, left - slice_size))   #: {name!r} needs {left} > {slice_size} → work {slice_size}, then go to the BACK with {left - slice_size} left
              else:
                  order.append(name)                     #: {name!r} needs only {left} → finished!
          return order

      print(round_robin([("A", 3), ("B", 1), ("C", 4)], 2))
    `,
    views: [
      { type: 'queue', var: 'queue' },
      { type: 'array', var: 'order', label: 'finish order' },
    ],
  },
})

addProblems({
  'st-valid': {
    title: 'Valid parentheses',
    level: 'Easy',
    pattern: 'Stack',
    leetcode: '20. Valid Parentheses',
    prompt: '<p><code>s</code> contains only <code>()[]{}</code>. Return <code>True</code> if every bracket is closed by the same type, in the right order.</p>',
    fn: 'is_valid',
    starter: py`
      def is_valid(s):
          # TODO
          return False
    `,
    tests: [
      { args: ['()'], expect: true },
      { args: ['()[]{}'], expect: true },
      { args: ['(]'], expect: false },
      { args: ['([)]'], expect: false },
      { args: ['{[]}'], expect: true },
      { args: [''], expect: true },
      { args: ['(('], expect: false },
      { args: [')('], expect: false },
    ],
    views: [{ type: 'array', var: 's', pointers: ['i'] }, { type: 'stack', var: 'stack' }],
    hints: ['Opening bracket → push. Closing bracket → the top of the stack must be its partner.', 'Two ways to fail: a closing bracket when the stack is empty / wrong type, or brackets left on the stack at the end.'],
    solution: py`
      def is_valid(s):
          pairs = {")": "(", "]": "[", "}": "{"}
          stack = []
          for ch in s:
              if ch in pairs:
                  if not stack or stack.pop() != pairs[ch]:
                      return False
              else:
                  stack.append(ch)
          return not stack
    `,
    explain: '<p>The most recently opened bracket must close first — "last in, first out" is exactly a stack. O(n).</p>',
  },
  'st-min-stack': {
    title: 'Min stack (design)',
    level: 'Medium',
    pattern: 'Stack of pairs',
    leetcode: '155. Min Stack',
    prompt: '<p>Design a stack with <code>push(x)</code>, <code>pop()</code>, <code>top()</code> and <code>get_min()</code> — <b>all O(1)</b>. <code>pop</code> returns nothing.</p>',
    fn: 'MinStack',
    starter: py`
      class MinStack:
          def __init__(self):
              self.items = []

          def push(self, x):
              pass

          def pop(self):
              pass

          def top(self):
              pass

          def get_min(self):
              pass
    `,
    tests: [
      { ops: ['MinStack', 'push', 'push', 'push', 'get_min', 'pop', 'top', 'get_min'], args: [[], [-2], [0], [-3], [], [], [], []], expect: [null, null, null, null, -3, null, 0, -2] },
      { ops: ['MinStack', 'push', 'push', 'get_min', 'pop', 'get_min'], args: [[], [5], [5], [], [], []], expect: [null, null, null, 5, null, 5] },
      { ops: ['MinStack', 'push', 'push', 'push', 'get_min', 'pop', 'get_min', 'pop', 'get_min'], args: [[], [3], [1], [2], [], [], [], [], []], expect: [null, null, null, null, 1, null, 1, null, 3] },
    ],
    hints: ['Calling <code>min(self.items)</code> is O(n). Instead, remember the minimum <i>at each level</i> of the stack.', 'Push pairs: <code>(x, min(x, current_min))</code>. Then the min is always <code>self.items[-1][1]</code>.'],
    solution: py`
      class MinStack:
          def __init__(self):
              self.items = []          # (value, min of the stack up to here)

          def push(self, x):
              current = min(x, self.items[-1][1]) if self.items else x
              self.items.append((x, current))

          def pop(self):
              self.items.pop()

          def top(self):
              return self.items[-1][0]

          def get_min(self):
              return self.items[-1][1]
    `,
    explain: '<p>Each level stores the answer for "what is the min if the stack were this tall?". Popping automatically restores the old min.</p>',
  },
  'st-backspace': {
    title: 'Backspace string compare',
    level: 'Easy',
    pattern: 'Stack',
    leetcode: '844. Backspace String Compare',
    prompt: '<p>In <code>s</code> and <code>t</code>, <code>#</code> means "backspace" (delete the previous character, if any). Return <code>True</code> if both give the same final text.</p>',
    fn: 'backspace_compare',
    starter: py`
      def backspace_compare(s, t):
          # TODO
          return False
    `,
    tests: [
      { args: ['ab#c', 'ad#c'], expect: true },
      { args: ['ab##', 'c#d#'], expect: true },
      { args: ['a#c', 'b'], expect: false },
      { args: ['a##c', '#a#c'], expect: true },
      { args: ['xy#z', 'xzz#'], expect: true },
    ],
    hints: ['Write a helper <code>build(text)</code> that types the text into a stack: normal char → push, <code>#</code> → pop if not empty.', 'Compare <code>build(s) == build(t)</code>.'],
    solution: py`
      def backspace_compare(s, t):
          def build(text):
              stack = []
              for ch in text:
                  if ch == "#":
                      if stack:
                          stack.pop()
                  else:
                      stack.append(ch)
              return stack
          return build(s) == build(t)
    `,
    explain: '<p>O(n + m). (An O(1)-space version walks both strings backwards with two pointers — a nice follow-up.)</p>',
  },
  'st-rpn': {
    title: 'Evaluate reverse Polish notation',
    level: 'Medium',
    pattern: 'Stack',
    leetcode: '150. Evaluate Reverse Polish Notation',
    prompt: '<p>Evaluate an expression in postfix form: <code>["2", "1", "+", "3", "*"]</code> means <code>(2 + 1) * 3 = 9</code>. Operators: <code>+ - * /</code>. Division truncates toward zero (use <code>int(a / b)</code>).</p>',
    fn: 'eval_rpn',
    starter: py`
      def eval_rpn(tokens):
          # TODO
          return 0
    `,
    tests: [
      { args: [['2', '1', '+', '3', '*']], expect: 9 },
      { args: [['4', '13', '5', '/', '+']], expect: 6 },
      { args: [['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']], expect: 22 },
      { args: [['7']], expect: 7 },
      { args: [['3', '-4', '/']], expect: 0 },
    ],
    views: [{ type: 'stack', var: 'stack' }],
    hints: ['Numbers go on a stack. An operator pops two numbers, computes, and pushes the result.', 'Order matters: the first pop is the <b>right</b> operand. <code>b = stack.pop(); a = stack.pop()</code> then <code>a - b</code>.'],
    solution: py`
      def eval_rpn(tokens):
          stack = []
          for tok in tokens:
              if tok in "+-*/":
                  b = stack.pop()
                  a = stack.pop()
                  if tok == "+":
                      stack.append(a + b)
                  elif tok == "-":
                      stack.append(a - b)
                  elif tok == "*":
                      stack.append(a * b)
                  else:
                      stack.append(int(a / b))
              else:
                  stack.append(int(tok))
          return stack[0]
    `,
    explain: '<p>Careful: <code>"-11" in "+-*/"</code> is False (it\'s a 3-char string), so negative numbers work. And <code>-3 // 4</code> is −1 in Python, but the problem wants 0 — hence <code>int(a / b)</code>.</p>',
  },
  'st-my-queue': {
    title: 'Queue using two stacks (design)',
    level: 'Easy',
    pattern: 'Two stacks',
    leetcode: '232. Implement Queue using Stacks',
    prompt: '<p>Implement a FIFO queue with <code>push(x)</code>, <code>pop()</code> (returns the front item), <code>peek()</code> and <code>empty()</code>, using only two lists used as stacks (only <code>append</code> and <code>pop()</code> from the end).</p>',
    fn: 'MyQueue',
    starter: py`
      class MyQueue:
          def __init__(self):
              self.inbox = []
              self.outbox = []

          def push(self, x):
              pass

          def pop(self):
              pass

          def peek(self):
              pass

          def empty(self):
              pass
    `,
    tests: [
      { ops: ['MyQueue', 'push', 'push', 'peek', 'pop', 'empty'], args: [[], [1], [2], [], [], []], expect: [null, null, null, 1, 1, false] },
      { ops: ['MyQueue', 'push', 'pop', 'empty', 'push', 'push', 'pop', 'peek'], args: [[], [5], [], [], [6], [7], [], []], expect: [null, null, 5, true, null, null, 6, 7] },
    ],
    hints: ['Push onto <code>inbox</code>. Pouring <code>inbox</code> into <code>outbox</code> reverses the order, so the oldest item ends on top of <code>outbox</code>.', 'Only pour when <code>outbox</code> is empty.'],
    solution: py`
      class MyQueue:
          def __init__(self):
              self.inbox = []
              self.outbox = []

          def push(self, x):
              self.inbox.append(x)

          def _move(self):
              if not self.outbox:
                  while self.inbox:
                      self.outbox.append(self.inbox.pop())

          def pop(self):
              self._move()
              return self.outbox.pop()

          def peek(self):
              self._move()
              return self.outbox[-1]

          def empty(self):
              return not self.inbox and not self.outbox
    `,
    explain: '<p>Each item is moved at most once from inbox to outbox → amortised O(1) per operation. A classic interview question about amortised cost.</p>',
  },
  'st-recent': {
    title: 'Number of recent calls (design)',
    level: 'Easy',
    pattern: 'Queue (deque)',
    leetcode: '933. Number of Recent Calls',
    prompt: '<p><code>RecentCounter()</code> starts empty. <code>ping(t)</code> records a request at time <code>t</code> (milliseconds, always increasing) and returns how many requests happened in <code>[t − 3000, t]</code>.</p>',
    fn: 'RecentCounter',
    starter: py`
      from collections import deque

      class RecentCounter:
          def __init__(self):
              self.times = deque()

          def ping(self, t):
              # TODO
              return 0
    `,
    tests: [
      { ops: ['RecentCounter', 'ping', 'ping', 'ping', 'ping'], args: [[], [1], [100], [3001], [3002]], expect: [null, 1, 2, 3, 3] },
      { ops: ['RecentCounter', 'ping', 'ping', 'ping'], args: [[], [5000], [9000], [9001]], expect: [null, 1, 1, 2] },
    ],
    hints: ['Append t to the back. Old requests are at the front: remove them while <code>times[0] &lt; t - 3000</code>.', 'Return <code>len(self.times)</code>.'],
    solution: py`
      from collections import deque

      class RecentCounter:
          def __init__(self):
              self.times = deque()

          def ping(self, t):
              self.times.append(t)
              while self.times[0] < t - 3000:
                  self.times.popleft()
              return len(self.times)
    `,
    explain: '<p>A queue is perfect for "a sliding window over time": new things join at the back, old things leave from the front.</p>',
  },
  'st-daily': {
    title: 'Daily temperatures',
    level: 'Medium',
    pattern: 'Monotonic stack',
    leetcode: '739. Daily Temperatures',
    prompt: '<p>For each day, return how many days you wait for a warmer temperature (0 if never). O(n) — the big test has 100,000 days.</p>',
    fn: 'daily_temperatures',
    starter: py`
      def daily_temperatures(temps):
          # TODO
          return []
    `,
    tests: [
      { args: [[73, 74, 75, 71, 69, 72, 76, 73]], expect: [1, 1, 4, 2, 1, 1, 0, 0] },
      { args: [[30, 40, 50, 60]], expect: [1, 1, 1, 0] },
      { args: [[30, 60, 90]], expect: [1, 1, 0] },
      { args: [[50]], expect: [0] },
      { args: [{ __py__: 'list(range(100_000, 0, -1))' }], expect: { __py__: '[0] * 100_000' } },
    ],
    views: [{ type: 'array', var: 'temps', pointers: ['i'] }, { type: 'stack', var: 'stack' }, { type: 'array', var: 'answer' }],
    hints: ['Keep a stack of the indexes of days that haven\'t found a warmer day yet.', 'When today is warmer than the day on top of the stack, that day\'s answer is <code>i - j</code>. Pop and repeat.', 'Then push today.'],
    solution: py`
      def daily_temperatures(temps):
          answer = [0] * len(temps)
          stack = []
          for i, t in enumerate(temps):
              while stack and temps[stack[-1]] < t:
                  j = stack.pop()
                  answer[j] = i - j
              stack.append(i)
          return answer
    `,
    explain: '<p>Each index is pushed once and popped at most once → O(n). The stack\'s temperatures always go down from bottom to top: a <b>monotonic stack</b>.</p>',
  },
  'st-decode': {
    title: 'Decode string',
    level: 'Medium',
    pattern: 'Stack of (previous text, count)',
    leetcode: '394. Decode String',
    prompt: '<p>Decode <code>k[text]</code> as <code>text</code> repeated <code>k</code> times. Brackets can be nested. <code>"3[a2[c]]"</code> → <code>"accaccacc"</code>.</p>',
    fn: 'decode_string',
    starter: py`
      def decode_string(s):
          # TODO
          return ""
    `,
    tests: [
      { args: ['3[a]2[bc]'], expect: 'aaabcbc' },
      { args: ['3[a2[c]]'], expect: 'accaccacc' },
      { args: ['2[abc]3[cd]ef'], expect: 'abcabccdcdcdef' },
      { args: ['abc'], expect: 'abc' },
      { args: ['10[x]'], expect: 'xxxxxxxxxx' },
    ],
    views: [{ type: 'stack', var: 'stack' }],
    hints: [
      'Keep <code>current</code> (text being built) and <code>num</code> (the number being read — it can have several digits).',
      'On <code>[</code>: push <code>(current, num)</code> and start fresh. On <code>]</code>: pop <code>(prev, k)</code> and set <code>current = prev + current * k</code>.',
    ],
    solution: py`
      def decode_string(s):
          stack = []
          current = ""
          num = 0
          for ch in s:
              if ch.isdigit():
                  num = num * 10 + int(ch)
              elif ch == "[":
                  stack.append((current, num))
                  current, num = "", 0
              elif ch == "]":
                  prev, k = stack.pop()
                  current = prev + current * k
              else:
                  current += ch
          return current
    `,
    explain: '<p>Nested structure (brackets inside brackets) is a strong stack signal. The stack remembers "where I was" before going one level deeper — like the call stack in recursion (lesson 10).</p>',
  },
})

addQuiz({
  'st-quiz': [
    { q: 'Which structure is LIFO (last in, first out)?', options: ['Queue', 'Stack', 'Set', 'Heap'], answer: 1, why: 'A stack of plates: you take the one you put on last.' },
    { q: 'You need a FIFO queue in Python with many operations. What do you use?', options: ['<code>list</code> with <code>pop(0)</code>', '<code>collections.deque</code> with <code>append</code> / <code>popleft</code>', 'A set', 'A string'], answer: 1, why: '<code>list.pop(0)</code> is O(n). <code>deque.popleft()</code> is O(1).' },
    { q: 'What is the top of a Python list used as a stack?', options: ['<code>stack[0]</code>', '<code>stack[-1]</code>', '<code>stack.top()</code>', '<code>stack.peek()</code>'], answer: 1, why: 'Push = <code>append</code>, pop = <code>pop()</code>, peek = <code>stack[-1]</code>. Always check <code>if stack</code> first.' },
    { q: '"Next greater element", "days until warmer", "stock span". Which pattern?', options: ['Sliding window', 'Monotonic stack', 'Binary search', 'Prefix sums'], answer: 1, why: 'Things wait on a stack until something bigger arrives and "answers" them.' },
    { q: 'Why is the monotonic stack O(n) even with a <code>while</code> inside the <code>for</code>?', options: ['It isn\'t', 'Each index is pushed once and popped at most once', 'The while runs only once', 'Python optimises it'], answer: 1, why: 'Total pushes ≤ n, total pops ≤ n → at most 2n operations.' },
  ],
})
