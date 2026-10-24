// Lesson 07 — Prefix sums
addViz({
  'pre-build': {
    title: 'Build the prefix list once, answer any range sum in O(1)',
    code: py`
      def build_prefix(nums):
          prefix = [0] * (len(nums) + 1)          # prefix[i] = sum of the first i numbers
          for i in range(len(nums)):
              prefix[i + 1] = prefix[i] + nums[i]  #: prefix[{i + 1}] = prefix[{i}] + nums[{i}] = {prefix[i]} + {nums[i]} = {prefix[i] + nums[i]}
          return prefix

      nums = [3, 1, 4, 1, 5, 9]
      prefix = build_prefix(nums)
      left, right = 2, 4
      answer = prefix[right + 1] - prefix[left]    #: sum of nums[{left}..{right}] = prefix[{right + 1}] − prefix[{left}] = {prefix[right + 1]} − {prefix[left]} = {prefix[right + 1] - prefix[left]}
      print(answer)
    `,
    views: [
      { type: 'array', var: 'nums', pointers: ['i'], range: (s) => (s.line >= 10 ? [s.v('left'), s.v('right')] : null) },
      {
        type: 'array',
        var: 'prefix',
        cls: (s) => {
          if (s.line >= 10 && Number.isInteger(s.v('left'))) return { [s.v('left')]: 'bad', [s.v('right') + 1]: 'done' }
          const i = s.v('i')
          return Number.isInteger(i) ? { [i + 1]: 'hot' } : {}
        },
      },
    ],
  },
  'pre-count-k': {
    title: 'Prefix sums + dict: count sections that sum to k',
    code: py`
      def subarray_sum(nums, k):
          count = 0
          running = 0
          seen = {0: 1}                  # prefix sum → how many times we have had it
          for x in nums:
              running += x               #: running sum: {running} + {x} = {running + x}
              if running - k in seen:    #: a section ending here sums to {k} if an EARLIER prefix was {running} − {k} = {running - k}. Seen it {seen.get(running - k, 0)} time(s)
                  count += seen[running - k]
              seen[running] = seen.get(running, 0) + 1   #: remember prefix {running}
          return count

      print(subarray_sum([1, 2, 1, -1, 2, 3], 3))
    `,
    views: [
      { type: 'array', var: 'nums' },
      { type: 'dict', var: 'seen', hot: (s) => (Number.isInteger(s.v('running')) ? s.v('running') - s.v('k') : undefined), keyLabel: 'prefix sum', valLabel: 'times' },
    ],
  },
})

addWidget({
  'prefix-range': (el) => {
    const nums = [3, 1, 4, 1, 5, 9, 2, 6]
    const prefix = [0]
    nums.forEach((x) => prefix.push(prefix[prefix.length - 1] + x))
    el.innerHTML = `<h4>Range sum with one subtraction</h4>
      <div class="row"><label>left <input type="range" class="l" min="0" max="${nums.length - 1}" value="2"></label><label>right <input type="range" class="r" min="0" max="${nums.length - 1}" value="5"></label></div>
      <div class="view-title"><b>nums</b></div><div class="arr a1"></div>
      <div class="view-title" style="margin-top:8px"><b>prefix</b> (one longer: prefix[0] = 0)</div><div class="arr a2"></div>
      <p class="msg"></p>`
    const l = el.querySelector('.l')
    const r = el.querySelector('.r')
    const draw = () => {
      let a = +l.value
      let b = +r.value
      if (a > b) [a, b] = [b, a]
      el.querySelector('.a1').innerHTML = nums.map((x, i) => `<div class="arr-cell${i >= a && i <= b ? ' in-range' : ' dim'}"><div class="arr-ptrs">${i === a ? '<span>left</span>' : ''}${i === b ? '<span class="p1">right</span>' : ''}</div><div class="arr-box">${x}</div><div class="arr-idx">${i}</div></div>`).join('')
      el.querySelector('.a2').innerHTML = prefix.map((x, i) => `<div class="arr-cell${i === b + 1 ? ' done' : i === a ? ' bad' : ''}"><div class="arr-ptrs"></div><div class="arr-box">${x}</div><div class="arr-idx">${i}</div></div>`).join('')
      const direct = nums.slice(a, b + 1).reduce((s, x) => s + x, 0)
      el.querySelector('.msg').innerHTML = `sum(nums[${a}..${b}]) = <b style="color:var(--good)">prefix[${b + 1}]</b> − <b style="color:var(--bad)">prefix[${a}]</b> = ${prefix[b + 1]} − ${prefix[a]} = <b>${prefix[b + 1] - prefix[a]}</b> &nbsp; (adding by hand: ${nums.slice(a, b + 1).join(' + ')} = ${direct}) ✅`
    }
    l.oninput = r.oninput = draw
    draw()
  },
})

