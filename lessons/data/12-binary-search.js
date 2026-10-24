// Lesson 12 — Binary search
function l12NumberLine(maxVar) {
  return {
    type: 'html',
    render: (s) => {
      const piles = s.v(maxVar)
      if (!Array.isArray(piles)) return ''
      const max = Math.max(...piles)
      const lo = s.v('lo')
      const hi = s.v('hi')
      const mid = s.v('mid')
      const cells = []
      for (let v = 1; v <= max; v++) {
        const inside = Number.isInteger(lo) && v >= lo && v <= hi
        const cls = v === mid ? 'hot' : inside ? 'in-range' : Number.isInteger(lo) ? 'dim' : ''
        const ptr = [v === lo ? '<span>lo</span>' : '', v === mid ? '<span class="p1">mid</span>' : '', v === hi ? '<span class="p2">hi</span>' : ''].join('')
        cells.push(`<div class="arr-cell ${cls}"><div class="arr-ptrs">${ptr}</div><div class="arr-box">${v}</div></div>`)
      }
      return '<div class="view-title"><b>possible speeds</b> (the answer is somewhere in lo..hi)</div><div class="arr">' + cells.join('') + '</div>'
    },
  }
}

addViz({
  'bs-classic': {
    title: 'Binary search: halve the search space every step',
    code: py`
      def binary_search(nums, target):
          lo, hi = 0, len(nums) - 1
          while lo <= hi:                   #: {'the target can only be in nums[' + str(lo) + '..' + str(hi) + '] → ' + str(hi - lo + 1) + ' numbers left' if lo <= hi else 'lo > hi → nothing left, not found'}
              mid = (lo + hi) // 2          #: look in the middle: ({lo} + {hi}) // 2 = {(lo + hi) // 2}
              if nums[mid] == target:       #: nums[{mid}] = {nums[mid]}. Is it {target}? {'YES!' if nums[mid] == target else 'no'}
                  return mid
              if nums[mid] < target:        #: {str(nums[mid]) + ' < ' + str(target) + ' → the target is to the RIGHT. Throw away the left half' if nums[mid] < target else str(nums[mid]) + ' > ' + str(target) + ' → the target is to the LEFT. Throw away the right half'}
                  lo = mid + 1
              else:
                  hi = mid - 1
          return -1

      nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
      print(binary_search(nums, 23))
    `,
    views: [{ type: 'array', var: 'nums', pointers: ['lo', 'mid', 'hi'], range: ['lo', 'hi'] }],
  },
  'bs-lower': {
    title: 'Lower bound: the FIRST position where nums[i] >= target',
    code: py`
      def lower_bound(nums, target):
          lo, hi = 0, len(nums)             # the answer is somewhere in lo..hi (hi = "after the end")
          while lo < hi:
              mid = (lo + hi) // 2
              if nums[mid] < target:        #: nums[{mid}] = {nums[mid]} < {target}? {'yes → the answer is right of mid: lo = mid + 1' if nums[mid] < target else 'no → mid might be the answer, keep it: hi = mid'}
                  lo = mid + 1
              else:
                  hi = mid
          return lo                         #: lo == hi → the answer is {lo}

      print(lower_bound([1, 3, 3, 3, 5, 8, 9], 3))
    `,
    views: [{ type: 'array', var: 'nums', pointers: ['lo', 'mid', 'hi'], range: (s) => (Number.isInteger(s.v('lo')) ? [s.v('lo'), s.v('hi') - 1] : null) }],
  },
  'bs-answer': {
    title: 'Binary search on the ANSWER: slowest speed that still finishes',
    code: py`
      def hours_needed(piles, speed):
          return sum((p + speed - 1) // speed for p in piles)   # each pile, rounded up

      def min_speed(piles, hours):
          lo, hi = 1, max(piles)                 # the answer is a speed between 1 and the biggest pile
          while lo < hi:
              mid = (lo + hi) // 2
              if hours_needed(piles, mid) <= hours:   #: at speed {mid} she needs {hours_needed(piles, mid)} hours (limit {hours}) → {'fast enough: try slower, hi = mid' if hours_needed(piles, mid) <= hours else 'too slow: must be faster, lo = mid + 1'}
                  hi = mid
              else:
                  lo = mid + 1
          return lo

      print(min_speed([3, 6, 7, 11], 8))
    `,
    views: [{ type: 'array', var: 'piles' }, l12NumberLine('piles')],
  },
})

