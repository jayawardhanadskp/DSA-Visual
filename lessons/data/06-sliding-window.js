// Lesson 06 — Sliding window
addViz({
  'sw-fixed': {
    title: 'Fixed-size window: biggest sum of k neighbours',
    code: py`
      def max_window_sum(nums, k):
          window = sum(nums[:k])                    #: the first window nums[0:{k}] sums to {sum(nums[:k])}
          best = window
          for right in range(k, len(nums)):
              left = right - k                      # the element that falls out
              window += nums[right] - nums[left]    #: slide: + nums[{right}] ({nums[right]}) − nums[{left}] ({nums[left]}) → {window + nums[right] - nums[left]}
              best = max(best, window)              #: best = max({best}, {window}) = {max(best, window)}
          return best

      print(max_window_sum([2, 1, 5, 1, 3, 2, 7, 1], 3))
    `,
    views: [
      {
        type: 'array',
        var: 'nums',
        pointers: ['left', 'right'],
        window: (s) => {
          const k = s.v('k')
          const r = s.v('right')
          if (!Number.isInteger(k)) return null
          if (!Number.isInteger(r)) return [0, k - 1]
          const line = s.line
          return line === 5 || line === 6 ? [r - k, r - 1] : [r - k + 1, r]
        },
      },
    ],
  },
  'sw-unique': {
    title: 'Variable window: longest substring without repeats',
    code: py`
      def longest_unique(s):
          seen = set()                   # characters inside the window
          left = 0
          best = 0
          for right in range(len(s)):
              while s[right] in seen:    #: is '{s[right]}' already inside the window? {'YES → shrink from the left' if s[right] in seen else 'no → we can grow'}
                  seen.remove(s[left])   #: drop '{s[left]}' (index {left}) from the window
                  left += 1
              seen.add(s[right])         #: add '{s[right]}' → window is now '{s[left:right + 1]}'
              best = max(best, right - left + 1)   #: window length {right - left + 1}; best = {max(best, right - left + 1)}
          return best

      print(longest_unique("abcabcbb"))
    `,
    views: [
      { type: 'array', var: 's', pointers: ['left', 'right'], window: ['left', 'right'] },
      { type: 'set', var: 'seen', label: 'seen (the window\'s characters)' },
    ],
  },
  'sw-min-len': {
    title: 'Variable window: shortest part with sum ≥ target',
    code: py`
      def min_subarray_len(target, nums):
          left = 0
          total = 0
          best = float("inf")
          for right in range(len(nums)):
              total += nums[right]                   #: grow: add nums[{right}] = {nums[right]} → sum {total + nums[right]}
              while total >= target:                 #: is {total} >= {target}? {'YES → valid. Record it, then try a shorter window' if total >= target else 'no → keep growing'}
                  best = min(best, right - left + 1) #: length {right - left + 1}; best = {min(best, right - left + 1)}
                  total -= nums[left]                #: shrink: remove nums[{left}] = {nums[left]}
                  left += 1
          return 0 if best == float("inf") else best

      print(min_subarray_len(7, [2, 3, 1, 2, 4, 3]))
    `,
    views: [{ type: 'array', var: 'nums', pointers: ['left', 'right'], window: ['left', 'right'] }],
  },
})

