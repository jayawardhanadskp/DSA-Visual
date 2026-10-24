// Lesson 16 — Backtracking
const l16Path = (s) => {
  const r = s.raw('path')
  return r !== undefined ? s.fmt(r) : '…'
}

addViz({
  'bt-subsets': {
    title: 'All subsets: choose → explore → un-choose',
    code: py`
      def subsets(nums):
          result = []
          path = []

          def backtrack(start):
              result.append(path[:])            #: record a COPY of the current path: {path}
              for i in range(start, len(nums)):
                  path.append(nums[i])          #: CHOOSE {nums[i]} → path becomes {path + [nums[i]]}
                  backtrack(i + 1)              #: EXPLORE everything that starts with {path}
                  path.pop()                    #: UN-CHOOSE {nums[i]} → path goes back to {path[:-1]}

          backtrack(0)
          return result

      print(subsets([1, 2, 3]))
    `,
    views: [
      { type: 'calltree', fn: 'backtrack', label: l16Path, showReturn: false },
      { type: 'array', var: 'path', label: 'path (current choices)' },
      { type: 'array', var: 'result', label: 'result' },
    ],
    hideGlobals: true,
    wide: true,
  },
  'bt-permutations': {
    title: 'All orderings (permutations)',
    code: py`
      def permutations(nums):
          result = []
          path = []
          used = [False] * len(nums)

          def backtrack():
              if len(path) == len(nums):       #: is the path {path} complete? {'yes → record it' if len(path) == len(nums) else 'not yet'}
                  result.append(path[:])
                  return
              for i in range(len(nums)):
                  if used[i]:
                      continue                 # already in the path
                  used[i] = True
                  path.append(nums[i])         #: choose {nums[i]}
                  backtrack()
                  path.pop()                   #: un-choose {nums[i]}
                  used[i] = False

          backtrack()
          return result

      print(permutations([1, 2, 3]))
    `,
    views: [
      { type: 'calltree', fn: 'backtrack', label: l16Path, showReturn: false },
      { type: 'array', var: 'nums', cls: (s) => Object.fromEntries((s.v('used') || []).map((u, i) => [i, u ? 'done' : ''])) },
      { type: 'array', var: 'path', label: 'path' },
    ],
    hideGlobals: true,
    wide: true,
  },
  'bt-queens': {
    title: '4 queens: place one per row, undo when stuck',
    code: py`
      def solve_queens(n):
          board = [["." for _ in range(n)] for _ in range(n)]
          cols, diag1, diag2 = set(), set(), set()
          solutions = []

          def place(r):
              if r == n:
                  solutions.append(["".join(row) for row in board])   #: all {n} queens are placed → a solution!
                  return
              for c in range(n):
                  if c in cols or r - c in diag1 or r + c in diag2:     #: can a queen stand on ({r}, {c})? {'NO — attacked by an earlier queen' if c in cols or r - c in diag1 or r + c in diag2 else 'yes, it is safe'}
                      continue
                  board[r][c] = "Q"                                     #: place a queen on ({r}, {c}) and go to row {r + 1}
                  cols.add(c)
                  diag1.add(r - c)
                  diag2.add(r + c)
                  place(r + 1)
                  board[r][c] = "."                                     #: back from row {r + 1} → remove the queen at ({r}, {c}) and try the next column
                  cols.remove(c)
                  diag1.remove(r - c)
                  diag2.remove(r + c)

          place(0)
          return solutions

      print(solve_queens(4))
    `,
    maxSteps: 2000,
    views: [{ type: 'grid', var: 'board', indexes: true, classMap: { Q: 'hot' }, hideValues: ['.'], pointer: ['r', 'c'] }],
    hideGlobals: true,
  },
})

