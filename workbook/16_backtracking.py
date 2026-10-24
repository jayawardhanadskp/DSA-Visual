"""
Lesson 16 · Backtracking — workbook
The visual lesson: lessons/16-backtracking.html

How to use:
  1. Write your code inside each function (replace the `pass` / TODO lines).
  2. Run:  python3 workbook/16_backtracking.py
  3. Fix until every problem shows ✅. Use print() freely while debugging.
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Subsets  ·  Medium  ·  Backtracking
#
# Return all subsets of nums (distinct numbers), in any order.
#
# LeetCode: 78. Subsets
# ────────────────────────────────────────────────────────────────────────────────────────
def subsets(nums):
    result = []
    path = []

    def backtrack(start):
        # TODO
        pass

    backtrack(0)
    return result


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Permutations  ·  Medium  ·  Backtracking with "used"
#
# Return all orderings of nums (distinct numbers), in any order.
#
# LeetCode: 46. Permutations
# ────────────────────────────────────────────────────────────────────────────────────────
def permute(nums):
    result = []
    # TODO
    return result


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Combinations  ·  Medium  ·  Backtracking
#
# Return all ways to choose k numbers from 1..n (order inside doesn't matter).
#
# LeetCode: 77. Combinations
# ────────────────────────────────────────────────────────────────────────────────────────
def combine(n, k):
    result = []
    # TODO
    return result


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Combination sum  ·  Medium  ·  Backtracking with reuse
#
# Return all unique combinations of candidates (distinct, positive) that sum to target. Each
# number may be used many times.
#
# LeetCode: 39. Combination Sum
# ────────────────────────────────────────────────────────────────────────────────────────
def combination_sum(candidates, target):
    result = []
    # TODO
    return result


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Letter combinations of a phone number  ·  Medium  ·  Backtracking over positions
#
# Digits 2–9 map to letters like on old phones (2 = abc, 3 = def, …, 7 = pqrs, 9 = wxyz).
# Return all letter strings the digits could mean (any order). Empty input → [].
#
# LeetCode: 17. Letter Combinations of a Phone Number
# ────────────────────────────────────────────────────────────────────────────────────────
def letter_combinations(digits):
    phone = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl",
             "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
    # TODO
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Generate parentheses  ·  Medium  ·  Backtracking with rules
#
# Return all valid strings of n pairs of parentheses (any order).
#
# LeetCode: 22. Generate Parentheses
# ────────────────────────────────────────────────────────────────────────────────────────
def generate_parenthesis(n):
    result = []
    # TODO
    return result


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Word search  ·  Medium  ·  Grid backtracking
#
# Return whether word can be spelled by moving up/down/left/right between letters of board,
# using each cell at most once.
#
# LeetCode: 79. Word Search
# ────────────────────────────────────────────────────────────────────────────────────────
def exist(board, word):
    # TODO
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. N-Queens II (count the solutions)  ·  Hard  ·  Backtracking with sets
#
# Return how many ways n queens can be placed on an n × n board so that no two attack each
# other (same row, column or diagonal).
#
# LeetCode: 52. N-Queens II
# ────────────────────────────────────────────────────────────────────────────────────────
def total_n_queens(n):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 9. Palindrome partitioning  ·  Medium  ·  Backtracking over cut points
#
# Split s into pieces so that every piece is a palindrome. Return all possible splits (any
# order).
#
# LeetCode: 131. Palindrome Partitioning
# ────────────────────────────────────────────────────────────────────────────────────────
def partition(s):
    result = []
    # TODO
    return result


if __name__ == "__main__":
    check(subsets, [
        {"args": [[1, 2, 3]], "expect": [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]},
        {"args": [[0]], "expect": [[], [0]]},
        {"args": [[5, 6]], "expect": [[], [5], [6], [5, 6]]},
    ], compare="nested")
    check(permute, [
        {"args": [[1, 2, 3]], "expect": [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]},
        {"args": [[0, 1]], "expect": [[0, 1], [1, 0]]},
        {"args": [[1]], "expect": [[1]]},
    ], compare="outer")
    check(combine, [
        {"args": [4, 2], "expect": [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]},
        {"args": [1, 1], "expect": [[1]]},
        {"args": [3, 3], "expect": [[1, 2, 3]]},
    ], compare="nested")
    check(combination_sum, [
        {"args": [[2, 3, 6, 7], 7], "expect": [[2, 2, 3], [7]]},
        {"args": [[2, 3, 5], 8], "expect": [[2, 2, 2, 2], [2, 3, 3], [3, 5]]},
        {"args": [[2], 1], "expect": []},
        {"args": [[1], 2], "expect": [[1, 1]]},
    ], compare="nested")
    check(letter_combinations, [
        {"args": ["23"], "expect": ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]},
        {"args": [""], "expect": []},
        {"args": ["2"], "expect": ["a", "b", "c"]},
        {"args": ["79"], "expect": {"__py__": "[a + b for a in \"pqrs\" for b in \"wxyz\"]"}},
    ], compare="sorted")
    check(generate_parenthesis, [
        {"args": [1], "expect": ["()"]},
        {"args": [2], "expect": ["(())", "()()"]},
        {"args": [3], "expect": ["((()))", "(()())", "(())()", "()(())", "()()()"]},
    ], compare="sorted")
    check(exist, [
        {"args": [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCCED"], "expect": True},
        {"args": [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "SEE"], "expect": True},
        {"args": [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCB"], "expect": False},
        {"args": [[["a"]], "a"], "expect": True},
        {"args": [[["a", "b"], ["c", "d"]], "abdc"], "expect": True},
    ])
    check(total_n_queens, [
        {"args": [1], "expect": 1},
        {"args": [4], "expect": 2},
        {"args": [5], "expect": 10},
        {"args": [6], "expect": 4},
        {"args": [8], "expect": 92},
    ])
    check(partition, [
        {"args": ["aab"], "expect": [["a", "a", "b"], ["aa", "b"]]},
        {"args": ["a"], "expect": [["a"]]},
        {"args": ["abba"], "expect": [["a", "b", "b", "a"], ["a", "bb", "a"], ["abba"]]},
    ], compare="outer")