addProblems({
  'sw-max-avg': {
    title: 'Maximum average of k neighbours',
    level: 'Easy',
    pattern: 'Fixed window',
    leetcode: '643. Maximum Average Subarray I',
    prompt: '<p>Return the biggest average of any <code>k</code> consecutive numbers in <code>nums</code>. Use a sliding window — O(n), not O(n·k).</p>',
    fn: 'find_max_average',
    compare: 'float',
    starter: py`
      def find_max_average(nums, k):
          # TODO
          return 0.0
    `,
    tests: [
      { args: [[1, 12, -5, -6, 50, 3], 4], expect: 12.75 },
      { args: [[5], 1], expect: 5.0 },
      { args: [[0, 4, 0, 3, 2], 1], expect: 4.0 },
      { args: [[-1, -2, -3], 2], expect: -1.5 },
      { args: [{ __py__: 'list(range(100_000))' }, 50_000], expect: 74999.5 },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['left', 'right', 'i'] }],
    hints: ['Find the best <b>sum</b> of k neighbours; the best average is that sum / k.', 'Start with <code>window = sum(nums[:k])</code>. Then for each new index <code>i</code> from k: <code>window += nums[i] - nums[i - k]</code>.'],
    solution: py`
      def find_max_average(nums, k):
          window = sum(nums[:k])
          best = window
          for i in range(k, len(nums)):
              window += nums[i] - nums[i - k]
              best = max(best, window)
          return best / k
    `,
    explain: '<p>Each slide costs O(1): add one, remove one. Total O(n).</p>',
  },
  'sw-vowels': {
    title: 'Most vowels in a window',
    level: 'Medium',
    pattern: 'Fixed window',
    leetcode: '1456. Maximum Number of Vowels in a Substring of Given Length',
    prompt: '<p>Return the largest number of vowels (<code>a e i o u</code>) in any substring of length <code>k</code>.</p>',
    fn: 'max_vowels',
    starter: py`
      def max_vowels(s, k):
          # TODO
          return 0
    `,
    tests: [
      { args: ['abciiidef', 3], expect: 3 },
      { args: ['aeiou', 2], expect: 2 },
      { args: ['leetcode', 3], expect: 2 },
      { args: ['rhythms', 4], expect: 0 },
      { args: ['tryhard', 4], expect: 1 },
    ],
    hints: ['Same as the window sum, but you add 1 for a vowel entering and subtract 1 for a vowel leaving.'],
    solution: py`
      def max_vowels(s, k):
          vowels = set("aeiou")
          count = sum(1 for ch in s[:k] if ch in vowels)
          best = count
          for i in range(k, len(s)):
              count += (s[i] in vowels) - (s[i - k] in vowels)
              best = max(best, count)
          return best
    `,
    explain: '<p>In Python <code>True</code> counts as 1 and <code>False</code> as 0, so <code>(a in vowels) - (b in vowels)</code> is −1, 0 or 1.</p>',
  },
  'sw-unique': {
    title: 'Longest substring without repeating characters',
    level: 'Medium',
    pattern: 'Variable window',
    leetcode: '3. Longest Substring Without Repeating Characters',
    prompt: '<p>Return the length of the longest substring of <code>s</code> with no repeated characters.</p>',
    fn: 'length_of_longest_substring',
    starter: py`
      def length_of_longest_substring(s):
          # TODO
          return 0
    `,
    tests: [
      { args: ['abcabcbb'], expect: 3 },
      { args: ['bbbbb'], expect: 1 },
      { args: ['pwwkew'], expect: 3 },
      { args: [''], expect: 0 },
      { args: [' '], expect: 1 },
      { args: ['dvdf'], expect: 3 },
      { args: ['abba'], expect: 2 },
      { args: [{ __py__: '"abcdefghij" * 5000' }], expect: 10 },
    ],
    views: [{ type: 'array', var: 's', pointers: ['left', 'right'], window: ['left', 'right'] }, { type: 'set', var: 'seen' }],
    hints: ['Watch the visualizer: <code>right</code> grows the window; when the new character is already inside, <code>left</code> shrinks it.', 'A set holds the characters inside the window. <code>while s[right] in seen: seen.remove(s[left]); left += 1</code>.', 'Faster variant: a dict <code>last_index[ch]</code> lets <code>left</code> jump directly: <code>left = max(left, last_index[ch] + 1)</code>.'],
    solution: py`
      def length_of_longest_substring(s):
          last_index = {}
          left = 0
          best = 0
          for right, ch in enumerate(s):
              if ch in last_index and last_index[ch] >= left:
                  left = last_index[ch] + 1
              last_index[ch] = right
              best = max(best, right - left + 1)
          return best
    `,
    explain: '<p>O(n): <code>left</code> and <code>right</code> each only move forward. The <code>&gt;= left</code> check matters for "abba" — the old <code>a</code> is no longer inside the window.</p>',
  },
  'sw-min-len': {
    title: 'Minimum size subarray sum',
    level: 'Medium',
    pattern: 'Variable window (shrink while valid)',
    leetcode: '209. Minimum Size Subarray Sum',
    prompt: '<p><code>nums</code> has positive numbers. Return the length of the shortest run of neighbours whose sum is <code>&gt;= target</code>, or <code>0</code> if there is none.</p>',
    fn: 'min_subarray_len',
    starter: py`
      def min_subarray_len(target, nums):
          # TODO
          return 0
    `,
    tests: [
      { args: [7, [2, 3, 1, 2, 4, 3]], expect: 2 },
      { args: [4, [1, 4, 4]], expect: 1 },
      { args: [11, [1, 1, 1, 1, 1, 1, 1, 1]], expect: 0 },
      { args: [15, [1, 2, 3, 4, 5]], expect: 5 },
      { args: [6, [10, 2, 3]], expect: 1 },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['left', 'right'], window: ['left', 'right'] }],
    hints: ['Grow the window with <code>right</code>. As long as the sum is big enough, record the length and shrink from the left.', 'Start <code>best = float("inf")</code> and return 0 if it never changed.'],
    solution: py`
      def min_subarray_len(target, nums):
          left = 0
          total = 0
          best = float("inf")
          for right in range(len(nums)):
              total += nums[right]
              while total >= target:
                  best = min(best, right - left + 1)
                  total -= nums[left]
                  left += 1
          return 0 if best == float("inf") else best
    `,
    explain: '<p>Works because all numbers are positive: shrinking always makes the sum smaller, growing always makes it bigger. With negative numbers you need prefix sums instead (lesson 07).</p>',
  },
  'sw-ones': {
    title: 'Max consecutive ones with k flips',
    level: 'Medium',
    pattern: 'Variable window (shrink while invalid)',
    leetcode: '1004. Max Consecutive Ones III',
    prompt: '<p><code>nums</code> has only 0s and 1s. You may flip at most <code>k</code> zeros to ones. Return the longest run of 1s you can get.</p>',
    fn: 'longest_ones',
    starter: py`
      def longest_ones(nums, k):
          # TODO
          return 0
    `,
    tests: [
      { args: [[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2], expect: 6 },
      { args: [[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3], expect: 10 },
      { args: [[0, 0, 0], 0], expect: 0 },
      { args: [[1, 1], 0], expect: 2 },
      { args: [[0, 0], 5], expect: 2 },
    ],
    views: [{ type: 'array', var: 'nums', pointers: ['left', 'right'], window: ['left', 'right'] }],
    hints: ['Rephrase: find the longest window that contains <b>at most k zeros</b>.', 'Count zeros in the window. While there are more than k, shrink from the left.'],
    solution: py`
      def longest_ones(nums, k):
          left = 0
          zeros = 0
          best = 0
          for right in range(len(nums)):
              if nums[right] == 0:
                  zeros += 1
              while zeros > k:
                  if nums[left] == 0:
                      zeros -= 1
                  left += 1
              best = max(best, right - left + 1)
          return best
    `,
    explain: '<p>Rephrasing ("flip k zeros" → "window with at most k zeros") is the real skill here. O(n).</p>',
  },
  'sw-replace': {
    title: 'Longest repeating character replacement',
    level: 'Medium',
    pattern: 'Variable window + counts',
    leetcode: '424. Longest Repeating Character Replacement',
    prompt: '<p>You can change at most <code>k</code> characters of <code>s</code> (uppercase letters). Return the length of the longest substring of one repeated letter you can get.</p>',
    fn: 'character_replacement',
    starter: py`
      def character_replacement(s, k):
          # TODO
          return 0
    `,
    tests: [
      { args: ['ABAB', 2], expect: 4 },
      { args: ['AABABBA', 1], expect: 4 },
      { args: ['A', 0], expect: 1 },
      { args: ['ABCDE', 1], expect: 2 },
      { args: ['AAAA', 0], expect: 4 },
    ],
    hints: ['A window is OK if <code>window_length - (count of its most common letter) &lt;= k</code> — those other letters are the ones you change.', 'Keep a dict of counts for the window. Shrink while the window is not OK.'],
    solution: py`
      def character_replacement(s, k):
          counts = {}
          left = 0
          best = 0
          for right, ch in enumerate(s):
              counts[ch] = counts.get(ch, 0) + 1
              while (right - left + 1) - max(counts.values()) > k:
                  counts[s[left]] -= 1
                  left += 1
              best = max(best, right - left + 1)
          return best
    `,
    explain: '<p><code>max(counts.values())</code> is at most 26 values, so each step is still O(1)-ish → O(26·n) = O(n).</p>',
  },
  'sw-permutation': {
    title: 'Permutation in string',
    level: 'Medium',
    pattern: 'Fixed window + counts',
    leetcode: '567. Permutation in String',
    prompt: '<p>Return <code>True</code> if some substring of <code>s2</code> is a permutation (an anagram) of <code>s1</code>.</p>',
    fn: 'check_inclusion',
    starter: py`
      def check_inclusion(s1, s2):
          # TODO
          return False
    `,
    tests: [
      { args: ['ab', 'eidbaooo'], expect: true },
      { args: ['ab', 'eidboaoo'], expect: false },
      { args: ['adc', 'dcda'], expect: true },
      { args: ['abc', 'ab'], expect: false },
      { args: ['a', 'a'], expect: true },
    ],
    hints: ['The window size is fixed: <code>len(s1)</code>.', 'Keep letter counts of the window and compare them with the counts of <code>s1</code> after every slide.'],
    solution: py`
      from collections import Counter

      def check_inclusion(s1, s2):
          k = len(s1)
          need = Counter(s1)
          window = Counter(s2[:k])
          if window == need:
              return True
          for i in range(k, len(s2)):
              window[s2[i]] += 1
              window[s2[i - k]] -= 1
              if window[s2[i - k]] == 0:
                  del window[s2[i - k]]
              if window == need:
                  return True
          return False
    `,
    explain: '<p>Comparing two Counters of at most 26 letters is O(26). Total O(26·n) = O(n). Deleting zero counts keeps the comparison correct.</p>',
  },
  'sw-anagrams': {
    title: 'Find all anagrams in a string',
    level: 'Medium',
    pattern: 'Fixed window + counts',
    leetcode: '438. Find All Anagrams in a String',
    prompt: '<p>Return all start indexes of substrings of <code>s</code> that are anagrams of <code>p</code>, in increasing order.</p>',
    fn: 'find_anagrams',
    starter: py`
      def find_anagrams(s, p):
          # TODO
          return []
    `,
    tests: [
      { args: ['cbaebabacd', 'abc'], expect: [0, 6] },
      { args: ['abab', 'ab'], expect: [0, 1, 2] },
      { args: ['a', 'ab'], expect: [] },
      { args: ['aaa', 'a'], expect: [0, 1, 2] },
    ],
    hints: ['Exactly the previous problem, but collect every start index instead of returning <code>True</code>.', 'The window that ends at index <code>i</code> starts at <code>i - len(p) + 1</code>.'],
    solution: py`
      def find_anagrams(s, p):
          k = len(p)
          if k > len(s):
              return []
          need = [0] * 26
          window = [0] * 26
          for ch in p:
              need[ord(ch) - 97] += 1
          result = []
          for i, ch in enumerate(s):
              window[ord(ch) - 97] += 1
              if i >= k:
                  window[ord(s[i - k]) - 97] -= 1
              if window == need:
                  result.append(i - k + 1)
          return result
    `,
    explain: '<p>This version uses 26-slot count lists (lesson 03) — comparing two lists of 26 is O(26).</p>',
  },
})

