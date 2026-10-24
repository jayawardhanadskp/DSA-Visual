// Lesson 11 — Sorting
addViz({
  'sort-insertion': {
    title: 'Insertion sort: like sorting playing cards in your hand',
    code: py`
      def insertion_sort(nums):
          for i in range(1, len(nums)):
              current = nums[i]                       #: pick up {nums[i]} (index {i}). Everything left of index {i} is already sorted
              j = i - 1
              while j >= 0 and nums[j] > current:     #: {('is ' + str(nums[j]) + ' > ' + str(current) + '? ' + ('yes → shift ' + str(nums[j]) + ' one place right' if nums[j] > current else 'no → stop here')) if j >= 0 else 'reached the start of the list → stop'}
                  nums[j + 1] = nums[j]
                  j -= 1
              nums[j + 1] = current                   #: drop {current} into the gap at index {j + 1}
          return nums

      print(insertion_sort([5, 2, 4, 6, 1, 3]))
    `,
    views: [
      {
        type: 'array',
        var: 'nums',
        bars: true,
        pointers: ['i', 'j'],
        cls: (s) => {
          const i = s.v('i')
          const o = {}
          if (Number.isInteger(i)) for (let k = 0; k < i; k++) o[k] = 'done'
          return o
        },
      },
    ],
  },
  'sort-merge': {
    title: 'Merge sort: split in half, sort each half, merge',
    code: py`
      def merge_sort(nums):
          if len(nums) <= 1:
              return nums                          #: one element (or none) is already sorted
          mid = len(nums) // 2
          left = merge_sort(nums[:mid])            #: sort the left half {nums[:mid]} (trust it!)
          right = merge_sort(nums[mid:])           #: sort the right half {nums[mid:]}
          return merge(left, right)                #: merge {left} + {right}

      def merge(a, b):
          result = []
          i = j = 0
          while i < len(a) and j < len(b):
              if a[i] <= b[j]:                     #: take the smaller front: {min(a[i], b[j])}
                  result.append(a[i])
                  i += 1
              else:
                  result.append(b[j])
                  j += 1
          return result + a[i:] + b[j:]

      print(merge_sort([6, 3, 8, 1, 5, 2]))
    `,
    views: [
      { type: 'calltree', fn: 'merge_sort', label: (s) => s.fmt(s.raw('nums')) },
      { type: 'array', var: (s) => (s.fn === 'merge' ? s.v('a') : null), label: 'a (sorted left half)', pointers: ['i'] },
      { type: 'array', var: (s) => (s.fn === 'merge' ? s.v('b') : null), label: 'b (sorted right half)', pointers: ['j'] },
      { type: 'array', var: (s) => (s.fn === 'merge' ? s.v('result') : null), label: 'result' },
    ],
    wide: true,
    hideGlobals: true,
  },
  'sort-quick': {
    title: 'Quick sort: put a pivot in its final place, then sort both sides',
    code: py`
      def partition(nums, lo, hi):
          pivot = nums[hi]                          #: pivot = {nums[hi]} (the last element of nums[{lo}..{hi}])
          i = lo                                    # next slot for a number smaller than the pivot
          for j in range(lo, hi):
              if nums[j] < pivot:                   #: is {nums[j]} < {pivot}? {'yes → swap it into slot ' + str(i) if nums[j] < pivot else 'no → leave it'}
                  nums[i], nums[j] = nums[j], nums[i]
                  i += 1
          nums[i], nums[hi] = nums[hi], nums[i]     #: put the pivot {pivot} into its FINAL place: index {i}
          return i

      def quick_sort(nums, lo, hi):
          if lo < hi:
              p = partition(nums, lo, hi)
              quick_sort(nums, lo, p - 1)           #: sort the part left of the pivot: {lo}..{p - 1}
              quick_sort(nums, p + 1, hi)           #: sort the part right of the pivot: {p + 1}..{hi}

      nums = [7, 2, 9, 4, 3, 8, 1, 6]
      quick_sort(nums, 0, len(nums) - 1)
      print(nums)
    `,
    views: [
      { type: 'array', var: 'nums', bars: true, pointers: ['i', 'j', 'p'], range: ['lo', 'hi'], dim: false },
      { type: 'calltree', fn: 'quick_sort', label: (s) => `sort ${s.v('lo')}..${s.v('hi')}`, showReturn: false },
    ],
    hideGlobals: true,
  },
})

