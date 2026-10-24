"""
Lesson 19 · Tries & bit tricks — SOLUTIONS
The visual lesson: lessons/19-tries-bits.html

Only open this after you've really tried (15+ minutes per problem).
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Implement a trie (design)  ·  Medium  ·  Trie
#
# Implement Trie() with insert(word), search(word) (is this exact word stored?) and
# starts_with(prefix) (does any stored word start with it?).
#
# LeetCode: 208. Implement Trie (Prefix Tree)
# ────────────────────────────────────────────────────────────────────────────────────────
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


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Add and search words with wildcards (design)  ·  Medium  ·  Trie + DFS
#
# Implement WordDictionary() with add_word(word) and search(word), where . in the search word
# matches any single letter.
#
# LeetCode: 211. Design Add and Search Words Data Structure
# ────────────────────────────────────────────────────────────────────────────────────────
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


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Search suggestions (autocomplete)  ·  Medium  ·  Sort + prefix (or trie)
#
# After typing each character of search_word, suggest at most 3 products (alphabetically
# smallest) that start with what was typed so far. Return a list of suggestion lists.
#
# LeetCode: 1268. Search Suggestions System
# ────────────────────────────────────────────────────────────────────────────────────────
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


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Single number  ·  Easy  ·  XOR
#
# Every number appears twice except one. Find it in O(n) time and O(1) extra space.
#
# LeetCode: 136. Single Number
# ────────────────────────────────────────────────────────────────────────────────────────
def single_number(nums):
    result = 0
    for x in nums:
        result ^= x
    return result


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Number of 1 bits  ·  Easy  ·  n & (n − 1)
#
# Return how many 1-bits the binary form of the positive integer n has.
#
# LeetCode: 191. Number of 1 Bits
# ────────────────────────────────────────────────────────────────────────────────────────
def hamming_weight(n):
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Power of two  ·  Easy  ·  n & (n − 1)
#
# Return True if n is a power of two (1, 2, 4, 8, …), without loops.
#
# LeetCode: 231. Power of Two
# ────────────────────────────────────────────────────────────────────────────────────────
def is_power_of_two(n):
    return n > 0 and n & (n - 1) == 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Counting bits  ·  Easy  ·  DP on bits
#
# Return a list ans of length n + 1 where ans[i] is the number of 1-bits in i. O(n).
#
# LeetCode: 338. Counting Bits
# ────────────────────────────────────────────────────────────────────────────────────────
def count_bits(n):
    ans = [0] * (n + 1)
    for i in range(1, n + 1):
        ans[i] = ans[i >> 1] + (i & 1)
    return ans


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. Reverse bits (32-bit)  ·  Easy  ·  Shift and build
#
# Reverse the 32 bits of the unsigned integer n and return the result.
#
# LeetCode: 190. Reverse Bits
# ────────────────────────────────────────────────────────────────────────────────────────
def reverse_bits(n):
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result


if __name__ == "__main__":
    check(Trie, [
        {"ops": ["Trie", "insert", "search", "search", "starts_with", "insert", "search"], "args": [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]], "expect": [None, None, True, False, True, None, True]},
        {"ops": ["Trie", "insert", "insert", "search", "starts_with", "search"], "args": [[], ["car"], ["cart"], ["ca"], ["cart"], ["cart"]], "expect": [None, None, None, False, True, True]},
    ])
    check(WordDictionary, [
        {"ops": ["WordDictionary", "add_word", "add_word", "add_word", "search", "search", "search", "search"], "args": [[], ["bad"], ["dad"], ["mad"], ["pad"], ["bad"], [".ad"], ["b.."]], "expect": [None, None, None, None, False, True, True, True]},
        {"ops": ["WordDictionary", "add_word", "search", "search", "search"], "args": [[], ["a"], ["."], ["a."], [""]], "expect": [None, None, True, False, False]},
    ])
    check(suggested_products, [
        {"args": [["mobile", "mouse", "moneypot", "monitor", "mousepad"], "mouse"], "expect": [["mobile", "moneypot", "monitor"], ["mobile", "moneypot", "monitor"], ["mouse", "mousepad"], ["mouse", "mousepad"], ["mouse", "mousepad"]]},
        {"args": [["havana"], "havana"], "expect": [["havana"], ["havana"], ["havana"], ["havana"], ["havana"], ["havana"]]},
        {"args": [["bags", "baggage", "banner", "box", "cloths"], "bags"], "expect": [["baggage", "bags", "banner"], ["baggage", "bags", "banner"], ["baggage", "bags"], ["bags"]]},
    ])
    check(single_number, [
        {"args": [[2, 2, 1]], "expect": 1},
        {"args": [[4, 1, 2, 1, 2]], "expect": 4},
        {"args": [[1]], "expect": 1},
        {"args": [[-1, -1, -2]], "expect": -2},
    ])
    check(hamming_weight, [
        {"args": [11], "expect": 3},
        {"args": [128], "expect": 1},
        {"args": [2147483645], "expect": 30},
        {"args": [0], "expect": 0},
    ])
    check(is_power_of_two, [
        {"args": [1], "expect": True},
        {"args": [16], "expect": True},
        {"args": [3], "expect": False},
        {"args": [0], "expect": False},
        {"args": [-16], "expect": False},
        {"args": [1073741824], "expect": True},
    ])
    check(count_bits, [
        {"args": [2], "expect": [0, 1, 1]},
        {"args": [5], "expect": [0, 1, 1, 2, 1, 2]},
        {"args": [0], "expect": [0]},
    ])
    check(reverse_bits, [
        {"args": [43261596], "expect": 964176192},
        {"args": [4294967293], "expect": 3221225471},
        {"args": [0], "expect": 0},
        {"args": [1], "expect": 2147483648},
    ])
