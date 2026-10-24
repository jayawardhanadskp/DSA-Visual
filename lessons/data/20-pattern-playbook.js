// Lesson 20 — Pattern playbook & interview mode
const L20_PLAN = [
  ['03 Arrays & strings', ['121 Best Time to Buy and Sell Stock', '268 Missing Number', '66 Plus One', '14 Longest Common Prefix', '189 Rotate Array', '54 Spiral Matrix', '48 Rotate Image', '238 Product of Array Except Self']],
  ['04 Hashing', ['1 Two Sum', '217 Contains Duplicate', '242 Valid Anagram', '387 First Unique Character', '383 Ransom Note', '205 Isomorphic Strings', '49 Group Anagrams', '347 Top K Frequent Elements', '128 Longest Consecutive Sequence']],
  ['05 Two pointers', ['125 Valid Palindrome', '167 Two Sum II', '283 Move Zeroes', '26 Remove Duplicates', '977 Squares of a Sorted Array', '11 Container With Most Water', '15 3Sum', '42 Trapping Rain Water (hard)']],
  ['06 Sliding window', ['643 Maximum Average Subarray I', '3 Longest Substring Without Repeating', '209 Minimum Size Subarray Sum', '1004 Max Consecutive Ones III', '424 Longest Repeating Character Replacement', '567 Permutation in String', '438 Find All Anagrams', '76 Minimum Window Substring (hard)']],
  ['07 Prefix sums', ['1480 Running Sum', '303 Range Sum Query', '724 Find Pivot Index', '560 Subarray Sum Equals K', '525 Contiguous Array']],
  ['08 Stacks & queues', ['20 Valid Parentheses', '155 Min Stack', '150 Evaluate RPN', '232 Queue using Stacks', '739 Daily Temperatures', '394 Decode String', '84 Largest Rectangle in Histogram (hard)']],
  ['09 Linked lists', ['206 Reverse Linked List', '876 Middle of the Linked List', '21 Merge Two Sorted Lists', '141 Linked List Cycle', '19 Remove Nth Node From End', '234 Palindrome Linked List', '2 Add Two Numbers', '143 Reorder List', '146 LRU Cache']],
  ['10–11 Recursion & sorting', ['50 Pow(x, n)', '912 Sort an Array', '75 Sort Colors', '179 Largest Number', '215 Kth Largest Element']],
  ['12 Binary search', ['704 Binary Search', '35 Search Insert Position', '69 Sqrt(x)', '34 First and Last Position', '153 Find Minimum in Rotated Array', '33 Search in Rotated Array', '875 Koko Eating Bananas', '74 Search a 2D Matrix', '1011 Capacity To Ship Packages']],
  ['13 Trees', ['104 Maximum Depth', '226 Invert Binary Tree', '100 Same Tree', '101 Symmetric Tree', '112 Path Sum', '543 Diameter', '102 Level Order Traversal', '199 Right Side View', '98 Validate BST', '230 Kth Smallest in BST', '235 LCA of a BST', '236 LCA of a Binary Tree', '105 Construct from Preorder and Inorder', '124 Maximum Path Sum (hard)']],
  ['14 Heaps', ['1046 Last Stone Weight', '703 Kth Largest in a Stream', '973 K Closest Points', '621 Task Scheduler', '23 Merge k Sorted Lists (hard)', '295 Find Median from Data Stream (hard)']],
  ['15 Graphs', ['733 Flood Fill', '200 Number of Islands', '695 Max Area of Island', '994 Rotting Oranges', '133 Clone Graph', '207 Course Schedule', '210 Course Schedule II', '417 Pacific Atlantic Water Flow', '743 Network Delay Time', '684 Redundant Connection', '127 Word Ladder (hard)']],
  ['16 Backtracking', ['78 Subsets', '46 Permutations', '77 Combinations', '39 Combination Sum', '17 Letter Combinations', '22 Generate Parentheses', '79 Word Search', '131 Palindrome Partitioning', '51 N-Queens (hard)']],
  ['17 Dynamic programming', ['70 Climbing Stairs', '746 Min Cost Climbing Stairs', '198 House Robber', '213 House Robber II', '322 Coin Change', '62 Unique Paths', '300 Longest Increasing Subsequence', '1143 Longest Common Subsequence', '139 Word Break', '416 Partition Equal Subset Sum', '91 Decode Ways', '5 Longest Palindromic Substring', '72 Edit Distance']],
  ['18 Greedy & intervals', ['53 Maximum Subarray', '55 Jump Game', '45 Jump Game II', '134 Gas Station', '763 Partition Labels', '56 Merge Intervals', '57 Insert Interval', '435 Non-overlapping Intervals', '452 Minimum Arrows']],
  ['19 Tries & bits', ['208 Implement Trie', '211 Add and Search Words', '1268 Search Suggestions', '212 Word Search II (hard)', '136 Single Number', '191 Number of 1 Bits', '338 Counting Bits', '190 Reverse Bits']],
]

