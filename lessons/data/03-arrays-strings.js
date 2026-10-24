// Lesson 03 — Arrays & strings
addViz({
  'arr-insert': {
    title: 'Why insert at the front is O(n): everything shifts',
    code: py`
      def insert_at(arr, index, value):
          arr.append(None)                 #: make one free slot at the end
          i = len(arr) - 1
          while i > index:
              arr[i] = arr[i - 1]          #: shift {arr[i - 1]} one place to the right (index {i - 1} → {i})
              i -= 1
          arr[index] = value               #: the gap is at index {index}: put {value} there
          return arr

      nums = [3, 8, 1, 9, 4]
      insert_at(nums, 1, 7)
      print(nums)
    `,
    views: [{ type: 'array', var: 'arr', pointers: ['i', 'index'] }],
  },
  'arr-stock': {
    title: 'One pass with "so far" variables: best stock profit',
    code: py`
      def max_profit(prices):
          lowest = prices[0]            # cheapest price seen so far
          best = 0                      # best profit seen so far
          for i in range(1, len(prices)):
              price = prices[i]
              if price < lowest:        #: is today's {price} cheaper than the lowest so far ({lowest})? {'yes → new cheapest day to buy' if price < lowest else 'no'}
                  lowest = price
              else:
                  best = max(best, price - lowest)   #: sell today: {price} - {lowest} = {price - lowest}. best = max({best}, {price - lowest}) = {max(best, price - lowest)}
          return best

      print(max_profit([7, 1, 5, 3, 6, 4]))
    `,
    views: [{ type: 'array', var: 'prices', pointers: ['i'], bars: true }],
  },
  'arr-letter-counts': {
    title: 'A list of 26 counters (one per letter)',
    code: py`
      def letter_counts(word):
          counts = [0] * 26
          for ch in word:
              counts[ord(ch) - ord("a")] += 1    #: '{ch}' → ord('{ch}') - ord('a') = {ord(ch) - ord("a")} → counts[{ord(ch) - ord("a")}] += 1
          return counts

      print(letter_counts("cabbage"))
    `,
    views: [{ type: 'array', var: 'counts', indexLabels: 'abcdefghijklmnopqrstuvwxyz'.split(''), cls: (s) => { const ch = s.v('ch'); return typeof ch === 'string' ? { [ch.charCodeAt(0) - 97]: 'hot' } : {} } }],
  },
  'arr-grid': {
    title: 'Grids: visiting the 4 neighbours of a cell',
    code: py`
      grid = [[1, 0, 1, 1],
              [1, 1, 0, 0],
              [0, 1, 1, 0]]
      rows, cols = len(grid), len(grid[0])
      r, c = 1, 1
      total = 0
      for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:    # up, down, left, right
          nr, nc = r + dr, c + dc
          if 0 <= nr < rows and 0 <= nc < cols:            #: is ({nr}, {nc}) inside the grid? {'yes' if 0 <= nr < rows and 0 <= nc < cols else 'NO → skip'}
              total += grid[nr][nc]                        #: neighbour ({nr}, {nc}) holds {grid[nr][nc]}
      print(total)
    `,
    views: [
      {
        type: 'grid',
        var: 'grid',
        indexes: true,
        marks: (s) => {
          const m = [[s.v('r'), s.v('c'), 'hot']]
          if (Number.isInteger(s.v('nr'))) m.push([s.v('nr'), s.v('nc'), 'ref'])
          return m
        },
      },
    ],
  },
})

