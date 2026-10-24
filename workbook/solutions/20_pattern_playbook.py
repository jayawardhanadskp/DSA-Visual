"""
Lesson 20 · Pattern playbook & interview mode — SOLUTIONS
The visual lesson: lessons/20-pattern-playbook.html

Only open this after you've really tried (15+ minutes per problem).
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Contains duplicate II  ·  Easy  ·  Mixed — which pattern?
#
# Return True if there are two different indexes i and j with nums[i] == nums[j] and abs(i -
# j) <= k.
#
# LeetCode: 219. Contains Duplicate II
# ────────────────────────────────────────────────────────────────────────────────────────
def contains_nearby_duplicate(nums, k):
    last = {}
    for i, x in enumerate(nums):
        if x in last and i - last[x] <= k:
            return True
        last[x] = i
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Reverse vowels of a string  ·  Easy  ·  Mixed — which pattern?
#
# Reverse only the vowels (aeiouAEIOU) of s, keeping every other character in place.
#
# LeetCode: 345. Reverse Vowels of a String
# ────────────────────────────────────────────────────────────────────────────────────────
def reverse_vowels(s):
    chars = list(s)
    vowels = set("aeiouAEIOU")
    left, right = 0, len(chars) - 1
    while left < right:
        if chars[left] not in vowels:
            left += 1
        elif chars[right] not in vowels:
            right -= 1
        else:
            chars[left], chars[right] = chars[right], chars[left]
            left += 1
            right -= 1
    return "".join(chars)


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Fruit into baskets  ·  Medium  ·  Mixed — which pattern?
#
# Trees in a row; fruits[i] is the fruit type of tree i. You have 2 baskets, each holds one
# type (unlimited amount). Start at any tree and pick one fruit from every tree going right,
# until you meet a third type. Return the most fruit you can pick.
#
# LeetCode: 904. Fruit Into Baskets
# ────────────────────────────────────────────────────────────────────────────────────────
def total_fruit(fruits):
    counts = {}
    left = 0
    best = 0
    for right, f in enumerate(fruits):
        counts[f] = counts.get(f, 0) + 1
        while len(counts) > 2:
            counts[fruits[left]] -= 1
            if counts[fruits[left]] == 0:
                del counts[fruits[left]]
            left += 1
        best = max(best, right - left + 1)
    return best


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Next greater element I  ·  Easy  ·  Mixed — which pattern?
#
# nums1 is a subset of nums2 (all distinct). For each x in nums1, find the first number to the
# right of x in nums2 that is bigger than x, or −1.
#
# LeetCode: 496. Next Greater Element I
# ────────────────────────────────────────────────────────────────────────────────────────
def next_greater_element(nums1, nums2):
    answer = {}
    stack = []
    for x in nums2:
        while stack and stack[-1] < x:
            answer[stack.pop()] = x
        stack.append(x)
    return [answer.get(x, -1) for x in nums1]


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Capacity to ship packages within D days  ·  Medium  ·  Mixed — which pattern?
#
# Packages must ship in the given order. Each day the ship carries packages (in order) up to
# its capacity. Return the smallest capacity that ships everything within days days.
#
# LeetCode: 1011. Capacity To Ship Packages Within D Days
# ────────────────────────────────────────────────────────────────────────────────────────
def ship_within_days(weights, days):
    def days_needed(capacity):
        count, load = 1, 0
        for w in weights:
            if load + w > capacity:
                count += 1
                load = 0
            load += w
        return count

    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = (lo + hi) // 2
        if days_needed(mid) <= days:
            hi = mid
        else:
            lo = mid + 1
    return lo


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Minimum depth of a binary tree  ·  Easy  ·  Mixed — which pattern?
#
# Return the number of nodes on the shortest path from the root down to the nearest leaf.
#
# LeetCode: 111. Minimum Depth of Binary Tree
# ────────────────────────────────────────────────────────────────────────────────────────
from collections import deque

def min_depth(root):
    if root is None:
        return 0
    queue = deque([(root, 1)])
    while queue:
        node, depth = queue.popleft()
        if node.left is None and node.right is None:
            return depth
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Max area of island  ·  Medium  ·  Mixed — which pattern?
#
# The grid has 1 (land) and 0 (water). Return the area (number of cells) of the biggest island
# (4-directional), or 0.
#
# LeetCode: 695. Max Area of Island
# ────────────────────────────────────────────────────────────────────────────────────────
def max_area_of_island(grid):
    rows, cols = len(grid), len(grid[0])

    def sink(r, c):
        if not (0 <= r < rows and 0 <= c < cols) or grid[r][c] != 1:
            return 0
        grid[r][c] = 0
        return 1 + sink(r + 1, c) + sink(r - 1, c) + sink(r, c + 1) + sink(r, c - 1)

    return max(sink(r, c) for r in range(rows) for c in range(cols))


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. House robber II (houses in a circle)  ·  Medium  ·  Mixed — which pattern?
#
# Like house robber, but the houses stand in a circle: the first and last house are
# neighbours. Return the most money.
#
# LeetCode: 213. House Robber II
# ────────────────────────────────────────────────────────────────────────────────────────
def rob_circle(nums):
    def rob_line(houses):
        prev, curr = 0, 0
        for x in houses:
            prev, curr = curr, max(curr, prev + x)
        return curr

    if len(nums) == 1:
        return nums[0]
    return max(rob_line(nums[:-1]), rob_line(nums[1:]))


# ────────────────────────────────────────────────────────────────────────────────────────
# 9. Combination sum III  ·  Medium  ·  Mixed — which pattern?
#
# Return all combinations of k different numbers from 1–9 that add up to n.
#
# LeetCode: 216. Combination Sum III
# ────────────────────────────────────────────────────────────────────────────────────────
def combination_sum3(k, n):
    result = []
    path = []

    def backtrack(start, remaining):
        if len(path) == k:
            if remaining == 0:
                result.append(path[:])
            return
        for x in range(start, 10):
            if x > remaining:
                break
            path.append(x)
            backtrack(x + 1, remaining - x)
            path.pop()

    backtrack(1, n)
    return result


# ────────────────────────────────────────────────────────────────────────────────────────
# 10. Find k closest elements  ·  Medium  ·  Mixed — which pattern?
#
# arr is sorted. Return the k values closest to x, sorted ascending. On a tie, the smaller
# value wins.
#
# LeetCode: 658. Find K Closest Elements
# ────────────────────────────────────────────────────────────────────────────────────────
def find_closest_elements(arr, k, x):
    left, right = 0, len(arr) - 1
    while right - left + 1 > k:
        if x - arr[left] <= arr[right] - x:
            right -= 1
        else:
            left += 1
    return arr[left:right + 1]


# ────────────────────────────────────────────────────────────────────────────────────────
# 11. Longest palindrome you can build  ·  Easy  ·  Mixed — which pattern?
#
# Using the letters of s (case-sensitive), how long is the longest palindrome you can build?
#
# LeetCode: 409. Longest Palindrome
# ────────────────────────────────────────────────────────────────────────────────────────
from collections import Counter

def longest_palindrome(s):
    length = 0
    odd = False
    for c in Counter(s).values():
        length += c // 2 * 2
        if c % 2:
            odd = True
    return length + (1 if odd else 0)


if __name__ == "__main__":
    check(contains_nearby_duplicate, [
        {"args": [[1, 2, 3, 1], 3], "expect": True},
        {"args": [[1, 0, 1, 1], 1], "expect": True},
        {"args": [[1, 2, 3, 1, 2, 3], 2], "expect": False},
        {"args": [[1], 1], "expect": False},
        {"args": [{"__py__": "list(range(100_000)) + [0]"}, 5], "expect": False},
    ])
    check(reverse_vowels, [
        {"args": ["IceCreAm"], "expect": "AceCreIm"},
        {"args": ["leetcode"], "expect": "leotcede"},
        {"args": ["a"], "expect": "a"},
        {"args": ["xyz"], "expect": "xyz"},
    ])
    check(total_fruit, [
        {"args": [[1, 2, 1]], "expect": 3},
        {"args": [[0, 1, 2, 2]], "expect": 3},
        {"args": [[1, 2, 3, 2, 2]], "expect": 4},
        {"args": [[3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]], "expect": 5},
    ])
    check(next_greater_element, [
        {"args": [[4, 1, 2], [1, 3, 4, 2]], "expect": [-1, 3, -1]},
        {"args": [[2, 4], [1, 2, 3, 4]], "expect": [3, -1]},
        {"args": [[1], [1]], "expect": [-1]},
    ])
    check(ship_within_days, [
        {"args": [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5], "expect": 15},
        {"args": [[3, 2, 2, 4, 1, 4], 3], "expect": 6},
        {"args": [[1, 2, 3, 1, 1], 4], "expect": 3},
        {"args": [[10], 1], "expect": 10},
    ])
    check(min_depth, [
        {"args": [[3, 9, 20, None, None, 15, 7]], "expect": 2},
        {"args": [[2, None, 3, None, 4, None, 5, None, 6]], "expect": 5},
        {"args": [[]], "expect": 0},
        {"args": [[1, 2]], "expect": 2},
    ], convert={"args": ["tree"]})
    check(max_area_of_island, [
        {"args": [[[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 1]]], "expect": 4},
        {"args": [[[0, 0, 0]]], "expect": 0},
        {"args": [[[1, 1], [1, 0]]], "expect": 3},
        {"args": [[[1, 0, 1], [0, 1, 0], [1, 0, 1]]], "expect": 1},
    ])
    check(rob_circle, [
        {"args": [[2, 3, 2]], "expect": 3},
        {"args": [[1, 2, 3, 1]], "expect": 4},
        {"args": [[1, 2, 3]], "expect": 3},
        {"args": [[5]], "expect": 5},
    ])
    check(combination_sum3, [
        {"args": [3, 7], "expect": [[1, 2, 4]]},
        {"args": [3, 9], "expect": [[1, 2, 6], [1, 3, 5], [2, 3, 4]]},
        {"args": [4, 1], "expect": []},
    ], compare="nested")
    check(find_closest_elements, [
        {"args": [[1, 2, 3, 4, 5], 4, 3], "expect": [1, 2, 3, 4]},
        {"args": [[1, 1, 2, 3, 4, 5], 4, -1], "expect": [1, 1, 2, 3]},
        {"args": [[1, 2, 3, 4, 5], 4, 6], "expect": [2, 3, 4, 5]},
        {"args": [[1, 3], 1, 2], "expect": [1]},
    ])
    check(longest_palindrome, [
        {"args": ["abccccdd"], "expect": 7},
        {"args": ["a"], "expect": 1},
        {"args": ["Aa"], "expect": 1},
        {"args": ["aaabb"], "expect": 5},
    ])
