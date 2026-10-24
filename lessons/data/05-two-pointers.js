// Lesson 05 — Two pointers
addViz({
  'tp-brute': {
    title: 'Brute force: try every pair (slow)',
    code: py`
      def pair_sum_slow(nums, target):
          checks = 0
          for i in range(len(nums)):
              for j in range(i + 1, len(nums)):
                  checks += 1
                  if nums[i] + nums[j] == target:  #: check #{checks}: nums[{i}] + nums[{j}] = {nums[i]} + {nums[j]} = {nums[i] + nums[j]}
                      return [i, j]
          return []

      nums = [1, 3, 4, 6, 8, 11]
      print(pair_sum_slow(nums, 19))
    `,
    views: [{ type: 'array', var: 'nums', pointers: ['i', 'j'] }],
  },
  'tp-pair-sum': {
    title: 'Two pointers: pair with target sum (sorted list)',
    code: py`
      def pair_sum(nums, target):
          left, right = 0, len(nums) - 1
          while left < right:                    #: Is left ({left}) still before right ({right})? {'Yes → keep going' if left < right else 'No → they met, stop'}
              total = nums[left] + nums[right]   #: total = nums[{left}] + nums[{right}] = {nums[left]} + {nums[right]} = {nums[left] + nums[right]}
              if total == target:                #: Is {total} == {target}? {'YES — found the pair!' if total == target else 'No.'}
                  return [left, right]
              if total < target:                 #: Is {total} < {target}? {'Yes → too small. Even with the BIGGEST number, ' + str(nums[left]) + ' is too small, so ' + str(nums[left]) + ' can never be in the answer. Move left →' if total < target else 'No → too big. Even with the SMALLEST number, ' + str(nums[right]) + ' is too big, so throw ' + str(nums[right]) + ' away. Move right ←'}
                  left += 1                      #: left: {left} → {left + 1}
              else:
                  right -= 1                     #: right: {right} → {right - 1}
          return []

      nums = [1, 3, 4, 6, 8, 11]
      print(pair_sum(nums, 10))
    `,
    views: [{ type: 'array', var: 'nums', pointers: ['left', 'right'], range: ['left', 'right'] }],
  },
  'tp-reverse': {
    title: 'Opposite ends: reverse a list in place',
    code: py`
      def reverse(chars):
          left, right = 0, len(chars) - 1
          while left < right:
              chars[left], chars[right] = chars[right], chars[left]   #: swap chars[{left}] ('{chars[left]}') with chars[{right}] ('{chars[right]}')
              left += 1
              right -= 1
          return chars

      print(reverse(list("python")))
    `,
    views: [{ type: 'array', var: 'chars', pointers: ['left', 'right'] }],
  },
  'tp-dedupe': {
    title: 'Same direction (fast & slow): remove duplicates in place',
    code: py`
      def remove_duplicates(nums):
          write = 1                              # slot for the next NEW value
          for read in range(1, len(nums)):       # read scans every value
              if nums[read] != nums[write - 1]:  #: nums[read] = {nums[read]}, last kept = {nums[write - 1]} → {'NEW value, keep it' if nums[read] != nums[write - 1] else 'duplicate, skip it'}
                  nums[write] = nums[read]       #: copy {nums[read]} into slot {write}
                  write += 1
          return write

      nums = [1, 1, 2, 3, 3, 3, 4]
      k = remove_duplicates(nums)
      print(k, nums[:k])
    `,
    views: [
      {
        type: 'array',
        var: 'nums',
        pointers: ['write', 'read'],
        cls: (s) => {
          const w = s.v('write') ?? s.v('k')
          const out = {}
          if (Number.isInteger(w)) for (let i = 0; i < w; i++) out[i] = 'done'
          return out
        },
      },
    ],
  },
})

