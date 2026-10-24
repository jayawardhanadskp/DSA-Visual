// Lesson 14 — Heaps & priority queues
addViz({
  'heap-push': {
    title: 'Push: add at the end, then bubble UP',
    code: py`
      def push(heap, val):
          heap.append(val)                      #: add {val} at the end (the next free spot in the tree)
          i = len(heap) - 1
          while i > 0:
              parent = (i - 1) // 2
              if heap[i] < heap[parent]:        #: is {heap[i]} smaller than its parent {heap[parent]}? {'yes → swap them (bubble up)' if heap[i] < heap[parent] else 'no → it is in the right place, stop'}
                  heap[i], heap[parent] = heap[parent], heap[i]
                  i = parent
              else:
                  break

      heap = []
      for x in [5, 3, 8, 1, 9, 2]:
          push(heap, x)
      print(heap)
    `,
    views: [
      { type: 'heaptree', var: 'heap', pointers: ['i', 'parent'] },
      { type: 'array', var: 'heap', pointers: ['i', 'parent'], label: 'heap (the real list)' },
    ],
  },
  'heap-pop': {
    title: 'Pop: take the top, move the last item up, then sink it DOWN',
    code: py`
      def pop(heap):
          smallest = heap[0]                    #: the smallest is always at the top: {heap[0]}
          last = heap.pop()
          if heap:
              heap[0] = last                    #: move the last item ({last}) to the top — probably too big for it
              i = 0
              while True:
                  left, right = 2 * i + 1, 2 * i + 2
                  small = i
                  if left < len(heap) and heap[left] < heap[small]:
                      small = left
                  if right < len(heap) and heap[right] < heap[small]:
                      small = right
                  if small == i:                #: {'is ' + str(heap[i]) + ' smaller than its children? yes → done' if small == i else str(heap[i]) + ' is bigger than its smaller child ' + str(heap[small]) + ' → swap (sink down)'}
                      break
                  heap[i], heap[small] = heap[small], heap[i]
                  i = small
          return smallest

      heap = [1, 3, 2, 5, 9, 8, 4]
      print(pop(heap), heap)
    `,
    views: [
      { type: 'heaptree', var: 'heap', pointers: ['i', 'small'] },
      { type: 'array', var: 'heap', pointers: ['i', 'left', 'right'], label: 'heap (the real list)' },
    ],
  },
  'heap-topk': {
    title: 'Top k with heapq: keep a min-heap of size k',
    code: py`
      import heapq

      def k_largest(nums, k):
          heap = []                            # min-heap of the k biggest numbers so far
          for x in nums:
              heapq.heappush(heap, x)          #: push {x}
              if len(heap) > k:
                  heapq.heappop(heap)          #: {len(heap)} > {k} items → throw away the smallest one: {heap[0]}
          return sorted(heap, reverse=True)

      print(k_largest([7, 2, 9, 4, 11, 5, 8], 3))
    `,
    views: [
      { type: 'array', var: 'nums', pointers: [] },
      { type: 'heaptree', var: 'heap' },
    ],
  },
})

