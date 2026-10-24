"""
Lesson 18 · Greedy & intervals — workbook
The visual lesson: lessons/18-greedy-intervals.html

How to use:
  1. Write your code inside each function (replace the `pass` / TODO lines).
  2. Run:  python3 workbook/18_greedy_intervals.py
  3. Fix until every problem shows ✅. Use print() freely while debugging.
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Maximum subarray  ·  Medium  ·  Kadane (greedy / DP)
#
# Return the biggest sum of a non-empty contiguous section of nums. O(n).
#
# LeetCode: 53. Maximum Subarray
# ────────────────────────────────────────────────────────────────────────────────────────
def max_subarray(nums):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Jump game  ·  Medium  ·  Greedy reach
#
# You start at index 0. nums[i] is the maximum jump length from i. Can you reach the last
# index?
#
# LeetCode: 55. Jump Game
# ────────────────────────────────────────────────────────────────────────────────────────
def can_jump(nums):
    # TODO
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Assign cookies  ·  Easy  ·  Sort + greedy match
#
# Child i is happy with a cookie of size ≥ g[i]. Each child gets at most one cookie (sizes s).
# Return the most happy children.
#
# LeetCode: 455. Assign Cookies
# ────────────────────────────────────────────────────────────────────────────────────────
def find_content_children(g, s):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Best time to buy and sell stock II  ·  Medium  ·  Greedy: take every gain
#
# Now you may buy and sell many times (hold at most one share at a time). Return the maximum
# profit.
#
# LeetCode: 122. Best Time to Buy and Sell Stock II
# ────────────────────────────────────────────────────────────────────────────────────────
def max_profit_ii(prices):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Gas station  ·  Medium  ·  Greedy restart
#
# Stations on a circle: you get gas[i] at station i and need cost[i] to drive to the next.
# Return the start index that lets you go all the way round (unique), or −1.
#
# LeetCode: 134. Gas Station
# ────────────────────────────────────────────────────────────────────────────────────────
def can_complete_circuit(gas, cost):
    # TODO
    return -1


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Partition labels  ·  Medium  ·  Greedy with last positions
#
# Split s into as many parts as possible so that each letter appears in only one part. Return
# the sizes of the parts.
#
# LeetCode: 763. Partition Labels
# ────────────────────────────────────────────────────────────────────────────────────────
def partition_labels(s):
    # TODO
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Merge intervals  ·  Medium  ·  Sort + sweep
#
# Merge all overlapping intervals and return them sorted by start. Intervals that touch ([1,4]
# and [4,5]) overlap.
#
# LeetCode: 56. Merge Intervals
# ────────────────────────────────────────────────────────────────────────────────────────
def merge_intervals(intervals):
    # TODO
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. Insert interval  ·  Medium  ·  Sweep in three parts
#
# intervals are sorted and don't overlap. Insert new and merge if needed. Return the result.
#
# LeetCode: 57. Insert Interval
# ────────────────────────────────────────────────────────────────────────────────────────
def insert_interval(intervals, new):
    # TODO
    return intervals


# ────────────────────────────────────────────────────────────────────────────────────────
# 9. Non-overlapping intervals  ·  Medium  ·  Greedy: earliest end first
#
# Return the minimum number of intervals to remove so that the rest don't overlap (touching
# like [1,2] and [2,3] is fine).
#
# LeetCode: 435. Non-overlapping Intervals
# ────────────────────────────────────────────────────────────────────────────────────────
def erase_overlap_intervals(intervals):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 10. Meeting rooms (can one person attend all?)  ·  Easy  ·  Sort + check neighbours
#
# Return True if no two meetings overlap (one may start exactly when another ends).
#
# LeetCode: 252. Meeting Rooms (premium)
# ────────────────────────────────────────────────────────────────────────────────────────
def can_attend_meetings(intervals):
    # TODO
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 11. Meeting rooms II (how many rooms?)  ·  Medium  ·  Sort + heap of end times
#
# Return the minimum number of rooms needed so that all meetings can happen.
#
# LeetCode: 253. Meeting Rooms II (premium)
# ────────────────────────────────────────────────────────────────────────────────────────
import heapq

def min_meeting_rooms(intervals):
    # TODO
    return 0


if __name__ == "__main__":
    check(max_subarray, [
        {"args": [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], "expect": 6},
        {"args": [[1]], "expect": 1},
        {"args": [[5, 4, -1, 7, 8]], "expect": 23},
        {"args": [[-3, -1, -2]], "expect": -1},
        {"args": [{"__py__": "list(range(-50_000, 50_000))"}], "expect": 1249975000},
    ])
    check(can_jump, [
        {"args": [[2, 3, 1, 1, 4]], "expect": True},
        {"args": [[3, 2, 1, 0, 4]], "expect": False},
        {"args": [[0]], "expect": True},
        {"args": [[2, 0, 0]], "expect": True},
        {"args": [[1, 0, 1, 0]], "expect": False},
    ])
    check(find_content_children, [
        {"args": [[1, 2, 3], [1, 1]], "expect": 1},
        {"args": [[1, 2], [1, 2, 3]], "expect": 2},
        {"args": [[10, 9, 8, 7], [5, 6, 7, 8]], "expect": 2},
        {"args": [[], [1]], "expect": 0},
    ])
    check(max_profit_ii, [
        {"args": [[7, 1, 5, 3, 6, 4]], "expect": 7},
        {"args": [[1, 2, 3, 4, 5]], "expect": 4},
        {"args": [[7, 6, 4, 3, 1]], "expect": 0},
        {"args": [[3]], "expect": 0},
    ])
    check(can_complete_circuit, [
        {"args": [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]], "expect": 3},
        {"args": [[2, 3, 4], [3, 4, 3]], "expect": -1},
        {"args": [[5], [4]], "expect": 0},
        {"args": [[3, 1, 1], [1, 2, 2]], "expect": 0},
    ])
    check(partition_labels, [
        {"args": ["ababcbacadefegdehijhklij"], "expect": [9, 7, 8]},
        {"args": ["eccbbbbdec"], "expect": [10]},
        {"args": ["abc"], "expect": [1, 1, 1]},
    ])
    check(merge_intervals, [
        {"args": [[[1, 3], [2, 6], [8, 10], [15, 18]]], "expect": [[1, 6], [8, 10], [15, 18]]},
        {"args": [[[1, 4], [4, 5]]], "expect": [[1, 5]]},
        {"args": [[[1, 4], [0, 4]]], "expect": [[0, 4]]},
        {"args": [[[1, 4], [2, 3]]], "expect": [[1, 4]]},
    ])
    check(insert_interval, [
        {"args": [[[1, 3], [6, 9]], [2, 5]], "expect": [[1, 5], [6, 9]]},
        {"args": [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]], "expect": [[1, 2], [3, 10], [12, 16]]},
        {"args": [[], [5, 7]], "expect": [[5, 7]]},
        {"args": [[[1, 5]], [6, 8]], "expect": [[1, 5], [6, 8]]},
    ])
    check(erase_overlap_intervals, [
        {"args": [[[1, 2], [2, 3], [3, 4], [1, 3]]], "expect": 1},
        {"args": [[[1, 2], [1, 2], [1, 2]]], "expect": 2},
        {"args": [[[1, 2], [2, 3]]], "expect": 0},
        {"args": [[[1, 100], [11, 22], [1, 11], [2, 12]]], "expect": 2},
    ])
    check(can_attend_meetings, [
        {"args": [[[0, 30], [5, 10], [15, 20]]], "expect": False},
        {"args": [[[7, 10], [2, 4]]], "expect": True},
        {"args": [[]], "expect": True},
        {"args": [[[1, 5], [5, 8]]], "expect": True},
    ])
    check(min_meeting_rooms, [
        {"args": [[[0, 30], [5, 10], [15, 20]]], "expect": 2},
        {"args": [[[7, 10], [2, 4]]], "expect": 1},
        {"args": [[[1, 5], [5, 8]]], "expect": 1},
        {"args": [[[1, 10], [2, 7], [3, 19], [8, 12], [10, 20], [11, 30]]], "expect": 4},
        {"args": [[]], "expect": 0},
    ])