addWidget({
  'array-memory': (el) => {
    let arr = [3, 8, 1, 9]
    let moved = []
    let next = 10
    let total = 0
    el.innerHTML = `<h4>Play with a Python list in memory</h4>
      <p style="margin:0 0 6px;font-size:15px">A list is a row of slots next to each other in memory. Python can jump to any index instantly (O(1)).
      But adding or removing at the <b>front</b> means moving every other element.</p>
      <div class="row">
        <button class="btn b-app">append(x)</button><button class="btn b-pop">pop()</button>
        <button class="btn b-ins">insert(0, x)</button><button class="btn b-pop0">pop(0)</button>
        <button class="btn b-get">a[2]</button><button class="btn b-reset">reset</button>
      </div>
      <div class="arr" style="min-height:70px"></div>
      <p class="msg"></p>`
    const box = el.querySelector('.arr')
    const msg = el.querySelector('.msg')
    const draw = (text, hot = []) => {
      box.innerHTML = arr
        .map((v, i) => `<div class="arr-cell${moved.includes(i) ? ' changed hot' : ''}${hot.includes(i) ? ' in-range' : ''}"><div class="arr-ptrs"></div><div class="arr-box">${v}</div><div class="arr-idx">${i}</div></div>`)
        .join('') + '<div class="arr-cell ghost"><div class="arr-ptrs"></div><div class="arr-box"></div><div class="arr-idx">free</div></div>'
      if (text) msg.innerHTML = text + ` <span style="color:var(--ink-3)">(total moves so far: ${total})</span>`
    }
    el.querySelector('.b-app').onclick = () => {
      arr.push(next++)
      moved = [arr.length - 1]
      draw('<b>append</b>: wrote 1 slot at the end, moved <b>0</b> elements → O(1).')
    }
    el.querySelector('.b-pop').onclick = () => {
      if (!arr.length) return draw('The list is empty.')
      const v = arr.pop()
      moved = []
      draw(`<b>pop()</b> removed ${v} from the end, moved <b>0</b> elements → O(1).`)
    }
    el.querySelector('.b-ins').onclick = () => {
      const n = arr.length
      arr.unshift(next++)
      total += n
      moved = arr.map((_, i) => i)
      draw(`<b>insert(0, x)</b>: had to move all <b>${n}</b> elements one place right → O(n).`)
    }
    el.querySelector('.b-pop0').onclick = () => {
      if (!arr.length) return draw('The list is empty.')
      const v = arr.shift()
      total += arr.length
      moved = arr.map((_, i) => i)
      draw(`<b>pop(0)</b> removed ${v}, then moved <b>${arr.length}</b> elements one place left → O(n).`)
    }
    el.querySelector('.b-get').onclick = () => {
      moved = []
      if (arr.length < 3) return draw('Needs at least 3 elements.')
      draw(`<b>a[2]</b> = ${arr[2]}: Python computes "start address + 2 × slot size" and jumps there. No searching → O(1).`, [2])
    }
    el.querySelector('.b-reset').onclick = () => {
      arr = [3, 8, 1, 9]
      next = 10
      total = 0
      moved = []
      draw('Reset.')
    }
    draw('Click the buttons. Watch which elements have to move.')
  },
})