addProblems({
  'tp-palindrome': {
    title: 'Valid palindrome',
    level: 'Easy',
    pattern: 'Two pointers (opposite ends)',
    leetcode: '125. Valid Palindrome',
    prompt: `<p>A phrase is a palindrome if, after making all letters lowercase and removing everything that is not a letter or digit, it reads the same forwards and backwards. Return <code>True</code> or <code>False</code>.</p>
      <p>Useful: <code>ch.isalnum()</code> is <code>True</code> for letters and digits, <code>ch.lower()</code> makes a letter lowercase.</p>`,
    fn: 'is_palindrome',
    starter: py`
      def is_palindrome(s):
          # TODO: left starts at 0, right at len(s) - 1
          # skip characters that are not letters/digits, compare the rest
          pass
    `,
    tests: [
      { args: ['A man, a plan, a canal: Panama'], expect: true },
      { args: ['race a car'], expect: false },
      { args: [' '], expect: true },
      { args: ['ab_a'], expect: true },
      { args: ['0P'], expect: false },
      { args: ['Madam'], expect: true },
    ],
    hints: [
      'Use two indexes: <code>left = 0</code>, <code>right = len(s) - 1</code>, and loop <code>while left &lt; right</code>.',
      'Inside the loop: if <code>s[left]</code> is not alphanumeric, move <code>left</code> and <code>continue</code>. Same for <code>right</code>.',
      'When both point at letters/digits, compare <code>s[left].lower()</code> with <code>s[right].lower()</code>. Different → <code>return False</code>. Same → move both inwards.',
    ],
    solution: py`
      def is_palindrome(s):
          left, right = 0, len(s) - 1
          while left < right:
              if not s[left].isalnum():
                  left += 1
              elif not s[right].isalnum():
                  right -= 1
              elif s[left].lower() != s[right].lower():
                  return False
              else:
                  left += 1
                  right -= 1
          return True
    `,
    explain: `<p><b>Why it works:</b> a palindrome mirrors itself, so the 1st character must equal the last, the 2nd must equal the 2nd-last, and so on. Two pointers check exactly those mirror pairs. <b>Time O(n)</b> (each pointer moves at most n times), <b>space O(1)</b>. The "easy" version <code>clean == clean[::-1]</code> also works but builds new strings (O(n) space).</p>`,
  },
  'tp-pair-sum': {
    title: 'Pair with target sum (sorted list)',
    level: 'Easy',
    pattern: 'Two pointers (opposite ends)',
    leetcode: '167. Two Sum II (LeetCode uses 1-based indexes)',
    prompt: `<p><code>nums</code> is sorted in increasing order. Return the indexes <code>[i, j]</code> (with <code>i &lt; j</code>) of the two numbers that add up to <code>target</code>, or <code>[]</code> if there is no such pair. Use <b>O(1)</b> extra space — no dict!</p>`,
    fn: 'pair_sum',
    starter: py`
      def pair_sum(nums, target):
          # TODO
          return []
    `,
    tests: [
      { args: [[2, 7, 11, 15], 9], expect: [0, 1] },
      { args: [[1, 3, 4, 6, 8, 11], 10], expect: [2, 3] },
      { args: [[-3, -1, 0, 2, 5], 1], expect: [1, 3] },
      { args: [[1, 2], 3], expect: [0, 1] },
      { args: [[1, 2, 3], 7], expect: [] },
      { args: [[5, 25, 75], 100], expect: [1, 2] },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['left', 'right', 'i', 'j'], range: ['left', 'right'] }],
    hints: [
      'Start with the smallest and the biggest number: <code>left = 0</code>, <code>right = len(nums) - 1</code>.',
      'If the sum is too small, which pointer makes it bigger? If it is too big, which pointer makes it smaller?',
      'Too small → <code>left += 1</code>. Too big → <code>right -= 1</code>. Equal → <code>return [left, right]</code>. Loop while <code>left &lt; right</code>.',
    ],
    solution: py`
      def pair_sum(nums, target):
          left, right = 0, len(nums) - 1
          while left < right:
              total = nums[left] + nums[right]
              if total == target:
                  return [left, right]
              if total < target:
                  left += 1
              else:
                  right -= 1
          return []
    `,
    explain: `<p><b>Why it works:</b> every step throws away one number that can't be in any answer (see the visualizer). <b>Time O(n)</b>, <b>space O(1)</b>. Brute force would be O(n²).</p>`,
  },
  'tp-move-zeroes': {
    title: 'Move zeroes to the end',
    level: 'Easy',
    pattern: 'Two pointers (same direction)',
    leetcode: '283. Move Zeroes',
    prompt: `<p>Move all <code>0</code>s to the end of <code>nums</code> <b>in place</b> (change the list itself, don't make a new one), keeping the order of the non-zero numbers. The function doesn't need to return anything.</p>`,
    fn: 'move_zeroes',
    starter: py`
      def move_zeroes(nums):
          # TODO: change nums in place
          pass
    `,
    inplace: 0,
    tests: [
      { args: [[0, 1, 0, 3, 12]], expect: [1, 3, 12, 0, 0] },
      { args: [[0]], expect: [0] },
      { args: [[1, 2]], expect: [1, 2] },
      { args: [[0, 0, 1]], expect: [1, 0, 0] },
      { args: [[4, 0, 5, 0, 0, 6]], expect: [4, 5, 6, 0, 0, 0] },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['write', 'read', 'i', 'j'] }],
    hints: [
      'Same idea as "remove duplicates": a <code>write</code> pointer marks where the next non-zero number should go.',
      'Scan with <code>read</code>. When <code>nums[read] != 0</code>, put it at <code>write</code> and move <code>write</code> forward.',
      'Swap instead of copy: <code>nums[write], nums[read] = nums[read], nums[write]</code> — the zeros get pushed back automatically.',
    ],
    solution: py`
      def move_zeroes(nums):
          write = 0
          for read in range(len(nums)):
              if nums[read] != 0:
                  nums[write], nums[read] = nums[read], nums[write]
                  write += 1
    `,
    explain: `<p><code>write</code> is the boundary: everything before it is a non-zero number in the original order. <b>Time O(n)</b>, <b>space O(1)</b>.</p>`,
  },
  'tp-dedupe': {
    title: 'Remove duplicates from a sorted list',
    level: 'Easy',
    pattern: 'Two pointers (same direction)',
    leetcode: '26. Remove Duplicates from Sorted Array',
    prompt: `<p><code>nums</code> is sorted. Remove the duplicates <b>in place</b> so the first <code>k</code> slots hold each unique value once, in order. To make testing easy, <b>return <code>nums[:k]</code></b>.</p>`,
    fn: 'remove_duplicates',
    starter: py`
      def remove_duplicates(nums):
          # TODO: use a write pointer and a read pointer
          k = 0
          return nums[:k]
    `,
    tests: [
      { args: [[1, 1, 2]], expect: [1, 2] },
      { args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expect: [0, 1, 2, 3, 4] },
      { args: [[7]], expect: [7] },
      { args: [[]], expect: [] },
      { args: [[2, 2, 2, 2]], expect: [2] },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['write', 'read'] }],
    hints: [
      'Watch the "fast &amp; slow" visualizer in the lesson again — it is this exact problem.',
      'An empty list is a special case: return <code>[]</code> straight away.',
      '<code>write = 1</code>; for <code>read</code> from 1: if <code>nums[read] != nums[write - 1]</code>, copy it to <code>nums[write]</code> and do <code>write += 1</code>. Return <code>nums[:write]</code>.',
    ],
    solution: py`
      def remove_duplicates(nums):
          if not nums:
              return []
          write = 1
          for read in range(1, len(nums)):
              if nums[read] != nums[write - 1]:
                  nums[write] = nums[read]
                  write += 1
          return nums[:write]
    `,
    explain: `<p>Because the list is sorted, duplicates sit next to each other, so we only compare with the last value we kept. <b>Time O(n)</b>, <b>space O(1)</b> (the final slice is only for testing).</p>`,
  },
  'tp-squares': {
    title: 'Squares of a sorted list',
    level: 'Easy',
    pattern: 'Two pointers (opposite ends)',
    leetcode: '977. Squares of a Sorted Array',
    prompt: `<p><code>nums</code> is sorted (it may contain negatives). Return a new list with the square of each number, <b>also sorted</b>. Try to do it in O(n) — without calling <code>sort()</code>.</p>`,
    fn: 'sorted_squares',
    starter: py`
      def sorted_squares(nums):
          # TODO: the biggest square is at one of the two ENDS
          return []
    `,
    tests: [
      { args: [[-4, -1, 0, 3, 10]], expect: [0, 1, 9, 16, 100] },
      { args: [[-7, -3, 2, 3, 11]], expect: [4, 9, 9, 49, 121] },
      { args: [[1]], expect: [1] },
      { args: [[-5, -3, -2]], expect: [4, 9, 25] },
      { args: [[]], expect: [] },
    ],
    hints: [
      'Where is the biggest square? It must be either the leftmost (a big negative) or the rightmost number.',
      'So fill the result from the <b>back</b>: <code>result = [0] * n</code>, position <code>pos</code> goes from <code>n - 1</code> down to 0.',
      'Compare <code>abs(nums[left])</code> and <code>abs(nums[right])</code>; put the bigger square at <code>result[pos]</code> and move that pointer inwards.',
    ],
    solution: py`
      def sorted_squares(nums):
          n = len(nums)
          result = [0] * n
          left, right = 0, n - 1
          for pos in range(n - 1, -1, -1):
              if abs(nums[left]) > abs(nums[right]):
                  result[pos] = nums[left] ** 2
                  left += 1
              else:
                  result[pos] = nums[right] ** 2
                  right -= 1
          return result
    `,
    explain: `<p>The squares are biggest at the ends and smallest in the middle, so the two ends "compete" for the next biggest place. <b>Time O(n)</b>. Using <code>sorted(x * x for x in nums)</code> is O(n log n) — fine in real life, but interviewers want the O(n) idea.</p>`,
  },
  'tp-water': {
    title: 'Container with most water',
    level: 'Medium',
    pattern: 'Two pointers (opposite ends)',
    leetcode: '11. Container With Most Water',
    prompt: `<p><code>height[i]</code> is the height of a vertical line at position <code>i</code>. Pick two lines; with the x-axis they form a container. Water area = <code>min(height[i], height[j]) * (j - i)</code>. Return the biggest area.</p>`,
    fn: 'max_area',
    starter: py`
      def max_area(height):
          # TODO
          return 0
    `,
    tests: [
      { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expect: 49 },
      { args: [[1, 1]], expect: 1 },
      { args: [[4, 3, 2, 1, 4]], expect: 16 },
      { args: [[1, 2, 1]], expect: 2 },
      { args: [[2, 3, 4, 5, 18, 17, 6]], expect: 17 },
    ],
    views: [{ type: 'array', var: 'height', pointers: ['left', 'right'], bars: true, range: ['left', 'right'] }],
    hints: [
      'Start with the widest container: <code>left = 0</code>, <code>right = len(height) - 1</code>. Keep the best area seen.',
      'The water level is limited by the <b>shorter</b> line. If you move the taller line inwards, can the area ever get bigger?',
      'No! Width gets smaller and the height is still capped by the short line. So always move the <b>shorter</b> one.',
    ],
    solution: py`
      def max_area(height):
          left, right = 0, len(height) - 1
          best = 0
          while left < right:
              h = min(height[left], height[right])
              best = max(best, h * (right - left))
              if height[left] < height[right]:
                  left += 1
              else:
                  right -= 1
          return best
    `,
    explain: `<p>Same "throw away what can't be the answer" idea as pair sum: the shorter line can't make a bigger container with anything closer, so we drop it. <b>Time O(n)</b>, <b>space O(1)</b>.</p>`,
  },
  'tp-3sum': {
    title: '3Sum',
    level: 'Medium',
    pattern: 'Sort + two pointers',
    leetcode: '15. 3Sum',
    prompt: `<p>Return all the <b>different</b> triplets <code>[a, b, c]</code> from <code>nums</code> with <code>a + b + c == 0</code> (each element used once per triplet). The order of the triplets and the order inside each triplet don't matter.</p>`,
    fn: 'three_sum',
    compare: 'nested',
    starter: py`
      def three_sum(nums):
          # TODO: sort first, then fix one number and run two pointers on the rest
          return []
    `,
    tests: [
      { args: [[-1, 0, 1, 2, -1, -4]], expect: [[-1, -1, 2], [-1, 0, 1]] },
      { args: [[0, 1, 1]], expect: [] },
      { args: [[0, 0, 0]], expect: [[0, 0, 0]] },
      { args: [[-2, 0, 1, 1, 2]], expect: [[-2, 0, 2], [-2, 1, 1]] },
      { args: [[1, -1, -1, 0]], expect: [[-1, 0, 1]] },
      { args: [[0, 0, 0, 0]], expect: [[0, 0, 0]] },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['i', 'left', 'right'] }],
    hints: [
      'Sort <code>nums</code>. Then for each index <code>i</code>, you need two numbers to the right of <code>i</code> that sum to <code>-nums[i]</code> — that\'s the pair-sum problem!',
      'To avoid duplicate triplets: skip <code>i</code> when <code>nums[i] == nums[i - 1]</code>.',
      'After finding a triplet, move both pointers, then keep moving <code>left</code> while it equals the previous value.',
    ],
    solution: py`
      def three_sum(nums):
          nums.sort()
          result = []
          for i in range(len(nums) - 2):
              if i > 0 and nums[i] == nums[i - 1]:
                  continue                      # same first number → same triplets
              left, right = i + 1, len(nums) - 1
              while left < right:
                  total = nums[i] + nums[left] + nums[right]
                  if total < 0:
                      left += 1
                  elif total > 0:
                      right -= 1
                  else:
                      result.append([nums[i], nums[left], nums[right]])
                      left += 1
                      right -= 1
                      while left < right and nums[left] == nums[left - 1]:
                          left += 1
          return result
    `,
    explain: `<p>A classic "reduce to a problem you know": fix one number, and the rest is <i>pair with target sum</i>. <b>Time O(n²)</b> (n starting points × O(n) two-pointer scan), which beats the O(n³) brute force.</p>`,
  },
})