addProblems({
  'bt-subsets': {
    title: 'Subsets',
    level: 'Medium',
    pattern: 'Backtracking',
    leetcode: '78. Subsets',
    prompt: '<p>Return all subsets of <code>nums</code> (distinct numbers), in any order.</p>',
    fn: 'subsets',
    compare: 'nested',
    starter: py`
      def subsets(nums):
          result = []
          path = []

          def backtrack(start):
              # TODO
              pass

          backtrack(0)
          return result
    `,
    tests: [
      { args: [[1, 2, 3]], expect: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] },
      { args: [[0]], expect: [[], [0]] },
      { args: [[5, 6]], expect: [[], [5], [6], [5, 6]] },
    ],
    views: [{ type: 'calltree', fn: 'backtrack', label: l16Path, showReturn: false }],
    hints: ['Watch the subsets visualizer — it\'s this problem.', 'Record <code>path[:]</code> (a copy!) at every call. Then for i from start: append, recurse with i + 1, pop.'],
    solution: py`
      def subsets(nums):
          result = []
          path = []

          def backtrack(start):
              result.append(path[:])
              for i in range(start, len(nums)):
                  path.append(nums[i])
                  backtrack(i + 1)
                  path.pop()

          backtrack(0)
          return result
    `,
    explain: '<p>2ⁿ subsets, each copied in O(n) → O(n · 2ⁿ). <code>result.append(path)</code> without the copy would give 8 references to the same (finally empty) list — lesson 01\'s reference trap!</p>',
  },
  'bt-permute': {
    title: 'Permutations',
    level: 'Medium',
    pattern: 'Backtracking with "used"',
    leetcode: '46. Permutations',
    prompt: '<p>Return all orderings of <code>nums</code> (distinct numbers), in any order.</p>',
    fn: 'permute',
    compare: 'outer',
    starter: py`
      def permute(nums):
          result = []
          # TODO
          return result
    `,
    tests: [
      { args: [[1, 2, 3]], expect: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] },
      { args: [[0, 1]], expect: [[0, 1], [1, 0]] },
      { args: [[1]], expect: [[1]] },
    ],
    views: [{ type: 'calltree', fn: 'backtrack', label: l16Path, showReturn: false }],
    hints: ['Base case: the path has all n numbers → record a copy.', 'Loop over <b>all</b> indexes (not from start), skip the ones already used.'],
    solution: py`
      def permute(nums):
          result = []
          path = []
          used = [False] * len(nums)

          def backtrack():
              if len(path) == len(nums):
                  result.append(path[:])
                  return
              for i in range(len(nums)):
                  if not used[i]:
                      used[i] = True
                      path.append(nums[i])
                      backtrack()
                      path.pop()
                      used[i] = False

          backtrack()
          return result
    `,
    explain: '<p>n! permutations → O(n · n!). Subsets loop "from start" (order doesn\'t matter); permutations loop "over everything unused" (order matters).</p>',
  },
  'bt-combine': {
    title: 'Combinations',
    level: 'Medium',
    pattern: 'Backtracking',
    leetcode: '77. Combinations',
    prompt: '<p>Return all ways to choose <code>k</code> numbers from <code>1..n</code> (order inside doesn\'t matter).</p>',
    fn: 'combine',
    compare: 'nested',
    starter: py`
      def combine(n, k):
          result = []
          # TODO
          return result
    `,
    tests: [
      { args: [4, 2], expect: [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]] },
      { args: [1, 1], expect: [[1]] },
      { args: [3, 3], expect: [[1, 2, 3]] },
    ],
    hints: ['Subsets, but only record when the path has exactly k items (and stop going deeper).', 'Optional pruning: stop when not enough numbers are left to reach k.'],
    solution: py`
      def combine(n, k):
          result = []
          path = []

          def backtrack(start):
              if len(path) == k:
                  result.append(path[:])
                  return
              for x in range(start, n + 1):
                  path.append(x)
                  backtrack(x + 1)
                  path.pop()

          backtrack(1)
          return result
    `,
    explain: '<p>(Python can do it with <code>itertools.combinations</code>, but interviews want the backtracking.)</p>',
  },
  'bt-comb-sum': {
    title: 'Combination sum',
    level: 'Medium',
    pattern: 'Backtracking with reuse',
    leetcode: '39. Combination Sum',
    prompt: '<p>Return all unique combinations of <code>candidates</code> (distinct, positive) that sum to <code>target</code>. Each number may be used <b>many times</b>.</p>',
    fn: 'combination_sum',
    compare: 'nested',
    starter: py`
      def combination_sum(candidates, target):
          result = []
          # TODO
          return result
    `,
    tests: [
      { args: [[2, 3, 6, 7], 7], expect: [[2, 2, 3], [7]] },
      { args: [[2, 3, 5], 8], expect: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] },
      { args: [[2], 1], expect: [] },
      { args: [[1], 2], expect: [[1, 1]] },
    ],
    hints: ['Track the remaining amount. remaining == 0 → record. remaining &lt; 0 → stop (prune).', 'To allow reuse, recurse with <code>i</code> (not <code>i + 1</code>). Starting from <code>i</code> also prevents [2,3] and [3,2] duplicates.'],
    solution: py`
      def combination_sum(candidates, target):
          result = []
          path = []

          def backtrack(start, remaining):
              if remaining == 0:
                  result.append(path[:])
                  return
              if remaining < 0:
                  return
              for i in range(start, len(candidates)):
                  path.append(candidates[i])
                  backtrack(i, remaining - candidates[i])
                  path.pop()

          backtrack(0, target)
          return result
    `,
    explain: '<p>Pruning (<code>remaining &lt; 0</code>) cuts whole branches of the tree. Sorting candidates first lets you <code>break</code> even earlier.</p>',
  },
  'bt-letters': {
    title: 'Letter combinations of a phone number',
    level: 'Medium',
    pattern: 'Backtracking over positions',
    leetcode: '17. Letter Combinations of a Phone Number',
    prompt: '<p>Digits 2–9 map to letters like on old phones (2 = abc, 3 = def, …, 7 = pqrs, 9 = wxyz). Return all letter strings the digits could mean (any order). Empty input → <code>[]</code>.</p>',
    fn: 'letter_combinations',
    compare: 'sorted',
    starter: py`
      def letter_combinations(digits):
          phone = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl",
                   "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
          # TODO
          return []
    `,
    tests: [
      { args: ['23'], expect: ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf'] },
      { args: [''], expect: [] },
      { args: ['2'], expect: ['a', 'b', 'c'] },
      { args: ['79'], expect: { __py__: '[a + b for a in "pqrs" for b in "wxyz"]' } },
    ],
    hints: ['One level of recursion per digit. At level i, try every letter of <code>phone[digits[i]]</code>.', 'When the path has <code>len(digits)</code> letters, record <code>"".join(path)</code>.'],
    solution: py`
      def letter_combinations(digits):
          phone = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl",
                   "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
          if not digits:
              return []
          result = []
          path = []

          def backtrack(i):
              if i == len(digits):
                  result.append("".join(path))
                  return
              for letter in phone[digits[i]]:
                  path.append(letter)
                  backtrack(i + 1)
                  path.pop()

          backtrack(0)
          return result
    `,
    explain: '<p>Up to 4ⁿ results. The recursion depth = the number of digits.</p>',
  },
  'bt-parens': {
    title: 'Generate parentheses',
    level: 'Medium',
    pattern: 'Backtracking with rules',
    leetcode: '22. Generate Parentheses',
    prompt: '<p>Return all valid strings of <code>n</code> pairs of parentheses (any order).</p>',
    fn: 'generate_parenthesis',
    compare: 'sorted',
    starter: py`
      def generate_parenthesis(n):
          result = []
          # TODO
          return result
    `,
    tests: [
      { args: [1], expect: ['()'] },
      { args: [2], expect: ['(())', '()()'] },
      { args: [3], expect: ['((()))', '(()())', '(())()', '()(())', '()()()'] },
    ],
    hints: ['Track how many <code>(</code> and <code>)</code> you have used.', 'You may add <code>(</code> if open &lt; n. You may add <code>)</code> only if close &lt; open. Done when the length is 2n.'],
    solution: py`
      def generate_parenthesis(n):
          result = []

          def backtrack(text, open_count, close_count):
              if len(text) == 2 * n:
                  result.append(text)
                  return
              if open_count < n:
                  backtrack(text + "(", open_count + 1, close_count)
              if close_count < open_count:
                  backtrack(text + ")", open_count, close_count + 1)

          backtrack("", 0, 0)
          return result
    `,
    explain: '<p>Only valid choices are ever made, so no checking is needed at the end. Passing <code>text + "("</code> builds a new string, so there is nothing to "un-choose".</p>',
  },
  'bt-word-search': {
    title: 'Word search',
    level: 'Medium',
    pattern: 'Grid backtracking',
    leetcode: '79. Word Search',
    prompt: '<p>Return whether <code>word</code> can be spelled by moving up/down/left/right between letters of <code>board</code>, using each cell at most once.</p>',
    fn: 'exist',
    starter: py`
      def exist(board, word):
          # TODO
          return False
    `,
    tests: [
      { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCCED'], expect: true },
      { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'SEE'], expect: true },
      { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCB'], expect: false },
      { args: [[['a']], 'a'], expect: true },
      { args: [[['a', 'b'], ['c', 'd']], 'abdc'], expect: true },
    ],
    views: [{ type: 'grid', var: 'board', pointer: ['r', 'c'], classMap: { '#': 'mark' } }],
    hints: ['Try every cell as a start. <code>dfs(r, c, i)</code> = can I spell <code>word[i:]</code> starting at (r, c)?', 'Mark the cell as used (e.g. set it to <code>"#"</code>) before recursing, and <b>restore</b> it afterwards — that\'s the un-choose step.'],
    solution: py`
      def exist(board, word):
          rows, cols = len(board), len(board[0])

          def dfs(r, c, i):
              if i == len(word):
                  return True
              if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != word[i]:
                  return False
              saved = board[r][c]
              board[r][c] = "#"                           # choose: mark as used
              found = (dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1) or
                       dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1))
              board[r][c] = saved                         # un-choose
              return found

          return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))
    `,
    explain: '<p>Islands (lesson 15) never un-mark cells; backtracking must, because another path may need that cell.</p>',
  },
  'bt-queens': {
    title: 'N-Queens II (count the solutions)',
    level: 'Hard',
    pattern: 'Backtracking with sets',
    leetcode: '52. N-Queens II',
    prompt: '<p>Return how many ways <code>n</code> queens can be placed on an n × n board so that no two attack each other (same row, column or diagonal).</p>',
    fn: 'total_n_queens',
    starter: py`
      def total_n_queens(n):
          # TODO
          return 0
    `,
    tests: [
      { args: [1], expect: 1 },
      { args: [4], expect: 2 },
      { args: [5], expect: 10 },
      { args: [6], expect: 4 },
      { args: [8], expect: 92 },
    ],
    hints: ['One queen per row: recurse row by row, trying every column.', 'Cells on the same "\\" diagonal share <code>r - c</code>; on the same "/" diagonal they share <code>r + c</code>. Keep three sets.'],
    solution: py`
      def total_n_queens(n):
          cols, diag1, diag2 = set(), set(), set()

          def place(r):
              if r == n:
                  return 1
              count = 0
              for c in range(n):
                  if c in cols or r - c in diag1 or r + c in diag2:
                      continue
                  cols.add(c)
                  diag1.add(r - c)
                  diag2.add(r + c)
                  count += place(r + 1)
                  cols.remove(c)
                  diag1.remove(r - c)
                  diag2.remove(r + c)
              return count

          return place(0)
    `,
    explain: '<p>The sets make "is it attacked?" O(1). Without pruning there would be nⁿ boards to check.</p>',
  },
  'bt-palindromes': {
    title: 'Palindrome partitioning',
    level: 'Medium',
    pattern: 'Backtracking over cut points',
    leetcode: '131. Palindrome Partitioning',
    prompt: '<p>Split <code>s</code> into pieces so that every piece is a palindrome. Return all possible splits (any order).</p>',
    fn: 'partition',
    compare: 'outer',
    starter: py`
      def partition(s):
          result = []
          # TODO
          return result
    `,
    tests: [
      { args: ['aab'], expect: [['a', 'a', 'b'], ['aa', 'b']] },
      { args: ['a'], expect: [['a']] },
      { args: ['abba'], expect: [['a', 'b', 'b', 'a'], ['a', 'bb', 'a'], ['abba']] },
    ],
    hints: ['At position <code>start</code>, try every end: if <code>s[start:end]</code> is a palindrome, choose it and recurse from <code>end</code>.', 'When start reaches len(s), record the path.'],
    solution: py`
      def partition(s):
          result = []
          path = []

          def backtrack(start):
              if start == len(s):
                  result.append(path[:])
                  return
              for end in range(start + 1, len(s) + 1):
                  piece = s[start:end]
                  if piece == piece[::-1]:
                      path.append(piece)
                      backtrack(end)
                      path.pop()

          backtrack(0)
          return result
    `,
    explain: '<p>"Choose the next piece" is a very common backtracking shape for strings (word break, IP addresses, …).</p>',
  },
})

