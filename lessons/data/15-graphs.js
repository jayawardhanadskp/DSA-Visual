// Lesson 15 — Graphs
const L15_POS = { A: [40, 110], B: [150, 50], C: [150, 170], D: [270, 22], E: [270, 110], F: [270, 194] }
const L15_GRAPH = py`
  graph = {
      "A": ["B", "C"],
      "B": ["A", "D", "E"],
      "C": ["A", "F"],
      "D": ["B"],
      "E": ["B", "F"],
      "F": ["C", "E"],
  }
`

addViz({
  'g-bfs': {
    title: 'BFS: explore in rings of distance with a queue',
    code: py`
      from collections import deque

    ` + '\n\n' + L15_GRAPH + '\n\n' + py`
      def bfs(start):
          dist = {start: 0}                  # distance from start (also our "visited")
          queue = deque([start])
          while queue:
              node = queue.popleft()         #: take {queue[0]} from the front (distance {dist[queue[0]]})
              for nei in graph[node]:
                  if nei not in dist:        #: neighbour {nei}: {'NEW → distance ' + str(dist[node] + 1) + ', join the queue' if nei not in dist else 'already seen → skip'}
                      dist[nei] = dist[node] + 1
                      queue.append(nei)
          return dist

      print(bfs("A"))
    `,
    views: [
      {
        type: 'graph',
        var: 'graph',
        pos: L15_POS,
        current: 'node',
        visited: 'dist',
        frontier: 'queue',
        labels: (s) => Object.fromEntries([...(s.v('dist') || new Map())].map(([k, v]) => [k, 'd=' + v])),
        hotEdge: (s) => (s.v('nei') !== undefined && s.fn === 'bfs' ? [s.v('node'), s.v('nei')] : null),
      },
      { type: 'queue', var: 'queue' },
    ],
    hideGlobals: true,
  },
  'g-dfs': {
    title: 'DFS: go as deep as possible, then back up',
    code: L15_GRAPH + '\n\n' + py`
      def dfs(node, visited, order):
          visited.add(node)
          order.append(node)                 #: visit {node}
          for nei in graph[node]:
              if nei not in visited:         #: from {node} look at {nei}: {'not visited → go deeper' if nei not in visited else 'already visited → skip'}
                  dfs(nei, visited, order)

      order = []
      dfs("A", set(), order)
      print(order)
    `,
    views: [
      {
        type: 'graph',
        var: 'graph',
        pos: L15_POS,
        current: (s) => (s.fn === 'dfs' ? [s.v('node')] : []),
        frontier: (s) => s.all('node'),
        visited: 'order',
        hotEdge: (s) => (s.fn === 'dfs' && s.v('nei') !== undefined ? [s.v('node'), s.v('nei')] : null),
      },
      { type: 'array', var: 'order', label: 'visit order' },
    ],
    hideGlobals: true,
  },
  'g-islands': {
    title: 'Grids are graphs: count islands with DFS',
    code: py`
      def num_islands(grid):
          rows, cols = len(grid), len(grid[0])
          count = 0

          def sink(r, c):
              if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":
                  return                         # outside, water, or already visited
              grid[r][c] = "#"                   #: mark ({r}, {c}) as visited
              sink(r + 1, c)
              sink(r - 1, c)
              sink(r, c + 1)
              sink(r, c - 1)

          for r in range(rows):
              for c in range(cols):
                  if grid[r][c] == "1":          #: ({r}, {c}) is land nobody visited → island #{count + 1}! Sink all of it
                      count += 1
                      sink(r, c)
          return count

      grid = [["1", "1", "0", "0"],
              ["1", "0", "0", "1"],
              ["0", "0", "1", "1"],
              ["1", "0", "0", "0"]]
      print(num_islands(grid))
    `,
    views: [{ type: 'grid', var: 'grid', indexes: true, classMap: { 1: 'land', 0: 'water', '#': 'mark' }, pointer: ['r', 'c'] }],
    hideGlobals: true,
    maxSteps: 1500,
  },
  'g-topo': {
    title: 'Topological sort: an order that respects every arrow',
    code: py`
      from collections import deque

      def course_order(n, prereqs):
          graph = {i: [] for i in range(n)}
          indegree = [0] * n                     # how many courses each course still waits for
          for course, pre in prereqs:
              graph[pre].append(course)          # arrow pre → course
              indegree[course] += 1
          queue = deque(i for i in range(n) if indegree[i] == 0)
          order = []
          while queue:
              node = queue.popleft()             #: take course {queue[0]} — nothing blocks it any more
              order.append(node)
              for nxt in graph[node]:
                  indegree[nxt] -= 1             #: {node} is done → course {nxt} now waits for {indegree[nxt] - 1} more
                  if indegree[nxt] == 0:
                      queue.append(nxt)          #: course {nxt} is free now → join the queue
          return order if len(order) == n else []   # shorter → there was a cycle

      print(course_order(6, [[1, 0], [2, 0], [3, 1], [3, 2], [4, 3], [5, 4], [5, 2]]))
    `,
    views: [
      {
        type: 'graph',
        var: 'graph',
        directed: true,
        pos: { 0: [40, 110], 1: [140, 45], 2: [140, 175], 3: [240, 110], 4: [340, 110], 5: [430, 175] },
        current: 'node',
        visited: 'order',
        frontier: 'queue',
        labels: (s) => Object.fromEntries((s.v('indegree') || []).map((d, i) => [i, 'waits ' + d])),
        hotEdge: (s) => (s.v('nxt') !== undefined ? [s.v('node'), s.v('nxt')] : null),
      },
      { type: 'queue', var: 'queue' },
      { type: 'array', var: 'order', label: 'order' },
    ],
    hideGlobals: true,
  },
  'g-dijkstra': {
    title: "Dijkstra: shortest paths with weights, using a heap",
    code: py`
      import heapq

      graph = {
          "A": [("B", 4), ("C", 1)],
          "B": [("D", 1)],
          "C": [("B", 2), ("D", 5)],
          "D": [],
      }

      def dijkstra(start):
          dist = {start: 0}
          heap = [(0, start)]                        # (distance so far, node)
          while heap:
              d, node = heapq.heappop(heap)          #: take the closest unfinished node: {heap[0][1]} at distance {heap[0][0]}
              if d > dist[node]:
                  continue                           # an old, longer entry → skip
              for nei, w in graph[node]:
                  new = d + w                        #: path to {nei} through {node}: {d} + {w} = {d + w}
                  if new < dist.get(nei, float("inf")):   #: is {new} shorter than the best known for {nei} ({dist.get(nei, float("inf"))})? {'yes → update' if new < dist.get(nei, float("inf")) else 'no'}
                      dist[nei] = new
                      heapq.heappush(heap, (new, nei))
          return dist

      print(dijkstra("A"))
    `,
    views: [
      {
        type: 'graph',
        var: 'graph',
        directed: true,
        pos: { A: [40, 110], B: [180, 40], C: [180, 180], D: [320, 110] },
        current: 'node',
        frontier: 'heap',
        visited: 'dist',
        labels: (s) => Object.fromEntries([...(s.v('dist') || new Map())].map(([k, v]) => [k, 'd=' + v])),
        hotEdge: (s) => (s.v('nei') !== undefined && s.fn === 'dijkstra' ? [s.v('node'), s.v('nei')] : null),
      },
      { type: 'array', var: 'heap', label: 'heap of (distance, node)' },
    ],
    hideGlobals: true,
  },
  'g-union-find': {
    title: 'Union-find: which group is each item in?',
    code: py`
      parent = list(range(6))                # at the start everyone is their own boss

      def find(x):
          while parent[x] != x:              #: {'is ' + str(x) + ' its own boss? no → go up to ' + str(parent[x]) if parent[x] != x else str(x) + ' is its own boss → it is the ROOT of the group'}
              x = parent[x]
          return x

      def union(a, b):
          ra, rb = find(a), find(b)
          if ra != rb:
              parent[rb] = ra                #: different groups → join them: {rb}'s boss becomes {ra}
              return True
          return False                       # same group already (this edge would make a cycle)

      for a, b in [(0, 1), (1, 2), (3, 4), (2, 0), (4, 5)]:
          print(a, b, union(a, b))           #: union({a}, {b})
    `,
    views: [
      {
        type: 'graph',
        label: 'arrows point to the boss (parent)',
        directed: true,
        var: (s) => new Map((s.v('parent') || []).map((p, i) => [i, p === i ? [] : [p]])),
        pos: { 0: [40, 40], 1: [120, 110], 2: [200, 40], 3: [280, 110], 4: [360, 40], 5: [440, 110] },
        current: (s) => [s.v('x'), s.v('a'), s.v('b')].filter((v) => v !== undefined),
      },
      { type: 'array', var: 'parent', pointers: ['x', 'ra', 'rb'] },
    ],
  },
})