addWidget({
  'sort-race': (el) => {
    const N = 32
    const algos = {
      'Bubble O(n²)': function* (a) {
        for (let i = 0; i < a.length; i++)
          for (let j = 0; j < a.length - 1 - i; j++) {
            yield [j, j + 1]
            if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]]
          }
      },
      'Insertion O(n²)': function* (a) {
        for (let i = 1; i < a.length; i++) {
          let j = i
          while (j > 0) {
            yield [j - 1, j]
            if (a[j - 1] <= a[j]) break
            ;[a[j - 1], a[j]] = [a[j], a[j - 1]]
            j--
          }
        }
      },
      'Merge O(n log n)': function* (a) {
        for (let w = 1; w < a.length; w *= 2)
          for (let lo = 0; lo < a.length; lo += 2 * w) {
            const mid = Math.min(lo + w, a.length)
            const hi = Math.min(lo + 2 * w, a.length)
            const merged = []
            let i = lo
            let j = mid
            while (i < mid && j < hi) {
              yield [i, j]
              merged.push(a[i] <= a[j] ? a[i++] : a[j++])
            }
            while (i < mid) merged.push(a[i++])
            while (j < hi) merged.push(a[j++])
            merged.forEach((v, k) => (a[lo + k] = v))
          }
      },
      'Quick O(n log n)': function* (a) {
        const stack = [[0, a.length - 1]]
        while (stack.length) {
          const [lo, hi] = stack.pop()
          if (lo >= hi) continue
          const pivot = a[hi]
          let i = lo
          for (let j = lo; j < hi; j++) {
            yield [j, hi]
            if (a[j] < pivot) {
              ;[a[i], a[j]] = [a[j], a[i]]
              i++
            }
          }
          ;[a[i], a[hi]] = [a[hi], a[i]]
          stack.push([lo, i - 1], [i + 1, hi])
        }
      },
    }
    el.innerHTML = `<h4>Sorting race (same ${N} numbers, counting comparisons)</h4>
      <div class="row"><button class="btn primary b-go">▶ Start</button><button class="btn b-shuffle">🔀 New numbers</button><button class="btn b-rev">Reversed input</button><button class="btn b-near">Almost sorted input</button></div>
      <div class="lanes" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px"></div>`
    let base = []
    let timer = null
    const lanes = el.querySelector('.lanes')
    const make = (kind) => {
      base = Array.from({ length: N }, (_, i) => i + 1)
      if (kind === 'rev') base.reverse()
      else if (kind === 'near') {
        for (let k = 0; k < 3; k++) {
          const i = Math.floor(Math.random() * (N - 1))
          ;[base[i], base[i + 1]] = [base[i + 1], base[i]]
        }
      } else base.sort(() => Math.random() - 0.5)
      setup()
    }
    let state = []
    const setup = () => {
      clearInterval(timer)
      timer = null
      state = Object.entries(algos).map(([name, gen]) => {
        const arr = base.slice()
        return { name, arr, it: gen(arr), hot: [], count: 0, done: false }
      })
      draw()
    }
    const draw = () => {
      lanes.innerHTML = state
        .map(
          (s) => `<div><div class="view-title"><b>${s.name}</b> — ${s.count} comparisons ${s.done ? '✅' : ''}</div>
          <div style="display:flex;align-items:flex-end;gap:1px;height:90px">${s.arr.map((v, i) => `<div style="flex:1;height:${(v / N) * 100}%;background:${s.hot.includes(i) ? 'var(--warn)' : s.done ? 'var(--good)' : 'var(--accent)'};border-radius:2px 2px 0 0"></div>`).join('')}</div></div>`,
        )
        .join('')
    }
    el.querySelector('.b-go').onclick = () => {
      if (timer) return
      setup()
      timer = setInterval(() => {
        let running = false
        state.forEach((s) => {
          if (s.done) return
          const r = s.it.next()
          if (r.done) {
            s.done = true
            s.hot = []
          } else {
            s.hot = r.value
            s.count++
            running = true
          }
        })
        draw()
        if (!running) {
          clearInterval(timer)
          timer = null
        }
      }, 25)
    }
    el.querySelector('.b-shuffle').onclick = () => make('random')
    el.querySelector('.b-rev').onclick = () => make('rev')
    el.querySelector('.b-near').onclick = () => make('near')
    make('random')
  },
})