addProblems({
  'pre-running': {
    title: 'Running sum',
    level: 'Easy',
    pattern: 'Prefix sums',
    leetcode: '1480. Running Sum of 1d Array',
    prompt: '<p>Return a list where item <code>i</code> is <code>nums[0] + … + nums[i]</code>.</p>',
    fn: 'running_sum',
    starter: py`
      def running_sum(nums):
          # TODO
          return []
    `,
    tests: [
      { args: [[1, 2, 3, 4]], expect: [1, 3, 6, 10] },
      { args: [[1, 1, 1, 1, 1]], expect: [1, 2, 3, 4, 5] },
      { args: [[3, 1, 2, 10, 1]], expect: [3, 4, 6, 16, 17] },
      { args: [[]], expect: [] },
    ],
    hints: ['Keep a total; append it after adding each number.'],
    solution: py`
      def running_sum(nums):
          result = []
          total = 0
          for x in nums:
              total += x
              result.append(total)
          return result
    `,
    explain: '<p>O(n). (<code>itertools.accumulate(nums)</code> does the same.) This is the prefix list without the leading 0.</p>',
  },
  'pre-num-array': {
    title: 'Range sum query (design)',
    level: 'Easy',
    pattern: 'Prefix sums',
    leetcode: '303. Range Sum Query - Immutable',
    prompt: '<p>Design <code>NumArray(nums)</code> with a method <code>sum_range(left, right)</code> that returns <code>nums[left] + … + nums[right]</code>. It will be called many times, so each call must be <b>O(1)</b>.</p>',
    fn: 'NumArray',
    starter: py`
      class NumArray:
          def __init__(self, nums):
              # TODO: build the prefix list once
              pass

          def sum_range(self, left, right):
              # TODO: O(1)
              return 0
    `,
    tests: [
      { ops: ['NumArray', 'sum_range', 'sum_range', 'sum_range'], args: [[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]], expect: [null, 1, -1, -3] },
      { ops: ['NumArray', 'sum_range', 'sum_range'], args: [[[5]], [0, 0], [0, 0]], expect: [null, 5, 5] },
      { ops: ['NumArray', 'sum_range', 'sum_range'], args: [[[1, 2, 3, 4]], [1, 2], [3, 3]], expect: [null, 5, 4] },
    ],
    hints: ['In <code>__init__</code>, build <code>self.prefix</code> with a leading 0.', '<code>return self.prefix[right + 1] - self.prefix[left]</code>'],
    solution: py`
      class NumArray:
          def __init__(self, nums):
              self.prefix = [0]
              for x in nums:
                  self.prefix.append(self.prefix[-1] + x)

          def sum_range(self, left, right):
              return self.prefix[right + 1] - self.prefix[left]
    `,
    explain: '<p>O(n) once to build, then O(1) per query. Pre-computing so later questions are cheap is a big idea in DSA.</p>',
  },
  'pre-pivot': {
    title: 'Pivot index',
    level: 'Easy',
    pattern: 'Prefix sums',
    leetcode: '724. Find Pivot Index',
    prompt: '<p>Return the first index where the sum of everything to its <b>left</b> equals the sum of everything to its <b>right</b> (not including itself), or <code>-1</code>.</p>',
    fn: 'pivot_index',
    starter: py`
      def pivot_index(nums):
          # TODO
          return -1
    `,
    tests: [
      { args: [[1, 7, 3, 6, 5, 6]], expect: 3 },
      { args: [[1, 2, 3]], expect: -1 },
      { args: [[2, 1, -1]], expect: 0 },
      { args: [[0]], expect: 0 },
      { args: [[-1, -1, 0, 1, 1, 0]], expect: 5 },
    ],
    hints: ['Compute <code>total = sum(nums)</code> once.', 'Walk with a <code>left_sum</code>. The right side is <code>total - left_sum - nums[i]</code>.'],
    solution: py`
      def pivot_index(nums):
          total = sum(nums)
          left_sum = 0
          for i, x in enumerate(nums):
              if left_sum == total - left_sum - x:
                  return i
              left_sum += x
          return -1
    `,
    explain: '<p>O(n). Total minus left gives right — no need for a second prefix list.</p>',
  },
  'pre-subarray-k': {
    title: 'Subarray sum equals k',
    level: 'Medium',
    pattern: 'Prefix sums + dict',
    leetcode: '560. Subarray Sum Equals K',
    prompt: '<p>Return how many contiguous sections of <code>nums</code> add up to exactly <code>k</code>. Numbers can be negative, so a sliding window doesn\'t work. Must be O(n).</p>',
    fn: 'subarray_sum',
    starter: py`
      def subarray_sum(nums, k):
          # TODO
          return 0
    `,
    tests: [
      { args: [[1, 1, 1], 2], expect: 2 },
      { args: [[1, 2, 3], 3], expect: 2 },
      { args: [[1, -1, 0], 0], expect: 3 },
      { args: [[1, 2, 1, -1, 2, 3], 3], expect: 4 },
      { args: [[3], 3], expect: 1 },
      { args: [{ __py__: '[0] * 3000' }, 0], expect: 4501500 },
    ],
    views: [{ type: 'array', var: 'nums' }, { type: 'dict', var: 'seen' }],
    hints: [
      'sum(nums[i..j]) = prefix[j + 1] − prefix[i]. We want that to be k.',
      'So while walking, for the current running sum <code>P</code>, count how many earlier prefixes equal <code>P - k</code>.',
      'Keep a dict prefix → count, starting with <code>{0: 1}</code> (the empty prefix).',
    ],
    solution: py`
      def subarray_sum(nums, k):
          count = 0
          running = 0
          seen = {0: 1}
          for x in nums:
              running += x
              count += seen.get(running - k, 0)
              seen[running] = seen.get(running, 0) + 1
          return count
    `,
    explain: '<p>The same "complement" idea as Two Sum, but with prefix sums: <i>current − earlier = k</i>. O(n) time, O(n) space. Why <code>{0: 1}</code>? It counts sections that start at index 0.</p>',
  },
  'pre-product': {
    title: 'Product of array except self',
    level: 'Medium',
    pattern: 'Prefix + suffix',
    leetcode: '238. Product of Array Except Self',
    prompt: '<p>Return a list where item <code>i</code> is the product of every number <b>except</b> <code>nums[i]</code>. Don\'t use division. O(n).</p>',
    fn: 'product_except_self',
    starter: py`
      def product_except_self(nums):
          # TODO
          return []
    `,
    tests: [
      { args: [[1, 2, 3, 4]], expect: [24, 12, 8, 6] },
      { args: [[-1, 1, 0, -3, 3]], expect: [0, 0, 9, 0, 0] },
      { args: [[2, 3]], expect: [3, 2] },
      { args: [[0, 0]], expect: [0, 0] },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['i'] }, { type: 'array', var: 'result', pointers: ['i'] }],
    hints: ['Answer[i] = (product of everything left of i) × (product of everything right of i).', 'Pass 1 (left → right): <code>result[i]</code> = product of the left side. Pass 2 (right → left): multiply in a running product of the right side.'],
    solution: py`
      def product_except_self(nums):
          n = len(nums)
          result = [1] * n
          left = 1
          for i in range(n):
              result[i] = left          # product of nums[0..i-1]
              left *= nums[i]
          right = 1
          for i in range(n - 1, -1, -1):
              result[i] *= right        # times product of nums[i+1..]
              right *= nums[i]
          return result
    `,
    explain: '<p>Prefix <i>products</i> instead of sums, from both sides. O(n) time, O(1) extra space (the result doesn\'t count).</p>',
  },
  'pre-contiguous': {
    title: 'Longest section with equal 0s and 1s',
    level: 'Medium',
    pattern: 'Prefix sums + first index',
    leetcode: '525. Contiguous Array',
    prompt: '<p><code>nums</code> has only 0s and 1s. Return the length of the longest contiguous section with the same number of 0s and 1s.</p>',
    fn: 'find_max_length',
    starter: py`
      def find_max_length(nums):
          # TODO
          return 0
    `,
    tests: [
      { args: [[0, 1]], expect: 2 },
      { args: [[0, 1, 0]], expect: 2 },
      { args: [[0, 1, 1, 1, 1, 1, 0, 0, 0]], expect: 6 },
      { args: [[1, 1, 1]], expect: 0 },
      { args: [[0, 0, 1, 0, 0, 0, 1, 1]], expect: 6 },
    ],
    hints: ['Treat 0 as −1. Then "equal 0s and 1s" means "sum is 0".', 'A section has sum 0 when two prefix sums are equal. Remember the <b>first</b> index where each prefix sum appeared.', 'Start with <code>first = {0: -1}</code>; length = <code>i - first[running]</code>.'],
    solution: py`
      def find_max_length(nums):
          first = {0: -1}
          running = 0
          best = 0
          for i, x in enumerate(nums):
              running += 1 if x == 1 else -1
              if running in first:
                  best = max(best, i - first[running])
              else:
                  first[running] = i
          return best
    `,
    explain: '<p>Turning the problem into "sum = 0" is the trick. Storing the <b>first</b> index gives the <b>longest</b> section.</p>',
  },
  'pre-matrix': {
    title: '2-D range sum (design)',
    level: 'Medium',
    pattern: '2-D prefix sums',
    leetcode: '304. Range Sum Query 2D - Immutable',
    prompt: '<p>Design <code>NumMatrix(matrix)</code> with <code>sum_region(r1, c1, r2, c2)</code> returning the sum of the rectangle from <code>(r1, c1)</code> to <code>(r2, c2)</code> (inclusive) in O(1).</p>',
    fn: 'NumMatrix',
    starter: py`
      class NumMatrix:
          def __init__(self, matrix):
              # TODO: P[r][c] = sum of the rectangle (0,0)..(r-1,c-1)
              pass

          def sum_region(self, r1, c1, r2, c2):
              return 0
    `,
    tests: [
      {
        ops: ['NumMatrix', 'sum_region', 'sum_region', 'sum_region'],
        args: [[[[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]], [2, 1, 4, 3], [1, 1, 2, 2], [1, 2, 2, 4]],
        expect: [null, 8, 11, 12],
      },
      { ops: ['NumMatrix', 'sum_region'], args: [[[[7]]], [0, 0, 0, 0]], expect: [null, 7] },
    ],
    hints: [
      'Build <code>P</code> with one extra row and column of zeros: <code>P[r+1][c+1] = matrix[r][c] + P[r][c+1] + P[r+1][c] - P[r][c]</code> (the top-left part was added twice).',
      'Answer: <code>P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]</code>. Draw the 4 rectangles on paper!',
    ],
    solution: py`
      class NumMatrix:
          def __init__(self, matrix):
              rows, cols = len(matrix), len(matrix[0])
              self.P = [[0] * (cols + 1) for _ in range(rows + 1)]
              for r in range(rows):
                  for c in range(cols):
                      self.P[r + 1][c + 1] = matrix[r][c] + self.P[r][c + 1] + self.P[r + 1][c] - self.P[r][c]

          def sum_region(self, r1, c1, r2, c2):
              P = self.P
              return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1]
    `,
    explain: '<p>Inclusion–exclusion: big rectangle − top strip − left strip + the corner you subtracted twice.</p>',
  },
})