addProblems({
  'hp-kth': {
    title: 'K-th largest element (with a heap)',
    level: 'Medium',
    pattern: 'Min-heap of size k',
    leetcode: '215. Kth Largest Element in an Array',
    prompt: '<p>Return the <code>k</code>-th largest element. This time use <code>heapq</code>: O(n log k).</p>',
    fn: 'find_kth_largest',
    starter: py`
      import heapq

      def find_kth_largest(nums, k):
          # TODO
          return 0
    `,
    tests: [
      { args: [[3, 2, 1, 5, 6, 4], 2], expect: 5 },
      { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expect: 4 },
      { args: [[1], 1], expect: 1 },
      { args: [{ __py__: 'list(range(200_000))' }, 5], expect: 199995 },
    ],
    views: [{ type: 'heaptree', var: 'heap' }],
    hints: ['Keep a min-heap with the k biggest numbers seen so far.', 'Push each number; if the heap has more than k items, pop the smallest. At the end <code>heap[0]</code> is the answer.'],
    solution: py`
      import heapq

      def find_kth_largest(nums, k):
          heap = []
          for x in nums:
              heapq.heappush(heap, x)
              if len(heap) > k:
                  heapq.heappop(heap)
          return heap[0]
    `,
    explain: '<p>O(n log k) time, O(k) space. One-liner: <code>heapq.nlargest(k, nums)[-1]</code>.</p>',
  },
  'hp-stones': {
    title: 'Last stone weight',
    level: 'Easy',
    pattern: 'Max-heap (negated)',
    leetcode: '1046. Last Stone Weight',
    prompt: '<p>Each turn, smash the two heaviest stones x ≤ y: if equal both disappear, otherwise a stone of weight y − x remains. Return the weight of the last stone, or 0.</p>',
    fn: 'last_stone_weight',
    starter: py`
      import heapq

      def last_stone_weight(stones):
          # TODO: heapq is a MIN-heap. How do you get the biggest?
          return 0
    `,
    tests: [
      { args: [[2, 7, 4, 1, 8, 1]], expect: 1 },
      { args: [[1]], expect: 1 },
      { args: [[2, 2]], expect: 0 },
      { args: [[10, 4, 2, 10]], expect: 2 },
      { args: [[3, 7, 2]], expect: 2 },
    ],
    views: [{ type: 'heaptree', var: 'heap' }],
    hints: ['Store negative weights: the smallest negative number is the biggest stone.', '<code>heap = [-s for s in stones]</code>, <code>heapq.heapify(heap)</code>. Pop two, push back the difference if not zero.'],
    solution: py`
      import heapq

      def last_stone_weight(stones):
          heap = [-s for s in stones]
          heapq.heapify(heap)
          while len(heap) > 1:
              y = -heapq.heappop(heap)
              x = -heapq.heappop(heap)
              if y != x:
                  heapq.heappush(heap, -(y - x))
          return -heap[0] if heap else 0
    `,
    explain: '<p>The "negate to get a max-heap" trick is used all the time in Python. <code>heapify</code> builds a heap from a list in O(n).</p>',
  },
  'hp-kth-class': {
    title: 'K-th largest in a stream (design)',
    level: 'Easy',
    pattern: 'Min-heap of size k',
    leetcode: '703. Kth Largest Element in a Stream',
    prompt: '<p>Design <code>KthLargest(k, nums)</code> with <code>add(val)</code> that adds a number and returns the current k-th largest.</p>',
    fn: 'KthLargest',
    starter: py`
      import heapq

      class KthLargest:
          def __init__(self, k, nums):
              pass

          def add(self, val):
              pass
    `,
    tests: [
      { ops: ['KthLargest', 'add', 'add', 'add', 'add', 'add'], args: [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]], expect: [null, 4, 5, 5, 8, 8] },
      { ops: ['KthLargest', 'add', 'add'], args: [[1, []], [-3], [-2]], expect: [null, -3, -2] },
    ],
    hints: ['Keep only the k biggest numbers in a min-heap. The smallest of them (<code>heap[0]</code>) is the k-th largest.', 'In <code>add</code>: push, and pop if the heap has more than k items.'],
    solution: py`
      import heapq

      class KthLargest:
          def __init__(self, k, nums):
              self.k = k
              self.heap = []
              for x in nums:
                  self.add(x)

          def add(self, val):
              heapq.heappush(self.heap, val)
              if len(self.heap) > self.k:
                  heapq.heappop(self.heap)
              return self.heap[0]
    `,
    explain: '<p>Each <code>add</code> is O(log k) — no matter how many numbers arrived before.</p>',
  },
  'hp-closest': {
    title: 'K closest points to the origin',
    level: 'Medium',
    pattern: 'Heap with tuples',
    leetcode: '973. K Closest Points to Origin',
    prompt: '<p>Return the <code>k</code> points closest to <code>(0, 0)</code> (any order). Distance² = x² + y².</p>',
    fn: 'k_closest',
    compare: 'outer',
    starter: py`
      import heapq

      def k_closest(points, k):
          # TODO
          return []
    `,
    tests: [
      { args: [[[1, 3], [-2, 2]], 1], expect: [[-2, 2]] },
      { args: [[[3, 3], [5, -1], [-2, 4]], 2], expect: [[3, 3], [-2, 4]] },
      { args: [[[0, 1], [1, 0]], 2], expect: [[0, 1], [1, 0]] },
      { args: [[[1, 1], [2, 2], [3, 3], [-1, -1]], 2], expect: [[1, 1], [-1, -1]] },
    ],
    hints: ['Heaps compare tuples item by item, so push <code>(distance, x, y)</code>.', 'Simple: <code>heapq.nsmallest(k, points, key=lambda p: p[0]**2 + p[1]**2)</code>. Or keep a max-heap of size k using negative distances.'],
    solution: py`
      import heapq

      def k_closest(points, k):
          heap = []                                  # max-heap (negated) of the k closest so far
          for x, y in points:
              heapq.heappush(heap, (-(x * x + y * y), x, y))
              if len(heap) > k:
                  heapq.heappop(heap)                # remove the farthest
          return [[x, y] for _, x, y in heap]
    `,
    explain: '<p>O(n log k). Putting tuples in a heap — <code>(priority, data…)</code> — is how you store things "with a priority".</p>',
  },
  'hp-top-words': {
    title: 'Top K frequent words',
    level: 'Medium',
    pattern: 'Count + heap/sort with tie-break',
    leetcode: '692. Top K Frequent Words',
    prompt: '<p>Return the <code>k</code> most frequent words, most frequent first. Words with the same count are sorted alphabetically.</p>',
    fn: 'top_k_words',
    starter: py`
      from collections import Counter
      import heapq

      def top_k_words(words, k):
          # TODO
          return []
    `,
    tests: [
      { args: [['i', 'love', 'leetcode', 'i', 'love', 'coding'], 2], expect: ['i', 'love'] },
      { args: [['the', 'day', 'is', 'sunny', 'the', 'the', 'the', 'sunny', 'is', 'is'], 4], expect: ['the', 'is', 'sunny', 'day'] },
      { args: [['a', 'b', 'c'], 2], expect: ['a', 'b'] },
    ],
    hints: ['Count first. The order you want is: count descending, then word ascending.', 'Key <code>(-count, word)</code> gives exactly that order: <code>heapq.nsmallest(k, counts, key=lambda w: (-counts[w], w))</code>.'],
    solution: py`
      from collections import Counter
      import heapq

      def top_k_words(words, k):
          counts = Counter(words)
          return heapq.nsmallest(k, counts, key=lambda w: (-counts[w], w))
    `,
    explain: '<p><code>nsmallest</code> / <code>nlargest</code> use a heap of size k inside: O(n log k).</p>',
  },
  'hp-merge-k': {
    title: 'Merge k sorted lists',
    level: 'Hard',
    pattern: 'Heap of "next items"',
    leetcode: '23. Merge k Sorted Lists (here: Python lists)',
    prompt: '<p><code>lists</code> contains k sorted lists. Return one sorted list with all their numbers. Aim for O(N log k) where N is the total count.</p>',
    fn: 'merge_k_sorted',
    starter: py`
      import heapq

      def merge_k_sorted(lists):
          # TODO
          return []
    `,
    tests: [
      { args: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expect: [1, 1, 2, 3, 4, 4, 5, 6] },
      { args: [[]], expect: [] },
      { args: [[[]]], expect: [] },
      { args: [[[5], [1], [3]]], expect: [1, 3, 5] },
    ],
    views: [{ type: 'heaptree', var: 'heap' }, { type: 'array', var: 'result' }],
    hints: ['The next smallest number is always the front of one of the k lists.', 'Keep a heap of <code>(value, list_index, position)</code> — one entry per list. Pop the smallest, append it, push the next item from the same list.'],
    solution: py`
      import heapq

      def merge_k_sorted(lists):
          heap = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]
          heapq.heapify(heap)
          result = []
          while heap:
              value, i, pos = heapq.heappop(heap)
              result.append(value)
              if pos + 1 < len(lists[i]):
                  heapq.heappush(heap, (lists[i][pos + 1], i, pos + 1))
          return result
    `,
    explain: '<p>The heap never holds more than k items, so each of the N pops/pushes is O(log k). The index <code>i</code> in the tuple also breaks ties, so Python never has to compare the rest.</p>',
  },
  'hp-median': {
    title: 'Find median from a data stream (design)',
    level: 'Hard',
    pattern: 'Two heaps',
    leetcode: '295. Find Median from Data Stream',
    prompt: '<p>Design <code>MedianFinder()</code> with <code>add_num(x)</code> and <code>find_median()</code> (the middle value, or the average of the two middle values). Both fast.</p>',
    fn: 'MedianFinder',
    starter: py`
      import heapq

      class MedianFinder:
          def __init__(self):
              self.low = []    # max-heap (negated): the smaller half
              self.high = []   # min-heap: the bigger half

          def add_num(self, x):
              pass

          def find_median(self):
              pass
    `,
    tests: [
      { ops: ['MedianFinder', 'add_num', 'add_num', 'find_median', 'add_num', 'find_median'], args: [[], [1], [2], [], [3], []], expect: [null, null, null, 1.5, null, 2.0] },
      { ops: ['MedianFinder', 'add_num', 'find_median', 'add_num', 'find_median', 'add_num', 'find_median'], args: [[], [5], [], [15], [], [1], []], expect: [null, null, 5, null, 10.0, null, 5] },
    ],
    hints: ['Keep the smaller half in a max-heap (<code>low</code>) and the bigger half in a min-heap (<code>high</code>). Keep their sizes equal, or <code>low</code> one bigger.', 'add: push to <code>low</code>, then move low\'s biggest to <code>high</code>; if <code>high</code> got bigger than <code>low</code>, move high\'s smallest back.', 'median: if low is bigger → <code>-low[0]</code>, else the average of <code>-low[0]</code> and <code>high[0]</code>.'],
    solution: py`
      import heapq

      class MedianFinder:
          def __init__(self):
              self.low = []
              self.high = []

          def add_num(self, x):
              heapq.heappush(self.low, -x)
              heapq.heappush(self.high, -heapq.heappop(self.low))
              if len(self.high) > len(self.low):
                  heapq.heappush(self.low, -heapq.heappop(self.high))

          def find_median(self):
              if len(self.low) > len(self.high):
                  return -self.low[0]
              return (-self.low[0] + self.high[0]) / 2
    `,
    explain: '<p>add is O(log n), find_median is O(1). The two tops of the heaps are always the middle values. A beautiful classic.</p>',
  },
})

