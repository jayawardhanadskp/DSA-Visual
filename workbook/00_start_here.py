"""
Lesson 00 · Start here: the method — workbook
The visual lesson: lessons/00-start-here.html

How to use:
  1. Write your code inside each function (replace the `pass` / TODO lines).
  2. Run:  python3 workbook/00_start_here.py
  3. Fix until every problem shows ✅. Use print() freely while debugging.
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Add up a list (without sum())  ·  Easy  ·  Warm-up
#
# Return the total of all numbers in nums. Don't use the built-in sum() — use a loop, like the
# visualizer above. An empty list has total 0.
# This exercise is mostly to try the editor: type, press ▶ Run tests, read the results.
# ────────────────────────────────────────────────────────────────────────────────────────
def total(nums):
    result = 0
    # TODO: loop over nums and add each number to result
    return result


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Count the even numbers  ·  Easy  ·  Warm-up
#
# Return how many numbers in nums are even. A number x is even when x % 2 == 0 (% is
# "remainder after dividing").
# ────────────────────────────────────────────────────────────────────────────────────────
def count_evens(nums):
    # TODO
    pass


if __name__ == "__main__":
    check(total, [
        {"args": [[4, 7, 1]], "expect": 12},
        {"args": [[]], "expect": 0},
        {"args": [[-2, 2, 5]], "expect": 5},
        {"args": [[100]], "expect": 100},
    ])
    check(count_evens, [
        {"args": [[1, 2, 3, 4]], "expect": 2},
        {"args": [[]], "expect": 0},
        {"args": [[1, 3, 5]], "expect": 0},
        {"args": [[0, -2, 7]], "expect": 2},
    ])