addQuiz({
  'sw-quiz': [
    { q: 'When does a problem smell like <b>sliding window</b>?', options: ['"sorted list, find a pair"', '"longest / shortest / best <b>contiguous</b> subarray or substring"', '"all subsets"', '"shortest path in a graph"'], answer: 1, why: '"Contiguous" (neighbours, no gaps) + best/longest/shortest + often "at most k" are the signals.' },
    { q: 'Why is the variable window O(n) even though it has a <code>while</code> inside a <code>for</code>?', options: ['Python optimises it', '<code>left</code> only moves forward, at most n times in total', 'The while runs once', 'It is actually O(n²)'], answer: 1, why: 'Count total moves: right moves n times, left moves at most n times → 2n steps.' },
    { q: 'In "minimum size subarray sum", why must the numbers be positive?', options: ['Because of Python', 'So that growing the window always increases the sum and shrinking always decreases it', 'To avoid division by zero', 'They don\'t have to be'], answer: 1, why: 'With negatives, shrinking might increase the sum, so the window logic breaks. Use prefix sums + hashing (lesson 07).' },
    { q: 'Fixed window of size k: after the first window, what does each slide do?', options: ['Recompute <code>sum(nums[i:i+k])</code>', 'Add the new right element, remove the element that left', 'Sort the window', 'Nothing'], answer: 1, why: 'Recomputing is O(k) per step → O(n·k). Adding/removing is O(1) per step → O(n).' },
  ],
})
