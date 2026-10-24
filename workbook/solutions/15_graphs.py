"""
Lesson 15 · Graphs — SOLUTIONS
The visual lesson: lessons/15-graphs.html

Only open this after you've really tried (15+ minutes per problem).
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
    rows, cols = len(grid), len(grid[0])

    def sink(r, c):
        if 0 <= r < rows and 0 <= c < cols and grid[r][c] == "1":
            grid[r][c] = "#"
            sink(r + 1, c)
            sink(r - 1, c)
            sink(r, c + 1)
            sink(r, c - 1)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                sink(r, c)
    return count


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Flood fill  ·  Easy  ·  Grid DFS
#
# Starting at (sr, sc), change the colour of that pixel and every pixel connected to it (4
# directions) with the same original colour to color. Return the image.
#
# LeetCode: 733. Flood Fill
# ────────────────────────────────────────────────────────────────────────────────────────
def flood_fill(image, sr, sc, color):
    original = image[sr][sc]
    if original == color:
        return image
    rows, cols = len(image), len(image[0])

    def paint(r, c):
        if 0 <= r < rows and 0 <= c < cols and image[r][c] == original:
            image[r][c] = color
            paint(r + 1, c)
            paint(r - 1, c)
            paint(r, c + 1)
            paint(r, c - 1)

    paint(sr, sc)
    return image


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Find if a path exists  ·  Easy  ·  Build adjacency list + BFS/DFS
#
# There are n nodes 0..n-1 and undirected edges. Return whether there is a path from source to
# destination.
#
# LeetCode: 1971. Find if Path Exists in Graph
# ────────────────────────────────────────────────────────────────────────────────────────
from collections import deque

def valid_path(n, edges, source, destination):
    graph = {i: [] for i in range(n)}
    for a, b in edges:
        graph[a].append(b)
        graph[b].append(a)
    seen = {source}
    queue = deque([source])
    while queue:
        node = queue.popleft()
        if node == destination:
            return True
        for nei in graph[node]:
            if nei not in seen:
                seen.add(nei)
                queue.append(nei)
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
    n = len(is_connected)
    visited = set()

    def dfs(i):
        for j in range(n):
            if is_connected[i][j] == 1 and j not in visited:
                visited.add(j)
                dfs(j)

    count = 0
    for i in range(n):
        if i not in visited:
            visited.add(i)
            dfs(i)
            count += 1
    return count


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
    graph = {i: [] for i in range(n)}
    indegree = [0] * n
    for course, pre in prereqs:
        graph[pre].append(course)
        indegree[course] += 1
    queue = deque(i for i in range(n) if indegree[i] == 0)
    taken = 0
    while queue:
        node = queue.popleft()
        taken += 1
        for nxt in graph[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                queue.append(nxt)
    return taken == n


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
    graph = {i: [] for i in range(n)}
    indegree = [0] * n
    for course, pre in prereqs:
        graph[pre].append(course)
        indegree[course] += 1
    queue = deque(i for i in range(n) if indegree[i] == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nxt in graph[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                queue.append(nxt)
    return order if len(order) == n else []


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
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1
    minutes = 0
    while queue and fresh:
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    queue.append((nr, nc))
        minutes += 1
    return -1 if fresh else minutes


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
    n = len(grid)
    if grid[0][0] or grid[n - 1][n - 1]:
        return -1
    queue = deque([(0, 0, 1)])
    grid[0][0] = 1                       # mark visited
    while queue:
        r, c, length = queue.popleft()
        if (r, c) == (n - 1, n - 1):
            return length
        for dr in (-1, 0, 1):
            for dc in (-1, 0, 1):
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                    grid[nr][nc] = 1
                    queue.append((nr, nc, length + 1))
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
    graph = {i: [] for i in range(1, n + 1)}
    for u, v, w in times:
        graph[u].append((v, w))
    dist = {k: 0}
    heap = [(0, k)]
    while heap:
        d, node = heapq.heappop(heap)
        if d > dist[node]:
            continue
        for nei, w in graph[node]:
            if d + w < dist.get(nei, float("inf")):
                dist[nei] = d + w
                heapq.heappush(heap, (d + w, nei))
    return max(dist.values()) if len(dist) == n else -1


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
        while parent[x] != x:
            parent[x] = parent[parent[x]]   # path compression: skip a level
            x = parent[x]
        return x

    count = n
    for a, b in edges:
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[rb] = ra
            count -= 1
    return count


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