addQuiz({
  'pre-quiz': [
    { q: '<code>prefix = [0, 3, 4, 8, 9, 14]</code> for <code>nums = [3, 1, 4, 1, 5]</code>. What is <code>nums[1] + nums[2] + nums[3]</code>?', options: ['<code>prefix[3] - prefix[1]</code> = 4', '<code>prefix[4] - prefix[1]</code> = 6', '<code>prefix[4] - prefix[0]</code> = 9', '<code>prefix[3]</code> = 8'], answer: 1, why: 'sum(nums[l..r]) = prefix[r + 1] − prefix[l] = prefix[4] − prefix[1] = 9 − 3 = 6.' },
    { q: 'Why does "subarray sum equals k" start the dict with <code>{0: 1}</code>?', options: ['To avoid KeyError', 'So sections that start at index 0 are counted', 'It is a LeetCode rule', 'To make it faster'], answer: 1, why: 'A section from index 0 to i has sum = running − 0. The "0" prefix is the empty prefix before the list.' },
    { q: 'Numbers can be negative and you need sections with sum exactly k. Which pattern?', options: ['Sliding window', 'Prefix sums + dict', 'Two pointers', 'Binary search'], answer: 1, why: 'Negative numbers break the window\'s "grow = bigger, shrink = smaller" rule.' },
    { q: 'You get 100,000 range-sum questions on a list that never changes. Best approach?', options: ['Sum each range: O(n) per question', 'Build a prefix list once: O(1) per question', 'Sort the list', 'Use a set'], answer: 1, why: 'O(n) once + O(1) × q questions, instead of O(n × q).' },
  ],
})
