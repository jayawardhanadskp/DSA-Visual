"""
Lesson 18 · Greedy & intervals — SOLUTIONS
The visual lesson: lessons/18-greedy-intervals.html

Only open this after you've really tried (15+ minutes per problem).
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
    best = current = nums[0]
    for x in nums[1:]:
        current = max(x, current + x)
        best = max(best, current)
    return best


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Jump game  ·  Medium  ·  Greedy reach
#
# You start at index 0. nums[i] is the maximum jump length from i. Can you reach the last
# index?
#
# LeetCode: 55. Jump Game
# ────────────────────────────────────────────────────────────────────────────────────────
def can_jump(nums):
    farthest = 0
    for i, step in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + step)
    return True


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Assign cookies  ·  Easy  ·  Sort + greedy match
#
# Child i is happy with a cookie of size ≥ g[i]. Each child gets at most one cookie (sizes s).
# Return the most happy children.
#
# LeetCode: 455. Assign Cookies
# ────────────────────────────────────────────────────────────────────────────────────────
def find_content_children(g, s):
    g.sort()
    s.sort()
    child = 0
    for cookie in s:
        if child < len(g) and cookie >= g[child]:
            child += 1
    return child


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Best time to buy and sell stock II  ·  Medium  ·  Greedy: take every gain
#
# Now you may buy and sell many times (hold at most one share at a time). Return the maximum
# profit.
#
# LeetCode: 122. Best Time to Buy and Sell Stock II
# ────────────────────────────────────────────────────────────────────────────────────────
def max_profit_ii(prices):
    return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, len(prices)))


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Gas station  ·  Medium  ·  Greedy restart
#
# Stations on a circle: you get gas[i] at station i and need cost[i] to drive to the next.
# Return the start index that lets you go all the way round (unique), or −1.
#
# LeetCode: 134. Gas Station
# ────────────────────────────────────────────────────────────────────────────────────────
def can_complete_circuit(gas, cost):
    if sum(gas) < sum(cost):
        return -1
    start = 0
    tank = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            start = i + 1
            tank = 0
    return start


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Partition labels  ·  Medium  ·  Greedy with last positions
#
# Split s into as many parts as possible so that each letter appears in only one part. Return
# the sizes of the parts.
#
# LeetCode: 763. Partition Labels
# ────────────────────────────────────────────────────────────────────────────────────────
def partition_labels(s):
    last = {ch: i for i, ch in enumerate(s)}
    sizes = []
    start = end = 0
    for i, ch in enumerate(s):
        end = max(end, last[ch])
        if i == end:
            sizes.append(end - start + 1)
            start = i + 1
    return sizes


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Merge intervals  ·  Medium  ·  Sort + sweep
#
# Merge all overlapping intervals and return them sorted by start. Intervals that touch ([1,4]
# and [4,5]) overlap.
#
# LeetCode: 56. Merge Intervals
# ────────────────────────────────────────────────────────────────────────────────────────
def merge_intervals(intervals):
    intervals.sort(key=lambda iv: iv[0])
    merged = []
    for start, end in intervals:
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. Insert interval  ·  Medium  ·  Sweep in three parts
#
# intervals are sorted and don't overlap. Insert new and merge if needed. Return the result.
#
# LeetCode: 57. Insert Interval
# ────────────────────────────────────────────────────────────────────────────────────────
def insert_interval(intervals, new):
    result = []
    start, end = new
    i, n = 0, len(intervals)
    while i < n and intervals[i][1] < start:          # before
        result.append(intervals[i])
        i += 1
    while i < n and intervals[i][0] <= end:           # overlapping → merge
        start = min(start, intervals[i][0])
        end = max(end, intervals[i][1])
        i += 1
    result.append([start, end])
    result.extend(intervals[i:])                      # after
    return result


# ────────────────────────────────────────────────────────────────────────────────────────
# 9. Non-overlapping intervals  ·  Medium  ·  Greedy: earliest end first
#
# Return the minimum number of intervals to remove so that the rest don't overlap (touching
# like [1,2] and [2,3] is fine).
#
# LeetCode: 435. Non-overlapping Intervals
# ────────────────────────────────────────────────────────────────────────────────────────
def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda iv: iv[1])
    removed = 0
    last_end = float("-inf")
    for start, end in intervals:
        if start >= last_end:
            last_end = end          # keep it
        else:
            removed += 1            # overlaps → remove it
    return removed


# ────────────────────────────────────────────────────────────────────────────────────────
# 10. Meeting rooms (can one person attend all?)  ·  Easy  ·  Sort + check neighbours
#
# Return True if no two meetings overlap (one may start exactly when another ends).
#
# LeetCode: 252. Meeting Rooms (premium)
# ────────────────────────────────────────────────────────────────────────────────────────
def can_attend_meetings(intervals):
    intervals.sort()
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i - 1][1]:
            return False
    return True


# ────────────────────────────────────────────────────────────────────────────────────────
# 11. Meeting rooms II (how many rooms?)  ·  Medium  ·  Sort + heap of end times
#
# Return the minimum number of rooms needed so that all meetings can happen.
#
# LeetCode: 253. Meeting Rooms II (premium)
# ────────────────────────────────────────────────────────────────────────────────────────
import heapq

def min_meeting_rooms(intervals):
    intervals.sort()
    ends = []
    for start, end in intervals:
        if ends and ends[0] <= start:
            heapq.heappop(ends)
        heapq.heappush(ends, end)
    return len(ends)


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
