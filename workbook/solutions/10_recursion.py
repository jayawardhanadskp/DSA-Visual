"""
Lesson 10 · Recursion — SOLUTIONS
The visual lesson: lessons/10-recursion.html

Only open this after you've really tried (15+ minutes per problem).
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Factorial  ·  Easy  ·  Recursion
#
# Return n! = n × (n−1) × … × 1 using recursion (no loop). 0! = 1.
# ────────────────────────────────────────────────────────────────────────────────────────
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Sum of digits  ·  Easy  ·  Recursion
#
# Return the sum of the digits of a non-negative integer, recursively. 1234 → 10. Hint: n % 10
# is the last digit, n // 10 removes it.
# ────────────────────────────────────────────────────────────────────────────────────────
def sum_digits(n):
    if n < 10:
        return n
    return n % 10 + sum_digits(n // 10)


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Reverse a string recursively  ·  Easy  ·  Recursion
#
# Return s reversed, using recursion (no slicing with [::-1], no loops).
# ────────────────────────────────────────────────────────────────────────────────────────
def reverse_string(s):
    if len(s) <= 1:
        return s
    return reverse_string(s[1:]) + s[0]


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Palindrome, recursively  ·  Easy  ·  Recursion (two ends)
#
# Return True if s reads the same backwards. Use recursion with indexes: write a helper
# check(left, right).
# ────────────────────────────────────────────────────────────────────────────────────────
def is_pal(s):
    def check(left, right):
        if left >= right:
            return True
        if s[left] != s[right]:
            return False
        return check(left + 1, right - 1)
    return check(0, len(s) - 1)


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Fibonacci  ·  Easy  ·  Recursion (two branches)
#
# fib(0) = 0, fib(1) = 1, fib(n) = fib(n−1) + fib(n−2). Return fib(n). The plain recursion
# works up to about n = 25; in lesson 17 you'll make it instant.
#
# LeetCode: 509. Fibonacci Number
# ────────────────────────────────────────────────────────────────────────────────────────
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Pow(x, n)  ·  Medium  ·  Divide in half
#
# Return x to the power n (n can be negative, and as big as 2³¹ − 1). Don't use ** or pow. A
# loop or "x × pow(x, n − 1)" is far too slow (or too deep) for the last test.
#
# LeetCode: 50. Pow(x, n)
# ────────────────────────────────────────────────────────────────────────────────────────
def my_pow(x, n):
    if n < 0:
        return 1 / my_pow(x, -n)
    if n == 0:
        return 1.0
    half = my_pow(x, n // 2)
    if n % 2 == 0:
        return half * half
    return half * half * x


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Flatten a nested list  ·  Medium  ·  Recursion on structure
#
# The input is a list whose items are numbers or other (nested) lists. Return all numbers in
# one flat list, in order. [1, [2, [3, 4]], 5] → [1, 2, 3, 4, 5].
# ────────────────────────────────────────────────────────────────────────────────────────
def flatten(nested):
    result = []
    for item in nested:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. Tower of Hanoi  ·  Medium  ·  Trust the recursion
#
# Move n disks from peg "A" to peg "C" using "B". Only one disk moves at a time, and a bigger
# disk can never sit on a smaller one. Return the list of moves as [from, to] pairs.
# ────────────────────────────────────────────────────────────────────────────────────────
def hanoi(n):
    moves = []

    def move(k, src, dst, via):
        if k == 0:
            return
        move(k - 1, src, via, dst)
        moves.append([src, dst])
        move(k - 1, via, dst, src)

    move(n, "A", "C", "B")
    return moves


if __name__ == "__main__":
    check(factorial, [
        {"args": [0], "expect": 1},
        {"args": [1], "expect": 1},
        {"args": [5], "expect": 120},
        {"args": [10], "expect": 3628800},
    ])
    check(sum_digits, [
        {"args": [0], "expect": 0},
        {"args": [7], "expect": 7},
        {"args": [1234], "expect": 10},
        {"args": [9999], "expect": 36},
        {"args": [1000000], "expect": 1},
    ])
    check(reverse_string, [
        {"args": ["hello"], "expect": "olleh"},
        {"args": [""], "expect": ""},
        {"args": ["a"], "expect": "a"},
        {"args": ["ab"], "expect": "ba"},
    ])
    check(is_pal, [
        {"args": ["racecar"], "expect": True},
        {"args": ["ab"], "expect": False},
        {"args": [""], "expect": True},
        {"args": ["a"], "expect": True},
        {"args": ["abca"], "expect": False},
        {"args": ["abba"], "expect": True},
    ])
    check(fib, [
        {"args": [0], "expect": 0},
        {"args": [1], "expect": 1},
        {"args": [2], "expect": 1},
        {"args": [10], "expect": 55},
        {"args": [20], "expect": 6765},
    ])
    check(my_pow, [
        {"args": [2, 10], "expect": 1024},
        {"args": [2.1, 3], "expect": 9.261},
        {"args": [2, -2], "expect": 0.25},
        {"args": [5, 0], "expect": 1},
        {"args": [-2, 3], "expect": -8},
        {"args": [1, 2147483647], "expect": 1},
    ], compare="float")
    check(flatten, [
        {"args": [[1, [2, [3, 4]], 5]], "expect": [1, 2, 3, 4, 5]},
        {"args": [[]], "expect": []},
        {"args": [[[[]]]], "expect": []},
        {"args": [[[1], [2, [3]], [[4]]]], "expect": [1, 2, 3, 4]},
        {"args": [[7]], "expect": [7]},
    ])
    check(hanoi, [
        {"args": [0], "expect": []},
        {"args": [1], "expect": [["A", "C"]]},
        {"args": [2], "expect": [["A", "B"], ["A", "C"], ["B", "C"]]},
        {"args": [3], "expect": [["A", "C"], ["A", "B"], ["C", "B"], ["A", "C"], ["B", "A"], ["B", "C"], ["A", "C"]]},
    ])
