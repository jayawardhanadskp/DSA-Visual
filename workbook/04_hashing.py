"""
Lesson 04 · Hash maps & sets — workbook
The visual lesson: lessons/04-hashing.html

How to use:
  1. Write your code inside each function (replace the `pass` / TODO lines).
  2. Run:  python3 workbook/04_hashing.py
  3. Fix until every problem shows ✅. Use print() freely while debugging.
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Two Sum  ·  Easy  ·  dict: value → index
#
# Return the indexes [i, j] (i < j) of the two numbers in nums that add up to target. There is
# exactly one answer. The list is not sorted. Aim for O(n).
#
# LeetCode: 1. Two Sum
# ────────────────────────────────────────────────────────────────────────────────────────
def two_sum(nums, target):
    # TODO: one pass with a dict
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Valid anagram  ·  Easy  ·  Counting
#
# Return True if t uses exactly the same letters as s (same counts), in any order.
#
# LeetCode: 242. Valid Anagram
# ────────────────────────────────────────────────────────────────────────────────────────
def is_anagram(s, t):
    # TODO
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. First unique character  ·  Easy  ·  Count, then scan
#
# Return the index of the first character in s that appears exactly once, or -1.
#
# LeetCode: 387. First Unique Character in a String
# ────────────────────────────────────────────────────────────────────────────────────────
def first_uniq_char(s):
    # TODO
    return -1


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Ransom note  ·  Easy  ·  Counting
#
# Can you build note by cutting letters out of magazine? Each magazine letter can be used
# once.
#
# LeetCode: 383. Ransom Note
# ────────────────────────────────────────────────────────────────────────────────────────
def can_construct(note, magazine):
    # TODO
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Isomorphic strings  ·  Easy  ·  Two-way mapping
#
# s and t (same length) are isomorphic if you can replace characters in s to get t, where each
# character always maps to the same character, and no two characters map to the same one.
# "egg"/"add" → True, "foo"/"bar" → False.
#
# LeetCode: 205. Isomorphic Strings
# ────────────────────────────────────────────────────────────────────────────────────────
def is_isomorphic(s, t):
    # TODO
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Group anagrams  ·  Medium  ·  dict: key → group
#
# Group the words that are anagrams of each other. Return a list of groups (any order of
# groups, any order inside a group).
#
# LeetCode: 49. Group Anagrams
# ────────────────────────────────────────────────────────────────────────────────────────
def group_anagrams(words):
    # TODO: what key do all anagrams share?
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Top K frequent elements  ·  Medium  ·  Count + sort (or bucket)
#
# Return the k most frequent values in nums (any order). The answer is unique.
#
# LeetCode: 347. Top K Frequent Elements
# ────────────────────────────────────────────────────────────────────────────────────────
def top_k_frequent(nums, k):
    # TODO
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. Longest consecutive sequence  ·  Medium  ·  set + "start of a run"
#
# Return the length of the longest run of consecutive integers (like 1, 2, 3, 4) that can be
# made from the values in nums, in any order. Must be O(n) — the big test has 100,001 values.
#
# LeetCode: 128. Longest Consecutive Sequence
# ────────────────────────────────────────────────────────────────────────────────────────
def longest_consecutive(nums):
    # TODO
    return 0


if __name__ == "__main__":
    check(two_sum, [
        {"args": [[2, 7, 11, 15], 9], "expect": [0, 1]},
        {"args": [[3, 2, 4], 6], "expect": [1, 2]},
        {"args": [[3, 3], 6], "expect": [0, 1]},
        {"args": [[5, 11, 9, 2, 14, 3], 17], "expect": [4, 5]},
        {"args": [[-1, -2, -3, -4, -5], -8], "expect": [2, 4]},
        {"args": [{"__py__": "list(range(100_000))"}, 199997], "expect": [99998, 99999]},
    ])
    check(is_anagram, [
        {"args": ["anagram", "nagaram"], "expect": True},
        {"args": ["rat", "car"], "expect": False},
        {"args": ["a", "ab"], "expect": False},
        {"args": ["", ""], "expect": True},
        {"args": ["listen", "silent"], "expect": True},
        {"args": ["aacc", "ccac"], "expect": False},
    ])
    check(first_uniq_char, [
        {"args": ["leetcode"], "expect": 0},
        {"args": ["loveleetcode"], "expect": 2},
        {"args": ["aabb"], "expect": -1},
        {"args": ["z"], "expect": 0},
        {"args": ["swiss"], "expect": 1},
    ])
    check(can_construct, [
        {"args": ["a", "b"], "expect": False},
        {"args": ["aa", "ab"], "expect": False},
        {"args": ["aa", "aab"], "expect": True},
        {"args": ["", "x"], "expect": True},
        {"args": ["abc", "cbaxyz"], "expect": True},
    ])
    check(is_isomorphic, [
        {"args": ["egg", "add"], "expect": True},
        {"args": ["foo", "bar"], "expect": False},
        {"args": ["paper", "title"], "expect": True},
        {"args": ["badc", "baba"], "expect": False},
        {"args": ["ab", "aa"], "expect": False},
        {"args": ["", ""], "expect": True},
    ])
    check(group_anagrams, [
        {"args": [["eat", "tea", "tan", "ate", "nat", "bat"]], "expect": [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]},
        {"args": [[""]], "expect": [[""]]},
        {"args": [["a"]], "expect": [["a"]]},
        {"args": [["abc", "bca", "xyz"]], "expect": [["abc", "bca"], ["xyz"]]},
    ], compare="nested")
    check(top_k_frequent, [
        {"args": [[1, 1, 1, 2, 2, 3], 2], "expect": [1, 2]},
        {"args": [[1], 1], "expect": [1]},
        {"args": [[4, 4, 5, 5, 5, 6], 1], "expect": [5]},
        {"args": [[7, 8, 7, 9, 8, 7], 2], "expect": [7, 8]},
    ], compare="sorted")
    check(longest_consecutive, [
        {"args": [[100, 4, 200, 1, 3, 2]], "expect": 4},
        {"args": [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], "expect": 9},
        {"args": [[]], "expect": 0},
        {"args": [[1, 2, 0, 1]], "expect": 3},
        {"args": [[9]], "expect": 1},
        {"args": [{"__py__": "list(range(0, 200_000, 2)) + [1]"}], "expect": 3},
    ])