addWidget({
  'guess-game': (el) => {
    let secret = 0
    let guesses = 0
    let lo = 1
    let hi = 1000
    el.innerHTML = `<h4>Guess my number (1 – 1000)</h4>
      <div class="row"><input type="number" class="g" min="1" max="1000" style="width:110px" aria-label="your guess"><button class="btn primary b-g">Guess</button><button class="btn b-auto">Let binary search play</button><button class="btn b-new">New number</button></div>
      <div class="bar" style="position:relative;height:22px;background:var(--panel-2);border-radius:6px;overflow:hidden"><div class="win" style="position:absolute;top:0;bottom:0;background:var(--accent-soft);border:2px solid var(--accent);border-radius:6px"></div></div>
      <p class="msg"></p><div class="log" style="font:13px var(--mono);color:var(--ink-2)"></div>`
    const msg = el.querySelector('.msg')
    const log = el.querySelector('.log')
    const draw = () => {
      const win = el.querySelector('.win')
      win.style.left = ((lo - 1) / 1000) * 100 + '%'
      win.style.width = ((hi - lo + 1) / 1000) * 100 + '%'
    }
    const reset = () => {
      secret = 1 + Math.floor(Math.random() * 1000)
      guesses = 0
      lo = 1
      hi = 1000
      log.innerHTML = ''
      msg.innerHTML = 'I picked a number. Guess it! I\'ll say "higher" or "lower". The blue bar shows where it can still be.'
      draw()
    }
    const guess = (g) => {
      if (!(g >= 1 && g <= 1000)) return
      guesses++
      let text
      if (g === secret) text = `🎉 <b>${g}</b> is right! ${guesses} guesses. Binary search never needs more than <b>10</b> (because 2¹⁰ = 1024 ≥ 1000).`
      else if (g < secret) {
        lo = Math.max(lo, g + 1)
        text = `${g} is too small → higher. ${hi - lo + 1} numbers left.`
      } else {
        hi = Math.min(hi, g - 1)
        text = `${g} is too big → lower. ${hi - lo + 1} numbers left.`
      }
      msg.innerHTML = text
      log.innerHTML += `#${guesses}: ${g} — ${g === secret ? 'correct' : g < secret ? 'higher' : 'lower'}<br>`
      draw()
      return g === secret
    }
    el.querySelector('.b-g').onclick = () => guess(+el.querySelector('.g').value)
    el.querySelector('.g').onkeydown = (e) => e.key === 'Enter' && guess(+e.target.value)
    el.querySelector('.b-new').onclick = reset
    el.querySelector('.b-auto').onclick = () => {
      const step = () => {
        const mid = Math.floor((lo + hi) / 2)
        if (!guess(mid) && guesses < 12) setTimeout(step, 600)
      }
      step()
    }
    reset()
  },
})