addQuiz({
  'bt-quiz': [
    { q: 'What are the 3 steps inside a backtracking loop?', options: ['push, pop, peek', 'choose, explore (recurse), un-choose', 'sort, search, return', 'split, merge, combine'], answer: 1, why: 'Un-choosing restores the state so the next choice starts from a clean path.' },
    { q: 'Why <code>result.append(path[:])</code> and not <code>result.append(path)</code>?', options: ['It is faster', 'path keeps changing; without a copy every result points to the same list', 'Python requires slicing', 'To sort it'], answer: 1, why: 'At the end path is empty, so you\'d get a list full of empty lists.' },
    { q: 'How many subsets does a set of n items have?', options: ['n', 'n²', '2ⁿ', 'n!'], answer: 2, why: 'Each item is either in or out: 2 × 2 × … × 2.' },
    { q: 'Which signal points to backtracking?', options: ['"shortest path"', '"return ALL combinations / permutations / ways / arrangements"', '"k-th largest"', '"sum of a subarray"'], answer: 1, why: 'Generating all possibilities = exploring a decision tree. Small n (≤ 20) is another hint.' },
    { q: 'What is <b>pruning</b>?', options: ['Removing duplicates at the end', 'Stopping a branch early when it can\'t lead to a valid answer', 'Sorting the input', 'Using a heap'], answer: 1, why: 'E.g. remaining &lt; 0 in combination sum, or an attacked square in N-Queens.' },
  ],
})
