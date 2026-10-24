"""
Lesson 14 · Heaps & priority queues — SOLUTIONS
The visual lesson: lessons/14-heaps.html

Only open this after you've really tried (15+ minutes per problem).
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
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]


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
    heap = [-s for s in stones]
    heapq.heapify(heap)
    while len(heap) > 1:
        y = -heapq.heappop(heap)
        x = -heapq.heappop(heap)
        if y != x:
            heapq.heappush(heap, -(y - x))
    return -heap[0] if heap else 0


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
        self.k = k
        self.heap = []
        for x in nums:
            self.add(x)

    def add(self, val):
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. K closest points to the origin  ·  Medium  ·  Heap with tuples
#
# Return the k points closest to (0, 0) (any order). Distance² = x² + y².
#
# LeetCode: 973. K Closest Points to Origin
# ────────────────────────────────────────────────────────────────────────────────────────
import heapq

def k_closest(points, k):
    heap = []                                  # max-heap (negated) of the k closest so far
    for x, y in points:
        heapq.heappush(heap, (-(x * x + y * y), x, y))
        if len(heap) > k:
            heapq.heappop(heap)                # remove the farthest
    return [[x, y] for _, x, y in heap]


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
    counts = Counter(words)
    return heapq.nsmallest(k, counts, key=lambda w: (-counts[w], w))


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
    heap = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]
    heapq.heapify(heap)
    result = []
    while heap:
        value, i, pos = heapq.heappop(heap)
        result.append(value)
        if pos + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][pos + 1], i, pos + 1))
    return result


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
        self.low = []
        self.high = []

    def add_num(self, x):
        heapq.heappush(self.low, -x)
        heapq.heappush(self.high, -heapq.heappop(self.low))
        if len(self.high) > len(self.low):
            heapq.heappush(self.low, -heapq.heappop(self.high))

    def find_median(self):
        if len(self.low) > len(self.high):
            return -self.low[0]
        return (-self.low[0] + self.high[0]) / 2


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