addProblems({
  'bs-search': {
    title: 'Binary search',
    level: 'Easy',
    pattern: 'Binary search',
    leetcode: '704. Binary Search',
    prompt: '<p><code>nums</code> is sorted. Return the index of <code>target</code>, or <code>-1</code>. Must be O(log n): the big tests use a sorted sequence of one <b>billion</b> numbers (a Python <code>range</code>, which you can index like a list).</p>',
    fn: 'search',
    starter: py`
      def search(nums, target):
          # TODO
          return -1
    `,
    tests: [
      { args: [[-1, 0, 3, 5, 9, 12], 9], expect: 4 },
      { args: [[-1, 0, 3, 5, 9, 12], 2], expect: -1 },
      { args: [[5], 5], expect: 0 },
      { args: [[], 1], expect: -1 },
      { args: [[1, 3], 3], expect: 1 },
      { args: [{ __py__: 'range(0, 3 * 10**9, 3)' }, 2999999997], expect: 999999999 },
      { args: [{ __py__: 'range(0, 3 * 10**9, 3)' }, 1], expect: -1 },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['lo', 'mid', 'hi'], range: ['lo', 'hi'] }],
    hints: ['<code>lo, hi = 0, len(nums) - 1</code>, loop <code>while lo &lt;= hi</code>.', 'mid = (lo + hi) // 2. Equal → return. Too small → <code>lo = mid + 1</code>. Too big → <code>hi = mid - 1</code>.'],
    solution: py`
      def search(nums, target):
          lo, hi = 0, len(nums) - 1
          while lo <= hi:
              mid = (lo + hi) // 2
              if nums[mid] == target:
                  return mid
              if nums[mid] < target:
                  lo = mid + 1
              else:
                  hi = mid - 1
          return -1
    `,
    explain: '<p>At most ~30 steps for a billion numbers. The <code>+ 1</code> / <code>- 1</code> matter: <code>mid</code> was already checked, so exclude it — otherwise the loop can get stuck.</p>',
  },
  'bs-insert': {
    title: 'Search insert position',
    level: 'Easy',
    pattern: 'Lower bound',
    leetcode: '35. Search Insert Position',
    prompt: '<p><code>nums</code> is sorted with distinct values. Return the index of <code>target</code> if it is there, otherwise the index where it would be inserted to keep the list sorted.</p>',
    fn: 'search_insert',
    starter: py`
      def search_insert(nums, target):
          # TODO
          return 0
    `,
    tests: [
      { args: [[1, 3, 5, 6], 5], expect: 2 },
      { args: [[1, 3, 5, 6], 2], expect: 1 },
      { args: [[1, 3, 5, 6], 7], expect: 4 },
      { args: [[1, 3, 5, 6], 0], expect: 0 },
      { args: [[], 4], expect: 0 },
      { args: [{ __py__: 'range(0, 2 * 10**9, 2)' }, 1000001], expect: 500001 },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['lo', 'mid', 'hi'] }],
    hints: ['This is exactly "the first index where nums[i] &gt;= target" — the lower-bound visualizer.', '<code>lo, hi = 0, len(nums)</code>, <code>while lo &lt; hi</code>, and <code>hi = mid</code> (not mid − 1) in the else branch.'],
    solution: py`
      def search_insert(nums, target):
          lo, hi = 0, len(nums)
          while lo < hi:
              mid = (lo + hi) // 2
              if nums[mid] < target:
                  lo = mid + 1
              else:
                  hi = mid
          return lo
    `,
    explain: '<p>The library version: <code>bisect.bisect_left(nums, target)</code>.</p>',
  },
  'bs-sqrt': {
    title: 'Integer square root',
    level: 'Easy',
    pattern: 'Binary search on the answer',
    leetcode: '69. Sqrt(x)',
    prompt: '<p>Return the square root of <code>x</code> rounded <b>down</b>, without <code>**</code>, <code>sqrt</code> or <code>math</code>. The last test is <code>10**18</code>.</p>',
    fn: 'my_sqrt',
    starter: py`
      def my_sqrt(x):
          # TODO: search for the biggest r with r * r <= x
          return 0
    `,
    tests: [
      { args: [4], expect: 2 },
      { args: [8], expect: 2 },
      { args: [0], expect: 0 },
      { args: [1], expect: 1 },
      { args: [2147395599], expect: 46339 },
      { args: [{ __py__: '10**18' }], expect: 1000000000 },
    ],
    hints: ['The answer is between 0 and x. The question "is r*r &lt;= x?" is True, True, …, True, False, False — sorted!', 'Find the <b>last</b> r where it is True. One way: <code>lo, hi = 0, x</code>; <code>mid = (lo + hi + 1) // 2</code>; if <code>mid * mid &lt;= x: lo = mid</code> else <code>hi = mid - 1</code>.'],
    solution: py`
      def my_sqrt(x):
          lo, hi = 0, x
          while lo < hi:
              mid = (lo + hi + 1) // 2      # round UP so lo = mid always makes progress
              if mid * mid <= x:
                  lo = mid
              else:
                  hi = mid - 1
          return lo
    `,
    explain: '<p>Binary search works on any yes/no question that is "sorted" (all yes then all no). Looking for the <b>last</b> yes needs <code>mid</code> rounded up, or <code>lo = mid</code> could loop forever when <code>hi = lo + 1</code>.</p>',
  },
  'bs-range': {
    title: 'First and last position',
    level: 'Medium',
    pattern: 'Two lower bounds',
    leetcode: '34. Find First and Last Position of Element in Sorted Array',
    prompt: '<p><code>nums</code> is sorted and may contain duplicates. Return <code>[first, last]</code> index of <code>target</code>, or <code>[-1, -1]</code>. O(log n).</p>',
    fn: 'search_range',
    starter: py`
      def search_range(nums, target):
          # TODO
          return [-1, -1]
    `,
    tests: [
      { args: [[5, 7, 7, 8, 8, 10], 8], expect: [3, 4] },
      { args: [[5, 7, 7, 8, 8, 10], 6], expect: [-1, -1] },
      { args: [[], 0], expect: [-1, -1] },
      { args: [[1], 1], expect: [0, 0] },
      { args: [[2, 2, 2, 2], 2], expect: [0, 3] },
    ],
    hints: ['Write a <code>lower_bound(x)</code> helper: first index with <code>nums[i] &gt;= x</code>.', 'first = lower_bound(target). last = lower_bound(target + 1) − 1. If first is out of range or <code>nums[first] != target</code> → [-1, -1].'],
    solution: py`
      def search_range(nums, target):
          def lower_bound(x):
              lo, hi = 0, len(nums)
              while lo < hi:
                  mid = (lo + hi) // 2
                  if nums[mid] < x:
                      lo = mid + 1
                  else:
                      hi = mid
              return lo

          first = lower_bound(target)
          if first == len(nums) or nums[first] != target:
              return [-1, -1]
          return [first, lower_bound(target + 1) - 1]
    `,
    explain: '<p>Reusing one well-tested helper twice is much safer than writing two slightly different binary searches.</p>',
  },
  'bs-peak': {
    title: 'Find a peak element',
    level: 'Medium',
    pattern: 'Binary search on a slope',
    leetcode: '162. Find Peak Element',
    prompt: '<p>A peak is bigger than its neighbours (imagine <code>-∞</code> outside the list). Neighbours are never equal. Return the index of <b>any</b> peak in O(log n).</p>',
    fn: 'find_peak_element',
    starter: py`
      def find_peak_element(nums):
          # TODO
          return 0
    `,
    tests: [
      { args: [[1, 2, 3, 1]], expect: 2 },
      { args: [[1, 2, 1, 3, 5, 6, 4]], expect: 1, anyOf: [1, 5] },
      { args: [[1]], expect: 0 },
      { args: [[1, 2]], expect: 1 },
      { args: [[3, 2, 1]], expect: 0 },
    ],
    hints: ['The list isn\'t sorted — but look at the <b>slope</b> at mid.', 'If <code>nums[mid] &lt; nums[mid + 1]</code>, you are walking uphill: a peak must exist to the right. Otherwise one exists at mid or to the left.'],
    solution: py`
      def find_peak_element(nums):
          lo, hi = 0, len(nums) - 1
          while lo < hi:
              mid = (lo + hi) // 2
              if nums[mid] < nums[mid + 1]:
                  lo = mid + 1
              else:
                  hi = mid
          return lo
    `,
    explain: '<p>Binary search needs a rule that tells you which half is safe to keep, not necessarily a sorted list.</p>',
  },
  'bs-rot-min': {
    title: 'Minimum in a rotated sorted list',
    level: 'Medium',
    pattern: 'Binary search (compare with the end)',
    leetcode: '153. Find Minimum in Rotated Sorted Array',
    prompt: '<p>A sorted list of distinct numbers was rotated: <code>[0,1,2,4,5,6,7]</code> → <code>[4,5,6,7,0,1,2]</code>. Return the minimum in O(log n).</p>',
    fn: 'find_min',
    starter: py`
      def find_min(nums):
          # TODO
          return nums[0]
    `,
    tests: [
      { args: [[3, 4, 5, 1, 2]], expect: 1 },
      { args: [[4, 5, 6, 7, 0, 1, 2]], expect: 0 },
      { args: [[11, 13, 15, 17]], expect: 11 },
      { args: [[2, 1]], expect: 1 },
      { args: [[1]], expect: 1 },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['lo', 'mid', 'hi'], range: ['lo', 'hi'] }],
    hints: ['Compare <code>nums[mid]</code> with <code>nums[hi]</code>.', 'If <code>nums[mid] &gt; nums[hi]</code>, the "drop" (the minimum) is to the right of mid. Otherwise the minimum is at mid or to its left (<code>hi = mid</code>).'],
    solution: py`
      def find_min(nums):
          lo, hi = 0, len(nums) - 1
          while lo < hi:
              mid = (lo + hi) // 2
              if nums[mid] > nums[hi]:
                  lo = mid + 1
              else:
                  hi = mid
          return nums[lo]
    `,
    explain: '<p>O(log n). Draw the rotated list as a line that goes up, drops, and goes up again — then the rule is obvious.</p>',
  },
  'bs-rot-search': {
    title: 'Search in a rotated sorted list',
    level: 'Medium',
    pattern: 'Binary search (which half is sorted?)',
    leetcode: '33. Search in Rotated Sorted Array',
    prompt: '<p>Like the previous problem, but return the index of <code>target</code> (or <code>-1</code>) in O(log n).</p>',
    fn: 'search_rotated',
    starter: py`
      def search_rotated(nums, target):
          # TODO
          return -1
    `,
    tests: [
      { args: [[4, 5, 6, 7, 0, 1, 2], 0], expect: 4 },
      { args: [[4, 5, 6, 7, 0, 1, 2], 3], expect: -1 },
      { args: [[1], 0], expect: -1 },
      { args: [[5, 1, 3], 3], expect: 2 },
      { args: [[3, 1], 1], expect: 1 },
      { args: [[1, 3], 3], expect: 1 },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['lo', 'mid', 'hi'], range: ['lo', 'hi'] }],
    hints: ['At every mid, at least one half (<code>lo..mid</code> or <code>mid..hi</code>) is normally sorted. Find out which: <code>nums[lo] &lt;= nums[mid]</code> means the left half is sorted.', 'If the target is inside the sorted half\'s range, go there; otherwise go to the other half.'],
    solution: py`
      def search_rotated(nums, target):
          lo, hi = 0, len(nums) - 1
          while lo <= hi:
              mid = (lo + hi) // 2
              if nums[mid] == target:
                  return mid
              if nums[lo] <= nums[mid]:                 # left half is sorted
                  if nums[lo] <= target < nums[mid]:
                      hi = mid - 1
                  else:
                      lo = mid + 1
              else:                                     # right half is sorted
                  if nums[mid] < target <= nums[hi]:
                      lo = mid + 1
                  else:
                      hi = mid - 1
          return -1
    `,
    explain: '<p>A classic interview question. The idea "one half is always sorted" is the whole trick; the rest is careful &lt; and &lt;=.</p>',
  },
  'bs-koko': {
    title: 'Koko eating bananas',
    level: 'Medium',
    pattern: 'Binary search on the answer',
    leetcode: '875. Koko Eating Bananas',
    prompt: '<p>Koko eats bananas at speed <code>k</code> per hour: each hour she picks one pile and eats <code>k</code> bananas from it (if the pile has fewer, she eats it and waits until the hour ends). Return the smallest <code>k</code> that lets her finish all <code>piles</code> within <code>h</code> hours.</p>',
    fn: 'min_eating_speed',
    starter: py`
      def min_eating_speed(piles, h):
          # TODO
          return 1
    `,
    tests: [
      { args: [[3, 6, 7, 11], 8], expect: 4 },
      { args: [[30, 11, 23, 4, 20], 5], expect: 30 },
      { args: [[30, 11, 23, 4, 20], 6], expect: 23 },
      { args: [[1], 1], expect: 1 },
      { args: [[1000000000], 2], expect: 500000000 },
    ],
    views: [{ type: 'array', var: 'piles' }, l12NumberLine('piles')],
    hints: ['If speed k works, every faster speed also works. So "does k work?" is False…False, True…True — sorted!', 'Binary search k between 1 and <code>max(piles)</code>. Hours at speed k: <code>sum((p + k - 1) // k for p in piles)</code> (that is p / k rounded up).'],
    solution: py`
      def min_eating_speed(piles, h):
          lo, hi = 1, max(piles)
          while lo < hi:
              mid = (lo + hi) // 2
              hours = sum((p + mid - 1) // mid for p in piles)
              if hours <= h:
                  hi = mid
              else:
                  lo = mid + 1
          return lo
    `,
    explain: '<p>O(n log max). The pattern: "find the minimum X such that something is possible" + "bigger X is always also possible" → binary search on X.</p>',
  },
  'bs-matrix': {
    title: 'Search a 2-D matrix',
    level: 'Medium',
    pattern: 'Binary search with index math',
    leetcode: '74. Search a 2D Matrix',
    prompt: '<p>Each row is sorted, and the first number of each row is bigger than the last number of the previous row. Return whether <code>target</code> is in the matrix, in O(log(rows × cols)).</p>',
    fn: 'search_matrix',
    starter: py`
      def search_matrix(matrix, target):
          # TODO
          return False
    `,
    tests: [
      { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], expect: true },
      { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], expect: false },
      { args: [[[1]], 1], expect: true },
      { args: [[[1, 3]], 2], expect: false },
    ],
    hints: ['Read the matrix row by row and it\'s one long sorted list of rows × cols numbers.', 'Binary search on index i in 0..rows*cols−1, and use <code>matrix[i // cols][i % cols]</code>.'],
    solution: py`
      def search_matrix(matrix, target):
          rows, cols = len(matrix), len(matrix[0])
          lo, hi = 0, rows * cols - 1
          while lo <= hi:
              mid = (lo + hi) // 2
              value = matrix[mid // cols][mid % cols]
              if value == target:
                  return True
              if value < target:
                  lo = mid + 1
              else:
                  hi = mid - 1
          return False
    `,
    explain: '<p><code>i // cols</code> and <code>i % cols</code> turn a flat index into (row, col) — a handy trick for grids.</p>',
  },
})