addQuiz({
  'hp-quiz': [
    { q: 'In a min-heap, where is the smallest element?', options: ['At the end of the list', 'At index 0 (the root)', 'Anywhere', 'In the middle'], answer: 1, why: 'The heap rule (parent ≤ children) puts the minimum at the root, <code>heap[0]</code>.' },
    { q: 'What do <code>heappush</code> and <code>heappop</code> cost?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1, why: 'Bubbling up or sinking down moves through at most the height of the tree: log₂ n levels.' },
    { q: 'Is a heap list sorted?', options: ['Yes', 'No — only each parent is ≤ its children', 'Only for numbers', 'Only after heapify'], answer: 1, why: '<code>[1, 3, 2, 5, 9, 8]</code> is a valid heap but not sorted. Only the top is guaranteed.' },
    { q: 'How do you get a max-heap with <code>heapq</code>?', options: ['<code>heapq.maxheap()</code>', 'Push negative values and negate when you pop', 'Sort in reverse', 'Use <code>heapq.heappush(heap, x, reverse=True)</code>'], answer: 1, why: 'The smallest negative is the biggest original value.' },
    { q: 'For node i in the list, where are its children?', options: ['i + 1 and i + 2', '2i + 1 and 2i + 2', 'i // 2', '2i and 2i − 1'], answer: 1, why: 'And the parent is at (i − 1) // 2. That\'s how a tree fits in a plain list with no pointers.' },
    { q: '"The k largest / smallest / most frequent / closest", "repeatedly take the best". Which structure?', options: ['Stack', 'Heap', 'Linked list', 'Trie'], answer: 1, why: 'Heaps give the best item in O(log n) whenever things change.' },
  ],
})
