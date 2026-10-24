"""
Lesson 06 · Sliding window — workbook
The visual lesson: lessons/06-sliding-window.html

How to use:
  1. Write your code inside each function (replace the `pass` / TODO lines).
  2. Run:  python3 workbook/06_sliding_window.py
  3. Fix until every problem shows ✅. Use print() freely while debugging.
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Maximum average of k neighbours  ·  Easy  ·  Fixed window
#
# Return the biggest average of any k consecutive numbers in nums. Use a sliding window —
# O(n), not O(n·k).
#
# LeetCode: 643. Maximum Average Subarray I
# ────────────────────────────────────────────────────────────────────────────────────────
def find_max_average(nums, k):
    # TODO
    return 0.0


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Most vowels in a window  ·  Medium  ·  Fixed window
#
# Return the largest number of vowels (a e i o u) in any substring of length k.
#
# LeetCode: 1456. Maximum Number of Vowels in a Substring of Given Length
# ────────────────────────────────────────────────────────────────────────────────────────
def max_vowels(s, k):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Longest substring without repeating characters  ·  Medium  ·  Variable window
#
# Return the length of the longest substring of s with no repeated characters.
#
# LeetCode: 3. Longest Substring Without Repeating Characters
# ────────────────────────────────────────────────────────────────────────────────────────
def length_of_longest_substring(s):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Minimum size subarray sum  ·  Medium  ·  Variable window (shrink while valid)
#
# nums has positive numbers. Return the length of the shortest run of neighbours whose sum is
# >= target, or 0 if there is none.
#
# LeetCode: 209. Minimum Size Subarray Sum
# ────────────────────────────────────────────────────────────────────────────────────────
def min_subarray_len(target, nums):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Max consecutive ones with k flips  ·  Medium  ·  Variable window (shrink while invalid)
#
# nums has only 0s and 1s. You may flip at most k zeros to ones. Return the longest run of 1s
# you can get.
#
# LeetCode: 1004. Max Consecutive Ones III
# ────────────────────────────────────────────────────────────────────────────────────────
def longest_ones(nums, k):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Longest repeating character replacement  ·  Medium  ·  Variable window + counts
#
# You can change at most k characters of s (uppercase letters). Return the length of the
# longest substring of one repeated letter you can get.
#
# LeetCode: 424. Longest Repeating Character Replacement
# ────────────────────────────────────────────────────────────────────────────────────────
def character_replacement(s, k):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Permutation in string  ·  Medium  ·  Fixed window + counts
#
# Return True if some substring of s2 is a permutation (an anagram) of s1.
#
# LeetCode: 567. Permutation in String
# ────────────────────────────────────────────────────────────────────────────────────────
def check_inclusion(s1, s2):
    # TODO
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. Find all anagrams in a string  ·  Medium  ·  Fixed window + counts
#
# Return all start indexes of substrings of s that are anagrams of p, in increasing order.
#
# LeetCode: 438. Find All Anagrams in a String
# ────────────────────────────────────────────────────────────────────────────────────────
def find_anagrams(s, p):
    # TODO
    return []


if __name__ == "__main__":
    check(find_max_average, [
        {"args": [[1, 12, -5, -6, 50, 3], 4], "expect": 12.75},
        {"args": [[5], 1], "expect": 5},
        {"args": [[0, 4, 0, 3, 2], 1], "expect": 4},
        {"args": [[-1, -2, -3], 2], "expect": -1.5},
        {"args": [{"__py__": "list(range(100_000))"}, 50000], "expect": 74999.5},
    ], compare="float")
    check(max_vowels, [
        {"args": ["abciiidef", 3], "expect": 3},
        {"args": ["aeiou", 2], "expect": 2},
        {"args": ["leetcode", 3], "expect": 2},
        {"args": ["rhythms", 4], "expect": 0},
        {"args": ["tryhard", 4], "expect": 1},
    ])
    check(length_of_longest_substring, [
        {"args": ["abcabcbb"], "expect": 3},
        {"args": ["bbbbb"], "expect": 1},
        {"args": ["pwwkew"], "expect": 3},
        {"args": [""], "expect": 0},
        {"args": [" "], "expect": 1},
        {"args": ["dvdf"], "expect": 3},
        {"args": ["abba"], "expect": 2},
        {"args": [{"__py__": "\"abcdefghij\" * 5000"}], "expect": 10},
    ])
    check(min_subarray_len, [
        {"args": [7, [2, 3, 1, 2, 4, 3]], "expect": 2},
        {"args": [4, [1, 4, 4]], "expect": 1},
        {"args": [11, [1, 1, 1, 1, 1, 1, 1, 1]], "expect": 0},
        {"args": [15, [1, 2, 3, 4, 5]], "expect": 5},
        {"args": [6, [10, 2, 3]], "expect": 1},
    ])
    check(longest_ones, [
        {"args": [[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2], "expect": 6},
        {"args": [[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3], "expect": 10},
        {"args": [[0, 0, 0], 0], "expect": 0},
        {"args": [[1, 1], 0], "expect": 2},
        {"args": [[0, 0], 5], "expect": 2},
    ])
    check(character_replacement, [
        {"args": ["ABAB", 2], "expect": 4},
        {"args": ["AABABBA", 1], "expect": 4},
        {"args": ["A", 0], "expect": 1},
        {"args": ["ABCDE", 1], "expect": 2},
        {"args": ["AAAA", 0], "expect": 4},
    ])
    check(check_inclusion, [
        {"args": ["ab", "eidbaooo"], "expect": True},
        {"args": ["ab", "eidboaoo"], "expect": False},
        {"args": ["adc", "dcda"], "expect": True},
        {"args": ["abc", "ab"], "expect": False},
        {"args": ["a", "a"], "expect": True},
    ])
    check(find_anagrams, [
        {"args": ["cbaebabacd", "abc"], "expect": [0, 6]},
        {"args": ["abab", "ab"], "expect": [0, 1, 2]},
        {"args": ["a", "ab"], "expect": []},
        {"args": ["aaa", "a"], "expect": [0, 1, 2]},
    ])