addQuiz({
  'bs-quiz': [
    { q: 'How many steps does binary search need for 1,000,000 sorted numbers (at most)?', options: ['About 20', 'About 1000', 'About 500,000', '1,000,000'], answer: 0, why: '2²⁰ ≈ 1,000,000, so about 20 halvings.' },
    { q: 'What does binary search need?', options: ['A sorted list, or any yes/no question that flips only once', 'A hash map', 'Unique values', 'A linked list'], answer: 0, why: 'You need a rule that tells you which half to throw away. Sorted data is the most common case, "binary search on the answer" is the other.' },
    { q: 'In the classic version (<code>while lo &lt;= hi</code>), why <code>lo = mid + 1</code> and not <code>lo = mid</code>?', options: ['It is faster', 'mid was already checked; with lo = mid the loop can get stuck forever', 'Python requires it', 'No reason'], answer: 1, why: 'When lo == hi, mid == lo, and <code>lo = mid</code> changes nothing → infinite loop.' },
    { q: '"Find the minimum capacity/speed/days so that X is possible." Which pattern?', options: ['Sliding window', 'Binary search on the answer', 'Two pointers', 'Prefix sums'], answer: 1, why: 'If a bigger value always works when a smaller one does, binary search the value and test it with a helper function.' },
    { q: 'What does <code>bisect.bisect_left([1, 3, 3, 5], 3)</code> return?', options: ['1', '2', '3', '0'], answer: 0, why: 'The first index where the value is &gt;= 3 (lower bound). <code>bisect_right</code> would return 3.' },
  ],
})