addWidget({
  'lc-plan': (el) => {
    const KEY = 'dsa-python-visual:lc-plan'
    let done = {}
    try {
      done = JSON.parse(localStorage.getItem(KEY)) || {}
    } catch {}
    const save = () => {
      try {
        localStorage.setItem(KEY, JSON.stringify(done))
      } catch {}
    }
    const total = L20_PLAN.reduce((n, [, list]) => n + list.length, 0)
    const draw = () => {
      const count = Object.values(done).filter(Boolean).length
      el.innerHTML =
        `<h4>Your LeetCode plan — ${count} / ${total} done</h4><div class="progressbar" style="margin-bottom:10px"><div style="width:${(count / total) * 100}%"></div></div>` +
        `<p style="margin:0 0 8px;font-size:14px;color:var(--ink-2)">Search the number + name on leetcode.com. Do them in this order, using the 6-step routine. Ticks are saved in this browser.</p>` +
        `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px 18px">` +
        L20_PLAN.map(
          ([group, list]) =>
            `<div><div class="view-title"><b>${DSA.esc(group)}</b></div>` +
            list.map((p) => `<label style="display:flex;gap:6px;font-size:14px;align-items:baseline"><input type="checkbox" data-p="${DSA.esc(p)}"${done[p] ? ' checked' : ''}><span style="${done[p] ? 'text-decoration:line-through;color:var(--ink-3)' : ''}">${DSA.esc(p)}</span></label>`).join('') +
            '</div>',
        ).join('') +
        '</div>'
      el.querySelectorAll('input[type=checkbox]').forEach((cb) => {
        cb.onchange = () => {
          done[cb.dataset.p] = cb.checked
          save()
          draw()
        }
      })
    }
    draw()
  },
})

addQuiz({
  'pb-which': [
    { q: '"Given a <b>sorted</b> array, find two numbers that add up to a target. Use O(1) extra space."', options: ['Hash map', 'Two pointers', 'Sliding window', 'DP'], answer: 1, why: 'Sorted + pair + no extra space → opposite-ends two pointers (lesson 05).' },
    { q: '"Find the length of the longest substring that contains at most 2 distinct characters."', options: ['Sliding window', 'Binary search', 'Backtracking', 'Heap'], answer: 0, why: 'Longest + contiguous substring + "at most k" → variable sliding window (lesson 06).' },
    { q: '"Return the number of contiguous subarrays whose sum equals k. Numbers can be negative."', options: ['Sliding window', 'Prefix sums + hash map', 'Two pointers', 'Greedy'], answer: 1, why: 'Negative numbers break the window. Count with prefix sums + dict (lesson 07).' },
    { q: '"For each element, find the next element to its right that is larger."', options: ['Monotonic stack', 'Heap', 'BFS', 'Prefix sums'], answer: 0, why: '"Next greater" → monotonic stack (lesson 08).' },
    { q: '"Find the minimum number of moves for a knight to reach a square on a chessboard."', options: ['DFS', 'BFS', 'Dijkstra', 'DP'], answer: 1, why: 'Minimum number of equal-cost moves → BFS (lesson 15).' },
    { q: '"Return all possible ways to place n queens / all subsets / all permutations."', options: ['DP', 'Greedy', 'Backtracking', 'Binary search'], answer: 2, why: '"All possible…" → backtracking (lesson 16).' },
    { q: '"How many distinct ways can you decode a string of digits into letters (1 = A … 26 = Z)?"', options: ['Backtracking', 'Dynamic programming', 'Greedy', 'Stack'], answer: 1, why: '"How many ways" with overlapping sub-problems → DP (LC 91). Backtracking would list them all — far too slow.' },
    { q: '"Find the k most frequent words in a huge stream."', options: ['Heap (+ hash map)', 'Two pointers', 'Trie only', 'Binary search'], answer: 0, why: 'Count with a dict, keep the top k with a heap (lesson 14).' },
    { q: '"Find the minimum ship capacity to ship all packages (in order) within d days."', options: ['Greedy only', 'Binary search on the answer', 'Sliding window', 'Topological sort'], answer: 1, why: '"Minimum X such that it\'s possible" + bigger X always works → binary search on X with a greedy check (LC 1011).' },
    { q: '"Given course prerequisites, return an order in which you can take all courses."', options: ['Topological sort', 'Dijkstra', 'Union-find', 'Heap'], answer: 0, why: 'Dependencies → topological sort (lesson 15).' },
    { q: '"Merge all overlapping meeting times."', options: ['Sort + sweep', 'Trie', 'Recursion', 'Hash set'], answer: 0, why: 'Intervals → sort by start, then sweep (lesson 18).' },
    { q: '"Check whether two strings are anagrams."', options: ['Counting (hash map / 26-array)', 'Binary search', 'BFS', 'Heap'], answer: 0, why: 'Same counts of letters (lesson 04).' },
    { q: '"Return the level-by-level values of a binary tree."', options: ['In-order DFS', 'BFS with a queue', 'Binary search', 'Prefix sums'], answer: 1, why: '"Level" → BFS (lesson 13).' },
    { q: '"Implement autocomplete: given a prefix, return matching words."', options: ['Trie (or sort + binary search)', 'Union-find', 'Monotonic stack', 'Kadane'], answer: 0, why: 'Prefixes → trie (lesson 19).' },
    { q: '"Maximum sum of a contiguous subarray."', options: ['Kadane (greedy / DP)', 'Backtracking', 'BFS', 'Heap'], answer: 0, why: 'Carry the run or start fresh — Kadane (lesson 18).' },
    { q: '"Detect whether a linked list has a cycle using O(1) memory."', options: ['Hash set', 'Fast & slow pointers', 'Recursion', 'Sorting'], answer: 1, why: 'A set works but uses O(n) memory. Floyd\'s tortoise and hare (lesson 09).' },
  ],
})