addProblems({
  'g-islands': {
    title: 'Number of islands',
    level: 'Medium',
    pattern: 'Grid DFS / BFS',
    leetcode: '200. Number of Islands',
    prompt: '<p><code>grid</code> has <code>"1"</code> (land) and <code>"0"</code> (water). An island is land connected up/down/left/right. Count the islands.</p>',
    fn: 'num_islands',
    starter: py`
      def num_islands(grid):
          # TODO
          return 0
    `,
    tests: [
      { args: [[['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']]], expect: 1 },
      { args: [[['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]], expect: 3 },
      { args: [[['0']]], expect: 0 },
      { args: [[['1', '0', '1'], ['0', '1', '0'], ['1', '0', '1']]], expect: 5 },
    ],
    views: [{ type: 'grid', var: 'grid', classMap: { 1: 'land', 0: 'water', '#': 'mark' }, pointer: ['r', 'c'] }],
    hints: ['Scan every cell. When you find unvisited land, count a new island and visit (sink) the whole island.', 'Sinking = DFS to the 4 neighbours, marking cells as visited (change them to "#" or keep a set).'],
    solution: py`
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
    `,
    explain: '<p>O(rows × cols): each cell is sunk at most once. "Count the connected groups" = count how many times you start a new DFS.</p>',
  },
  'g-flood': {
    title: 'Flood fill',
    level: 'Easy',
    pattern: 'Grid DFS',
    leetcode: '733. Flood Fill',
    prompt: '<p>Starting at <code>(sr, sc)</code>, change the colour of that pixel and every pixel connected to it (4 directions) with the <b>same</b> original colour to <code>color</code>. Return the image.</p>',
    fn: 'flood_fill',
    starter: py`
      def flood_fill(image, sr, sc, color):
          # TODO
          return image
    `,
    tests: [
      { args: [[[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2], expect: [[2, 2, 2], [2, 2, 0], [2, 0, 1]] },
      { args: [[[0, 0, 0], [0, 0, 0]], 0, 0, 0], expect: [[0, 0, 0], [0, 0, 0]] },
      { args: [[[0, 0, 0], [0, 1, 1]], 1, 1, 1], expect: [[0, 0, 0], [0, 1, 1]] },
      { args: [[[1]], 0, 0, 5], expect: [[5]] },
    ],
    views: [{ type: 'grid', var: 'image', pointer: ['r', 'c'] }],
    hints: ['Remember the original colour. DFS from the start, painting cells that have the original colour.', 'Careful: if the new colour equals the original colour, return immediately — otherwise you loop forever.'],
    solution: py`
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
    `,
    explain: '<p>The paint bucket in every drawing app. Changing the colour <i>is</i> the "visited" mark.</p>',
  },
  'g-valid-path': {
    title: 'Find if a path exists',
    level: 'Easy',
    pattern: 'Build adjacency list + BFS/DFS',
    leetcode: '1971. Find if Path Exists in Graph',
    prompt: '<p>There are <code>n</code> nodes <code>0..n-1</code> and undirected <code>edges</code>. Return whether there is a path from <code>source</code> to <code>destination</code>.</p>',
    fn: 'valid_path',
    starter: py`
      def valid_path(n, edges, source, destination):
          # TODO: 1. build the adjacency list  2. BFS or DFS from source
          return False
    `,
    tests: [
      { args: [3, [[0, 1], [1, 2], [2, 0]], 0, 2], expect: true },
      { args: [6, [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]], 0, 5], expect: false },
      { args: [1, [], 0, 0], expect: true },
      { args: [4, [[0, 1], [2, 3]], 1, 3], expect: false },
    ],
    hints: ['<code>graph = {i: [] for i in range(n)}</code>; for each edge (a, b) append both ways.', 'BFS from source with a visited set; return True when you reach destination.'],
    solution: py`
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
    `,
    explain: '<p>Edge list → adjacency list is step 1 of most graph problems. O(V + E).</p>',
  },
  'g-provinces': {
    title: 'Number of provinces',
    level: 'Medium',
    pattern: 'Count connected components',
    leetcode: '547. Number of Provinces',
    prompt: '<p><code>is_connected[i][j] == 1</code> means city i and city j are directly connected. A province is a group of connected cities. Count the provinces.</p>',
    fn: 'find_circle_num',
    starter: py`
      def find_circle_num(is_connected):
          # TODO
          return 0
    `,
    tests: [
      { args: [[[1, 1, 0], [1, 1, 0], [0, 0, 1]]], expect: 2 },
      { args: [[[1, 0, 0], [0, 1, 0], [0, 0, 1]]], expect: 3 },
      { args: [[[1]]], expect: 1 },
      { args: [[[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 1], [1, 0, 1, 1]]], expect: 1 },
    ],
    hints: ['This graph is given as an adjacency <b>matrix</b>: the neighbours of i are the j with <code>is_connected[i][j] == 1</code>.', 'Same as islands: for each city not yet visited, count +1 and DFS through its whole group.'],
    solution: py`
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
    `,
    explain: '<p>O(n²) because of the matrix. Union-find solves it too (try it after problem 10!).</p>',
  },
  'g-course': {
    title: 'Course schedule (can you finish?)',
    level: 'Medium',
    pattern: 'Topological sort / cycle detection',
    leetcode: '207. Course Schedule',
    prompt: '<p>There are <code>n</code> courses. <code>[a, b]</code> in <code>prereqs</code> means you must take b before a. Return whether you can finish all courses (i.e. there is no cycle).</p>',
    fn: 'can_finish',
    starter: py`
      from collections import deque

      def can_finish(n, prereqs):
          # TODO
          return False
    `,
    tests: [
      { args: [2, [[1, 0]]], expect: true },
      { args: [2, [[1, 0], [0, 1]]], expect: false },
      { args: [3, []], expect: true },
      { args: [4, [[1, 0], [2, 1], [3, 2], [1, 3]]], expect: false },
      { args: [5, [[1, 0], [2, 0], [3, 1], [4, 3]]], expect: true },
    ],
    views: [{ type: 'array', var: 'indegree' }, { type: 'queue', var: 'queue' }],
    hints: ['Watch the topological sort visualizer: count how many courses each course waits for (indegree).', 'Start with all courses with indegree 0. Taking a course lowers the indegree of the courses after it.', 'If you could take all n courses, there was no cycle.'],
    solution: py`
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
    `,
    explain: '<p>Kahn\'s algorithm, O(V + E). Courses in a cycle never reach indegree 0, so they are never taken.</p>',
  },
  'g-order': {
    title: 'Course schedule II (the order)',
    level: 'Medium',
    pattern: 'Topological sort',
    leetcode: '210. Course Schedule II',
    prompt: '<p>Same input. Return an order to take all courses, or <code>[]</code> if impossible. If several orders are valid, any is accepted.</p>',
    fn: 'find_order',
    starter: py`
      from collections import deque

      def find_order(n, prereqs):
          # TODO
          return []
    `,
    tests: [
      { args: [2, [[1, 0]]], expect: [0, 1] },
      { args: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], expect: [0, 1, 2, 3], anyOf: [[0, 1, 2, 3], [0, 2, 1, 3]] },
      { args: [1, []], expect: [0] },
      { args: [2, [[0, 1], [1, 0]]], expect: [] },
    ],
    hints: ['The previous solution, but append each taken course to an <code>order</code> list.'],
    solution: py`
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
    `,
    explain: '<p>Topological order is used by build systems, package managers (pub!) and spreadsheet formulas: do things only after what they depend on.</p>',
  },
  'g-oranges': {
    title: 'Rotting oranges',
    level: 'Medium',
    pattern: 'Multi-source BFS',
    leetcode: '994. Rotting Oranges',
    prompt: '<p>0 = empty, 1 = fresh orange, 2 = rotten. Every minute, fresh oranges next to a rotten one (4 directions) become rotten. Return the minutes until no fresh orange is left, or −1 if that never happens.</p>',
    fn: 'oranges_rotting',
    starter: py`
      from collections import deque

      def oranges_rotting(grid):
          # TODO
          return -1
    `,
    tests: [
      { args: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expect: 4 },
      { args: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expect: -1 },
      { args: [[[0, 2]]], expect: 0 },
      { args: [[[0]]], expect: 0 },
      { args: [[[1]]], expect: -1 },
    ],
    views: [{ type: 'grid', var: 'grid', classMap: { 2: 'bad', 1: 'land' } }, { type: 'queue', var: 'queue' }],
    hints: ['Put <b>all</b> rotten oranges in the queue at the start (multi-source BFS) and count the fresh ones.', 'Process the queue level by level; each level is one minute. Rot fresh neighbours and add them to the queue.', 'At the end: fresh left → −1, else the number of minutes.'],
    solution: py`
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
    `,
    explain: '<p>BFS levels = time steps. Starting BFS from many places at once is just "put them all in the queue first".</p>',
  },
  'g-binary-maze': {
    title: 'Shortest path in a binary matrix',
    level: 'Medium',
    pattern: 'BFS shortest path',
    leetcode: '1091. Shortest Path in Binary Matrix',
    prompt: '<p>Find the length (number of cells) of the shortest path from the top-left to the bottom-right cell through 0-cells, moving in <b>8</b> directions. Return −1 if there is none.</p>',
    fn: 'shortest_path_binary_matrix',
    starter: py`
      from collections import deque

      def shortest_path_binary_matrix(grid):
          # TODO
          return -1
    `,
    tests: [
      { args: [[[0, 1], [1, 0]]], expect: 2 },
      { args: [[[0, 0, 0], [1, 1, 0], [1, 1, 0]]], expect: 4 },
      { args: [[[1, 0, 0], [1, 1, 0], [1, 1, 0]]], expect: -1 },
      { args: [[[0]]], expect: 1 },
    ],
    hints: ['BFS gives the shortest path when every step costs the same.', 'Store <code>(r, c, length)</code> in the queue. Mark cells as visited when you <b>add</b> them to the queue (not when you pop them).'],
    solution: py`
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
    `,
    explain: '<p>The first time BFS reaches a cell, it got there by a shortest path. O(n²).</p>',
  },
  'g-network': {
    title: 'Network delay time',
    level: 'Medium',
    pattern: 'Dijkstra',
    leetcode: '743. Network Delay Time',
    prompt: '<p><code>times[i] = [u, v, w]</code>: a signal goes from node u to node v in w time (directed). Nodes are 1..n. A signal starts at node k. Return the time until <b>all</b> nodes have it, or −1.</p>',
    fn: 'network_delay_time',
    starter: py`
      import heapq

      def network_delay_time(times, n, k):
          # TODO
          return -1
    `,
    tests: [
      { args: [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2], expect: 2 },
      { args: [[[1, 2, 1]], 2, 1], expect: 1 },
      { args: [[[1, 2, 1]], 2, 2], expect: -1 },
      { args: [[[1, 2, 1], [2, 3, 2], [1, 3, 4]], 3, 1], expect: 3 },
    ],
    views: [{ type: 'array', var: 'heap' }, { type: 'dict', var: 'dist' }],
    hints: ['Build <code>graph[u] = [(v, w), …]</code>, then Dijkstra from k (see the visualizer).', 'Answer = the biggest distance, if all n nodes were reached.'],
    solution: py`
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
    `,
    explain: '<p>O((V + E) log V). Dijkstra needs non-negative weights.</p>',
  },
  'g-components': {
    title: 'Number of connected components',
    level: 'Medium',
    pattern: 'Union-find',
    leetcode: '323. Number of Connected Components in an Undirected Graph (premium)',
    prompt: '<p><code>n</code> nodes and undirected <code>edges</code>. Return the number of connected groups. Try union-find.</p>',
    fn: 'count_components',
    starter: py`
      def count_components(n, edges):
          parent = list(range(n))

          def find(x):
              # TODO
              return x

          # TODO: union every edge; count successful unions
          return n
    `,
    tests: [
      { args: [5, [[0, 1], [1, 2], [3, 4]]], expect: 2 },
      { args: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], expect: 1 },
      { args: [3, []], expect: 3 },
      { args: [4, [[0, 1], [2, 3], [1, 2]]], expect: 1 },
      { args: [4, [[0, 1], [1, 0], [2, 3]]], expect: 2 },
    ],
    views: [{ type: 'array', var: 'parent', pointers: ['x'] }],
    hints: ['Start with n groups. Every union that joins two <b>different</b> groups reduces the count by 1.', '<code>find</code> walks up <code>parent</code> until <code>parent[x] == x</code>. Bonus: path compression — <code>parent[x] = parent[parent[x]]</code> while walking.'],
    solution: py`
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
    `,
    explain: '<p>With path compression (and union by size) each operation is almost O(1). Union-find shines when edges arrive one by one.</p>',
  },
})

addQuiz({
  'g-quiz': [
    { q: 'You need the fewest number of steps between two places, and every step costs the same. Which algorithm?', options: ['DFS', 'BFS', 'Dijkstra', 'Topological sort'], answer: 1, why: 'BFS explores in rings of distance 1, 2, 3, … so the first time it reaches the target is a shortest path. With different weights, use Dijkstra.' },
    { q: 'Why does every graph traversal need a <code>visited</code> set?', options: ['To be faster in Python', 'Graphs can have cycles — without it you loop forever', 'To sort the nodes', 'It doesn\'t'], answer: 1, why: 'Trees have no cycles, so tree traversals didn\'t need one. Graphs do.' },
    { q: 'What is the time complexity of BFS/DFS on a graph with V nodes and E edges (adjacency list)?', options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V × E)'], answer: 2, why: 'Each node is visited once and each edge is looked at once (twice if undirected).' },
    { q: '"Tasks with dependencies — find a valid order" is…', options: ['Dijkstra', 'Topological sort', 'Union-find', 'Binary search'], answer: 1, why: 'Directed graph, no cycles allowed, every arrow must go forward in the order.' },
    { q: 'Edges arrive one at a time and you must keep answering "are a and b connected?". Best tool?', options: ['BFS each time', 'Union-find', 'Heap', 'Sorting'], answer: 1, why: 'Union-find answers in almost O(1) per operation.' },
    { q: 'A grid problem says "connected cells". What is the graph?', options: ['There is no graph', 'Cells are nodes; up/down/left/right neighbours are edges', 'Rows are nodes', 'Only diagonals are edges'], answer: 1, why: 'You never build it — the directions list generates the neighbours on the fly.' },
  ],
})
