"""
Lesson 03 · Arrays & strings — SOLUTIONS
The visual lesson: lessons/03-arrays-strings.html

Only open this after you've really tried (15+ minutes per problem).
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Best time to buy and sell a stock  ·  Easy  ·  One pass + "so far" variables
#
# prices[i] is the price on day i. Buy on one day and sell on a later day. Return the biggest
# profit, or 0 if you can't make money.
#
# LeetCode: 121. Best Time to Buy and Sell Stock
# ────────────────────────────────────────────────────────────────────────────────────────
def max_profit(prices):
    lowest = prices[0]
    best = 0
    for price in prices[1:]:
        best = max(best, price - lowest)
        lowest = min(lowest, price)
    return best


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Missing number  ·  Easy  ·  Math / one pass
#
# nums contains n different numbers from the range 0..n — so exactly one number in that range
# is missing. Return it. O(n) time, O(1) extra space.
#
# LeetCode: 268. Missing Number
# ────────────────────────────────────────────────────────────────────────────────────────
def missing_number(nums):
    n = len(nums)
    return n * (n + 1) // 2 - sum(nums)


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Plus one  ·  Easy  ·  Walk from the end
#
# A big number is stored as a list of digits, most significant first ([1, 2, 9] is 129). Add
# one and return the new list of digits.
#
# LeetCode: 66. Plus One
# ────────────────────────────────────────────────────────────────────────────────────────
def plus_one(digits):
    for i in range(len(digits) - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        digits[i] = 0
    return [1] + digits


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Merge two sorted lists  ·  Easy  ·  Two pointers (two lists)
#
# a and b are sorted. Return one sorted list with all their elements. Don't use sorted() — do
# it in O(n + m) by walking both lists.
#
# LeetCode: 88. Merge Sorted Array
# ────────────────────────────────────────────────────────────────────────────────────────
def merge_sorted(a, b):
    result = []
    i, j = 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i])
            i += 1
        else:
            result.append(b[j])
            j += 1
    result.extend(a[i:])
    result.extend(b[j:])
    return result


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Longest common prefix  ·  Easy  ·  Compare column by column
#
# Return the longest string that is a prefix (start) of every string in strs. Return "" if
# there is none.
#
# LeetCode: 14. Longest Common Prefix
# ────────────────────────────────────────────────────────────────────────────────────────
def longest_common_prefix(strs):
    first = strs[0]
    for i in range(len(first)):
        for word in strs[1:]:
            if i >= len(word) or word[i] != first[i]:
                return first[:i]
    return first


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. String compression  ·  Easy  ·  Group runs, build with a list
#
# Compress runs of the same character: "aabcccccaaa" → "a2b1c5a3". If the compressed string is
# not shorter than the original, return the original.
# ────────────────────────────────────────────────────────────────────────────────────────
def compress(s):
    parts = []
    i = 0
    while i < len(s):
        j = i
        while j < len(s) and s[j] == s[i]:
            j += 1
        parts.append(s[i] + str(j - i))
        i = j
    result = "".join(parts)
    return result if len(result) < len(s) else s


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Rotate a list to the right by k  ·  Medium  ·  Reverse trick
#
# Rotate nums to the right by k steps, in place. [1,2,3,4,5,6,7], k = 3 → [5,6,7,1,2,3,4]. k
# can be bigger than the length.
#
# LeetCode: 189. Rotate Array
# ────────────────────────────────────────────────────────────────────────────────────────
def rotate(nums, k):
    n = len(nums)
    k %= n

    def reverse(left, right):
        while left < right:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1

    reverse(0, n - 1)      # [7,6,5,4,3,2,1]
    reverse(0, k - 1)      # [5,6,7,4,3,2,1]
    reverse(k, n - 1)      # [5,6,7,1,2,3,4]


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. Spiral order of a matrix  ·  Medium  ·  Grid boundaries
#
# Return all elements of the matrix in spiral order: right along the top, down the right side,
# left along the bottom, up the left side, then repeat inside.
#
# LeetCode: 54. Spiral Matrix
# ────────────────────────────────────────────────────────────────────────────────────────
def spiral_order(matrix):
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            result.append(matrix[top][c])
        top += 1
        for r in range(top, bottom + 1):
            result.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1):
                result.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1):
                result.append(matrix[r][left])
            left += 1
    return result


# ────────────────────────────────────────────────────────────────────────────────────────
# 9. Rotate an image 90° clockwise  ·  Medium  ·  Transpose + reverse
#
# Rotate the n × n matrix 90° clockwise, in place.
#
# LeetCode: 48. Rotate Image
# ────────────────────────────────────────────────────────────────────────────────────────
def rotate_image(matrix):
    n = len(matrix)
    for r in range(n):
        for c in range(r + 1, n):
            matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]
    for row in matrix:
        row.reverse()


if __name__ == "__main__":
    check(max_profit, [
        {"args": [[7, 1, 5, 3, 6, 4]], "expect": 5},
        {"args": [[7, 6, 4, 3, 1]], "expect": 0},
        {"args": [[1, 2]], "expect": 1},
        {"args": [[2, 4, 1]], "expect": 2},
        {"args": [[3, 3, 3]], "expect": 0},
        {"args": [{"__py__": "list(range(100_000, 0, -1)) + [200_000]"}], "expect": 199999},
    ])
    check(missing_number, [
        {"args": [[3, 0, 1]], "expect": 2},
        {"args": [[0, 1]], "expect": 2},
        {"args": [[9, 6, 4, 2, 3, 5, 7, 0, 1]], "expect": 8},
        {"args": [[1]], "expect": 0},
        {"args": [{"__py__": "[x for x in range(100_001) if x != 4242]"}], "expect": 4242},
    ])
    check(plus_one, [
        {"args": [[1, 2, 3]], "expect": [1, 2, 4]},
        {"args": [[1, 2, 9]], "expect": [1, 3, 0]},
        {"args": [[9]], "expect": [1, 0]},
        {"args": [[9, 9]], "expect": [1, 0, 0]},
        {"args": [[0]], "expect": [1]},
    ])
    check(merge_sorted, [
        {"args": [[1, 3, 5], [2, 4, 6]], "expect": [1, 2, 3, 4, 5, 6]},
        {"args": [[], [1]], "expect": [1]},
        {"args": [[1, 2, 3], []], "expect": [1, 2, 3]},
        {"args": [[1, 1], [1]], "expect": [1, 1, 1]},
        {"args": [[-5, 0, 10], [-6, 20]], "expect": [-6, -5, 0, 10, 20]},
    ])
    check(longest_common_prefix, [
        {"args": [["flower", "flow", "flight"]], "expect": "fl"},
        {"args": [["dog", "racecar", "car"]], "expect": ""},
        {"args": [["alone"]], "expect": "alone"},
        {"args": [["ab", "ab"]], "expect": "ab"},
        {"args": [["", "b"]], "expect": ""},
        {"args": [["interview", "internet", "interval"]], "expect": "inter"},
    ])
    check(compress, [
        {"args": ["aabcccccaaa"], "expect": "a2b1c5a3"},
        {"args": ["abc"], "expect": "abc"},
        {"args": [""], "expect": ""},
        {"args": ["aaaa"], "expect": "a4"},
        {"args": ["aabb"], "expect": "aabb"},
    ])
    check(rotate, [
        {"args": [[1, 2, 3, 4, 5, 6, 7], 3], "expect": [5, 6, 7, 1, 2, 3, 4]},
        {"args": [[-1, -100, 3, 99], 2], "expect": [3, 99, -1, -100]},
        {"args": [[1, 2], 3], "expect": [2, 1]},
        {"args": [[1], 0], "expect": [1]},
        {"args": [[1, 2, 3], 3], "expect": [1, 2, 3]},
    ], inplace=0)
    check(spiral_order, [
        {"args": [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], "expect": [1, 2, 3, 6, 9, 8, 7, 4, 5]},
        {"args": [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], "expect": [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]},
        {"args": [[[1]]], "expect": [1]},
        {"args": [[[1, 2], [3, 4]]], "expect": [1, 2, 4, 3]},
        {"args": [[[1], [2], [3]]], "expect": [1, 2, 3]},
    ])
    check(rotate_image, [
        {"args": [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], "expect": [[7, 4, 1], [8, 5, 2], [9, 6, 3]]},
        {"args": [[[1]]], "expect": [[1]]},
        {"args": [[[1, 2], [3, 4]]], "expect": [[3, 1], [4, 2]]},
        {"args": [[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]], "expect": [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]},
    ], inplace=0)
