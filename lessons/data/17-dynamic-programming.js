// Lesson 17 — Dynamic programming
addViz({
  'dp-fib-memo': {
    title: 'Memoization: the same fib, but it remembers answers',
    code: py`
      memo = {}

      def fib(n):
          if n in memo:
              return memo[n]                    #: fib({n}) is already in the memo → answer instantly, no new calls!
          if n < 2:
              return n
          memo[n] = fib(n - 1) + fib(n - 2)     #: compute fib({n}) once and remember it
          return memo[n]

      print(fib(6))
    `,
    views: [
      { type: 'calltree', fn: 'fib' },
      { type: 'dict', var: 'memo', keyLabel: 'n', valLabel: 'fib(n)' },
    ],
    hideGlobals: true,
    wide: true,
  },
  'dp-climb': {
    title: 'Bottom-up: fill a table from small to big (climbing stairs)',
    code: py`
      def climb_stairs(n):
          dp = [0] * (n + 1)                    # dp[i] = number of ways to reach step i
          dp[0], dp[1] = 1, 1
          for i in range(2, n + 1):
              dp[i] = dp[i - 1] + dp[i - 2]     #: ways to reach step {i} = from step {i - 1} ({dp[i - 1]} ways) + from step {i - 2} ({dp[i - 2]} ways) = {dp[i - 1] + dp[i - 2]}
          return dp[n]

      print(climb_stairs(6))
    `,
    views: [
      {
        type: 'array',
        var: 'dp',
        pointers: ['i'],
        cls: (s) => {
          const i = s.v('i')
          return Number.isInteger(i) && s.line === 5 ? { [i - 1]: 'in-range', [i - 2]: 'in-range' } : {}
        },
      },
    ],
  },
  'dp-coins': {
    title: 'Coin change: fewest coins for every amount',
    code: py`
      def coin_change(coins, amount):
          INF = float("inf")
          dp = [0] + [INF] * amount               # dp[a] = fewest coins that make amount a
          for a in range(1, amount + 1):
              for c in coins:
                  if c <= a and dp[a - c] + 1 < dp[a]:   #: amount {a}, coin {c}: {('dp[' + str(a - c) + '] + 1 = ' + str(dp[a - c] + 1) + (' < ' + str(dp[a]) + ' → better!' if dp[a - c] + 1 < dp[a] else ' — not better than ' + str(dp[a]))) if c <= a else 'coin is bigger than the amount → skip'}
                      dp[a] = dp[a - c] + 1
          return dp[amount] if dp[amount] != INF else -1

      print(coin_change([1, 3, 4], 6))
    `,
    views: [
      { type: 'array', var: 'coins' },
      {
        type: 'array',
        var: 'dp',
        pointers: ['a'],
        cls: (s) => {
          const a = s.v('a')
          const c = s.v('c')
          return Number.isInteger(a) && Number.isInteger(c) && c <= a ? { [a - c]: 'in-range' } : {}
        },
      },
    ],
  },
  'dp-lcs': {
    title: '2-D table: longest common subsequence',
    code: py`
      def lcs(a, b):
          rows, cols = len(a), len(b)
          dp = [[0] * (cols + 1) for _ in range(rows + 1)]   # dp[i][j] = LCS of a[:i] and b[:j]
          for i in range(1, rows + 1):
              for j in range(1, cols + 1):
                  if a[i - 1] == b[j - 1]:     #: '{a[i - 1]}' vs '{b[j - 1]}': {'SAME → 1 + diagonal (' + str(dp[i - 1][j - 1]) + ')' if a[i - 1] == b[j - 1] else 'different → best of up (' + str(dp[i - 1][j]) + ') and left (' + str(dp[i][j - 1]) + ')'}
                      dp[i][j] = 1 + dp[i - 1][j - 1]
                  else:
                      dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
          return dp[rows][cols]

      print(lcs("ABCDE", "ACE"))
    `,
    views: [
      {
        type: 'grid',
        var: 'dp',
        rowLabels: ['""', 'A', 'B', 'C', 'D', 'E'],
        colLabels: ['""', 'A', 'C', 'E'],
        pointer: ['i', 'j'],
        marks: (s) => {
          const i = s.v('i')
          const j = s.v('j')
          if (!Number.isInteger(i) || !Number.isInteger(j)) return []
          return [[i - 1, j - 1, 'ref'], [i - 1, j, 'ref'], [i, j - 1, 'ref']]
        },
      },
    ],
  },
})