addProblems({
  'so-insertion': {
    title: 'Implement insertion sort',
    level: 'Easy',
    pattern: 'Sorting by hand',
    prompt: '<p>Sort <code>nums</code> in increasing order using <b>insertion sort</b> (no <code>sorted()</code> / <code>.sort()</code>) and return it.</p>',
    fn: 'insertion_sort',
    starter: py`
      def insertion_sort(nums):
          # TODO
          return nums
    `,
    tests: [
      { args: [[5, 2, 4, 6, 1, 3]], expect: [1, 2, 3, 4, 5, 6] },
      { args: [[]], expect: [] },
      { args: [[1]], expect: [1] },
      { args: [[3, 3, 1]], expect: [1, 3, 3] },
      { args: [[-1, 5, -10]], expect: [-10, -1, 5] },
    ],
    views: [{ type: 'array', var: 'nums', bars: true, pointers: ['i', 'j'] }],
    hints: ['Watch the visualizer: for each i, take <code>current = nums[i]</code> and shift bigger elements on its left one place right.', 'Then put current into the gap at <code>j + 1</code>.'],
    solution: py`
      def insertion_sort(nums):
          for i in range(1, len(nums)):
              current = nums[i]
              j = i - 1
              while j >= 0 and nums[j] > current:
                  nums[j + 1] = nums[j]
                  j -= 1
              nums[j + 1] = current
          return nums
    `,
    explain: '<p>O(n²) worst case, but O(n) on almost-sorted input (the inner loop stops immediately). That\'s why real sorts (Timsort) use it for small pieces.</p>',
  },
  'so-merge-sort': {
    title: 'Implement merge sort',
    level: 'Medium',
    pattern: 'Divide &amp; conquer',
    leetcode: '912. Sort an Array',
    prompt: '<p>Sort <code>nums</code> with <b>merge sort</b> and return a sorted list. The last test has 8,000 numbers in reverse order — an O(n²) sort is too slow.</p>',
    fn: 'merge_sort',
    starter: py`
      def merge_sort(nums):
          # TODO: base case, split, sort halves (recursion), merge
          return nums
    `,
    tests: [
      { args: [[5, 2, 3, 1]], expect: [1, 2, 3, 5] },
      { args: [[5, 1, 1, 2, 0, 0]], expect: [0, 0, 1, 1, 2, 5] },
      { args: [[]], expect: [] },
      { args: [[42]], expect: [42] },
      { args: [{ __py__: 'list(range(8_000, 0, -1))' }], expect: { __py__: 'list(range(1, 8_001))' } },
    ],
    views: [{ type: 'calltree', fn: 'merge_sort', label: (s) => s.fmt(s.raw('nums')) }],
    hints: ['Base case: length 0 or 1 → return it.', 'Split at <code>mid = len(nums) // 2</code>, sort both halves recursively, then merge them with two pointers (you wrote merge in lesson 03).'],
    solution: py`
      def merge_sort(nums):
          if len(nums) <= 1:
              return nums
          mid = len(nums) // 2
          left = merge_sort(nums[:mid])
          right = merge_sort(nums[mid:])
          result = []
          i = j = 0
          while i < len(left) and j < len(right):
              if left[i] <= right[j]:
                  result.append(left[i])
                  i += 1
              else:
                  result.append(right[j])
                  j += 1
          return result + left[i:] + right[j:]
    `,
    explain: '<p>log₂ n levels of splitting, and each level merges n elements in total → <b>O(n log n)</b> always. Space O(n) for the merged lists.</p>',
  },
  'so-colors': {
    title: 'Sort colors (Dutch national flag)',
    level: 'Medium',
    pattern: 'Three pointers',
    leetcode: '75. Sort Colors',
    prompt: '<p><code>nums</code> has only 0, 1 and 2. Sort it <b>in place</b> in one pass, without <code>sort()</code>.</p>',
    fn: 'sort_colors',
    inplace: 0,
    starter: py`
      def sort_colors(nums):
          # TODO
          pass
    `,
    tests: [
      { args: [[2, 0, 2, 1, 1, 0]], expect: [0, 0, 1, 1, 2, 2] },
      { args: [[2, 0, 1]], expect: [0, 1, 2] },
      { args: [[0]], expect: [0] },
      { args: [[1, 1]], expect: [1, 1] },
      { args: [[2, 2, 0, 0]], expect: [0, 0, 2, 2] },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['low', 'mid', 'high'] }],
    hints: ['Easy 2-pass way: count the 0s, 1s, 2s, then overwrite. Now try one pass:', 'Three pointers: everything before <code>low</code> is 0, everything after <code>high</code> is 2, <code>mid</code> scans.', 'nums[mid] == 0 → swap with low, move low and mid. == 1 → move mid. == 2 → swap with high, move high (but not mid — check the swapped-in value!).'],
    solution: py`
      def sort_colors(nums):
          low, mid, high = 0, 0, len(nums) - 1
          while mid <= high:
              if nums[mid] == 0:
                  nums[low], nums[mid] = nums[mid], nums[low]
                  low += 1
                  mid += 1
              elif nums[mid] == 1:
                  mid += 1
              else:
                  nums[mid], nums[high] = nums[high], nums[mid]
                  high -= 1
    `,
    explain: '<p>One pass, O(1) space. The same partitioning idea as quick sort, with 3 groups instead of 2.</p>',
  },
  'so-people': {
    title: 'Sort people by age, then name',
    level: 'Easy',
    pattern: 'sorted(key=…)',
    prompt: '<p><code>people</code> is a list of <code>[name, age]</code>. Return them sorted by age (youngest first); people with the same age in alphabetical order.</p>',
    fn: 'sort_people',
    starter: py`
      def sort_people(people):
          # TODO: one line with sorted(..., key=lambda p: ...)
          return people
    `,
    tests: [
      { args: [[['ann', 30], ['bob', 25], ['cat', 30], ['dan', 20]]], expect: [['dan', 20], ['bob', 25], ['ann', 30], ['cat', 30]] },
      { args: [[]], expect: [] },
      { args: [[['zed', 5], ['amy', 5]]], expect: [['amy', 5], ['zed', 5]] },
    ],
    hints: ['A key can be a tuple: Python compares tuples item by item.', '<code>sorted(people, key=lambda p: (p[1], p[0]))</code>'],
    solution: py`
      def sort_people(people):
          return sorted(people, key=lambda p: (p[1], p[0]))
    `,
    explain: '<p>Tuple keys are the Pythonic way to sort by several things. For "age descending, name ascending" use <code>key=lambda p: (-p[1], p[0])</code>.</p>',
  },
  'so-kth': {
    title: 'K-th largest element',
    level: 'Medium',
    pattern: 'Sort (heap in lesson 14)',
    leetcode: '215. Kth Largest Element in an Array',
    prompt: '<p>Return the <code>k</code>-th largest element (counting duplicates: in <code>[3, 3, 1]</code> the 2nd largest is 3).</p>',
    fn: 'find_kth_largest',
    starter: py`
      def find_kth_largest(nums, k):
          # TODO
          return 0
    `,
    tests: [
      { args: [[3, 2, 1, 5, 6, 4], 2], expect: 5 },
      { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expect: 4 },
      { args: [[1], 1], expect: 1 },
      { args: [[7, 7, 7], 2], expect: 7 },
    ],
    hints: ['Sort descending and take index <code>k - 1</code>.'],
    solution: py`
      def find_kth_largest(nums, k):
          return sorted(nums, reverse=True)[k - 1]
    `,
    explain: '<p>O(n log n). Lesson 14 does it in O(n log k) with a heap, and "quickselect" (quick sort\'s partition, only recursing into one side) does it in O(n) on average.</p>',
  },
  'so-min-diff': {
    title: 'Minimum absolute difference pairs',
    level: 'Easy',
    pattern: 'Sort, then compare neighbours',
    leetcode: '1200. Minimum Absolute Difference',
    prompt: '<p>All values are different. Find the smallest difference between any two values, and return all pairs <code>[a, b]</code> (a &lt; b) with that difference, in increasing order.</p>',
    fn: 'minimum_abs_difference',
    starter: py`
      def minimum_abs_difference(arr):
          # TODO
          return []
    `,
    tests: [
      { args: [[4, 2, 1, 3]], expect: [[1, 2], [2, 3], [3, 4]] },
      { args: [[1, 3, 6, 10, 15]], expect: [[1, 3]] },
      { args: [[3, 8, -10, 23, 19, -4, -14, 27]], expect: [[-14, -10], [19, 23], [23, 27]] },
    ],
    hints: ['After sorting, the closest pair is always next to each other.', 'Pass 1: find the minimum difference of neighbours. Pass 2: collect the neighbour pairs with that difference.'],
    solution: py`
      def minimum_abs_difference(arr):
          arr = sorted(arr)
          best = min(arr[i + 1] - arr[i] for i in range(len(arr) - 1))
          return [[arr[i], arr[i + 1]] for i in range(len(arr) - 1) if arr[i + 1] - arr[i] == best]
    `,
    explain: '<p>"Sort first" turns an O(n²) all-pairs problem into O(n log n). Ask yourself early: <i>would sorting make this easy?</i></p>',
  },
  'so-frequency': {
    title: 'Sort by frequency',
    level: 'Easy',
    pattern: 'Count + custom key',
    leetcode: '1636. Sort Array by Increasing Frequency',
    prompt: '<p>Sort <code>nums</code> by how often each value appears (rarer first). If two values appear equally often, put the <b>bigger</b> value first.</p>',
    fn: 'frequency_sort',
    starter: py`
      def frequency_sort(nums):
          # TODO
          return nums
    `,
    tests: [
      { args: [[1, 1, 2, 2, 2, 3]], expect: [3, 1, 1, 2, 2, 2] },
      { args: [[2, 3, 1, 3, 2]], expect: [1, 3, 3, 2, 2] },
      { args: [[-1, 1, -6, 4, 5, -6, 1, 4, 1]], expect: [5, -1, 4, 4, -6, -6, 1, 1, 1] },
    ],
    hints: ['Count with <code>Counter</code>.', '<code>sorted(nums, key=lambda x: (counts[x], -x))</code>'],
    solution: py`
      from collections import Counter

      def frequency_sort(nums):
          counts = Counter(nums)
          return sorted(nums, key=lambda x: (counts[x], -x))
    `,
    explain: '<p>Counting + a tuple key. The <code>-x</code> trick flips the order for numbers.</p>',
  },
  'so-largest-number': {
    title: 'Largest number',
    level: 'Medium',
    pattern: 'Custom comparison',
    leetcode: '179. Largest Number',
    prompt: '<p>Arrange the numbers so that, written one after another, they form the largest number. Return it as a string. <code>[3, 30, 34, 5, 9]</code> → <code>"9534330"</code>.</p>',
    fn: 'largest_number',
    starter: py`
      def largest_number(nums):
          # TODO
          return ""
    `,
    tests: [
      { args: [[10, 2]], expect: '210' },
      { args: [[3, 30, 34, 5, 9]], expect: '9534330' },
      { args: [[0, 0]], expect: '0' },
      { args: [[1]], expect: '1' },
      { args: [[432, 43243]], expect: '43243432' },
    ],
    hints: ['Normal sorting of strings puts "30" before "3", which is wrong here.', 'Compare two numbers a and b by which concatenation is bigger: <code>a + b</code> vs <code>b + a</code> (as strings).', '<code>from functools import cmp_to_key</code> turns a compare function (returning −1/0/1) into a key. Watch out for all zeros → "0".'],
    solution: py`
      from functools import cmp_to_key

      def largest_number(nums):
          strs = [str(x) for x in nums]

          def compare(a, b):
              if a + b > b + a:
                  return -1        # a should come first
              if a + b < b + a:
                  return 1
              return 0

          strs.sort(key=cmp_to_key(compare))
          result = "".join(strs)
          return "0" if result[0] == "0" else result
    `,
    explain: '<p>When the order is not "natural", define how two items compare. O(n log n) comparisons.</p>',
  },
})

