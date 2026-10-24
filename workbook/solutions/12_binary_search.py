"""
Lesson 12 · Binary search — SOLUTIONS
The visual lesson: lessons/12-binary-search.html

Only open this after you've really tried (15+ minutes per problem).
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Binary search  ·  Easy  ·  Binary search
#
# nums is sorted. Return the index of target, or -1. Must be O(log n): the big tests use a
# sorted sequence of one billion numbers (a Python range, which you can index like a list).
#
# LeetCode: 704. Binary Search
# ────────────────────────────────────────────────────────────────────────────────────────
def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Search insert position  ·  Easy  ·  Lower bound
#
# nums is sorted with distinct values. Return the index of target if it is there, otherwise
# the index where it would be inserted to keep the list sorted.
#
# LeetCode: 35. Search Insert Position
# ────────────────────────────────────────────────────────────────────────────────────────
def search_insert(nums, target):
    lo, hi = 0, len(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Integer square root  ·  Easy  ·  Binary search on the answer
#
# Return the square root of x rounded down, without **, sqrt or math. The last test is 10**18.
#
# LeetCode: 69. Sqrt(x)
# ────────────────────────────────────────────────────────────────────────────────────────
def my_sqrt(x):
    lo, hi = 0, x
    while lo < hi:
        mid = (lo + hi + 1) // 2      # round UP so lo = mid always makes progress
        if mid * mid <= x:
            lo = mid
        else:
            hi = mid - 1
    return lo


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. First and last position  ·  Medium  ·  Two lower bounds
#
# nums is sorted and may contain duplicates. Return [first, last] index of target, or [-1,
# -1]. O(log n).
#
# LeetCode: 34. Find First and Last Position of Element in Sorted Array
# ────────────────────────────────────────────────────────────────────────────────────────
def search_range(nums, target):
    def lower_bound(x):
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] < x:
                lo = mid + 1
            else:
                hi = mid
        return lo

    first = lower_bound(target)
    if first == len(nums) or nums[first] != target:
        return [-1, -1]
    return [first, lower_bound(target + 1) - 1]


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Find a peak element  ·  Medium  ·  Binary search on a slope
#
# A peak is bigger than its neighbours (imagine -∞ outside the list). Neighbours are never
# equal. Return the index of any peak in O(log n).
#
# LeetCode: 162. Find Peak Element
# ────────────────────────────────────────────────────────────────────────────────────────
def find_peak_element(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < nums[mid + 1]:
            lo = mid + 1
        else:
            hi = mid
    return lo


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Minimum in a rotated sorted list  ·  Medium  ·  Binary search (compare with the end)
#
# A sorted list of distinct numbers was rotated: [0,1,2,4,5,6,7] → [4,5,6,7,0,1,2]. Return the
# minimum in O(log n).
#
# LeetCode: 153. Find Minimum in Rotated Sorted Array
# ────────────────────────────────────────────────────────────────────────────────────────
def find_min(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    return nums[lo]


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Search in a rotated sorted list  ·  Medium  ·  Binary search (which half is sorted?)
#
# Like the previous problem, but return the index of target (or -1) in O(log n).
#
# LeetCode: 33. Search in Rotated Sorted Array
# ────────────────────────────────────────────────────────────────────────────────────────
def search_rotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:                 # left half is sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                                     # right half is sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. Koko eating bananas  ·  Medium  ·  Binary search on the answer
#
# Koko eats bananas at speed k per hour: each hour she picks one pile and eats k bananas from
# it (if the pile has fewer, she eats it and waits until the hour ends). Return the smallest k
# that lets her finish all piles within h hours.
#
# LeetCode: 875. Koko Eating Bananas
# ────────────────────────────────────────────────────────────────────────────────────────
def min_eating_speed(piles, h):
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        hours = sum((p + mid - 1) // mid for p in piles)
        if hours <= h:
            hi = mid
        else:
            lo = mid + 1
    return lo


# ────────────────────────────────────────────────────────────────────────────────────────
# 9. Search a 2-D matrix  ·  Medium  ·  Binary search with index math
#
# Each row is sorted, and the first number of each row is bigger than the last number of the
# previous row. Return whether target is in the matrix, in O(log(rows × cols)).
#
# LeetCode: 74. Search a 2D Matrix
# ────────────────────────────────────────────────────────────────────────────────────────
def search_matrix(matrix, target):
    rows, cols = len(matrix), len(matrix[0])
    lo, hi = 0, rows * cols - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        value = matrix[mid // cols][mid % cols]
        if value == target:
            return True
        if value < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return False


if __name__ == "__main__":
    check(search, [
        {"args": [[-1, 0, 3, 5, 9, 12], 9], "expect": 4},
        {"args": [[-1, 0, 3, 5, 9, 12], 2], "expect": -1},
        {"args": [[5], 5], "expect": 0},
        {"args": [[], 1], "expect": -1},
        {"args": [[1, 3], 3], "expect": 1},
        {"args": [{"__py__": "range(0, 3 * 10**9, 3)"}, 2999999997], "expect": 999999999},
        {"args": [{"__py__": "range(0, 3 * 10**9, 3)"}, 1], "expect": -1},
    ])
    check(search_insert, [
        {"args": [[1, 3, 5, 6], 5], "expect": 2},
        {"args": [[1, 3, 5, 6], 2], "expect": 1},
        {"args": [[1, 3, 5, 6], 7], "expect": 4},
        {"args": [[1, 3, 5, 6], 0], "expect": 0},
        {"args": [[], 4], "expect": 0},
        {"args": [{"__py__": "range(0, 2 * 10**9, 2)"}, 1000001], "expect": 500001},
    ])
    check(my_sqrt, [
        {"args": [4], "expect": 2},
        {"args": [8], "expect": 2},
        {"args": [0], "expect": 0},
        {"args": [1], "expect": 1},
        {"args": [2147395599], "expect": 46339},
        {"args": [{"__py__": "10**18"}], "expect": 1000000000},
    ])
    check(search_range, [
        {"args": [[5, 7, 7, 8, 8, 10], 8], "expect": [3, 4]},
        {"args": [[5, 7, 7, 8, 8, 10], 6], "expect": [-1, -1]},
        {"args": [[], 0], "expect": [-1, -1]},
        {"args": [[1], 1], "expect": [0, 0]},
        {"args": [[2, 2, 2, 2], 2], "expect": [0, 3]},
    ])
    check(find_peak_element, [
        {"args": [[1, 2, 3, 1]], "expect": 2},
        {"args": [[1, 2, 1, 3, 5, 6, 4]], "expect": 1, "anyOf": [1, 5]},
        {"args": [[1]], "expect": 0},
        {"args": [[1, 2]], "expect": 1},
        {"args": [[3, 2, 1]], "expect": 0},
    ])
    check(find_min, [
        {"args": [[3, 4, 5, 1, 2]], "expect": 1},
        {"args": [[4, 5, 6, 7, 0, 1, 2]], "expect": 0},
        {"args": [[11, 13, 15, 17]], "expect": 11},
        {"args": [[2, 1]], "expect": 1},
        {"args": [[1]], "expect": 1},
    ])
    check(search_rotated, [
        {"args": [[4, 5, 6, 7, 0, 1, 2], 0], "expect": 4},
        {"args": [[4, 5, 6, 7, 0, 1, 2], 3], "expect": -1},
        {"args": [[1], 0], "expect": -1},
        {"args": [[5, 1, 3], 3], "expect": 2},
        {"args": [[3, 1], 1], "expect": 1},
        {"args": [[1, 3], 3], "expect": 1},
    ])
    check(min_eating_speed, [
        {"args": [[3, 6, 7, 11], 8], "expect": 4},
        {"args": [[30, 11, 23, 4, 20], 5], "expect": 30},
        {"args": [[30, 11, 23, 4, 20], 6], "expect": 23},
        {"args": [[1], 1], "expect": 1},
        {"args": [[1000000000], 2], "expect": 500000000},
    ])
    check(search_matrix, [
        {"args": [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], "expect": True},
        {"args": [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], "expect": False},
        {"args": [[[1]], 1], "expect": True},
        {"args": [[[1, 3]], 2], "expect": False},
    ])
