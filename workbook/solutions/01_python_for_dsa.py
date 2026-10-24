"""
Lesson 01 · Python for DSA (from Dart) — SOLUTIONS
The visual lesson: lessons/01-python-for-dsa.html

Only open this after you've really tried (15+ minutes per problem).
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Count vowels  ·  Easy  ·  Loop + condition
#
# Return how many vowels (a e i o u, upper or lower case) are in the string s.
# ────────────────────────────────────────────────────────────────────────────────────────
def count_vowels(s):
    count = 0
    for ch in s:
        if ch.lower() in "aeiou":
            count += 1
    return count


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Smallest and largest  ·  Easy  ·  "So far" variables
#
# Return a list [smallest, largest] of the numbers in nums (it has at least one number). Don't
# use min() or max() — use one loop.
# ────────────────────────────────────────────────────────────────────────────────────────
def smallest_and_largest(nums):
    low = high = nums[0]
    for x in nums:
        if x < low:
            low = x
        if x > high:
            high = x
    return [low, high]


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Reverse the words  ·  Easy  ·  split / join
#
# Given a sentence with words separated by single spaces, return the words in reverse order.
# "I love Python" → "Python love I".
# ────────────────────────────────────────────────────────────────────────────────────────
def reverse_words(sentence):
    words = sentence.split()
    return " ".join(words[::-1])


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Squares of the even numbers  ·  Easy  ·  List comprehension
#
# Return a list with the square of every even number in nums, in the same order. Try writing
# it as one list comprehension.
# ────────────────────────────────────────────────────────────────────────────────────────
def even_squares(nums):
    return [x * x for x in nums if x % 2 == 0]


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Character counts  ·  Easy  ·  dict counting
#
# Return a dict that maps each character of s to how many times it appears.
# ────────────────────────────────────────────────────────────────────────────────────────
def char_count(s):
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1
    return counts


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Unique values, sorted  ·  Easy  ·  set + sorted
#
# Return the different values of nums, sorted from small to big.
# ────────────────────────────────────────────────────────────────────────────────────────
def unique_sorted(nums):
    return sorted(set(nums))


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Second largest (different) value  ·  Easy  ·  "So far" variables
#
# Return the second largest different value in nums, or None if there isn't one. [5, 1, 5, 3]
# → 3. Try it in one pass, without sorting.
# ────────────────────────────────────────────────────────────────────────────────────────
def second_largest(nums):
    first = second = None
    for x in nums:
        if first is None or x > first:
            second = first
            first = x
        elif x != first and (second is None or x > second):
            second = x
    return second


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. Transpose a matrix  ·  Easy  ·  2-D lists
#
# Return the transpose of matrix: row r, column c moves to row c, column r. The matrix can be
# non-square.
# ────────────────────────────────────────────────────────────────────────────────────────
def transpose(matrix):
    rows, cols = len(matrix), len(matrix[0])
    result = [[0] * rows for _ in range(cols)]
    for r in range(rows):
        for c in range(cols):
            result[c][r] = matrix[r][c]
    return result


# ────────────────────────────────────────────────────────────────────────────────────────
# 9. Design a Wallet class  ·  Easy  ·  Classes
#
# Write a class Wallet:
# • Wallet(start) creates a wallet with start money,
# • deposit(amount) adds money (returns nothing),
# • withdraw(amount) takes money out and returns True, or returns False (and changes nothing)
# if there isn't enough,
# • balance() returns the money in the wallet.
# The tests use LeetCode's "design" format: a list of method names and a list of their
# arguments. The first one creates the object.
# ────────────────────────────────────────────────────────────────────────────────────────
class Wallet:
    def __init__(self, start):
        self.money = start

    def deposit(self, amount):
        self.money += amount

    def withdraw(self, amount):
        if amount > self.money:
            return False
        self.money -= amount
        return True

    def balance(self):
        return self.money


if __name__ == "__main__":
    check(count_vowels, [
        {"args": ["hello"], "expect": 2},
        {"args": ["PYTHON"], "expect": 1},
        {"args": [""], "expect": 0},
        {"args": ["Queue Up"], "expect": 5},
        {"args": ["rhythm"], "expect": 0},
    ])
    check(smallest_and_largest, [
        {"args": [[3, 9, 2, 12, 5]], "expect": [2, 12]},
        {"args": [[7]], "expect": [7, 7]},
        {"args": [[-1, -8, -3]], "expect": [-8, -1]},
        {"args": [[4, 4, 4]], "expect": [4, 4]},
    ])
    check(reverse_words, [
        {"args": ["I love Python"], "expect": "Python love I"},
        {"args": ["hello"], "expect": "hello"},
        {"args": ["a b c d"], "expect": "d c b a"},
    ])
    check(even_squares, [
        {"args": [[1, 2, 3, 4]], "expect": [4, 16]},
        {"args": [[]], "expect": []},
        {"args": [[5, 7]], "expect": []},
        {"args": [[-2, 0, 10]], "expect": [4, 0, 100]},
    ])
    check(char_count, [
        {"args": ["banana"], "expect": {"b": 1, "a": 3, "n": 2}},
        {"args": [""], "expect": {}},
        {"args": ["aaa"], "expect": {"a": 3}},
        {"args": ["abcab"], "expect": {"a": 2, "b": 2, "c": 1}},
    ])
    check(unique_sorted, [
        {"args": [[3, 1, 3, 2, 1]], "expect": [1, 2, 3]},
        {"args": [[]], "expect": []},
        {"args": [[5, 5, 5]], "expect": [5]},
        {"args": [[10, -1, 7]], "expect": [-1, 7, 10]},
    ])
    check(second_largest, [
        {"args": [[5, 1, 5, 3]], "expect": 3},
        {"args": [[1, 2]], "expect": 1},
        {"args": [[7, 7, 7]], "expect": None},
        {"args": [[]], "expect": None},
        {"args": [[-3, -1, -2]], "expect": -2},
        {"args": [[2, 9, 4, 9, 8]], "expect": 8},
    ])
    check(transpose, [
        {"args": [[[1, 2, 3], [4, 5, 6]]], "expect": [[1, 4], [2, 5], [3, 6]]},
        {"args": [[[1]]], "expect": [[1]]},
        {"args": [[[1, 2], [3, 4]]], "expect": [[1, 3], [2, 4]]},
    ])
    check(Wallet, [
        {"ops": ["Wallet", "deposit", "withdraw", "withdraw", "balance"], "args": [[10], [5], [20], [3], []], "expect": [None, None, False, True, 12]},
        {"ops": ["Wallet", "balance", "withdraw", "balance"], "args": [[0], [], [1], []], "expect": [None, 0, False, 0]},
        {"ops": ["Wallet", "withdraw", "balance"], "args": [[50], [50], []], "expect": [None, True, 0]},
    ])