addQuiz({
  'so-quiz': [
    { q: 'What is the best possible time for a sort that only compares elements?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 1, why: 'Comparison sorts can\'t beat O(n log n) in the worst case. Counting/bucket sort can be O(n) when values are small integers.' },
    { q: 'What is the difference between <code>nums.sort()</code> and <code>sorted(nums)</code>?', options: ['No difference', '<code>sort()</code> changes the list and returns None; <code>sorted()</code> returns a new list', '<code>sorted()</code> is faster', '<code>sort()</code> only works for numbers'], answer: 1, why: 'A classic bug: <code>nums = nums.sort()</code> sets nums to None!' },
    { q: 'Which sort is fastest on an <b>almost sorted</b> list?', options: ['Merge sort', 'Insertion sort', 'Quick sort with the last element as pivot', 'Selection sort'], answer: 1, why: 'Insertion sort does almost no shifting → close to O(n). (Quick sort with a last-element pivot is at its <i>worst</i> on sorted input: O(n²).)' },
    { q: 'Python\'s sort is <b>stable</b>. What does that mean?', options: ['It never crashes', 'Equal elements keep their original order', 'It is O(n log n)', 'It sorts in place'], answer: 1, why: 'So you can sort by name, then by age, and people with the same age stay sorted by name.' },
    { q: 'How do you sort words by length, longest first, and alphabetically when equal?', options: ['<code>sorted(w, key=len, reverse=True)</code>', '<code>sorted(w, key=lambda s: (-len(s), s))</code>', '<code>sorted(w, key=lambda s: (len(s), s), reverse=True)</code>', '<code>w.sort(len)</code>'], answer: 1, why: 'Negate the number you want descending; keep the string as is for ascending. (Option 3 would also reverse the alphabetical order.)' },
  ],
})
