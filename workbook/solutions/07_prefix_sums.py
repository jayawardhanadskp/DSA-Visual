"""
Lesson 07 · Prefix sums — SOLUTIONS
The visual lesson: lessons/07-prefix-sums.html

Only open this after you've really tried (15+ minutes per problem).
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Running sum  ·  Easy  ·  Prefix sums
#
# Return a list where item i is nums[0] + … + nums[i].
#
# LeetCode: 1480. Running Sum of 1d Array
# ────────────────────────────────────────────────────────────────────────────────────────
def running_sum(nums):
    result = []
    total = 0
    for x in nums:
        total += x
        result.append(total)
    return result


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Range sum query (design)  ·  Easy  ·  Prefix sums
#
# Design NumArray(nums) with a method sum_range(left, right) that returns nums[left] + … +
# nums[right]. It will be called many times, so each call must be O(1).
#
# LeetCode: 303. Range Sum Query - Immutable
# ────────────────────────────────────────────────────────────────────────────────────────
class NumArray:
    def __init__(self, nums):
        self.prefix = [0]
        for x in nums:
            self.prefix.append(self.prefix[-1] + x)

    def sum_range(self, left, right):
        return self.prefix[right + 1] - self.prefix[left]


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Pivot index  ·  Easy  ·  Prefix sums
#
# Return the first index where the sum of everything to its left equals the sum of everything
# to its right (not including itself), or -1.
#
# LeetCode: 724. Find Pivot Index
# ────────────────────────────────────────────────────────────────────────────────────────
def pivot_index(nums):
    total = sum(nums)
    left_sum = 0
    for i, x in enumerate(nums):
        if left_sum == total - left_sum - x:
            return i
        left_sum += x
    return -1


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Subarray sum equals k  ·  Medium  ·  Prefix sums + dict
#
# Return how many contiguous sections of nums add up to exactly k. Numbers can be negative, so
# a sliding window doesn't work. Must be O(n).
#
# LeetCode: 560. Subarray Sum Equals K
# ────────────────────────────────────────────────────────────────────────────────────────
def subarray_sum(nums, k):
    count = 0
    running = 0
    seen = {0: 1}
    for x in nums:
        running += x
        count += seen.get(running - k, 0)
        seen[running] = seen.get(running, 0) + 1
    return count


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Product of array except self  ·  Medium  ·  Prefix + suffix
#
# Return a list where item i is the product of every number except nums[i]. Don't use
# division. O(n).
#
# LeetCode: 238. Product of Array Except Self
# ────────────────────────────────────────────────────────────────────────────────────────
def product_except_self(nums):
    n = len(nums)
    result = [1] * n
    left = 1
    for i in range(n):
        result[i] = left          # product of nums[0..i-1]
        left *= nums[i]
    right = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right        # times product of nums[i+1..]
        right *= nums[i]
    return result


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Longest section with equal 0s and 1s  ·  Medium  ·  Prefix sums + first index
#
# nums has only 0s and 1s. Return the length of the longest contiguous section with the same
# number of 0s and 1s.
#
# LeetCode: 525. Contiguous Array
# ────────────────────────────────────────────────────────────────────────────────────────
def find_max_length(nums):
    first = {0: -1}
    running = 0
    best = 0
    for i, x in enumerate(nums):
        running += 1 if x == 1 else -1
        if running in first:
            best = max(best, i - first[running])
        else:
            first[running] = i
    return best


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. 2-D range sum (design)  ·  Medium  ·  2-D prefix sums
#
# Design NumMatrix(matrix) with sum_region(r1, c1, r2, c2) returning the sum of the rectangle
# from (r1, c1) to (r2, c2) (inclusive) in O(1).
#
# LeetCode: 304. Range Sum Query 2D - Immutable
# ────────────────────────────────────────────────────────────────────────────────────────
class NumMatrix:
    def __init__(self, matrix):
        rows, cols = len(matrix), len(matrix[0])
        self.P = [[0] * (cols + 1) for _ in range(rows + 1)]
        for r in range(rows):
            for c in range(cols):
                self.P[r + 1][c + 1] = matrix[r][c] + self.P[r][c + 1] + self.P[r + 1][c] - self.P[r][c]

    def sum_region(self, r1, c1, r2, c2):
        P = self.P
        return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1]


if __name__ == "__main__":
    check(running_sum, [
        {"args": [[1, 2, 3, 4]], "expect": [1, 3, 6, 10]},
        {"args": [[1, 1, 1, 1, 1]], "expect": [1, 2, 3, 4, 5]},
        {"args": [[3, 1, 2, 10, 1]], "expect": [3, 4, 6, 16, 17]},
        {"args": [[]], "expect": []},
    ])
    check(NumArray, [
        {"ops": ["NumArray", "sum_range", "sum_range", "sum_range"], "args": [[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]], "expect": [None, 1, -1, -3]},
        {"ops": ["NumArray", "sum_range", "sum_range"], "args": [[[5]], [0, 0], [0, 0]], "expect": [None, 5, 5]},
        {"ops": ["NumArray", "sum_range", "sum_range"], "args": [[[1, 2, 3, 4]], [1, 2], [3, 3]], "expect": [None, 5, 4]},
    ])
    check(pivot_index, [
        {"args": [[1, 7, 3, 6, 5, 6]], "expect": 3},
        {"args": [[1, 2, 3]], "expect": -1},
        {"args": [[2, 1, -1]], "expect": 0},
        {"args": [[0]], "expect": 0},
        {"args": [[-1, -1, 0, 1, 1, 0]], "expect": 5},
    ])
    check(subarray_sum, [
        {"args": [[1, 1, 1], 2], "expect": 2},
        {"args": [[1, 2, 3], 3], "expect": 2},
        {"args": [[1, -1, 0], 0], "expect": 3},
        {"args": [[1, 2, 1, -1, 2, 3], 3], "expect": 4},
        {"args": [[3], 3], "expect": 1},
        {"args": [{"__py__": "[0] * 3000"}, 0], "expect": 4501500},
    ])
    check(product_except_self, [
        {"args": [[1, 2, 3, 4]], "expect": [24, 12, 8, 6]},
        {"args": [[-1, 1, 0, -3, 3]], "expect": [0, 0, 9, 0, 0]},
        {"args": [[2, 3]], "expect": [3, 2]},
        {"args": [[0, 0]], "expect": [0, 0]},
    ])
    check(find_max_length, [
        {"args": [[0, 1]], "expect": 2},
        {"args": [[0, 1, 0]], "expect": 2},
        {"args": [[0, 1, 1, 1, 1, 1, 0, 0, 0]], "expect": 6},
        {"args": [[1, 1, 1]], "expect": 0},
        {"args": [[0, 0, 1, 0, 0, 0, 1, 1]], "expect": 6},
    ])
    check(NumMatrix, [
        {"ops": ["NumMatrix", "sum_region", "sum_region", "sum_region"], "args": [[[[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]], [2, 1, 4, 3], [1, 1, 2, 2], [1, 2, 2, 4]], "expect": [None, 8, 11, 12]},
        {"ops": ["NumMatrix", "sum_region"], "args": [[[[7]]], [0, 0, 0, 0]], "expect": [None, 7]},
    ])
