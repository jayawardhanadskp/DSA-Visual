"""
Lesson 17 · Dynamic programming — SOLUTIONS
The visual lesson: lessons/17-dynamic-programming.html

Only open this after you've really tried (15+ minutes per problem).
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Climbing stairs  ·  Easy  ·  1-D DP
#
# You climb a staircase with n steps, taking 1 or 2 steps at a time. In how many different
# ways can you reach the top? (The last test is n = 80 — plain recursion is far too slow.)
#
# LeetCode: 70. Climbing Stairs
# ────────────────────────────────────────────────────────────────────────────────────────
def climb_stairs(n):
    prev, curr = 1, 1          # ways(0), ways(1)
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Min cost climbing stairs  ·  Easy  ·  1-D DP
#
# cost[i] is the price of standing on step i. You can start on step 0 or 1 and climb 1 or 2
# steps at a time. The top is just past the last step. Return the minimum total cost.
#
# LeetCode: 746. Min Cost Climbing Stairs
# ────────────────────────────────────────────────────────────────────────────────────────
def min_cost_climbing_stairs(cost):
    n = len(cost)
    dp = [0] * (n + 1)
    for i in range(2, n + 1):
        dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])
    return dp[n]


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. House robber  ·  Medium  ·  1-D DP (take / skip)
#
# nums[i] is the money in house i. You can't rob two neighbouring houses. Return the most
# money you can rob.
#
# LeetCode: 198. House Robber
# ────────────────────────────────────────────────────────────────────────────────────────
def rob(nums):
    prev, curr = 0, 0           # best up to house i-2, best up to house i-1
    for x in nums:
        prev, curr = curr, max(curr, prev + x)
    return curr


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Coin change  ·  Medium  ·  1-D DP over amounts
#
# Return the fewest coins needed to make amount (unlimited coins of each value), or −1 if
# impossible. Greedy (biggest coin first) is wrong: with coins [1, 3, 4] and amount 6, greedy
# gives 4+1+1, but 3+3 is better.
#
# LeetCode: 322. Coin Change
# ────────────────────────────────────────────────────────────────────────────────────────
def coin_change(coins, amount):
    INF = float("inf")
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != INF else -1


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Unique paths  ·  Medium  ·  2-D DP (grid)
#
# A robot starts at the top-left of an m × n grid and can only move right or down. How many
# different paths reach the bottom-right?
#
# LeetCode: 62. Unique Paths
# ────────────────────────────────────────────────────────────────────────────────────────
def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
    return dp[m - 1][n - 1]


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Longest increasing subsequence  ·  Medium  ·  1-D DP (look at all earlier)
#
# Return the length of the longest strictly increasing subsequence (items in order, not
# necessarily next to each other).
#
# LeetCode: 300. Longest Increasing Subsequence
# ────────────────────────────────────────────────────────────────────────────────────────
def length_of_lis(nums):
    dp = [1] * len(nums)
    for i in range(len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Longest common subsequence  ·  Medium  ·  2-D DP (two strings)
#
# Return the length of the longest sequence of characters that appears in both strings in the
# same order (not necessarily next to each other).
#
# LeetCode: 1143. Longest Common Subsequence
# ────────────────────────────────────────────────────────────────────────────────────────
def longest_common_subsequence(a, b):
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[len(a)][len(b)]


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. Word break  ·  Medium  ·  1-D DP over prefixes
#
# Can s be split into a sequence of words from words (words can be reused)? The last test
# makes plain recursion explode.
#
# LeetCode: 139. Word Break
# ────────────────────────────────────────────────────────────────────────────────────────
def word_break(s, words):
    word_set = set(words)
    ok = [False] * (len(s) + 1)
    ok[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if ok[j] and s[j:i] in word_set:
                ok[i] = True
                break
    return ok[len(s)]


# ────────────────────────────────────────────────────────────────────────────────────────
# 9. Partition equal subset sum  ·  Medium  ·  0/1 knapsack
#
# Can nums be split into two groups with the same sum?
#
# LeetCode: 416. Partition Equal Subset Sum
# ────────────────────────────────────────────────────────────────────────────────────────
def can_partition(nums):
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    reachable = {0}
    for x in nums:
        reachable |= {s + x for s in reachable if s + x <= target}
    return target in reachable


# ────────────────────────────────────────────────────────────────────────────────────────
# 10. Edit distance  ·  Hard  ·  2-D DP (two strings)
#
# Return the minimum number of operations (insert a character, delete a character, replace a
# character) to turn word1 into word2.
#
# LeetCode: 72. Edit Distance
# ────────────────────────────────────────────────────────────────────────────────────────
def min_distance(word1, word2):
    n, m = len(word1), len(word2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]


if __name__ == "__main__":
    check(climb_stairs, [
        {"args": [1], "expect": 1},
        {"args": [2], "expect": 2},
        {"args": [3], "expect": 3},
        {"args": [5], "expect": 8},
        {"args": [45], "expect": 1836311903},
        {"args": [80], "expect": {"__py__": "37889062373143906"}},
    ])
    check(min_cost_climbing_stairs, [
        {"args": [[10, 15, 20]], "expect": 15},
        {"args": [[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]], "expect": 6},
        {"args": [[0, 0]], "expect": 0},
        {"args": [[5, 10]], "expect": 5},
    ])
    check(rob, [
        {"args": [[1, 2, 3, 1]], "expect": 4},
        {"args": [[2, 7, 9, 3, 1]], "expect": 12},
        {"args": [[5]], "expect": 5},
        {"args": [[2, 1, 1, 2]], "expect": 4},
        {"args": [{"__py__": "list(range(1, 101))"}], "expect": 2550},
    ])
    check(coin_change, [
        {"args": [[1, 2, 5], 11], "expect": 3},
        {"args": [[2], 3], "expect": -1},
        {"args": [[1], 0], "expect": 0},
        {"args": [[1, 3, 4], 6], "expect": 2},
        {"args": [[186, 419, 83, 408], 6249], "expect": 20},
    ])
    check(unique_paths, [
        {"args": [3, 7], "expect": 28},
        {"args": [3, 2], "expect": 3},
        {"args": [1, 1], "expect": 1},
        {"args": [10, 10], "expect": 48620},
        {"args": [23, 12], "expect": 193536720},
    ])
    check(length_of_lis, [
        {"args": [[10, 9, 2, 5, 3, 7, 101, 18]], "expect": 4},
        {"args": [[0, 1, 0, 3, 2, 3]], "expect": 4},
        {"args": [[7, 7, 7, 7]], "expect": 1},
        {"args": [[1]], "expect": 1},
        {"args": [[4, 10, 4, 3, 8, 9]], "expect": 3},
    ])
    check(longest_common_subsequence, [
        {"args": ["abcde", "ace"], "expect": 3},
        {"args": ["abc", "abc"], "expect": 3},
        {"args": ["abc", "def"], "expect": 0},
        {"args": ["bsbininm", "jmjkbkjkv"], "expect": 1},
    ])
    check(word_break, [
        {"args": ["leetcode", ["leet", "code"]], "expect": True},
        {"args": ["applepenapple", ["apple", "pen"]], "expect": True},
        {"args": ["catsandog", ["cats", "dog", "sand", "and", "cat"]], "expect": False},
        {"args": ["a", ["b"]], "expect": False},
        {"args": [{"__py__": "\"a\" * 40 + \"b\""}, ["a", "aa", "aaa", "aaaa"]], "expect": False},
    ])
    check(can_partition, [
        {"args": [[1, 5, 11, 5]], "expect": True},
        {"args": [[1, 2, 3, 5]], "expect": False},
        {"args": [[2, 2]], "expect": True},
        {"args": [[1]], "expect": False},
        {"args": [[3, 3, 3, 4, 5]], "expect": True},
    ])
    check(min_distance, [
        {"args": ["horse", "ros"], "expect": 3},
        {"args": ["intention", "execution"], "expect": 5},
        {"args": ["", "a"], "expect": 1},
        {"args": ["abc", "abc"], "expect": 0},
    ])
