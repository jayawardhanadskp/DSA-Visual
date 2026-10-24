// Lesson 18 — Greedy & intervals
addViz({
  'gr-kadane': {
    title: "Kadane's algorithm: carry the run or start fresh",
    code: py`
      def max_subarray(nums):
          best = current = nums[0]
          start = 0
          for i in range(1, len(nums)):
              if current + nums[i] < nums[i]:   #: carry the run so far ({current}) into {nums[i]}, or start fresh? {'START FRESH — the old run (' + str(current) + ') only makes it worse' if current + nums[i] < nums[i] else 'carry it: ' + str(current) + ' + ' + str(nums[i]) + ' = ' + str(current + nums[i])}
                  current = nums[i]
                  start = i
              else:
                  current += nums[i]
              best = max(best, current)         #: the run nums[{start}..{i}] sums to {current}; best = {max(best, current)}
          return best

      print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))
    `,
    views: [{ type: 'array', var: 'nums', pointers: ['start', 'i'], window: ['start', 'i'] }],
  },
  'gr-jump': {
    title: 'Jump game: track the farthest reachable index',
    code: py`
      def can_jump(nums):
          farthest = 0
          for i in range(len(nums)):
              if i > farthest:                          #: can we even reach index {i}? farthest so far = {farthest} → {'NO, stuck → False' if i > farthest else 'yes'}
                  return False
              farthest = max(farthest, i + nums[i])     #: from index {i} we can jump up to {i + nums[i]} → farthest = {max(farthest, i + nums[i])}
          return True

      print(can_jump([2, 3, 1, 1, 0, 4]))
    `,
    views: [{ type: 'array', var: 'nums', pointers: ['i', 'farthest'], range: (s) => (Number.isInteger(s.v('farthest')) ? [0, s.v('farthest')] : null), dim: false }],
  },
  'iv-merge': {
    title: 'Merge intervals: sort by start, then sweep',
    code: py`
      def merge(intervals):
          intervals.sort()                          # sort by start time
          merged = [intervals[0][:]]
          for i in range(1, len(intervals)):
              start, end = intervals[i]
              last = merged[-1]
              if start <= last[1]:                  #: does [{start}, {end}] start before [{last[0]}, {last[1]}] ends? {'yes → they overlap, stretch the last one' if start <= last[1] else 'no → gap, start a new interval'}
                  last[1] = max(last[1], end)
              else:
                  merged.append([start, end])
          return merged

      print(merge([[8, 10], [1, 3], [2, 6], [15, 18], [5, 7]]))
    `,
    views: [{ type: 'intervals', vars: [{ var: 'intervals', label: 'input', pointer: 'i' }, { var: 'merged', label: 'merged' }] }],
  },
})

