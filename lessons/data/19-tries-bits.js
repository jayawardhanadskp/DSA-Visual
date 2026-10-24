// Lesson 19 — Tries & bit tricks
const l19Bits = (name, width) => ({
  type: 'array',
  label: `${name} in binary`,
  var: (s) => {
    const n = s.v(name)
    return Number.isInteger(n) && n >= 0 ? n.toString(2).padStart(width, '0').split('') : null
  },
  indexLabels: Array.from({ length: width }, (_, i) => String(width - 1 - i)),
  cls: (s) => {
    const n = s.v(name)
    if (!Number.isInteger(n) || n <= 0) return {}
    const low = Math.log2(n & -n)
    return { [width - 1 - low]: 'hot' }
  },
})

addViz({
  'trie-insert': {
    title: 'A trie: words that share a prefix share a path',
    code: py`
      class TrieNode:
          def __init__(self):
              self.children = {}             # letter → TrieNode
              self.is_end = False            # does a word end here?

      root = TrieNode()

      def insert(word):
          node = root
          for ch in word:
              if ch not in node.children:    #: is there a '{ch}' branch here? {'no → create it' if ch not in node.children else 'yes → reuse it (shared prefix!)'}
                  node.children[ch] = TrieNode()
              node = node.children[ch]
          node.is_end = True                 #: mark: the word '{word}' ends here

      def starts_with(prefix):
          node = root
          for ch in prefix:
              if ch not in node.children:    #: follow '{ch}'? {'no such branch → no word starts with ' + repr(prefix) if ch not in node.children else 'yes'}
                  return False
              node = node.children[ch]
          return True

      for w in ["car", "cat", "cart", "dog"]:
          insert(w)
      print(starts_with("ca"), starts_with("cow"))
    `,
    views: [{ type: 'trie', var: 'root', pointers: ['node'] }],
    hideGlobals: true,
  },
  'bits-count': {
    title: 'n & (n - 1) removes the lowest 1-bit',
    code: py`
      def count_ones(n):
          count = 0
          while n:
              n &= n - 1               #: {n:08b} & {n - 1:08b} = {n & (n - 1):08b} → the lowest 1 is gone
              count += 1
          return count

      print(count_ones(0b10110100))
    `,
    views: [l19Bits('n', 8)],
  },
  'bits-xor': {
    title: 'XOR: pairs cancel out',
    code: py`
      def single_number(nums):
          result = 0
          for x in nums:
              result ^= x              #: {result:04b} ^ {x:04b} = {result ^ x:04b}  ({result} ^ {x} = {result ^ x})
          return result

      print(single_number([4, 1, 2, 1, 2]))
    `,
    views: [{ type: 'array', var: 'nums' }, l19Bits('result', 4), l19Bits('x', 4)],
  },
})

addWidget({
  'bits-play': (el) => {
    el.innerHTML = `<h4>Bit playground</h4>
      <div class="row"><label>a = <input type="number" class="a" value="12" style="width:90px"></label><label>b = <input type="number" class="b" value="10" style="width:90px"></label></div>
      <table class="kv rows" style="font-size:14px"></table>`
    const a = el.querySelector('.a')
    const b = el.querySelector('.b')
    const bin = (v) => (v < 0 ? '−' + (-v).toString(2) : v.toString(2).padStart(8, '0'))
    const draw = () => {
      const x = Math.trunc(+a.value) || 0
      const y = Math.trunc(+b.value) || 0
      const rows = [
        ['a', x, ''],
        ['b', y, ''],
        ['a &amp; b', x & y, 'AND: 1 only where both are 1'],
        ['a | b', x | y, 'OR: 1 where either is 1'],
        ['a ^ b', x ^ y, 'XOR: 1 where they differ (a ^ a = 0)'],
        ['a &lt;&lt; 1', x << 1, 'shift left = × 2'],
        ['a &gt;&gt; 1', x >> 1, 'shift right = // 2'],
        ['a &amp; (a − 1)', x & (x - 1), 'removes the lowest 1-bit'],
        ['a &amp; −a', x & -x, 'keeps only the lowest 1-bit'],
      ]
      el.querySelector('.rows').innerHTML = '<tr><th>expression</th><th>binary</th><th>decimal</th><th>meaning</th></tr>' + rows.map(([e, v, m]) => `<tr><td>${e}</td><td style="letter-spacing:2px">${bin(v)}</td><td>${v}</td><td style="font-family:var(--sans)">${m}</td></tr>`).join('')
    }
    a.oninput = b.oninput = draw
    draw()
  },
})