addQuiz({
  'tp-quiz': [
    {
      q: 'In <i>pair with target sum</i> on a sorted list, <code>nums[left] + nums[right]</code> is <b>bigger</b> than the target. What do you do?',
      options: ['<code>left += 1</code>', '<code>right -= 1</code>', 'Move both', 'Restart from the beginning'],
      answer: 1,
      why: 'The sum is too big, so we need a smaller number. The only way to get smaller is to move <code>right</code> to the left (the list is sorted).',
    },
    {
      q: 'Why does the opposite-ends technique need the list to be <b>sorted</b>?',
      options: [
        'Python lists must be sorted for indexes to work',
        'So that moving a pointer changes the sum in a predictable direction',
        'Sorting makes it O(1)',
        'It doesn\'t need it',
      ],
      answer: 1,
      why: 'Sorted means: move left → bigger number, move right → smaller number. That is what lets us safely throw numbers away.',
    },
    {
      q: 'What is the time complexity of the two-pointer pair sum?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      answer: 2,
      why: 'Each step moves one pointer one place closer. They can meet after at most n steps.',
    },
    {
      q: 'In the fast &amp; slow version (remove duplicates), what does the <code>write</code> pointer mean?',
      options: [
        'The index of the current value being read',
        'Everything before it is the finished answer; it is where the next kept value goes',
        'The end of the list',
        'The number of duplicates found',
      ],
      answer: 1,
      why: 'That sentence is the "invariant" — the promise that stays true after every step. Saying the invariant out loud is how you write these loops without bugs.',
    },
    {
      q: 'Which problem is <b>NOT</b> a good fit for two pointers?',
      options: ['Reverse a string in place', 'Check if a string is a palindrome', 'Find two numbers that add to a target in an <b>unsorted</b> list (return their indexes)', 'Merge two sorted lists'],
      answer: 2,
      why: 'Unsorted + must return the original indexes → use a dict ("have I seen target − x?") from lesson 04. Sorting would lose the original indexes.',
    },
  ],
})