addProblems({
  'gr-max-sub': {
    title: 'Maximum subarray',
    level: 'Medium',
    pattern: "Kadane (greedy / DP)",
    leetcode: '53. Maximum Subarray',
    prompt: '<p>Return the biggest sum of a non-empty contiguous section of <code>nums</code>. O(n).</p>',
    fn: 'max_subarray',
    starter: py`
      def max_subarray(nums):
          # TODO
          return 0
    `,
    tests: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expect: 6 },
      { args: [[1]], expect: 1 },
      { args: [[5, 4, -1, 7, 8]], expect: 23 },
      { args: [[-3, -1, -2]], expect: -1 },
      { args: [{ __py__: 'list(range(-50_000, 50_000))' }], expect: 1249975000 },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['i'] }],
    hints: ['Walk once. Keep <code>current</code> = best sum of a run that ends here.', 'At each number: <code>current = max(x, current + x)</code> (a negative run is not worth carrying). Track the best <code>current</code> ever.'],
    solution: py`
      def max_subarray(nums):
          best = current = nums[0]
          for x in nums[1:]:
              current = max(x, current + x)
              best = max(best, current)
          return best
    `,
    explain: '<p>Kadane is both greedy ("drop a negative past") and DP ("best run ending at i"). Start with <code>nums[0]</code>, not 0, so an all-negative list works.</p>',
  },
  'gr-jump': {
    title: 'Jump game',
    level: 'Medium',
    pattern: 'Greedy reach',
    leetcode: '55. Jump Game',
    prompt: '<p>You start at index 0. <code>nums[i]</code> is the maximum jump length from i. Can you reach the last index?</p>',
    fn: 'can_jump',
    starter: py`
      def can_jump(nums):
          # TODO
          return False
    `,
    tests: [
      { args: [[2, 3, 1, 1, 4]], expect: true },
      { args: [[3, 2, 1, 0, 4]], expect: false },
      { args: [[0]], expect: true },
      { args: [[2, 0, 0]], expect: true },
      { args: [[1, 0, 1, 0]], expect: false },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['i'] }],
    hints: ['You don\'t need to know which jumps — only how far you can get.', 'Keep <code>farthest</code>. If <code>i &gt; farthest</code> you are stuck.'],
    solution: py`
      def can_jump(nums):
          farthest = 0
          for i, step in enumerate(nums):
              if i > farthest:
                  return False
              farthest = max(farthest, i + step)
          return True
    `,
    explain: '<p>O(n). A DP over "can I reach i?" would be O(n²); the greedy observation (only the farthest point matters) removes that.</p>',
  },
  'gr-cookies': {
    title: 'Assign cookies',
    level: 'Easy',
    pattern: 'Sort + greedy match',
    leetcode: '455. Assign Cookies',
    prompt: '<p>Child i is happy with a cookie of size ≥ <code>g[i]</code>. Each child gets at most one cookie (sizes <code>s</code>). Return the most happy children.</p>',
    fn: 'find_content_children',
    starter: py`
      def find_content_children(g, s):
          # TODO
          return 0
    `,
    tests: [
      { args: [[1, 2, 3], [1, 1]], expect: 1 },
      { args: [[1, 2], [1, 2, 3]], expect: 2 },
      { args: [[10, 9, 8, 7], [5, 6, 7, 8]], expect: 2 },
      { args: [[], [1]], expect: 0 },
    ],
    hints: ['Sort both. Give the smallest cookie that is big enough to the least greedy child.', 'Two pointers: if the cookie fits the child, both move; otherwise try the next (bigger) cookie.'],
    solution: py`
      def find_content_children(g, s):
          g.sort()
          s.sort()
          child = 0
          for cookie in s:
              if child < len(g) and cookie >= g[child]:
                  child += 1
          return child
    `,
    explain: '<p>Why is greedy safe? Using a bigger cookie than needed never helps — the smallest fitting cookie leaves bigger ones for greedier children.</p>',
  },
  'gr-stock2': {
    title: 'Best time to buy and sell stock II',
    level: 'Medium',
    pattern: 'Greedy: take every gain',
    leetcode: '122. Best Time to Buy and Sell Stock II',
    prompt: '<p>Now you may buy and sell many times (hold at most one share at a time). Return the maximum profit.</p>',
    fn: 'max_profit_ii',
    starter: py`
      def max_profit_ii(prices):
          # TODO
          return 0
    `,
    tests: [
      { args: [[7, 1, 5, 3, 6, 4]], expect: 7 },
      { args: [[1, 2, 3, 4, 5]], expect: 4 },
      { args: [[7, 6, 4, 3, 1]], expect: 0 },
      { args: [[3]], expect: 0 },
    ],
    hints: ['Any rise from one day to the next can be captured: buy today, sell tomorrow.', 'Add up every positive difference <code>prices[i] - prices[i - 1]</code>.'],
    solution: py`
      def max_profit_ii(prices):
          return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, len(prices)))
    `,
    explain: '<p>A long rise 1→5 equals the sum of its daily rises (1→2→3→4→5), so taking every daily gain is optimal.</p>',
  },
  'gr-gas': {
    title: 'Gas station',
    level: 'Medium',
    pattern: 'Greedy restart',
    leetcode: '134. Gas Station',
    prompt: '<p>Stations on a circle: you get <code>gas[i]</code> at station i and need <code>cost[i]</code> to drive to the next. Return the start index that lets you go all the way round (unique), or −1.</p>',
    fn: 'can_complete_circuit',
    starter: py`
      def can_complete_circuit(gas, cost):
          # TODO
          return -1
    `,
    tests: [
      { args: [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]], expect: 3 },
      { args: [[2, 3, 4], [3, 4, 3]], expect: -1 },
      { args: [[5], [4]], expect: 0 },
      { args: [[3, 1, 1], [1, 2, 2]], expect: 0 },
    ],
    hints: ['If total gas &lt; total cost → −1. Otherwise an answer exists.', 'Drive from a start, tracking the tank. If the tank goes negative at station i, no station between start and i can be the answer → restart at i + 1 with an empty tank.'],
    solution: py`
      def can_complete_circuit(gas, cost):
          if sum(gas) < sum(cost):
              return -1
          start = 0
          tank = 0
          for i in range(len(gas)):
              tank += gas[i] - cost[i]
              if tank < 0:
                  start = i + 1
                  tank = 0
          return start
    `,
    explain: '<p>O(n) instead of trying every start (O(n²)). Greedy proofs often look like this: "a failure at i rules out a whole range of options".</p>',
  },
  'gr-labels': {
    title: 'Partition labels',
    level: 'Medium',
    pattern: 'Greedy with last positions',
    leetcode: '763. Partition Labels',
    prompt: '<p>Split <code>s</code> into as many parts as possible so that each letter appears in only one part. Return the sizes of the parts.</p>',
    fn: 'partition_labels',
    starter: py`
      def partition_labels(s):
          # TODO
          return []
    `,
    tests: [
      { args: ['ababcbacadefegdehijhklij'], expect: [9, 7, 8] },
      { args: ['eccbbbbdec'], expect: [10] },
      { args: ['abc'], expect: [1, 1, 1] },
    ],
    hints: ['First record the last index of every letter.', 'Walk through s, extending <code>end = max(end, last[ch])</code>. When <code>i == end</code>, the current part can close.'],
    solution: py`
      def partition_labels(s):
          last = {ch: i for i, ch in enumerate(s)}
          sizes = []
          start = end = 0
          for i, ch in enumerate(s):
              end = max(end, last[ch])
              if i == end:
                  sizes.append(end - start + 1)
                  start = i + 1
          return sizes
    `,
    explain: '<p>Really an intervals problem in disguise: each letter is the interval [first, last]; merge overlapping ones.</p>',
  },
  'iv-merge': {
    title: 'Merge intervals',
    level: 'Medium',
    pattern: 'Sort + sweep',
    leetcode: '56. Merge Intervals',
    prompt: '<p>Merge all overlapping intervals and return them sorted by start. Intervals that touch (<code>[1,4]</code> and <code>[4,5]</code>) overlap.</p>',
    fn: 'merge_intervals',
    starter: py`
      def merge_intervals(intervals):
          # TODO
          return []
    `,
    tests: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expect: [[1, 6], [8, 10], [15, 18]] },
      { args: [[[1, 4], [4, 5]]], expect: [[1, 5]] },
      { args: [[[1, 4], [0, 4]]], expect: [[0, 4]] },
      { args: [[[1, 4], [2, 3]]], expect: [[1, 4]] },
    ],
    views: [{ type: 'intervals', vars: [{ var: 'intervals', label: 'input', pointer: 'i' }, 'merged'] }],
    hints: ['Sort by start. Then overlapping intervals are next to each other.', 'Compare each interval with the <b>last merged</b> one: overlap → extend its end with <code>max</code> (test 4!), otherwise append.'],
    solution: py`
      def merge_intervals(intervals):
          intervals.sort(key=lambda iv: iv[0])
          merged = []
          for start, end in intervals:
              if merged and start <= merged[-1][1]:
                  merged[-1][1] = max(merged[-1][1], end)
              else:
                  merged.append([start, end])
          return merged
    `,
    explain: '<p>O(n log n) for sorting, then one O(n) sweep. The <code>max</code> handles an interval completely inside another.</p>',
  },
  'iv-insert': {
    title: 'Insert interval',
    level: 'Medium',
    pattern: 'Sweep in three parts',
    leetcode: '57. Insert Interval',
    prompt: '<p><code>intervals</code> are sorted and don\'t overlap. Insert <code>new</code> and merge if needed. Return the result.</p>',
    fn: 'insert_interval',
    starter: py`
      def insert_interval(intervals, new):
          # TODO
          return intervals
    `,
    tests: [
      { args: [[[1, 3], [6, 9]], [2, 5]], expect: [[1, 5], [6, 9]] },
      { args: [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]], expect: [[1, 2], [3, 10], [12, 16]] },
      { args: [[], [5, 7]], expect: [[5, 7]] },
      { args: [[[1, 5]], [6, 8]], expect: [[1, 5], [6, 8]] },
    ],
    hints: ['Three parts: intervals completely <b>before</b> new (end &lt; new start), the ones that <b>overlap</b> it (merge into new), and the ones completely <b>after</b>.'],
    solution: py`
      def insert_interval(intervals, new):
          result = []
          start, end = new
          i, n = 0, len(intervals)
          while i < n and intervals[i][1] < start:          # before
              result.append(intervals[i])
              i += 1
          while i < n and intervals[i][0] <= end:           # overlapping → merge
              start = min(start, intervals[i][0])
              end = max(end, intervals[i][1])
              i += 1
          result.append([start, end])
          result.extend(intervals[i:])                      # after
          return result
    `,
    explain: '<p>O(n), no sorting needed because the input is already sorted.</p>',
  },
  'iv-erase': {
    title: 'Non-overlapping intervals',
    level: 'Medium',
    pattern: 'Greedy: earliest end first',
    leetcode: '435. Non-overlapping Intervals',
    prompt: '<p>Return the minimum number of intervals to remove so that the rest don\'t overlap (touching like [1,2] and [2,3] is fine).</p>',
    fn: 'erase_overlap_intervals',
    starter: py`
      def erase_overlap_intervals(intervals):
          # TODO
          return 0
    `,
    tests: [
      { args: [[[1, 2], [2, 3], [3, 4], [1, 3]]], expect: 1 },
      { args: [[[1, 2], [1, 2], [1, 2]]], expect: 2 },
      { args: [[[1, 2], [2, 3]]], expect: 0 },
      { args: [[[1, 100], [11, 22], [1, 11], [2, 12]]], expect: 2 },
    ],
    hints: ['Flip it: keep as many intervals as possible.', 'Sort by <b>end</b>. Always keep the interval that ends first — it leaves the most room for the rest. Skip (remove) anything that starts before the last kept end.'],
    solution: py`
      def erase_overlap_intervals(intervals):
          intervals.sort(key=lambda iv: iv[1])
          removed = 0
          last_end = float("-inf")
          for start, end in intervals:
              if start >= last_end:
                  last_end = end          # keep it
              else:
                  removed += 1            # overlaps → remove it
          return removed
    `,
    explain: '<p>The classic "activity selection" greedy. Sorting by start instead of end gives wrong answers — try test 4 by hand to see why.</p>',
  },
  'iv-meetings': {
    title: 'Meeting rooms (can one person attend all?)',
    level: 'Easy',
    pattern: 'Sort + check neighbours',
    leetcode: '252. Meeting Rooms (premium)',
    prompt: '<p>Return <code>True</code> if no two meetings overlap (one may start exactly when another ends).</p>',
    fn: 'can_attend_meetings',
    starter: py`
      def can_attend_meetings(intervals):
          # TODO
          return False
    `,
    tests: [
      { args: [[[0, 30], [5, 10], [15, 20]]], expect: false },
      { args: [[[7, 10], [2, 4]]], expect: true },
      { args: [[]], expect: true },
      { args: [[[1, 5], [5, 8]]], expect: true },
    ],
    hints: ['Sort by start; then you only need to compare each meeting with the previous one.'],
    solution: py`
      def can_attend_meetings(intervals):
          intervals.sort()
          for i in range(1, len(intervals)):
              if intervals[i][0] < intervals[i - 1][1]:
                  return False
          return True
    `,
    explain: '<p>"Sort first" again: after sorting, an overlap can only be between neighbours.</p>',
  },
  'iv-rooms': {
    title: 'Meeting rooms II (how many rooms?)',
    level: 'Medium',
    pattern: 'Sort + heap of end times',
    leetcode: '253. Meeting Rooms II (premium)',
    prompt: '<p>Return the minimum number of rooms needed so that all meetings can happen.</p>',
    fn: 'min_meeting_rooms',
    starter: py`
      import heapq

      def min_meeting_rooms(intervals):
          # TODO
          return 0
    `,
    tests: [
      { args: [[[0, 30], [5, 10], [15, 20]]], expect: 2 },
      { args: [[[7, 10], [2, 4]]], expect: 1 },
      { args: [[[1, 5], [5, 8]]], expect: 1 },
      { args: [[[1, 10], [2, 7], [3, 19], [8, 12], [10, 20], [11, 30]]], expect: 4 },
      { args: [[]], expect: 0 },
    ],
    views: [{ type: 'heaptree', var: 'ends' }],
    hints: ['Sort by start. Keep a min-heap of the end times of meetings in progress (one per busy room).', 'For each meeting: if the earliest-ending room is free (<code>ends[0] &lt;= start</code>), reuse it (pop). Then push this meeting\'s end. The answer is the biggest heap size.'],
    solution: py`
      import heapq

      def min_meeting_rooms(intervals):
          intervals.sort()
          ends = []
          for start, end in intervals:
              if ends and ends[0] <= start:
                  heapq.heappop(ends)
              heapq.heappush(ends, end)
          return len(ends)
    `,
    explain: '<p>Combines three tools: sorting, a heap, and a greedy choice (reuse the room that frees up first). O(n log n).</p>',
  },
})