addProblems({
  'tb-trie': {
    title: 'Implement a trie (design)',
    level: 'Medium',
    pattern: 'Trie',
    leetcode: '208. Implement Trie (Prefix Tree)',
    prompt: '<p>Implement <code>Trie()</code> with <code>insert(word)</code>, <code>search(word)</code> (is this exact word stored?) and <code>starts_with(prefix)</code> (does any stored word start with it?).</p>',
    fn: 'Trie',
    starter: py`
      class TrieNode:
          def __init__(self):
              self.children = {}
              self.is_end = False

      class Trie:
          def __init__(self):
              self.root = TrieNode()

          def insert(self, word):
              pass

          def search(self, word):
              pass

          def starts_with(self, prefix):
              pass
    `,
    tests: [
      { ops: ['Trie', 'insert', 'search', 'search', 'starts_with', 'insert', 'search'], args: [[], ['apple'], ['apple'], ['app'], ['app'], ['app'], ['app']], expect: [null, null, true, false, true, null, true] },
      { ops: ['Trie', 'insert', 'insert', 'search', 'starts_with', 'search'], args: [[], ['car'], ['cart'], ['ca'], ['cart'], ['cart']], expect: [null, null, null, false, true, true] },
    ],
    hints: ['Write a helper <code>_walk(text)</code> that follows the letters from the root and returns the last node, or <code>None</code> if a letter is missing.', 'search = walk exists <b>and</b> its <code>is_end</code> is True. starts_with = walk exists.'],
    solution: py`
      class TrieNode:
          def __init__(self):
              self.children = {}
              self.is_end = False

      class Trie:
          def __init__(self):
              self.root = TrieNode()

          def insert(self, word):
              node = self.root
              for ch in word:
                  node = node.children.setdefault(ch, TrieNode())
              node.is_end = True

          def _walk(self, text):
              node = self.root
              for ch in text:
                  if ch not in node.children:
                      return None
                  node = node.children[ch]
              return node

          def search(self, word):
              node = self._walk(word)
              return node is not None and node.is_end

          def starts_with(self, prefix):
              return self._walk(prefix) is not None
    `,
    explain: '<p>Every operation is O(length of the word) — independent of how many words are stored. <code>setdefault</code> = "get it, or create it if missing".</p>',
  },
  'tb-word-dict': {
    title: 'Add and search words with wildcards (design)',
    level: 'Medium',
    pattern: 'Trie + DFS',
    leetcode: '211. Design Add and Search Words Data Structure',
    prompt: '<p>Implement <code>WordDictionary()</code> with <code>add_word(word)</code> and <code>search(word)</code>, where <code>.</code> in the search word matches any single letter.</p>',
    fn: 'WordDictionary',
    starter: py`
      class WordDictionary:
          def __init__(self):
              self.root = {}            # tip: a trie can be plain nested dicts; use "$" to mark a word end

          def add_word(self, word):
              pass

          def search(self, word):
              pass
    `,
    tests: [
      { ops: ['WordDictionary', 'add_word', 'add_word', 'add_word', 'search', 'search', 'search', 'search'], args: [[], ['bad'], ['dad'], ['mad'], ['pad'], ['bad'], ['.ad'], ['b..']], expect: [null, null, null, null, false, true, true, true] },
      { ops: ['WordDictionary', 'add_word', 'search', 'search', 'search'], args: [[], ['a'], ['.'], ['a.'], ['']], expect: [null, null, true, false, false] },
    ],
    hints: ['add_word: like insert. Mark the end with <code>node["$"] = True</code>.', 'search: recursion <code>dfs(node, i)</code>. A normal letter follows one branch; <code>.</code> tries every child branch (skip the "$" key).'],
    solution: py`
      class WordDictionary:
          def __init__(self):
              self.root = {}

          def add_word(self, word):
              node = self.root
              for ch in word:
                  node = node.setdefault(ch, {})
              node["$"] = True

          def search(self, word):
              def dfs(node, i):
                  if i == len(word):
                      return "$" in node
                  ch = word[i]
                  if ch == ".":
                      return any(dfs(child, i + 1) for key, child in node.items() if key != "$")
                  return ch in node and dfs(node[ch], i + 1)
              return dfs(self.root, 0)
    `,
    explain: '<p>A trie as nested dicts is very Pythonic. Wildcards turn the walk into a small backtracking search.</p>',
  },
  'tb-suggest': {
    title: 'Search suggestions (autocomplete)',
    level: 'Medium',
    pattern: 'Sort + prefix (or trie)',
    leetcode: '1268. Search Suggestions System',
    prompt: '<p>After typing each character of <code>search_word</code>, suggest at most 3 products (alphabetically smallest) that start with what was typed so far. Return a list of suggestion lists.</p>',
    fn: 'suggested_products',
    starter: py`
      def suggested_products(products, search_word):
          # TODO
          return []
    `,
    tests: [
      { args: [['mobile', 'mouse', 'moneypot', 'monitor', 'mousepad'], 'mouse'], expect: [['mobile', 'moneypot', 'monitor'], ['mobile', 'moneypot', 'monitor'], ['mouse', 'mousepad'], ['mouse', 'mousepad'], ['mouse', 'mousepad']] },
      { args: [['havana'], 'havana'], expect: [['havana'], ['havana'], ['havana'], ['havana'], ['havana'], ['havana']] },
      { args: [['bags', 'baggage', 'banner', 'box', 'cloths'], 'bags'], expect: [['baggage', 'bags', 'banner'], ['baggage', 'bags', 'banner'], ['baggage', 'bags'], ['bags']] },
    ],
    hints: ['Sort the products. Then all products with a given prefix are next to each other.', 'For each prefix, <code>bisect_left(products, prefix)</code> finds the first candidate; take up to 3 that start with the prefix.'],
    solution: py`
      import bisect

      def suggested_products(products, search_word):
          products = sorted(products)
          result = []
          prefix = ""
          for ch in search_word:
              prefix += ch
              i = bisect.bisect_left(products, prefix)
              result.append([p for p in products[i:i + 3] if p.startswith(prefix)])
          return result
    `,
    explain: '<p>A trie works too (store the 3 best words in each node). Sorting + binary search (lesson 12) is shorter and just as fast here.</p>',
  },
  'tb-single': {
    title: 'Single number',
    level: 'Easy',
    pattern: 'XOR',
    leetcode: '136. Single Number',
    prompt: '<p>Every number appears twice except one. Find it in O(n) time and O(1) extra space.</p>',
    fn: 'single_number',
    starter: py`
      def single_number(nums):
          # TODO
          return 0
    `,
    tests: [
      { args: [[2, 2, 1]], expect: 1 },
      { args: [[4, 1, 2, 1, 2]], expect: 4 },
      { args: [[1]], expect: 1 },
      { args: [[-1, -1, -2]], expect: -2 },
    ],
    hints: ['<code>x ^ x == 0</code> and <code>x ^ 0 == x</code>, and the order of XORs doesn\'t matter.'],
    solution: py`
      def single_number(nums):
          result = 0
          for x in nums:
              result ^= x
          return result
    `,
    explain: '<p>A set also works, but uses O(n) space. XOR is the "aha" O(1) answer.</p>',
  },
  'tb-ones': {
    title: 'Number of 1 bits',
    level: 'Easy',
    pattern: 'n & (n − 1)',
    leetcode: '191. Number of 1 Bits',
    prompt: '<p>Return how many 1-bits the binary form of the positive integer <code>n</code> has.</p>',
    fn: 'hamming_weight',
    starter: py`
      def hamming_weight(n):
          # TODO (don't use bin(n).count("1") — that's the 1-line answer to check against!)
          return 0
    `,
    tests: [
      { args: [11], expect: 3 },
      { args: [128], expect: 1 },
      { args: [2147483645], expect: 30 },
      { args: [0], expect: 0 },
    ],
    hints: ['Way 1: check the last bit with <code>n &amp; 1</code>, then <code>n &gt;&gt;= 1</code>.', 'Way 2: <code>n &amp;= n - 1</code> removes one 1-bit per step.'],
    solution: py`
      def hamming_weight(n):
          count = 0
          while n:
              n &= n - 1
              count += 1
          return count
    `,
    explain: '<p>Loops once per 1-bit instead of once per bit. (Python: <code>n.bit_count()</code>.)</p>',
  },
  'tb-power2': {
    title: 'Power of two',
    level: 'Easy',
    pattern: 'n & (n − 1)',
    leetcode: '231. Power of Two',
    prompt: '<p>Return <code>True</code> if <code>n</code> is a power of two (1, 2, 4, 8, …), without loops.</p>',
    fn: 'is_power_of_two',
    starter: py`
      def is_power_of_two(n):
          # TODO
          return False
    `,
    tests: [
      { args: [1], expect: true },
      { args: [16], expect: true },
      { args: [3], expect: false },
      { args: [0], expect: false },
      { args: [-16], expect: false },
      { args: [1073741824], expect: true },
    ],
    hints: ['A power of two has exactly one 1-bit.', 'So removing the lowest 1-bit must leave 0: <code>n &gt; 0 and n &amp; (n - 1) == 0</code>.'],
    solution: py`
      def is_power_of_two(n):
          return n > 0 and n & (n - 1) == 0
    `,
    explain: '<p>O(1).</p>',
  },
  'tb-count-bits': {
    title: 'Counting bits',
    level: 'Easy',
    pattern: 'DP on bits',
    leetcode: '338. Counting Bits',
    prompt: '<p>Return a list <code>ans</code> of length <code>n + 1</code> where <code>ans[i]</code> is the number of 1-bits in i. O(n).</p>',
    fn: 'count_bits',
    starter: py`
      def count_bits(n):
          # TODO
          return []
    `,
    tests: [
      { args: [2], expect: [0, 1, 1] },
      { args: [5], expect: [0, 1, 1, 2, 1, 2] },
      { args: [0], expect: [0] },
    ],
    hints: ['<code>i &gt;&gt; 1</code> is i without its last bit, and you already know its answer.', '<code>ans[i] = ans[i &gt;&gt; 1] + (i &amp; 1)</code>'],
    solution: py`
      def count_bits(n):
          ans = [0] * (n + 1)
          for i in range(1, n + 1):
              ans[i] = ans[i >> 1] + (i & 1)
          return ans
    `,
    explain: '<p>A tiny DP (lesson 17) where the sub-problem is "the same number without its last bit".</p>',
  },
  'tb-reverse': {
    title: 'Reverse bits (32-bit)',
    level: 'Easy',
    pattern: 'Shift and build',
    leetcode: '190. Reverse Bits',
    prompt: '<p>Reverse the 32 bits of the unsigned integer <code>n</code> and return the result.</p>',
    fn: 'reverse_bits',
    starter: py`
      def reverse_bits(n):
          # TODO
          return 0
    `,
    tests: [
      { args: [43261596], expect: 964176192 },
      { args: [4294967293], expect: 3221225471 },
      { args: [0], expect: 0 },
      { args: [1], expect: 2147483648 },
    ],
    hints: ['Repeat 32 times: take the last bit of n (<code>n &amp; 1</code>), push it onto the result (<code>result = (result &lt;&lt; 1) | bit</code>), drop it from n (<code>n &gt;&gt;= 1</code>).'],
    solution: py`
      def reverse_bits(n):
          result = 0
          for _ in range(32):
              result = (result << 1) | (n & 1)
              n >>= 1
          return result
    `,
    explain: '<p>The same "pop the last digit, push it onto a new number" loop as reversing a decimal number, in base 2.</p>',
  },
})