addProblems({
  'arr-profit': {
    title: 'Best time to buy and sell a stock',
    level: 'Easy',
    pattern: 'One pass + "so far" variables',
    leetcode: '121. Best Time to Buy and Sell Stock',
    prompt: '<p><code>prices[i]</code> is the price on day <code>i</code>. Buy on one day and sell on a <b>later</b> day. Return the biggest profit, or <code>0</code> if you can\'t make money.</p>',
    fn: 'max_profit',
    starter: py`
      def max_profit(prices):
          # TODO: one pass. What do you need to remember about the past?
          return 0
    `,
    tests: [
      { args: [[7, 1, 5, 3, 6, 4]], expect: 5 },
      { args: [[7, 6, 4, 3, 1]], expect: 0 },
      { args: [[1, 2]], expect: 1 },
      { args: [[2, 4, 1]], expect: 2 },
      { args: [[3, 3, 3]], expect: 0 },
      { args: [{ __py__: 'list(range(100_000, 0, -1)) + [200_000]' }], expect: 199999 },
    ],
    views: [{ type: 'array', var: 'prices', pointers: ['i'], bars: true }],
    hints: [
      'Brute force: try every (buy day, sell day) pair — O(n²). Too slow for the last test.',
      'If you sell on day i, the best buy day is the <b>cheapest day before i</b>. Keep that as a "so far" variable.',
      'For each price: update <code>best = max(best, price - lowest)</code> and <code>lowest = min(lowest, price)</code>.',
    ],
    solution: py`
      def max_profit(prices):
          lowest = prices[0]
          best = 0
          for price in prices[1:]:
              best = max(best, price - lowest)
              lowest = min(lowest, price)
          return best
    `,
    explain: '<p>O(n) time, O(1) space. The key thought: "if I sell <i>today</i>, what is the best I could have done?" — then the past is summarised by one number.</p>',
  },
  'arr-missing': {
    title: 'Missing number',
    level: 'Easy',
    pattern: 'Math / one pass',
    leetcode: '268. Missing Number',
    prompt: '<p><code>nums</code> contains <code>n</code> different numbers from the range <code>0..n</code> — so exactly one number in that range is missing. Return it. O(n) time, O(1) extra space.</p>',
    fn: 'missing_number',
    starter: py`
      def missing_number(nums):
          # TODO
          return 0
    `,
    tests: [
      { args: [[3, 0, 1]], expect: 2 },
      { args: [[0, 1]], expect: 2 },
      { args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expect: 8 },
      { args: [[1]], expect: 0 },
      { args: [{ __py__: '[x for x in range(100_001) if x != 4242]' }], expect: 4242 },
    ],
    hints: ['What should the sum of 0..n be? (Lesson 02 had the formula.)', 'Expected sum minus actual sum = the missing number. n is <code>len(nums)</code>.'],
    solution: py`
      def missing_number(nums):
          n = len(nums)
          return n * (n + 1) // 2 - sum(nums)
    `,
    explain: '<p>O(n) time, O(1) space. Lesson 19 shows another trick with XOR.</p>',
  },
  'arr-plus-one': {
    title: 'Plus one',
    level: 'Easy',
    pattern: 'Walk from the end',
    leetcode: '66. Plus One',
    prompt: '<p>A big number is stored as a list of digits, most significant first (<code>[1, 2, 9]</code> is 129). Add one and return the new list of digits.</p>',
    fn: 'plus_one',
    starter: py`
      def plus_one(digits):
          # TODO: work from the last digit, like you add on paper
          return digits
    `,
    tests: [
      { args: [[1, 2, 3]], expect: [1, 2, 4] },
      { args: [[1, 2, 9]], expect: [1, 3, 0] },
      { args: [[9]], expect: [1, 0] },
      { args: [[9, 9]], expect: [1, 0, 0] },
      { args: [[0]], expect: [1] },
    ],
    hints: ['Loop <code>i</code> from <code>len(digits) - 1</code> down to 0.', 'If the digit is less than 9, add one and <b>return</b> straight away. If it is 9, it becomes 0 and the carry moves left.', 'If the loop finishes, every digit was 9: return <code>[1] + digits</code>.'],
    solution: py`
      def plus_one(digits):
          for i in range(len(digits) - 1, -1, -1):
              if digits[i] < 9:
                  digits[i] += 1
                  return digits
              digits[i] = 0
          return [1] + digits
    `,
    explain: '<p>O(n) in the worst case (all 9s), but usually it stops after one step.</p>',
  },
  'arr-merge': {
    title: 'Merge two sorted lists',
    level: 'Easy',
    pattern: 'Two pointers (two lists)',
    leetcode: '88. Merge Sorted Array',
    prompt: '<p><code>a</code> and <code>b</code> are sorted. Return one sorted list with all their elements. Don\'t use <code>sorted()</code> — do it in O(n + m) by walking both lists.</p>',
    fn: 'merge_sorted',
    starter: py`
      def merge_sorted(a, b):
          result = []
          i, j = 0, 0
          # TODO
          return result
    `,
    tests: [
      { args: [[1, 3, 5], [2, 4, 6]], expect: [1, 2, 3, 4, 5, 6] },
      { args: [[], [1]], expect: [1] },
      { args: [[1, 2, 3], []], expect: [1, 2, 3] },
      { args: [[1, 1], [1]], expect: [1, 1, 1] },
      { args: [[-5, 0, 10], [-6, 20]], expect: [-6, -5, 0, 10, 20] },
    ],
    views: [{ type: 'array', var: 'a', pointers: ['i'] }, { type: 'array', var: 'b', pointers: ['j'] }, { type: 'array', var: 'result' }],
    hints: ['<code>i</code> walks <code>a</code>, <code>j</code> walks <code>b</code>. While both have elements, take the smaller one.', 'When one list runs out, add the rest of the other: <code>result.extend(a[i:])</code> and <code>result.extend(b[j:])</code>.'],
    solution: py`
      def merge_sorted(a, b):
          result = []
          i, j = 0, 0
          while i < len(a) and j < len(b):
              if a[i] <= b[j]:
                  result.append(a[i])
                  i += 1
              else:
                  result.append(b[j])
                  j += 1
          result.extend(a[i:])
          result.extend(b[j:])
          return result
    `,
    explain: '<p>Each step moves one pointer, so O(n + m). This is the heart of <b>merge sort</b> (lesson 11).</p>',
  },
  'arr-prefix': {
    title: 'Longest common prefix',
    level: 'Easy',
    pattern: 'Compare column by column',
    leetcode: '14. Longest Common Prefix',
    prompt: '<p>Return the longest string that is a prefix (start) of every string in <code>strs</code>. Return <code>""</code> if there is none.</p>',
    fn: 'longest_common_prefix',
    starter: py`
      def longest_common_prefix(strs):
          # TODO
          return ""
    `,
    tests: [
      { args: [['flower', 'flow', 'flight']], expect: 'fl' },
      { args: [['dog', 'racecar', 'car']], expect: '' },
      { args: [['alone']], expect: 'alone' },
      { args: [['ab', 'ab']], expect: 'ab' },
      { args: [['', 'b']], expect: '' },
      { args: [['interview', 'internet', 'interval']], expect: 'inter' },
    ],
    hints: ['Take the first word. Check its characters one position at a time.', 'At position <code>i</code>, every other word must be long enough <b>and</b> have the same character. If not, return <code>first[:i]</code>.'],
    solution: py`
      def longest_common_prefix(strs):
          first = strs[0]
          for i in range(len(first)):
              for word in strs[1:]:
                  if i >= len(word) or word[i] != first[i]:
                      return first[:i]
          return first
    `,
    explain: '<p>O(total number of characters). Checking "column by column" stops as early as possible.</p>',
  },
  'arr-compress': {
    title: 'String compression',
    level: 'Easy',
    pattern: 'Group runs, build with a list',
    prompt: '<p>Compress runs of the same character: <code>"aabcccccaaa"</code> → <code>"a2b1c5a3"</code>. If the compressed string is <b>not shorter</b> than the original, return the original.</p>',
    fn: 'compress',
    starter: py`
      def compress(s):
          parts = []
          # TODO: count each run of the same character
          return "".join(parts)
    `,
    tests: [
      { args: ['aabcccccaaa'], expect: 'a2b1c5a3' },
      { args: ['abc'], expect: 'abc' },
      { args: [''], expect: '' },
      { args: ['aaaa'], expect: 'a4' },
      { args: ['aabb'], expect: 'aabb' },
    ],
    hints: ['Walk with an index <code>i</code>. From <code>i</code>, move <code>j</code> forward while <code>s[j] == s[i]</code>. The run length is <code>j - i</code>.', 'Append <code>s[i]</code> and <code>str(j - i)</code> to <code>parts</code>, then <code>i = j</code>. At the end compare lengths.'],
    solution: py`
      def compress(s):
          parts = []
          i = 0
          while i < len(s):
              j = i
              while j < len(s) and s[j] == s[i]:
                  j += 1
              parts.append(s[i] + str(j - i))
              i = j
          result = "".join(parts)
          return result if len(result) < len(s) else s
    `,
    explain: '<p>The inner <code>while</code> doesn\'t make it O(n²): together, <code>i</code> and <code>j</code> only move forward n times. Building a list and joining once avoids slow string <code>+=</code>.</p>',
  },
  'arr-rotate': {
    title: 'Rotate a list to the right by k',
    level: 'Medium',
    pattern: 'Reverse trick',
    leetcode: '189. Rotate Array',
    prompt: '<p>Rotate <code>nums</code> to the right by <code>k</code> steps, <b>in place</b>. <code>[1,2,3,4,5,6,7]</code>, k = 3 → <code>[5,6,7,1,2,3,4]</code>. k can be bigger than the length.</p>',
    fn: 'rotate',
    inplace: 0,
    starter: py`
      def rotate(nums, k):
          # TODO: change nums in place
          pass
    `,
    tests: [
      { args: [[1, 2, 3, 4, 5, 6, 7], 3], expect: [5, 6, 7, 1, 2, 3, 4] },
      { args: [[-1, -100, 3, 99], 2], expect: [3, 99, -1, -100] },
      { args: [[1, 2], 3], expect: [2, 1] },
      { args: [[1], 0], expect: [1] },
      { args: [[1, 2, 3], 3], expect: [1, 2, 3] },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['left', 'right'] }],
    hints: [
      'First do <code>k %= len(nums)</code> — rotating by the length changes nothing.',
      'Easy Python way: <code>nums[:] = nums[-k:] + nums[:-k]</code> (careful when k is 0!). <code>nums[:] = …</code> replaces the contents <i>in place</i>; <code>nums = …</code> would only re-label a local name.',
      'O(1)-space way: reverse the whole list, then reverse the first k, then reverse the rest.',
    ],
    solution: py`
      def rotate(nums, k):
          n = len(nums)
          k %= n

          def reverse(left, right):
              while left < right:
                  nums[left], nums[right] = nums[right], nums[left]
                  left += 1
                  right -= 1

          reverse(0, n - 1)      # [7,6,5,4,3,2,1]
          reverse(0, k - 1)      # [5,6,7,4,3,2,1]
          reverse(k, n - 1)      # [5,6,7,1,2,3,4]
    `,
    explain: '<p>O(n) time, O(1) space. Press 🎬 Watch my code with the solution to see the three reversals. The reverse helper is the two-pointer template from lesson 05.</p>',
  },
  'arr-spiral': {
    title: 'Spiral order of a matrix',
    level: 'Medium',
    pattern: 'Grid boundaries',
    leetcode: '54. Spiral Matrix',
    prompt: '<p>Return all elements of the matrix in spiral order: right along the top, down the right side, left along the bottom, up the left side, then repeat inside.</p>',
    fn: 'spiral_order',
    starter: py`
      def spiral_order(matrix):
          result = []
          top, bottom = 0, len(matrix) - 1
          left, right = 0, len(matrix[0]) - 1
          # TODO: walk the 4 sides, then shrink the boundaries
          return result
    `,
    tests: [
      { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expect: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
      { args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expect: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
      { args: [[[1]]], expect: [1] },
      { args: [[[1, 2], [3, 4]]], expect: [1, 2, 4, 3] },
      { args: [[[1], [2], [3]]], expect: [1, 2, 3] },
    ],
    views: [{ type: 'grid', var: 'matrix', indexes: true }, { type: 'array', var: 'result' }],
    hints: [
      'Keep four boundaries: <code>top</code>, <code>bottom</code>, <code>left</code>, <code>right</code>. Loop while <code>top &lt;= bottom and left &lt;= right</code>.',
      'Top row left→right, then <code>top += 1</code>. Right column top→bottom, then <code>right -= 1</code>.',
      'Before the bottom row and the left column, check again that <code>top &lt;= bottom</code> / <code>left &lt;= right</code> — otherwise a single row or column is added twice.',
    ],
    solution: py`
      def spiral_order(matrix):
          result = []
          top, bottom = 0, len(matrix) - 1
          left, right = 0, len(matrix[0]) - 1
          while top <= bottom and left <= right:
              for c in range(left, right + 1):
                  result.append(matrix[top][c])
              top += 1
              for r in range(top, bottom + 1):
                  result.append(matrix[r][right])
              right -= 1
              if top <= bottom:
                  for c in range(right, left - 1, -1):
                      result.append(matrix[bottom][c])
                  bottom -= 1
              if left <= right:
                  for r in range(bottom, top - 1, -1):
                      result.append(matrix[r][left])
                  left += 1
          return result
    `,
    explain: '<p>O(rows × cols). No clever trick — just careful boundaries. These "simulation" problems reward drawing the grid on paper first.</p>',
  },
  'arr-rotate-image': {
    title: 'Rotate an image 90° clockwise',
    level: 'Medium',
    pattern: 'Transpose + reverse',
    leetcode: '48. Rotate Image',
    prompt: '<p>Rotate the n × n <code>matrix</code> 90° clockwise, <b>in place</b>.</p>',
    fn: 'rotate_image',
    inplace: 0,
    starter: py`
      def rotate_image(matrix):
          # TODO: change matrix in place
          pass
    `,
    tests: [
      { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expect: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] },
      { args: [[[1]]], expect: [[1]] },
      { args: [[[1, 2], [3, 4]]], expect: [[3, 1], [4, 2]] },
      { args: [[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]], expect: [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]] },
    ],
    views: [{ type: 'grid', var: 'matrix', indexes: true, pointer: ['r', 'c'] }],
    hints: ['Draw a 3×3 grid and its rotation. Where does row 0 end up? (It becomes the last column.)', 'Two easy steps: <b>transpose</b> (swap <code>matrix[r][c]</code> with <code>matrix[c][r]</code> for <code>c &gt; r</code>), then <b>reverse each row</b>.'],
    solution: py`
      def rotate_image(matrix):
          n = len(matrix)
          for r in range(n):
              for c in range(r + 1, n):
                  matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]
          for row in matrix:
              row.reverse()
    `,
    explain: '<p>O(n²) — you have to touch every cell — and O(1) extra space. Breaking a hard move into two easy moves is a great general trick.</p>',
  },
})

