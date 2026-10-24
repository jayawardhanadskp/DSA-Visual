"""
Lesson 15 · Graphs — workbook
The visual lesson: lessons/15-graphs.html

How to use:
  1. Write your code inside each function (replace the `pass` / TODO lines).
  2. Run:  python3 workbook/15_graphs.py
  3. Fix until every problem shows ✅. Use print() freely while debugging.
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Number of islands  ·  Medium  ·  Grid DFS / BFS
#
# grid has "1" (land) and "0" (water). An island is land connected up/down/left/right. Count
# the islands.
#
# LeetCode: 200. Number of Islands
# ────────────────────────────────────────────────────────────────────────────────────────
def num_islands(grid):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Flood fill  ·  Easy  ·  Grid DFS
#
# Starting at (sr, sc), change the colour of that pixel and every pixel connected to it (4
# directions) with the same original colour to color. Return the image.
#
# LeetCode: 733. Flood Fill
# ────────────────────────────────────────────────────────────────────────────────────────
def flood_fill(image, sr, sc, color):
    # TODO
    return image


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Find if a path exists  ·  Easy  ·  Build adjacency list + BFS/DFS
#
# There are n nodes 0..n-1 and undirected edges. Return whether there is a path from source to
# destination.
#
# LeetCode: 1971. Find if Path Exists in Graph
# ────────────────────────────────────────────────────────────────────────────────────────
def valid_path(n, edges, source, destination):
    # TODO: 1. build the adjacency list  2. BFS or DFS from source
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Number of provinces  ·  Medium  ·  Count connected components
#
# is_connected[i][j] == 1 means city i and city j are directly connected. A province is a
# group of connected cities. Count the provinces.
#
# LeetCode: 547. Number of Provinces
# ────────────────────────────────────────────────────────────────────────────────────────
def find_circle_num(is_connected):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Course schedule (can you finish?)  ·  Medium  ·  Topological sort / cycle detection
#
# There are n courses. [a, b] in prereqs means you must take b before a. Return whether you
# can finish all courses (i.e. there is no cycle).
#
# LeetCode: 207. Course Schedule
# ────────────────────────────────────────────────────────────────────────────────────────
from collections import deque

def can_finish(n, prereqs):
    # TODO
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Course schedule II (the order)  ·  Medium  ·  Topological sort
#
# Same input. Return an order to take all courses, or [] if impossible. If several orders are
# valid, any is accepted.
#
# LeetCode: 210. Course Schedule II
# ────────────────────────────────────────────────────────────────────────────────────────
from collections import deque

def find_order(n, prereqs):
    # TODO
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Rotting oranges  ·  Medium  ·  Multi-source BFS
#
# 0 = empty, 1 = fresh orange, 2 = rotten. Every minute, fresh oranges next to a rotten one (4
# directions) become rotten. Return the minutes until no fresh orange is left, or −1 if that
# never happens.
#
# LeetCode: 994. Rotting Oranges
# ────────────────────────────────────────────────────────────────────────────────────────
from collections import deque

def oranges_rotting(grid):
    # TODO
    return -1


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. Shortest path in a binary matrix  ·  Medium  ·  BFS shortest path
#
# Find the length (number of cells) of the shortest path from the top-left to the bottom-right
# cell through 0-cells, moving in 8 directions. Return −1 if there is none.
#
# LeetCode: 1091. Shortest Path in Binary Matrix
# ────────────────────────────────────────────────────────────────────────────────────────
from collections import deque

def shortest_path_binary_matrix(grid):
    # TODO
    return -1


# ────────────────────────────────────────────────────────────────────────────────────────
# 9. Network delay time  ·  Medium  ·  Dijkstra
#
# times[i] = [u, v, w]: a signal goes from node u to node v in w time (directed). Nodes are
# 1..n. A signal starts at node k. Return the time until all nodes have it, or −1.
#
# LeetCode: 743. Network Delay Time
# ────────────────────────────────────────────────────────────────────────────────────────
import heapq

def network_delay_time(times, n, k):
    # TODO
    return -1


# ────────────────────────────────────────────────────────────────────────────────────────
# 10. Number of connected components  ·  Medium  ·  Union-find
#
# n nodes and undirected edges. Return the number of connected groups. Try union-find.
#
# LeetCode: 323. Number of Connected Components in an Undirected Graph (premium)
# ────────────────────────────────────────────────────────────────────────────────────────
def count_components(n, edges):
    parent = list(range(n))

    def find(x):
        # TODO
        return x

    # TODO: union every edge; count successful unions
    return n


if __name__ == "__main__":
    check(num_islands, [
        {"args": [[["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]]], "expect": 1},
        {"args": [[["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]]], "expect": 3},
        {"args": [[["0"]]], "expect": 0},
        {"args": [[["1", "0", "1"], ["0", "1", "0"], ["1", "0", "1"]]], "expect": 5},
    ])
    check(flood_fill, [
        {"args": [[[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2], "expect": [[2, 2, 2], [2, 2, 0], [2, 0, 1]]},
        {"args": [[[0, 0, 0], [0, 0, 0]], 0, 0, 0], "expect": [[0, 0, 0], [0, 0, 0]]},
        {"args": [[[0, 0, 0], [0, 1, 1]], 1, 1, 1], "expect": [[0, 0, 0], [0, 1, 1]]},
        {"args": [[[1]], 0, 0, 5], "expect": [[5]]},
    ])
    check(valid_path, [
        {"args": [3, [[0, 1], [1, 2], [2, 0]], 0, 2], "expect": True},
        {"args": [6, [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]], 0, 5], "expect": False},
        {"args": [1, [], 0, 0], "expect": True},
        {"args": [4, [[0, 1], [2, 3]], 1, 3], "expect": False},
    ])
    check(find_circle_num, [
        {"args": [[[1, 1, 0], [1, 1, 0], [0, 0, 1]]], "expect": 2},
        {"args": [[[1, 0, 0], [0, 1, 0], [0, 0, 1]]], "expect": 3},
        {"args": [[[1]]], "expect": 1},
        {"args": [[[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 1], [1, 0, 1, 1]]], "expect": 1},
    ])
    check(can_finish, [
        {"args": [2, [[1, 0]]], "expect": True},
        {"args": [2, [[1, 0], [0, 1]]], "expect": False},
        {"args": [3, []], "expect": True},
        {"args": [4, [[1, 0], [2, 1], [3, 2], [1, 3]]], "expect": False},
        {"args": [5, [[1, 0], [2, 0], [3, 1], [4, 3]]], "expect": True},
    ])
    check(find_order, [
        {"args": [2, [[1, 0]]], "expect": [0, 1]},
        {"args": [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], "expect": [0, 1, 2, 3], "anyOf": [[0, 1, 2, 3], [0, 2, 1, 3]]},
        {"args": [1, []], "expect": [0]},
        {"args": [2, [[0, 1], [1, 0]]], "expect": []},
    ])
    check(oranges_rotting, [
        {"args": [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], "expect": 4},
        {"args": [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], "expect": -1},
        {"args": [[[0, 2]]], "expect": 0},
        {"args": [[[0]]], "expect": 0},
        {"args": [[[1]]], "expect": -1},
    ])
    check(shortest_path_binary_matrix, [
        {"args": [[[0, 1], [1, 0]]], "expect": 2},
        {"args": [[[0, 0, 0], [1, 1, 0], [1, 1, 0]]], "expect": 4},
        {"args": [[[1, 0, 0], [1, 1, 0], [1, 1, 0]]], "expect": -1},
        {"args": [[[0]]], "expect": 1},
    ])
    check(network_delay_time, [
        {"args": [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2], "expect": 2},
        {"args": [[[1, 2, 1]], 2, 1], "expect": 1},
        {"args": [[[1, 2, 1]], 2, 2], "expect": -1},
        {"args": [[[1, 2, 1], [2, 3, 2], [1, 3, 4]], 3, 1], "expect": 3},
    ])
    check(count_components, [
        {"args": [5, [[0, 1], [1, 2], [3, 4]]], "expect": 2},
        {"args": [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], "expect": 1},
        {"args": [3, []], "expect": 3},
        {"args": [4, [[0, 1], [2, 3], [1, 2]]], "expect": 1},
        {"args": [4, [[0, 1], [1, 0], [2, 3]]], "expect": 2},
    ])