addQuiz({
  'tb-quiz': [
    { q: 'Checking whether a prefix exists in a trie costs…', options: ['O(number of words)', 'O(length of the prefix)', 'O(log n)', 'O(1)'], answer: 1, why: 'You follow one branch per character, no matter how many words are stored.' },
    { q: 'What is <code>5 ^ 5 ^ 7</code>?', options: ['17', '7', '0', '5'], answer: 1, why: '5 ^ 5 = 0, and 0 ^ 7 = 7. Equal numbers cancel out.' },
    { q: 'What does <code>n &amp; (n - 1)</code> do?', options: ['Doubles n', 'Removes the lowest 1-bit of n', 'Flips all bits', 'Returns the last bit'], answer: 1, why: 'n − 1 flips the lowest 1-bit and all the 0s below it; AND-ing clears that bit.' },
    { q: 'What are <code>x &lt;&lt; 3</code> and <code>x &gt;&gt; 1</code> for x = 5?', options: ['40 and 2', '15 and 2.5', '8 and 4', '53 and 51'], answer: 0, why: 'Shift left by k = × 2ᵏ; shift right by 1 = // 2.' },
    { q: 'Which signals point to a trie?', options: ['"prefix", "autocomplete", "starts with", many words searched letter by letter', '"shortest path"', '"k-th largest"', '"sum of a range"'], answer: 0, why: 'Tries share prefixes. Word Search II (LC 212) combines a trie with backtracking.' },
  ],
})