addQuiz({
  'gr-quiz': [
    { q: 'What does a greedy algorithm do?', options: ['Tries every possibility', 'Makes the choice that looks best right now and never goes back', 'Uses a table of sub-answers', 'Always sorts'], answer: 1, why: 'Greedy is fast and simple — but only correct when you can argue that the local best choice is safe.' },
    { q: 'Coins [1, 3, 4], amount 6. Greedy takes the biggest coin first. Result?', options: ['2 coins (3 + 3)', '3 coins (4 + 1 + 1) — greedy is wrong here', '1 coin', 'Impossible'], answer: 1, why: 'Always test greedy on small examples. When it fails, think DP (lesson 17).' },
    { q: 'What is the first step in almost every interval problem?', options: ['Build a graph', 'Sort the intervals (by start, sometimes by end)', 'Use a stack', 'Binary search'], answer: 1, why: 'After sorting, overlapping intervals sit next to each other and one sweep is enough.' },
    { q: 'To keep the most non-overlapping intervals, which do you pick first?', options: ['The longest', 'The one that starts first', 'The one that ends first', 'A random one'], answer: 2, why: 'Ending first leaves the most room for everything else ("activity selection").' },
    { q: 'Two intervals [a, b] and [c, d] (sorted, a ≤ c) overlap when…', options: ['c &lt;= b', 'a == c', 'd &lt; b', 'c &gt; b'], answer: 0, why: 'The second starts before (or exactly when) the first ends. Check if the problem counts touching as overlap.' },
  ],
})