addProblems({
  'mx-nearby': {
    title: 'Contains duplicate II',
    level: 'Easy',
    pattern: 'Mixed — which pattern?',
    leetcode: '219. Contains Duplicate II',
    prompt: '<p>Return <code>True</code> if there are two different indexes i and j with <code>nums[i] == nums[j]</code> and <code>abs(i - j) &lt;= k</code>.</p>',
    fn: 'contains_nearby_duplicate',
    starter: py`
      def contains_nearby_duplicate(nums, k):
          # Step 1: understand. Step 2: examples. Step 3: brute force. Step 4: which pattern?
          return False
    `,
    tests: [
      { args: [[1, 2, 3, 1], 3], expect: true },
      { args: [[1, 0, 1, 1], 1], expect: true },
      { args: [[1, 2, 3, 1, 2, 3], 2], expect: false },
      { args: [[1], 1], expect: false },
      { args: [{ __py__: 'list(range(100_000)) + [0]' }, 5], expect: false },
    ],
    hints: ['Brute force compares each pair within distance k: O(n·k).', 'Pattern: <b>hash map</b> — remember the last index where you saw each value.'],
    solution: py`
      def contains_nearby_duplicate(nums, k):
          last = {}
          for i, x in enumerate(nums):
              if x in last and i - last[x] <= k:
                  return True
              last[x] = i
          return False
    `,
    explain: '<p><b>Pattern: hashing</b> (value → last index). A sliding-window <i>set</i> of size k also works.</p>',
  },
  'mx-vowels': {
    title: 'Reverse vowels of a string',
    level: 'Easy',
    pattern: 'Mixed — which pattern?',
    leetcode: '345. Reverse Vowels of a String',
    prompt: '<p>Reverse only the vowels (<code>aeiouAEIOU</code>) of <code>s</code>, keeping every other character in place.</p>',
    fn: 'reverse_vowels',
    starter: py`
      def reverse_vowels(s):
          return s
    `,
    tests: [
      { args: ['IceCreAm'], expect: 'AceCreIm' },
      { args: ['leetcode'], expect: 'leotcede' },
      { args: ['a'], expect: 'a' },
      { args: ['xyz'], expect: 'xyz' },
    ],
    hints: ['"Reverse" + "in place" + two ends…', 'Pattern: <b>two pointers</b> from both ends; skip non-vowels; swap vowels. Work on <code>list(s)</code>.'],
    solution: py`
      def reverse_vowels(s):
          chars = list(s)
          vowels = set("aeiouAEIOU")
          left, right = 0, len(chars) - 1
          while left < right:
              if chars[left] not in vowels:
                  left += 1
              elif chars[right] not in vowels:
                  right -= 1
              else:
                  chars[left], chars[right] = chars[right], chars[left]
                  left += 1
                  right -= 1
          return "".join(chars)
    `,
    explain: '<p><b>Pattern: two pointers (opposite ends)</b> — the same shape as valid palindrome.</p>',
  },
  'mx-fruits': {
    title: 'Fruit into baskets',
    level: 'Medium',
    pattern: 'Mixed — which pattern?',
    leetcode: '904. Fruit Into Baskets',
    prompt: '<p>Trees in a row; <code>fruits[i]</code> is the fruit type of tree i. You have 2 baskets, each holds one type (unlimited amount). Start at any tree and pick one fruit from every tree going right, until you meet a third type. Return the most fruit you can pick.</p>',
    fn: 'total_fruit',
    starter: py`
      def total_fruit(fruits):
          return 0
    `,
    tests: [
      { args: [[1, 2, 1]], expect: 3 },
      { args: [[0, 1, 2, 2]], expect: 3 },
      { args: [[1, 2, 3, 2, 2]], expect: 4 },
      { args: [[3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]], expect: 5 },
    ],
    hints: ['Rephrase: the longest contiguous section with at most 2 different values.', 'Pattern: <b>variable sliding window</b> with a count dict.'],
    solution: py`
      def total_fruit(fruits):
          counts = {}
          left = 0
          best = 0
          for right, f in enumerate(fruits):
              counts[f] = counts.get(f, 0) + 1
              while len(counts) > 2:
                  counts[fruits[left]] -= 1
                  if counts[fruits[left]] == 0:
                      del counts[fruits[left]]
                  left += 1
              best = max(best, right - left + 1)
          return best
    `,
    explain: '<p><b>Pattern: sliding window</b> ("longest contiguous with at most k distinct"). The story hides it — rephrasing reveals it.</p>',
  },
  'mx-next-greater': {
    title: 'Next greater element I',
    level: 'Easy',
    pattern: 'Mixed — which pattern?',
    leetcode: '496. Next Greater Element I',
    prompt: '<p><code>nums1</code> is a subset of <code>nums2</code> (all distinct). For each x in nums1, find the first number to the right of x <b>in nums2</b> that is bigger than x, or −1.</p>',
    fn: 'next_greater_element',
    starter: py`
      def next_greater_element(nums1, nums2):
          return []
    `,
    tests: [
      { args: [[4, 1, 2], [1, 3, 4, 2]], expect: [-1, 3, -1] },
      { args: [[2, 4], [1, 2, 3, 4]], expect: [3, -1] },
      { args: [[1], [1]], expect: [-1] },
    ],
    hints: ['"Next greater" — you have seen this signal.', 'Pattern: <b>monotonic stack</b> over nums2, store the answers in a dict, then look them up for nums1.'],
    solution: py`
      def next_greater_element(nums1, nums2):
          answer = {}
          stack = []
          for x in nums2:
              while stack and stack[-1] < x:
                  answer[stack.pop()] = x
              stack.append(x)
          return [answer.get(x, -1) for x in nums1]
    `,
    explain: '<p><b>Pattern: monotonic stack + hash map</b>. O(n + m).</p>',
  },
  'mx-ship': {
    title: 'Capacity to ship packages within D days',
    level: 'Medium',
    pattern: 'Mixed — which pattern?',
    leetcode: '1011. Capacity To Ship Packages Within D Days',
    prompt: '<p>Packages must ship in the given order. Each day the ship carries packages (in order) up to its capacity. Return the smallest capacity that ships everything within <code>days</code> days.</p>',
    fn: 'ship_within_days',
    starter: py`
      def ship_within_days(weights, days):
          return 0
    `,
    tests: [
      { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5], expect: 15 },
      { args: [[3, 2, 2, 4, 1, 4], 3], expect: 6 },
      { args: [[1, 2, 3, 1, 1], 4], expect: 3 },
      { args: [[10], 1], expect: 10 },
    ],
    hints: ['"Smallest capacity such that it\'s possible" — and a bigger ship always works too.', 'Pattern: <b>binary search on the answer</b> between <code>max(weights)</code> and <code>sum(weights)</code>, with a greedy "how many days?" check.'],
    solution: py`
      def ship_within_days(weights, days):
          def days_needed(capacity):
              count, load = 1, 0
              for w in weights:
                  if load + w > capacity:
                      count += 1
                      load = 0
                  load += w
              return count

          lo, hi = max(weights), sum(weights)
          while lo < hi:
              mid = (lo + hi) // 2
              if days_needed(mid) <= days:
                  hi = mid
              else:
                  lo = mid + 1
          return lo
    `,
    explain: '<p><b>Pattern: binary search on the answer + greedy check</b>. Same shape as Koko.</p>',
  },
  'mx-min-depth': {
    title: 'Minimum depth of a binary tree',
    level: 'Easy',
    pattern: 'Mixed — which pattern?',
    leetcode: '111. Minimum Depth of Binary Tree',
    prompt: '<p>Return the number of nodes on the shortest path from the root down to the nearest <b>leaf</b>.</p>',
    fn: 'min_depth',
    convert: { args: ['tree'] },
    starter: py`
      def min_depth(root):
          return 0
    `,
    tests: [
      { args: [[3, 9, 20, null, null, 15, 7]], expect: 2 },
      { args: [[2, null, 3, null, 4, null, 5, null, 6]], expect: 5 },
      { args: [[]], expect: 0 },
      { args: [[1, 2]], expect: 2 },
    ],
    hints: ['"Nearest / shortest" in a tree…', 'Pattern: <b>BFS</b> level by level — the first leaf you meet is the answer. (DFS works too, but careful: a node with one child is not a leaf.)'],
    solution: py`
      from collections import deque

      def min_depth(root):
          if root is None:
              return 0
          queue = deque([(root, 1)])
          while queue:
              node, depth = queue.popleft()
              if node.left is None and node.right is None:
                  return depth
              if node.left:
                  queue.append((node.left, depth + 1))
              if node.right:
                  queue.append((node.right, depth + 1))
    `,
    explain: '<p><b>Pattern: BFS</b> — it stops at the first leaf, without visiting the whole tree.</p>',
  },
  'mx-island-area': {
    title: 'Max area of island',
    level: 'Medium',
    pattern: 'Mixed — which pattern?',
    leetcode: '695. Max Area of Island',
    prompt: '<p>The grid has 1 (land) and 0 (water). Return the area (number of cells) of the biggest island (4-directional), or 0.</p>',
    fn: 'max_area_of_island',
    starter: py`
      def max_area_of_island(grid):
          return 0
    `,
    tests: [
      { args: [[[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 1]]], expect: 4 },
      { args: [[[0, 0, 0]]], expect: 0 },
      { args: [[[1, 1], [1, 0]]], expect: 3 },
      { args: [[[1, 0, 1], [0, 1, 0], [1, 0, 1]]], expect: 1 },
    ],
    hints: ['Connected cells in a grid…', 'Pattern: <b>grid DFS</b> that <i>returns</i> the size of the island it sank.'],
    solution: py`
      def max_area_of_island(grid):
          rows, cols = len(grid), len(grid[0])

          def sink(r, c):
              if not (0 <= r < rows and 0 <= c < cols) or grid[r][c] != 1:
                  return 0
              grid[r][c] = 0
              return 1 + sink(r + 1, c) + sink(r - 1, c) + sink(r, c + 1) + sink(r, c - 1)

          return max(sink(r, c) for r in range(rows) for c in range(cols))
    `,
    explain: '<p><b>Pattern: graph DFS on a grid</b>, where information flows up as return values (lesson 13 thinking).</p>',
  },
  'mx-rob-circle': {
    title: 'House robber II (houses in a circle)',
    level: 'Medium',
    pattern: 'Mixed — which pattern?',
    leetcode: '213. House Robber II',
    prompt: '<p>Like house robber, but the houses stand in a <b>circle</b>: the first and last house are neighbours. Return the most money.</p>',
    fn: 'rob_circle',
    starter: py`
      def rob_circle(nums):
          return 0
    `,
    tests: [
      { args: [[2, 3, 2]], expect: 3 },
      { args: [[1, 2, 3, 1]], expect: 4 },
      { args: [[1, 2, 3]], expect: 3 },
      { args: [[5]], expect: 5 },
    ],
    hints: ['Take-or-skip with "best so far" → you know this one.', 'Pattern: <b>DP</b>. The circle only means: you can\'t take both the first and the last. So answer = max(rob(without the last), rob(without the first)).'],
    solution: py`
      def rob_circle(nums):
          def rob_line(houses):
              prev, curr = 0, 0
              for x in houses:
                  prev, curr = curr, max(curr, prev + x)
              return curr

          if len(nums) == 1:
              return nums[0]
          return max(rob_line(nums[:-1]), rob_line(nums[1:]))
    `,
    explain: '<p><b>Pattern: DP</b> + "reduce to a problem you already solved". Interviewers love this move.</p>',
  },
  'mx-comb3': {
    title: 'Combination sum III',
    level: 'Medium',
    pattern: 'Mixed — which pattern?',
    leetcode: '216. Combination Sum III',
    prompt: '<p>Return all combinations of <code>k</code> different numbers from 1–9 that add up to <code>n</code>.</p>',
    fn: 'combination_sum3',
    compare: 'nested',
    starter: py`
      def combination_sum3(k, n):
          return []
    `,
    tests: [
      { args: [3, 7], expect: [[1, 2, 4]] },
      { args: [3, 9], expect: [[1, 2, 6], [1, 3, 5], [2, 3, 4]] },
      { args: [4, 1], expect: [] },
    ],
    hints: ['"All combinations" …', 'Pattern: <b>backtracking</b> with start, path and remaining sum; prune when remaining &lt; 0 or the path is too long.'],
    solution: py`
      def combination_sum3(k, n):
          result = []
          path = []

          def backtrack(start, remaining):
              if len(path) == k:
                  if remaining == 0:
                      result.append(path[:])
                  return
              for x in range(start, 10):
                  if x > remaining:
                      break
                  path.append(x)
                  backtrack(x + 1, remaining - x)
                  path.pop()

          backtrack(1, n)
          return result
    `,
    explain: '<p><b>Pattern: backtracking (combinations)</b> with pruning.</p>',
  },
  'mx-closest': {
    title: 'Find k closest elements',
    level: 'Medium',
    pattern: 'Mixed — which pattern?',
    leetcode: '658. Find K Closest Elements',
    prompt: '<p><code>arr</code> is sorted. Return the <code>k</code> values closest to <code>x</code>, sorted ascending. On a tie, the smaller value wins.</p>',
    fn: 'find_closest_elements',
    starter: py`
      def find_closest_elements(arr, k, x):
          return []
    `,
    tests: [
      { args: [[1, 2, 3, 4, 5], 4, 3], expect: [1, 2, 3, 4] },
      { args: [[1, 1, 2, 3, 4, 5], 4, -1], expect: [1, 1, 2, 3] },
      { args: [[1, 2, 3, 4, 5], 4, 6], expect: [2, 3, 4, 5] },
      { args: [[1, 3], 1, 2], expect: [1] },
    ],
    hints: ['Several patterns work: a heap, sorting by distance, or two pointers shrinking a window from both ends.', 'Two pointers: start with the whole array; while it\'s longer than k, drop whichever end is farther from x (drop the right one on ties).'],
    solution: py`
      def find_closest_elements(arr, k, x):
          left, right = 0, len(arr) - 1
          while right - left + 1 > k:
              if x - arr[left] <= arr[right] - x:
                  right -= 1
              else:
                  left += 1
          return arr[left:right + 1]
    `,
    explain: '<p><b>Pattern: two pointers (shrinking window)</b>. O(n). The best solution binary searches the window start: O(log n + k). Many problems have more than one right pattern — pick the one you can explain.</p>',
  },
  'mx-longest-pal': {
    title: 'Longest palindrome you can build',
    level: 'Easy',
    pattern: 'Mixed — which pattern?',
    leetcode: '409. Longest Palindrome',
    prompt: '<p>Using the letters of <code>s</code> (case-sensitive), how long is the longest palindrome you can build?</p>',
    fn: 'longest_palindrome',
    starter: py`
      def longest_palindrome(s):
          return 0
    `,
    tests: [
      { args: ['abccccdd'], expect: 7 },
      { args: ['a'], expect: 1 },
      { args: ['Aa'], expect: 1 },
      { args: ['aaabb'], expect: 5 },
    ],
    hints: ['A palindrome uses letters in pairs, plus at most one letter in the middle.', 'Pattern: <b>counting</b>. Add <code>count // 2 * 2</code> for each letter; add 1 if any count was odd.'],
    solution: py`
      from collections import Counter

      def longest_palindrome(s):
          length = 0
          odd = False
          for c in Counter(s).values():
              length += c // 2 * 2
              if c % 2:
                  odd = True
          return length + (1 if odd else 0)
    `,
    explain: '<p><b>Pattern: counting with a hash map</b>, plus a little reasoning about the structure of palindromes.</p>',
  },
})
