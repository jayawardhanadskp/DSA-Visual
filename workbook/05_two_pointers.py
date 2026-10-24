"""
Lesson 05 · Two pointers — workbook
The visual lesson: lessons/05-two-pointers.html

How to use:
  1. Write your code inside each function (replace the `pass` / TODO lines).
  2. Run:  python3 workbook/05_two_pointers.py
  3. Fix until every problem shows ✅. Use print() freely while debugging.
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Valid palindrome  ·  Easy  ·  Two pointers (opposite ends)
#
# A phrase is a palindrome if, after making all letters lowercase and removing everything that
# is not a letter or digit, it reads the same forwards and backwards. Return True or False.
# Useful: ch.isalnum() is True for letters and digits, ch.lower() makes a letter lowercase.
#
# LeetCode: 125. Valid Palindrome
# ────────────────────────────────────────────────────────────────────────────────────────
def is_palindrome(s):
    # TODO: left starts at 0, right at len(s) - 1
    # skip characters that are not letters/digits, compare the rest
    pass


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Pair with target sum (sorted list)  ·  Easy  ·  Two pointers (opposite ends)
#
# nums is sorted in increasing order. Return the indexes [i, j] (with i < j) of the two
# numbers that add up to target, or [] if there is no such pair. Use O(1) extra space — no
# dict!
#
# LeetCode: 167. Two Sum II (LeetCode uses 1-based indexes)
# ────────────────────────────────────────────────────────────────────────────────────────
def pair_sum(nums, target):
    # TODO
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Move zeroes to the end  ·  Easy  ·  Two pointers (same direction)
#
# Move all 0s to the end of nums in place (change the list itself, don't make a new one),
# keeping the order of the non-zero numbers. The function doesn't need to return anything.
#
# LeetCode: 283. Move Zeroes
# ────────────────────────────────────────────────────────────────────────────────────────
def move_zeroes(nums):
    # TODO: change nums in place
    pass


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Remove duplicates from a sorted list  ·  Easy  ·  Two pointers (same direction)
#
# nums is sorted. Remove the duplicates in place so the first k slots hold each unique value
# once, in order. To make testing easy, return nums[:k].
#
# LeetCode: 26. Remove Duplicates from Sorted Array
# ────────────────────────────────────────────────────────────────────────────────────────
def remove_duplicates(nums):
    # TODO: use a write pointer and a read pointer
    k = 0
    return nums[:k]


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Squares of a sorted list  ·  Easy  ·  Two pointers (opposite ends)
#
# nums is sorted (it may contain negatives). Return a new list with the square of each number,
# also sorted. Try to do it in O(n) — without calling sort().
#
# LeetCode: 977. Squares of a Sorted Array
# ────────────────────────────────────────────────────────────────────────────────────────
def sorted_squares(nums):
    # TODO: the biggest square is at one of the two ENDS
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Container with most water  ·  Medium  ·  Two pointers (opposite ends)
#
# height[i] is the height of a vertical line at position i. Pick two lines; with the x-axis
# they form a container. Water area = min(height[i], height[j]) * (j - i). Return the biggest
# area.
#
# LeetCode: 11. Container With Most Water
# ────────────────────────────────────────────────────────────────────────────────────────
def max_area(height):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. 3Sum  ·  Medium  ·  Sort + two pointers
#
# Return all the different triplets [a, b, c] from nums with a + b + c == 0 (each element used
# once per triplet). The order of the triplets and the order inside each triplet don't matter.
#
# LeetCode: 15. 3Sum
# ────────────────────────────────────────────────────────────────────────────────────────
def three_sum(nums):
    # TODO: sort first, then fix one number and run two pointers on the rest
    return []


if __name__ == "__main__":
    check(is_palindrome, [
        {"args": ["A man, a plan, a canal: Panama"], "expect": True},
        {"args": ["race a car"], "expect": False},
        {"args": [" "], "expect": True},
        {"args": ["ab_a"], "expect": True},
        {"args": ["0P"], "expect": False},
        {"args": ["Madam"], "expect": True},
    ])
    check(pair_sum, [
        {"args": [[2, 7, 11, 15], 9], "expect": [0, 1]},
        {"args": [[1, 3, 4, 6, 8, 11], 10], "expect": [2, 3]},
        {"args": [[-3, -1, 0, 2, 5], 1], "expect": [1, 3]},
        {"args": [[1, 2], 3], "expect": [0, 1]},
        {"args": [[1, 2, 3], 7], "expect": []},
        {"args": [[5, 25, 75], 100], "expect": [1, 2]},
    ])
    check(move_zeroes, [
        {"args": [[0, 1, 0, 3, 12]], "expect": [1, 3, 12, 0, 0]},
        {"args": [[0]], "expect": [0]},
        {"args": [[1, 2]], "expect": [1, 2]},
        {"args": [[0, 0, 1]], "expect": [1, 0, 0]},
        {"args": [[4, 0, 5, 0, 0, 6]], "expect": [4, 5, 6, 0, 0, 0]},
    ], inplace=0)
    check(remove_duplicates, [
        {"args": [[1, 1, 2]], "expect": [1, 2]},
        {"args": [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], "expect": [0, 1, 2, 3, 4]},
        {"args": [[7]], "expect": [7]},
        {"args": [[]], "expect": []},
        {"args": [[2, 2, 2, 2]], "expect": [2]},
    ])
    check(sorted_squares, [
        {"args": [[-4, -1, 0, 3, 10]], "expect": [0, 1, 9, 16, 100]},
        {"args": [[-7, -3, 2, 3, 11]], "expect": [4, 9, 9, 49, 121]},
        {"args": [[1]], "expect": [1]},
        {"args": [[-5, -3, -2]], "expect": [4, 9, 25]},
        {"args": [[]], "expect": []},
    ])
    check(max_area, [
        {"args": [[1, 8, 6, 2, 5, 4, 8, 3, 7]], "expect": 49},
        {"args": [[1, 1]], "expect": 1},
        {"args": [[4, 3, 2, 1, 4]], "expect": 16},
        {"args": [[1, 2, 1]], "expect": 2},
        {"args": [[2, 3, 4, 5, 18, 17, 6]], "expect": 17},
    ])
    check(three_sum, [
        {"args": [[-1, 0, 1, 2, -1, -4]], "expect": [[-1, -1, 2], [-1, 0, 1]]},
        {"args": [[0, 1, 1]], "expect": []},
        {"args": [[0, 0, 0]], "expect": [[0, 0, 0]]},
        {"args": [[-2, 0, 1, 1, 2]], "expect": [[-2, 0, 2], [-2, 1, 1]]},
        {"args": [[1, -1, -1, 0]], "expect": [[-1, 0, 1]]},
        {"args": [[0, 0, 0, 0]], "expect": [[0, 0, 0]]},
    ], compare="nested")
