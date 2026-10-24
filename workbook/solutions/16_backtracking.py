"""
Lesson 16 · Backtracking — SOLUTIONS
The visual lesson: lessons/16-backtracking.html

Only open this after you've really tried (15+ minutes per problem).
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
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1)
            path.pop()

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
    path = []
    used = [False] * len(nums)

    def backtrack():
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i in range(len(nums)):
            if not used[i]:
                used[i] = True
                path.append(nums[i])
                backtrack()
                path.pop()
                used[i] = False

    backtrack()
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
    path = []

    def backtrack(start):
        if len(path) == k:
            result.append(path[:])
            return
        for x in range(start, n + 1):
            path.append(x)
            backtrack(x + 1)
            path.pop()

    backtrack(1)
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
    path = []

    def backtrack(start, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        if remaining < 0:
            return
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            backtrack(i, remaining - candidates[i])
            path.pop()

    backtrack(0, target)
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
    if not digits:
        return []
    result = []
    path = []

    def backtrack(i):
        if i == len(digits):
            result.append("".join(path))
            return
        for letter in phone[digits[i]]:
            path.append(letter)
            backtrack(i + 1)
            path.pop()

    backtrack(0)
    return result


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Generate parentheses  ·  Medium  ·  Backtracking with rules
#
# Return all valid strings of n pairs of parentheses (any order).
#
# LeetCode: 22. Generate Parentheses
# ────────────────────────────────────────────────────────────────────────────────────────
def generate_parenthesis(n):
    result = []

    def backtrack(text, open_count, close_count):
        if len(text) == 2 * n:
            result.append(text)
            return
        if open_count < n:
            backtrack(text + "(", open_count + 1, close_count)
        if close_count < open_count:
            backtrack(text + ")", open_count, close_count + 1)

    backtrack("", 0, 0)
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
    rows, cols = len(board), len(board[0])

    def dfs(r, c, i):
        if i == len(word):
            return True
        if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != word[i]:
            return False
        saved = board[r][c]
        board[r][c] = "#"                           # choose: mark as used
        found = (dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1) or
                 dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1))
        board[r][c] = saved                         # un-choose
        return found

    return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. N-Queens II (count the solutions)  ·  Hard  ·  Backtracking with sets
#
# Return how many ways n queens can be placed on an n × n board so that no two attack each
# other (same row, column or diagonal).
#
# LeetCode: 52. N-Queens II
# ────────────────────────────────────────────────────────────────────────────────────────
def total_n_queens(n):
    cols, diag1, diag2 = set(), set(), set()

    def place(r):
        if r == n:
            return 1
        count = 0
        for c in range(n):
            if c in cols or r - c in diag1 or r + c in diag2:
                continue
            cols.add(c)
            diag1.add(r - c)
            diag2.add(r + c)
            count += place(r + 1)
            cols.remove(c)
            diag1.remove(r - c)
            diag2.remove(r + c)
        return count

    return place(0)


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
    path = []

    def backtrack(start):
        if start == len(s):
            result.append(path[:])
            return
        for end in range(start + 1, len(s) + 1):
            piece = s[start:end]
            if piece == piece[::-1]:
                path.append(piece)
                backtrack(end)
                path.pop()

    backtrack(0)
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