addProblems({
  'dp-climb': {
    title: 'Climbing stairs',
    level: 'Easy',
    pattern: '1-D DP',
    leetcode: '70. Climbing Stairs',
    prompt: '<p>You climb a staircase with <code>n</code> steps, taking 1 or 2 steps at a time. In how many different ways can you reach the top? (The last test is n = 80 — plain recursion is far too slow.)</p>',
    fn: 'climb_stairs',
    starter: py`
      def climb_stairs(n):
          # TODO
          return 0
    `,
    tests: [
      { args: [1], expect: 1 },
      { args: [2], expect: 2 },
      { args: [3], expect: 3 },
      { args: [5], expect: 8 },
      { args: [45], expect: 1836311903 },
      { args: [80], expect: { __py__: '37889062373143906' } },
    ],
    views: [{ type: 'array', var: 'dp', pointers: ['i'] }],
    hints: ['To stand on step n, your last move came from step n − 1 or step n − 2.', 'ways(n) = ways(n − 1) + ways(n − 2), with ways(0) = ways(1) = 1. That\'s Fibonacci!', 'Fill a list from small to big, or keep just two variables.'],
    solution: py`
      def climb_stairs(n):
          prev, curr = 1, 1          # ways(0), ways(1)
          for _ in range(2, n + 1):
              prev, curr = curr, prev + curr
          return curr
    `,
    explain: '<p>O(n) time, O(1) space: when each state depends only on the last two, keep only two variables.</p>',
  },
  'dp-min-cost': {
    title: 'Min cost climbing stairs',
    level: 'Easy',
    pattern: '1-D DP',
    leetcode: '746. Min Cost Climbing Stairs',
    prompt: '<p><code>cost[i]</code> is the price of standing on step i. You can start on step 0 or 1 and climb 1 or 2 steps at a time. The top is just past the last step. Return the minimum total cost.</p>',
    fn: 'min_cost_climbing_stairs',
    starter: py`
      def min_cost_climbing_stairs(cost):
          # TODO
          return 0
    `,
    tests: [
      { args: [[10, 15, 20]], expect: 15 },
      { args: [[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]], expect: 6 },
      { args: [[0, 0]], expect: 0 },
      { args: [[5, 10]], expect: 5 },
    ],
    views: [{ type: 'array', var: 'dp', pointers: ['i'] }],
    hints: ['Let <code>dp[i]</code> = the cheapest way to <b>reach</b> step i (not paying for i yet). dp[0] = dp[1] = 0.', '<code>dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])</code>. The answer is dp[n].'],
    solution: py`
      def min_cost_climbing_stairs(cost):
          n = len(cost)
          dp = [0] * (n + 1)
          for i in range(2, n + 1):
              dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])
          return dp[n]
    `,
    explain: '<p>Defining the state exactly ("cost to <i>reach</i> step i") is half the work in every DP problem.</p>',
  },
  'dp-rob': {
    title: 'House robber',
    level: 'Medium',
    pattern: '1-D DP (take / skip)',
    leetcode: '198. House Robber',
    prompt: '<p><code>nums[i]</code> is the money in house i. You can\'t rob two neighbouring houses. Return the most money you can rob.</p>',
    fn: 'rob',
    starter: py`
      def rob(nums):
          # TODO
          return 0
    `,
    tests: [
      { args: [[1, 2, 3, 1]], expect: 4 },
      { args: [[2, 7, 9, 3, 1]], expect: 12 },
      { args: [[5]], expect: 5 },
      { args: [[2, 1, 1, 2]], expect: 4 },
      { args: [{ __py__: 'list(range(1, 101))' }], expect: 2550 },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['i'] }],
    hints: ['At each house: <b>skip</b> it (keep the best up to the previous house) or <b>take</b> it (its money + the best up to two houses back).', '<code>best[i] = max(best[i - 1], best[i - 2] + nums[i])</code> — again only the last two values are needed.'],
    solution: py`
      def rob(nums):
          prev, curr = 0, 0           # best up to house i-2, best up to house i-1
          for x in nums:
              prev, curr = curr, max(curr, prev + x)
          return curr
    `,
    explain: '<p>"Take it or skip it" is the most common DP decision. O(n) time, O(1) space.</p>',
  },
  'dp-coins': {
    title: 'Coin change',
    level: 'Medium',
    pattern: '1-D DP over amounts',
    leetcode: '322. Coin Change',
    prompt: '<p>Return the fewest coins needed to make <code>amount</code> (unlimited coins of each value), or −1 if impossible. Greedy (biggest coin first) is wrong: with coins [1, 3, 4] and amount 6, greedy gives 4+1+1, but 3+3 is better.</p>',
    fn: 'coin_change',
    starter: py`
      def coin_change(coins, amount):
          # TODO
          return -1
    `,
    tests: [
      { args: [[1, 2, 5], 11], expect: 3 },
      { args: [[2], 3], expect: -1 },
      { args: [[1], 0], expect: 0 },
      { args: [[1, 3, 4], 6], expect: 2 },
      { args: [[186, 419, 83, 408], 6249], expect: 20 },
    ],
    views: [{ type: 'array', var: 'dp', pointers: ['a'] }],
    hints: ['<code>dp[a]</code> = fewest coins for amount a. <code>dp[0] = 0</code>, everything else starts at infinity.', 'For each amount a and coin c ≤ a: <code>dp[a] = min(dp[a], dp[a - c] + 1)</code>.'],
    solution: py`
      def coin_change(coins, amount):
          INF = float("inf")
          dp = [0] + [INF] * amount
          for a in range(1, amount + 1):
              for c in coins:
                  if c <= a:
                      dp[a] = min(dp[a], dp[a - c] + 1)
          return dp[amount] if dp[amount] != INF else -1
    `,
    explain: '<p>O(amount × number of coins). The coin-change table is the classic "unbounded knapsack".</p>',
  },
  'dp-paths': {
    title: 'Unique paths',
    level: 'Medium',
    pattern: '2-D DP (grid)',
    leetcode: '62. Unique Paths',
    prompt: '<p>A robot starts at the top-left of an <code>m</code> × <code>n</code> grid and can only move right or down. How many different paths reach the bottom-right?</p>',
    fn: 'unique_paths',
    starter: py`
      def unique_paths(m, n):
          # TODO
          return 0
    `,
    tests: [
      { args: [3, 7], expect: 28 },
      { args: [3, 2], expect: 3 },
      { args: [1, 1], expect: 1 },
      { args: [10, 10], expect: 48620 },
      { args: [23, 12], expect: 193536720 },
    ],
    views: [{ type: 'grid', var: 'dp', pointer: ['r', 'c'] }],
    hints: ['You arrive at a cell from above or from the left.', '<code>dp[r][c] = dp[r - 1][c] + dp[r][c - 1]</code>; the first row and first column are all 1.'],
    solution: py`
      def unique_paths(m, n):
          dp = [[1] * n for _ in range(m)]
          for r in range(1, m):
              for c in range(1, n):
                  dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
          return dp[m - 1][n - 1]
    `,
    explain: '<p>O(m × n). Most grid DP problems look like this: each cell is built from its top and left neighbours.</p>',
  },
  'dp-lis': {
    title: 'Longest increasing subsequence',
    level: 'Medium',
    pattern: '1-D DP (look at all earlier)',
    leetcode: '300. Longest Increasing Subsequence',
    prompt: '<p>Return the length of the longest strictly increasing <b>subsequence</b> (items in order, not necessarily next to each other).</p>',
    fn: 'length_of_lis',
    starter: py`
      def length_of_lis(nums):
          # TODO
          return 0
    `,
    tests: [
      { args: [[10, 9, 2, 5, 3, 7, 101, 18]], expect: 4 },
      { args: [[0, 1, 0, 3, 2, 3]], expect: 4 },
      { args: [[7, 7, 7, 7]], expect: 1 },
      { args: [[1]], expect: 1 },
      { args: [[4, 10, 4, 3, 8, 9]], expect: 3 },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['i', 'j'] }, { type: 'array', var: 'dp', pointers: ['i', 'j'] }],
    hints: ['<code>dp[i]</code> = length of the longest increasing subsequence that <b>ends at</b> index i.', 'For each earlier j with <code>nums[j] &lt; nums[i]</code>: <code>dp[i] = max(dp[i], dp[j] + 1)</code>. Answer: <code>max(dp)</code>.'],
    solution: py`
      def length_of_lis(nums):
          dp = [1] * len(nums)
          for i in range(len(nums)):
              for j in range(i):
                  if nums[j] < nums[i]:
                      dp[i] = max(dp[i], dp[j] + 1)
          return max(dp)
    `,
    explain: '<p>O(n²). "Ends at index i" is a very useful state definition. (There is an O(n log n) version with binary search — look it up after you master this one.)</p>',
  },
  'dp-lcs': {
    title: 'Longest common subsequence',
    level: 'Medium',
    pattern: '2-D DP (two strings)',
    leetcode: '1143. Longest Common Subsequence',
    prompt: '<p>Return the length of the longest sequence of characters that appears in both strings in the same order (not necessarily next to each other).</p>',
    fn: 'longest_common_subsequence',
    starter: py`
      def longest_common_subsequence(a, b):
          # TODO
          return 0
    `,
    tests: [
      { args: ['abcde', 'ace'], expect: 3 },
      { args: ['abc', 'abc'], expect: 3 },
      { args: ['abc', 'def'], expect: 0 },
      { args: ['bsbininm', 'jmjkbkjkv'], expect: 1 },
    ],
    views: [{ type: 'grid', var: 'dp', pointer: ['i', 'j'] }],
    hints: ['Watch the LCS visualizer. dp has one extra row and column of zeros.', 'Same letters → 1 + diagonal. Different → max(up, left).'],
    solution: py`
      def longest_common_subsequence(a, b):
          dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
          for i in range(1, len(a) + 1):
              for j in range(1, len(b) + 1):
                  if a[i - 1] == b[j - 1]:
                      dp[i][j] = 1 + dp[i - 1][j - 1]
                  else:
                      dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
          return dp[len(a)][len(b)]
    `,
    explain: '<p>O(n × m). Two strings → a 2-D table where <code>dp[i][j]</code> is about the first i and first j characters. Diff tools (git diff!) use this idea.</p>',
  },
  'dp-word-break': {
    title: 'Word break',
    level: 'Medium',
    pattern: '1-D DP over prefixes',
    leetcode: '139. Word Break',
    prompt: '<p>Can <code>s</code> be split into a sequence of words from <code>words</code> (words can be reused)? The last test makes plain recursion explode.</p>',
    fn: 'word_break',
    starter: py`
      def word_break(s, words):
          # TODO
          return False
    `,
    tests: [
      { args: ['leetcode', ['leet', 'code']], expect: true },
      { args: ['applepenapple', ['apple', 'pen']], expect: true },
      { args: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], expect: false },
      { args: ['a', ['b']], expect: false },
      { args: [{ __py__: '"a" * 40 + "b"' }, ['a', 'aa', 'aaa', 'aaaa']], expect: false },
    ],
    views: [{ type: 'array', var: 'ok', pointers: ['i', 'j'] }],
    hints: ['<code>ok[i]</code> = can the first i characters be split? <code>ok[0] = True</code>.', '<code>ok[i]</code> is True if some j &lt; i has <code>ok[j]</code> True and <code>s[j:i]</code> is a word. Put the words in a set.'],
    solution: py`
      def word_break(s, words):
          word_set = set(words)
          ok = [False] * (len(s) + 1)
          ok[0] = True
          for i in range(1, len(s) + 1):
              for j in range(i):
                  if ok[j] and s[j:i] in word_set:
                      ok[i] = True
                      break
          return ok[len(s)]
    `,
    explain: '<p>O(n²) (times the slice cost). Without the table, the same suffix is checked again and again — exponential.</p>',
  },
  'dp-partition': {
    title: 'Partition equal subset sum',
    level: 'Medium',
    pattern: '0/1 knapsack',
    leetcode: '416. Partition Equal Subset Sum',
    prompt: '<p>Can <code>nums</code> be split into two groups with the same sum?</p>',
    fn: 'can_partition',
    starter: py`
      def can_partition(nums):
          # TODO
          return False
    `,
    tests: [
      { args: [[1, 5, 11, 5]], expect: true },
      { args: [[1, 2, 3, 5]], expect: false },
      { args: [[2, 2]], expect: true },
      { args: [[1]], expect: false },
      { args: [[3, 3, 3, 4, 5]], expect: true },
    ],
    hints: ['If the total is odd → impossible. Otherwise: is there a subset with sum = total / 2?', 'Keep a set (or boolean list) of all sums you can make. For each number, add it to every sum you could already make.'],
    solution: py`
      def can_partition(nums):
          total = sum(nums)
          if total % 2:
              return False
          target = total // 2
          reachable = {0}
          for x in nums:
              reachable |= {s + x for s in reachable if s + x <= target}
          return target in reachable
    `,
    explain: '<p>"Each item: take it or not, with a capacity" is the 0/1 knapsack. The classic table is <code>dp[i][s]</code>; the set version keeps only the current row. O(n × target).</p>',
  },
  'dp-edit': {
    title: 'Edit distance',
    level: 'Hard',
    pattern: '2-D DP (two strings)',
    leetcode: '72. Edit Distance',
    prompt: '<p>Return the minimum number of operations (insert a character, delete a character, replace a character) to turn <code>word1</code> into <code>word2</code>.</p>',
    fn: 'min_distance',
    starter: py`
      def min_distance(word1, word2):
          # TODO
          return 0
    `,
    tests: [
      { args: ['horse', 'ros'], expect: 3 },
      { args: ['intention', 'execution'], expect: 5 },
      { args: ['', 'a'], expect: 1 },
      { args: ['abc', 'abc'], expect: 0 },
    ],
    views: [{ type: 'grid', var: 'dp', pointer: ['i', 'j'] }],
    hints: ['<code>dp[i][j]</code> = edits to turn the first i chars of word1 into the first j chars of word2. Row 0 is j (inserts), column 0 is i (deletes).', 'Same last character → <code>dp[i-1][j-1]</code>. Otherwise 1 + min(replace <code>dp[i-1][j-1]</code>, delete <code>dp[i-1][j]</code>, insert <code>dp[i][j-1]</code>).'],
    solution: py`
      def min_distance(word1, word2):
          n, m = len(word1), len(word2)
          dp = [[0] * (m + 1) for _ in range(n + 1)]
          for i in range(n + 1):
              dp[i][0] = i
          for j in range(m + 1):
              dp[0][j] = j
          for i in range(1, n + 1):
              for j in range(1, m + 1):
                  if word1[i - 1] == word2[j - 1]:
                      dp[i][j] = dp[i - 1][j - 1]
                  else:
                      dp[i][j] = 1 + min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
          return dp[n][m]
    `,
    explain: '<p>Same table shape as LCS, with three choices instead of two. Spell-checkers and DNA comparison use it.</p>',
  },
})

