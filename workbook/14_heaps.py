"""
Lesson 14 · Heaps & priority queues — workbook
The visual lesson: lessons/14-heaps.html

How to use:
  1. Write your code inside each function (replace the `pass` / TODO lines).
  2. Run:  python3 workbook/14_heaps.py
  3. Fix until every problem shows ✅. Use print() freely while debugging.
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. K-th largest element (with a heap)  ·  Medium  ·  Min-heap of size k
#
# Return the k-th largest element. This time use heapq: O(n log k).
#
# LeetCode: 215. Kth Largest Element in an Array
# ────────────────────────────────────────────────────────────────────────────────────────
import heapq

def find_kth_largest(nums, k):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Last stone weight  ·  Easy  ·  Max-heap (negated)
#
# Each turn, smash the two heaviest stones x ≤ y: if equal both disappear, otherwise a stone
# of weight y − x remains. Return the weight of the last stone, or 0.
#
# LeetCode: 1046. Last Stone Weight
# ────────────────────────────────────────────────────────────────────────────────────────
import heapq

def last_stone_weight(stones):
    # TODO: heapq is a MIN-heap. How do you get the biggest?
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. K-th largest in a stream (design)  ·  Easy  ·  Min-heap of size k
#
# Design KthLargest(k, nums) with add(val) that adds a number and returns the current k-th
# largest.
#
# LeetCode: 703. Kth Largest Element in a Stream
# ────────────────────────────────────────────────────────────────────────────────────────
import heapq

class KthLargest:
    def __init__(self, k, nums):
        pass

    def add(self, val):
        pass


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. K closest points to the origin  ·  Medium  ·  Heap with tuples
#
# Return the k points closest to (0, 0) (any order). Distance² = x² + y².
#
# LeetCode: 973. K Closest Points to Origin
# ────────────────────────────────────────────────────────────────────────────────────────
import heapq

def k_closest(points, k):
    # TODO
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Top K frequent words  ·  Medium  ·  Count + heap/sort with tie-break
#
# Return the k most frequent words, most frequent first. Words with the same count are sorted
# alphabetically.
#
# LeetCode: 692. Top K Frequent Words
# ────────────────────────────────────────────────────────────────────────────────────────
from collections import Counter
import heapq

def top_k_words(words, k):
    # TODO
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Merge k sorted lists  ·  Hard  ·  Heap of "next items"
#
# lists contains k sorted lists. Return one sorted list with all their numbers. Aim for O(N
# log k) where N is the total count.
#
# LeetCode: 23. Merge k Sorted Lists (here: Python lists)
# ────────────────────────────────────────────────────────────────────────────────────────
import heapq

def merge_k_sorted(lists):
    # TODO
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Find median from a data stream (design)  ·  Hard  ·  Two heaps
#
# Design MedianFinder() with add_num(x) and find_median() (the middle value, or the average of
# the two middle values). Both fast.
#
# LeetCode: 295. Find Median from Data Stream
# ────────────────────────────────────────────────────────────────────────────────────────
import heapq

class MedianFinder:
    def __init__(self):
        self.low = []    # max-heap (negated): the smaller half
        self.high = []   # min-heap: the bigger half

    def add_num(self, x):
        pass

    def find_median(self):
        pass


if __name__ == "__main__":
    check(find_kth_largest, [
        {"args": [[3, 2, 1, 5, 6, 4], 2], "expect": 5},
        {"args": [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], "expect": 4},
        {"args": [[1], 1], "expect": 1},
        {"args": [{"__py__": "list(range(200_000))"}, 5], "expect": 199995},
    ])
    check(last_stone_weight, [
        {"args": [[2, 7, 4, 1, 8, 1]], "expect": 1},
        {"args": [[1]], "expect": 1},
        {"args": [[2, 2]], "expect": 0},
        {"args": [[10, 4, 2, 10]], "expect": 2},
        {"args": [[3, 7, 2]], "expect": 2},
    ])
    check(KthLargest, [
        {"ops": ["KthLargest", "add", "add", "add", "add", "add"], "args": [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]], "expect": [None, 4, 5, 5, 8, 8]},
        {"ops": ["KthLargest", "add", "add"], "args": [[1, []], [-3], [-2]], "expect": [None, -3, -2]},
    ])
    check(k_closest, [
        {"args": [[[1, 3], [-2, 2]], 1], "expect": [[-2, 2]]},
        {"args": [[[3, 3], [5, -1], [-2, 4]], 2], "expect": [[3, 3], [-2, 4]]},
        {"args": [[[0, 1], [1, 0]], 2], "expect": [[0, 1], [1, 0]]},
        {"args": [[[1, 1], [2, 2], [3, 3], [-1, -1]], 2], "expect": [[1, 1], [-1, -1]]},
    ], compare="outer")
    check(top_k_words, [
        {"args": [["i", "love", "leetcode", "i", "love", "coding"], 2], "expect": ["i", "love"]},
        {"args": [["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"], 4], "expect": ["the", "is", "sunny", "day"]},
        {"args": [["a", "b", "c"], 2], "expect": ["a", "b"]},
    ])
    check(merge_k_sorted, [
        {"args": [[[1, 4, 5], [1, 3, 4], [2, 6]]], "expect": [1, 1, 2, 3, 4, 4, 5, 6]},
        {"args": [[]], "expect": []},
        {"args": [[[]]], "expect": []},
        {"args": [[[5], [1], [3]]], "expect": [1, 3, 5]},
    ])
    check(MedianFinder, [
        {"ops": ["MedianFinder", "add_num", "add_num", "find_median", "add_num", "find_median"], "args": [[], [1], [2], [], [3], []], "expect": [None, None, None, 1.5, None, 2]},
        {"ops": ["MedianFinder", "add_num", "find_median", "add_num", "find_median", "add_num", "find_median"], "args": [[], [5], [], [15], [], [1], []], "expect": [None, None, 5, None, 10, None, 5]},
    ])