addQuiz({
  'arr-quiz': [
    { q: 'Why is <code>nums[500000]</code> just as fast as <code>nums[0]</code>?', options: ['Python caches it', 'The address is computed: start + index × slot size', 'Lists are sorted', 'It isn\'t — it is slower'], answer: 1, why: 'The slots are next to each other in memory, so Python can jump directly. That is what "random access" means.' },
    { q: 'You need to add 100,000 items to the <b>front</b> of a sequence, one by one. Best choice?', options: ['<code>list.insert(0, x)</code>', '<code>collections.deque</code> with <code>appendleft</code>', 'A string', 'A set'], answer: 1, why: 'Each <code>insert(0, x)</code> on a list is O(n) → O(n²) total. A deque adds to either end in O(1).' },
    { q: 'What does this code do to <code>s</code>?', code: 's = "cat"\ns[0] = "b"', options: ['s becomes "bat"', 'TypeError: strings are immutable', 's becomes "bcat"', 'Nothing'], answer: 1, why: 'Strings can\'t be changed. Build a new one: <code>s = "b" + s[1:]</code>, or use a list of characters.' },
    { q: 'Inside a grid with <code>rows</code> × <code>cols</code>, when is <code>(nr, nc)</code> a valid cell?', options: ['<code>nr &lt; rows and nc &lt; cols</code>', '<code>0 &lt;= nr &lt; rows and 0 &lt;= nc &lt; cols</code>', '<code>nr &gt;= 0 or nc &gt;= 0</code>', '<code>grid[nr][nc] != None</code>'], answer: 1, why: 'Check both sides of both coordinates. Negative indexes don\'t raise an error in Python — <code>grid[-1]</code> silently gives the last row — so forgetting <code>0 &lt;=</code> creates sneaky bugs.' },
    { q: 'What is the best way to build a long string from many pieces?', options: ['<code>s += piece</code> in a loop', 'Collect pieces in a list, then <code>"".join(pieces)</code>', 'Use a set', '<code>str(list)</code>'], answer: 1, why: 'Each <code>+=</code> can copy the whole string. <code>join</code> builds it once: O(total length).' },
  ],
})