addQuiz({
  'dp-quiz': [
    { q: 'When can you use dynamic programming?', options: ['When the input is sorted', 'When the problem breaks into overlapping sub-problems and the best answer is built from best sub-answers', 'When you need a heap', 'Only for strings'], answer: 1, why: '"Overlapping sub-problems" (the same question is asked many times) + "optimal substructure" (big answer from small answers).' },
    { q: 'What is memoization?', options: ['Writing notes in comments', 'Storing results of function calls so the same call is never computed twice', 'Sorting before searching', 'A kind of heap'], answer: 1, why: 'Top-down DP: plain recursion + a dict. In Python, <code>@functools.cache</code> does it for you.' },
    { q: 'What is the difference between top-down and bottom-up DP?', options: ['There is none', 'Top-down = recursion + memo (start from the big problem); bottom-up = fill a table from the smallest problems up', 'Bottom-up is always slower', 'Top-down uses a heap'], answer: 1, why: 'Same recurrence, different order. Bottom-up avoids deep recursion and often allows saving memory.' },
    { q: 'Which is the first thing to write down for a DP problem?', options: ['The loops', 'The meaning of the state: "dp[i] = …"', 'The return statement', 'The Big-O'], answer: 1, why: 'Once dp[i] has an exact meaning, the recurrence and the base cases usually follow.' },
    { q: 'Signals for DP are…', options: ['"shortest path in a grid with walls"', '"how many ways", "minimum/maximum cost", "can you reach/make…", choices at each step', '"sorted array, find target"', '"next greater element"'], answer: 1, why: 'Counting ways or optimising over a sequence of choices → DP. (A grid maze with equal steps is BFS.)' },
  ],
})
