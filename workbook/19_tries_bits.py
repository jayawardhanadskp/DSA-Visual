"""
Lesson 19 · Tries & bit tricks — workbook
The visual lesson: lessons/19-tries-bits.html

How to use:
  1. Write your code inside each function (replace the `pass` / TODO lines).
  2. Run:  python3 workbook/19_tries_bits.py
  3. Fix until every problem shows ✅. Use print() freely while debugging.
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
        pass

    def search(self, word):
        pass

    def starts_with(self, prefix):
        pass


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
        self.root = {}            # tip: a trie can be plain nested dicts; use "$" to mark a word end

    def add_word(self, word):
        pass

    def search(self, word):
        pass


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Search suggestions (autocomplete)  ·  Medium  ·  Sort + prefix (or trie)
#
# After typing each character of search_word, suggest at most 3 products (alphabetically
# smallest) that start with what was typed so far. Return a list of suggestion lists.
#
# LeetCode: 1268. Search Suggestions System
# ────────────────────────────────────────────────────────────────────────────────────────
def suggested_products(products, search_word):
    # TODO
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Single number  ·  Easy  ·  XOR
#
# Every number appears twice except one. Find it in O(n) time and O(1) extra space.
#
# LeetCode: 136. Single Number
# ────────────────────────────────────────────────────────────────────────────────────────
def single_number(nums):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Number of 1 bits  ·  Easy  ·  n & (n − 1)
#
# Return how many 1-bits the binary form of the positive integer n has.
#
# LeetCode: 191. Number of 1 Bits
# ────────────────────────────────────────────────────────────────────────────────────────
def hamming_weight(n):
    # TODO (don't use bin(n).count("1") — that's the 1-line answer to check against!)
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Power of two  ·  Easy  ·  n & (n − 1)
#
# Return True if n is a power of two (1, 2, 4, 8, …), without loops.
#
# LeetCode: 231. Power of Two
# ────────────────────────────────────────────────────────────────────────────────────────
def is_power_of_two(n):
    # TODO
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Counting bits  ·  Easy  ·  DP on bits
#
# Return a list ans of length n + 1 where ans[i] is the number of 1-bits in i. O(n).
#
# LeetCode: 338. Counting Bits
# ────────────────────────────────────────────────────────────────────────────────────────
def count_bits(n):
    # TODO
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. Reverse bits (32-bit)  ·  Easy  ·  Shift and build
#
# Reverse the 32 bits of the unsigned integer n and return the result.
#
# LeetCode: 190. Reverse Bits
# ────────────────────────────────────────────────────────────────────────────────────────
def reverse_bits(n):
    # TODO
    return 0


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
