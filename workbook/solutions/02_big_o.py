"""
Lesson 02 · Big-O: how fast is my code? — SOLUTIONS
The visual lesson: lessons/02-big-o.html

Only open this after you've really tried (15+ minutes per problem).
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Sum from 1 to n — make it O(1)  ·  Easy  ·  Math instead of a loop
#
# Return 1 + 2 + … + n. The last test uses n = 10**12 (a trillion). A loop would need a
# trillion steps — find the formula.
# ────────────────────────────────────────────────────────────────────────────────────────
def sum_to_n(n):
    return n * (n + 1) // 2


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Has a duplicate? — make it O(n)  ·  Easy  ·  Set lookup
#
# Return True if any value appears at least twice in nums. The starter is O(n²) and is too
# slow for the big tests (100,000 numbers). Use a set (lesson 01): checking x in seen is O(1).
#
# LeetCode: 217. Contains Duplicate
# ────────────────────────────────────────────────────────────────────────────────────────
def has_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Common elements — make it fast  ·  Easy  ·  Set lookup
#
# Return the sorted list of the different values that appear in both a and b. The big test has
# 20,000 and 8,000 numbers.
#
# LeetCode: 349. Intersection of Two Arrays
# ────────────────────────────────────────────────────────────────────────────────────────
def common_elements(a, b):
    return sorted(set(a) & set(b))


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. First repeated character  ·  Easy  ·  Set lookup
#
# Return the first character in s that appears for the second time while reading left to
# right, or None if no character repeats. "abcbad" → "b".
# ────────────────────────────────────────────────────────────────────────────────────────
def first_repeat(s):
    seen = set()
    for ch in s:
        if ch in seen:
            return ch
        seen.add(ch)
    return None


if __name__ == "__main__":
    check(sum_to_n, [
        {"args": [1], "expect": 1},
        {"args": [10], "expect": 55},
        {"args": [100], "expect": 5050},
        {"args": [0], "expect": 0},
        {"args": [{"__py__": "10**12"}], "expect": {"__py__": "500000000000500000000000"}},
    ])
    check(has_duplicate, [
        {"args": [[1, 2, 3, 1]], "expect": True},
        {"args": [[1, 2, 3, 4]], "expect": False},
        {"args": [[]], "expect": False},
        {"args": [{"__py__": "list(range(100_000))"}], "expect": False},
        {"args": [{"__py__": "list(range(100_000)) + [99_999]"}], "expect": True},
    ])
    check(common_elements, [
        {"args": [[1, 2, 2, 1], [2, 2]], "expect": [2]},
        {"args": [[4, 9, 5], [9, 4, 9, 8, 4]], "expect": [4, 9]},
        {"args": [[1, 2], [3]], "expect": []},
        {"args": [{"__py__": "list(range(0, 40_000, 2))"}, {"__py__": "list(range(0, 40_000, 5))"}], "expect": {"__py__": "list(range(0, 40_000, 10))"}},
    ])
    check(first_repeat, [
        {"args": ["abcbad"], "expect": "b"},
        {"args": ["abc"], "expect": None},
        {"args": ["aa"], "expect": "a"},
        {"args": [""], "expect": None},
        {"args": ["xyzzyx"], "expect": "z"},
    ])
