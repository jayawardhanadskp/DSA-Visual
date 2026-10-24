"""
Lesson 11 · Sorting — workbook
The visual lesson: lessons/11-sorting.html

How to use:
  1. Write your code inside each function (replace the `pass` / TODO lines).
  2. Run:  python3 workbook/11_sorting.py
  3. Fix until every problem shows ✅. Use print() freely while debugging.
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Implement insertion sort  ·  Easy  ·  Sorting by hand
#
# Sort nums in increasing order using insertion sort (no sorted() / .sort()) and return it.
# ────────────────────────────────────────────────────────────────────────────────────────
def insertion_sort(nums):
    # TODO
    return nums


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Implement merge sort  ·  Medium  ·  Divide &amp; conquer
#
# Sort nums with merge sort and return a sorted list. The last test has 8,000 numbers in
# reverse order — an O(n²) sort is too slow.
#
# LeetCode: 912. Sort an Array
# ────────────────────────────────────────────────────────────────────────────────────────
def merge_sort(nums):
    # TODO: base case, split, sort halves (recursion), merge
    return nums


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Sort colors (Dutch national flag)  ·  Medium  ·  Three pointers
#
# nums has only 0, 1 and 2. Sort it in place in one pass, without sort().
#
# LeetCode: 75. Sort Colors
# ────────────────────────────────────────────────────────────────────────────────────────
def sort_colors(nums):
    # TODO
    pass


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Sort people by age, then name  ·  Easy  ·  sorted(key=…)
#
# people is a list of [name, age]. Return them sorted by age (youngest first); people with the
# same age in alphabetical order.
# ────────────────────────────────────────────────────────────────────────────────────────
def sort_people(people):
    # TODO: one line with sorted(..., key=lambda p: ...)
    return people


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. K-th largest element  ·  Medium  ·  Sort (heap in lesson 14)
#
# Return the k-th largest element (counting duplicates: in [3, 3, 1] the 2nd largest is 3).
#
# LeetCode: 215. Kth Largest Element in an Array
# ────────────────────────────────────────────────────────────────────────────────────────
def find_kth_largest(nums, k):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Minimum absolute difference pairs  ·  Easy  ·  Sort, then compare neighbours
#
# All values are different. Find the smallest difference between any two values, and return
# all pairs [a, b] (a < b) with that difference, in increasing order.
#
# LeetCode: 1200. Minimum Absolute Difference
# ────────────────────────────────────────────────────────────────────────────────────────
def minimum_abs_difference(arr):
    # TODO
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Sort by frequency  ·  Easy  ·  Count + custom key
#
# Sort nums by how often each value appears (rarer first). If two values appear equally often,
# put the bigger value first.
#
# LeetCode: 1636. Sort Array by Increasing Frequency
# ────────────────────────────────────────────────────────────────────────────────────────
def frequency_sort(nums):
    # TODO
    return nums


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. Largest number  ·  Medium  ·  Custom comparison
#
# Arrange the numbers so that, written one after another, they form the largest number. Return
# it as a string. [3, 30, 34, 5, 9] → "9534330".
#
# LeetCode: 179. Largest Number
# ────────────────────────────────────────────────────────────────────────────────────────
def largest_number(nums):
    # TODO
    return ""


if __name__ == "__main__":
    check(insertion_sort, [
        {"args": [[5, 2, 4, 6, 1, 3]], "expect": [1, 2, 3, 4, 5, 6]},
        {"args": [[]], "expect": []},
        {"args": [[1]], "expect": [1]},
        {"args": [[3, 3, 1]], "expect": [1, 3, 3]},
        {"args": [[-1, 5, -10]], "expect": [-10, -1, 5]},
    ])
    check(merge_sort, [
        {"args": [[5, 2, 3, 1]], "expect": [1, 2, 3, 5]},
        {"args": [[5, 1, 1, 2, 0, 0]], "expect": [0, 0, 1, 1, 2, 5]},
        {"args": [[]], "expect": []},
        {"args": [[42]], "expect": [42]},
        {"args": [{"__py__": "list(range(8_000, 0, -1))"}], "expect": {"__py__": "list(range(1, 8_001))"}},
    ])
    check(sort_colors, [
        {"args": [[2, 0, 2, 1, 1, 0]], "expect": [0, 0, 1, 1, 2, 2]},
        {"args": [[2, 0, 1]], "expect": [0, 1, 2]},
        {"args": [[0]], "expect": [0]},
        {"args": [[1, 1]], "expect": [1, 1]},
        {"args": [[2, 2, 0, 0]], "expect": [0, 0, 2, 2]},
    ], inplace=0)
    check(sort_people, [
        {"args": [[["ann", 30], ["bob", 25], ["cat", 30], ["dan", 20]]], "expect": [["dan", 20], ["bob", 25], ["ann", 30], ["cat", 30]]},
        {"args": [[]], "expect": []},
        {"args": [[["zed", 5], ["amy", 5]]], "expect": [["amy", 5], ["zed", 5]]},
    ])
    check(find_kth_largest, [
        {"args": [[3, 2, 1, 5, 6, 4], 2], "expect": 5},
        {"args": [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], "expect": 4},
        {"args": [[1], 1], "expect": 1},
        {"args": [[7, 7, 7], 2], "expect": 7},
    ])
    check(minimum_abs_difference, [
        {"args": [[4, 2, 1, 3]], "expect": [[1, 2], [2, 3], [3, 4]]},
        {"args": [[1, 3, 6, 10, 15]], "expect": [[1, 3]]},
        {"args": [[3, 8, -10, 23, 19, -4, -14, 27]], "expect": [[-14, -10], [19, 23], [23, 27]]},
    ])
    check(frequency_sort, [
        {"args": [[1, 1, 2, 2, 2, 3]], "expect": [3, 1, 1, 2, 2, 2]},
        {"args": [[2, 3, 1, 3, 2]], "expect": [1, 3, 3, 2, 2]},
        {"args": [[-1, 1, -6, 4, 5, -6, 1, 4, 1]], "expect": [5, -1, 4, 4, -6, -6, 1, 1, 1]},
    ])
    check(largest_number, [
        {"args": [[10, 2]], "expect": "210"},
        {"args": [[3, 30, 34, 5, 9]], "expect": "9534330"},
        {"args": [[0, 0]], "expect": "0"},
        {"args": [[1]], "expect": "1"},
        {"args": [[432, 43243]], "expect": "43243432"},
    ])
