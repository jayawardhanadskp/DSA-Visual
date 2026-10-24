// Lesson 13 — Trees & BST
const L13_NODE = py`
  class TreeNode:
      def __init__(self, val, left=None, right=None):
          self.val = val
          self.left = left
          self.right = right
`
const L13_TREE = py`
  root = TreeNode(8,
                  TreeNode(3, TreeNode(1), TreeNode(6, TreeNode(4), TreeNode(7))),
                  TreeNode(10, None, TreeNode(14)))
`
const L13_NOTE = '# TreeNode is ready to use: TreeNode(val, left=None, right=None) with .val .left .right\n'
const l13Val = (s) => {
  const r = s.rawTop('node')
  return r && r.ref !== undefined ? s.field(r, 'val') : 'None'
}

addViz({
  'tree-inorder': {
    title: 'Depth-first: in-order traversal (left, node, right)',
    code: L13_NODE + '\n\n' + py`
      def inorder(node, out):
          if node is None:
              return                        # empty subtree → nothing to do
          inorder(node.left, out)           #: at {node.val}: first visit the whole LEFT subtree
          out.append(node.val)              #: left side of {node.val} is done → now visit {node.val} itself
          inorder(node.right, out)          #: then the whole RIGHT subtree of {node.val}

    ` + '\n\n' + L13_TREE + '\n' + py`
      result = []
      inorder(root, result)
      print(result)                         # a BST in-order comes out SORTED
    `,
    views: [{ type: 'tree', var: 'root', pointers: ['node'], visited: (s) => s.v('out') || s.v('result') }, { type: 'array', var: 'result', label: 'result (visit order)' }],
    hideGlobals: true,
  },
  'tree-depth': {
    title: 'Answers flow up: maximum depth',
    code: L13_NODE + '\n\n' + py`
      def max_depth(node):
          if node is None:
              return 0                       # an empty tree has depth 0
          left = max_depth(node.left)        #: ask the left subtree of {node.val} for its depth
          right = max_depth(node.right)      #: ask the right subtree of {node.val}
          return 1 + max(left, right)        #: depth at {node.val} = 1 + max({left}, {right}) = {1 + max(left, right)}

    ` + '\n\n' + L13_TREE + '\n' + py`
      print(max_depth(root))
    `,
    views: [
      { type: 'tree', var: 'root', pointers: ['node'] },
      { type: 'calltree', fn: 'max_depth', label: (s) => 'd(' + l13Val(s) + ')' },
    ],
    hideGlobals: true,
    wide: true,
  },
  'tree-bfs': {
    title: 'Breadth-first: level by level with a queue',
    code: L13_NODE + '\n\n' + py`
      from collections import deque

      def level_order(root):
          levels = []
          queue = deque([root])
          while queue:
              level = []
              for _ in range(len(queue)):     #: this level has {len(queue)} node(s) waiting in the queue
                  node = queue.popleft()        #: take {queue[0].val} from the front
                  level.append(node.val)
                  if node.left:
                      queue.append(node.left)   #: its left child {node.left.val} joins the back of the queue
                  if node.right:
                      queue.append(node.right)  #: its right child {node.right.val} joins the back of the queue
              levels.append(level)              #: level finished: {level}
          return levels

    ` + '\n\n' + L13_TREE + '\n' + py`
      print(level_order(root))
    `,
    views: [
      { type: 'tree', var: 'root', pointers: ['node'], visited: (s) => [...(s.v('levels') || []).flat(), ...(s.v('level') || [])] },
      { type: 'queue', var: 'queue' },
      { type: 'array', var: 'level', label: 'current level' },
    ],
    hideGlobals: true,
  },
  'tree-bst-insert': {
    title: 'Binary search tree: insert by going left or right',
    code: L13_NODE + '\n\n' + py`
      def insert(node, val):
          if node is None:
              return TreeNode(val)              #: found an empty spot → a new node {val} goes here
          if val < node.val:                    #: {val} < {node.val}? {'yes → go LEFT' if val < node.val else 'no → go RIGHT'}
              node.left = insert(node.left, val)
          else:
              node.right = insert(node.right, val)
          return node

      root = None
      for v in [8, 3, 10, 1, 6, 14, 4]:
          root = insert(root, v)                #: insert {v}
    `,
    views: [{ type: 'tree', var: 'root', pointers: ['node'] }],
    hideGlobals: false,
  },
})

addProblems({
  'tr-depth': {
    title: 'Maximum depth of a binary tree',
    level: 'Easy',
    pattern: 'DFS (answers flow up)',
    leetcode: '104. Maximum Depth of Binary Tree',
    prompt: '<p>Return the number of nodes on the longest path from the root down to a leaf. (Trees are given in LeetCode\'s level-order format: <code>[3, 9, 20, None, None, 15, 7]</code>.)</p>',
    fn: 'max_depth',
    convert: { args: ['tree'] },
    starter: L13_NOTE + py`
      def max_depth(root):
          # TODO
          return 0
    `,
    tests: [
      { args: [[3, 9, 20, null, null, 15, 7]], expect: 3 },
      { args: [[1, null, 2]], expect: 2 },
      { args: [[]], expect: 0 },
      { args: [[1]], expect: 1 },
    ],
    views: [{ type: 'tree', var: 'root', pointers: ['root'] }],
    hints: ['Base case: an empty tree (<code>root is None</code>) has depth 0.', '<code>1 + max(max_depth(root.left), max_depth(root.right))</code>'],
    solution: py`
      def max_depth(root):
          if root is None:
              return 0
          return 1 + max(max_depth(root.left), max_depth(root.right))
    `,
    explain: '<p>O(n) — every node is visited once. Space O(h) for the call stack, where h is the height.</p>',
  },
  'tr-invert': {
    title: 'Invert a binary tree',
    level: 'Easy',
    pattern: 'DFS',
    leetcode: '226. Invert Binary Tree',
    prompt: '<p>Mirror the tree: swap every node\'s left and right children. Return the root.</p>',
    fn: 'invert_tree',
    convert: { args: ['tree'], ret: 'tree' },
    starter: L13_NOTE + py`
      def invert_tree(root):
          # TODO
          return root
    `,
    tests: [
      { args: [[4, 2, 7, 1, 3, 6, 9]], expect: [4, 7, 2, 9, 6, 3, 1] },
      { args: [[2, 1, 3]], expect: [2, 3, 1] },
      { args: [[]], expect: [] },
      { args: [[1, 2]], expect: [1, null, 2] },
    ],
    views: [{ type: 'tree', var: 'root', pointers: ['root'] }],
    hints: ['Swap the two children, then invert each subtree (or invert first, then swap — both work).'],
    solution: py`
      def invert_tree(root):
          if root is None:
              return None
          root.left, root.right = invert_tree(root.right), invert_tree(root.left)
          return root
    `,
    explain: '<p>Famous because a well-known engineer once failed it in an interview. With the 3 recursion questions it is 4 lines.</p>',
  },
  'tr-same': {
    title: 'Same tree',
    level: 'Easy',
    pattern: 'DFS on two trees at once',
    leetcode: '100. Same Tree',
    prompt: '<p>Return <code>True</code> if the two trees have the same shape and the same values.</p>',
    fn: 'is_same_tree',
    convert: { args: ['tree', 'tree'] },
    starter: L13_NOTE + py`
      def is_same_tree(p, q):
          # TODO
          return False
    `,
    tests: [
      { args: [[1, 2, 3], [1, 2, 3]], expect: true },
      { args: [[1, 2], [1, null, 2]], expect: false },
      { args: [[1, 2, 1], [1, 1, 2]], expect: false },
      { args: [[], []], expect: true },
    ],
    hints: ['Both None → True. Only one None → False. Different values → False.', 'Otherwise both left subtrees must be the same AND both right subtrees.'],
    solution: py`
      def is_same_tree(p, q):
          if p is None and q is None:
              return True
          if p is None or q is None or p.val != q.val:
              return False
          return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)
    `,
    explain: '<p>Walking two trees together is a useful shape: symmetric tree (LC 101) and subtree of another tree (LC 572) are the same idea.</p>',
  },
  'tr-path-sum': {
    title: 'Path sum',
    level: 'Easy',
    pattern: 'DFS (pass information down)',
    leetcode: '112. Path Sum',
    prompt: '<p>Return <code>True</code> if some path from the root down to a <b>leaf</b> (a node with no children) adds up to <code>target</code>.</p>',
    fn: 'has_path_sum',
    convert: { args: ['tree', null] },
    starter: L13_NOTE + py`
      def has_path_sum(root, target):
          # TODO
          return False
    `,
    tests: [
      { args: [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], 22], expect: true },
      { args: [[1, 2, 3], 5], expect: false },
      { args: [[], 0], expect: false },
      { args: [[1, 2], 1], expect: false },
      { args: [[-2, null, -3], -5], expect: true },
    ],
    views: [{ type: 'tree', var: 'root', pointers: ['root'] }],
    hints: ['Pass the <b>remaining</b> target down: at a node, the children need <code>target - root.val</code>.', 'At a leaf, check whether the remaining target equals the leaf\'s value.'],
    solution: py`
      def has_path_sum(root, target):
          if root is None:
              return False
          remaining = target - root.val
          if root.left is None and root.right is None:
              return remaining == 0
          return has_path_sum(root.left, remaining) or has_path_sum(root.right, remaining)
    `,
    explain: '<p>Information can flow <b>down</b> (as arguments: the remaining sum) or <b>up</b> (as return values: the depth). Decide which one you need.</p>',
  },
  'tr-levels': {
    title: 'Level order traversal',
    level: 'Medium',
    pattern: 'BFS',
    leetcode: '102. Binary Tree Level Order Traversal',
    prompt: '<p>Return the values level by level, left to right: <code>[[3], [9, 20], [15, 7]]</code>.</p>',
    fn: 'level_order',
    convert: { args: ['tree'] },
    starter: L13_NOTE + py`
      from collections import deque

      def level_order(root):
          # TODO
          return []
    `,
    tests: [
      { args: [[3, 9, 20, null, null, 15, 7]], expect: [[3], [9, 20], [15, 7]] },
      { args: [[1]], expect: [[1]] },
      { args: [[]], expect: [] },
      { args: [[1, 2, 3, 4, null, null, 5]], expect: [[1], [2, 3], [4, 5]] },
    ],
    views: [{ type: 'tree', var: 'root', pointers: ['node'] }, { type: 'queue', var: 'queue' }],
    hints: ['Empty tree → <code>[]</code>.', 'Queue starts with the root. While the queue isn\'t empty: the current level is exactly <code>len(queue)</code> nodes — pop that many, adding their children.'],
    solution: py`
      from collections import deque

      def level_order(root):
          if root is None:
              return []
          levels = []
          queue = deque([root])
          while queue:
              level = []
              for _ in range(len(queue)):
                  node = queue.popleft()
                  level.append(node.val)
                  if node.left:
                      queue.append(node.left)
                  if node.right:
                      queue.append(node.right)
              levels.append(level)
          return levels
    `,
    explain: '<p>The <code>for _ in range(len(queue))</code> trick separates the levels. BFS on graphs (lesson 15) is the same code.</p>',
  },
  'tr-right-view': {
    title: 'Right side view',
    level: 'Medium',
    pattern: 'BFS (last of each level)',
    leetcode: '199. Binary Tree Right Side View',
    prompt: '<p>Return the values you would see standing on the right side of the tree, top to bottom (the last node of each level).</p>',
    fn: 'right_side_view',
    convert: { args: ['tree'] },
    starter: L13_NOTE + py`
      def right_side_view(root):
          # TODO
          return []
    `,
    tests: [
      { args: [[1, 2, 3, null, 5, null, 4]], expect: [1, 3, 4] },
      { args: [[1, null, 3]], expect: [1, 3] },
      { args: [[]], expect: [] },
      { args: [[1, 2]], expect: [1, 2] },
    ],
    hints: ['Do level order, and keep only the last value of each level.', 'Careful: the rightmost node of a level can be in the LEFT subtree (test 4).'],
    solution: py`
      from collections import deque

      def right_side_view(root):
          if root is None:
              return []
          view = []
          queue = deque([root])
          while queue:
              for i in range(len(queue)):
                  node = queue.popleft()
                  if node.left:
                      queue.append(node.left)
                  if node.right:
                      queue.append(node.right)
              view.append(node.val)          # the last node popped in this level
          return view
    `,
    explain: '<p>A small change to a template you know. Most tree "medium" problems are a known traversal plus one twist.</p>',
  },
  'tr-valid-bst': {
    title: 'Validate a binary search tree',
    level: 'Medium',
    pattern: 'DFS with bounds',
    leetcode: '98. Validate Binary Search Tree',
    prompt: '<p>Return <code>True</code> if the tree is a valid BST: for every node, <b>all</b> values in its left subtree are smaller and <b>all</b> values in its right subtree are bigger (no duplicates).</p>',
    fn: 'is_valid_bst',
    convert: { args: ['tree'] },
    starter: L13_NOTE + py`
      def is_valid_bst(root):
          # TODO
          return False
    `,
    tests: [
      { args: [[2, 1, 3]], expect: true },
      { args: [[5, 1, 4, null, null, 3, 6]], expect: false },
      { args: [[5, 4, 6, null, null, 3, 7]], expect: false },
      { args: [[1]], expect: true },
      { args: [[2, 2, 2]], expect: false },
    ],
    hints: ['Checking only "left child &lt; node &lt; right child" is not enough — test 3 has a 3 in the right subtree of 5.', 'Pass down the allowed range: <code>check(node, low, high)</code>. Going left, <code>high</code> becomes node.val; going right, <code>low</code> becomes node.val. Start with <code>-inf, inf</code>.'],
    solution: py`
      def is_valid_bst(root):
          def check(node, low, high):
              if node is None:
                  return True
              if not (low < node.val < high):
                  return False
              return check(node.left, low, node.val) and check(node.right, node.val, high)
          return check(root, float("-inf"), float("inf"))
    `,
    explain: '<p>Alternative: an in-order traversal of a BST must be strictly increasing.</p>',
  },
  'tr-kth': {
    title: 'K-th smallest in a BST',
    level: 'Medium',
    pattern: 'In-order traversal',
    leetcode: '230. Kth Smallest Element in a BST',
    prompt: '<p>Return the <code>k</code>-th smallest value (1-indexed) in the BST.</p>',
    fn: 'kth_smallest',
    convert: { args: ['tree', null] },
    starter: L13_NOTE + py`
      def kth_smallest(root, k):
          # TODO
          return 0
    `,
    tests: [
      { args: [[3, 1, 4, null, 2], 1], expect: 1 },
      { args: [[5, 3, 6, 2, 4, null, null, 1], 3], expect: 3 },
      { args: [[1], 1], expect: 1 },
      { args: [[5, 3, 6, 2, 4, null, null, 1], 6], expect: 6 },
    ],
    hints: ['In-order traversal of a BST gives sorted values.', 'Simple: collect the in-order list and return <code>values[k - 1]</code>. Better: stop as soon as you have visited k nodes.'],
    solution: py`
      def kth_smallest(root, k):
          stack = []
          node = root
          while True:
              while node:                 # go as far left as possible
                  stack.append(node)
                  node = node.left
              node = stack.pop()          # the next smallest
              k -= 1
              if k == 0:
                  return node.val
              node = node.right
    `,
    explain: '<p>This is in-order traversal with an explicit stack instead of recursion — it stops after k nodes: O(h + k).</p>',
  },
  'tr-lca': {
    title: 'Lowest common ancestor in a BST',
    level: 'Medium',
    pattern: 'BST walk',
    leetcode: '235. Lowest Common Ancestor of a Binary Search Tree',
    prompt: '<p>Given a BST and two values <code>p</code> and <code>q</code> that are in it, return the lowest node that has both in its subtree (a node counts as its own descendant). Return the node; the test shows its value.</p>',
    fn: 'lowest_common_ancestor',
    convert: { args: ['tree', null, null], ret: 'node' },
    starter: L13_NOTE + py`
      def lowest_common_ancestor(root, p, q):
          # TODO
          return root
    `,
    tests: [
      { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8], expect: 6 },
      { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4], expect: 2 },
      { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 3, 5], expect: 4 },
      { args: [[2, 1], 2, 1], expect: 2 },
    ],
    views: [{ type: 'tree', var: 'root', pointers: ['node'] }],
    hints: ['If both values are smaller than the node, the answer is in the left subtree. Both bigger → right.', 'Otherwise they split here (or one of them is this node) → this node is the answer.'],
    solution: py`
      def lowest_common_ancestor(root, p, q):
          node = root
          while node:
              if p < node.val and q < node.val:
                  node = node.left
              elif p > node.val and q > node.val:
                  node = node.right
              else:
                  return node
    `,
    explain: '<p>O(h). The BST ordering tells you which way to go, just like binary search.</p>',
  },
  'tr-diameter': {
    title: 'Diameter of a binary tree',
    level: 'Easy',
    pattern: 'DFS returning height + global best',
    leetcode: '543. Diameter of Binary Tree',
    prompt: '<p>Return the number of <b>edges</b> on the longest path between any two nodes (it doesn\'t have to pass through the root).</p>',
    fn: 'diameter_of_binary_tree',
    convert: { args: ['tree'] },
    starter: L13_NOTE + py`
      def diameter_of_binary_tree(root):
          # TODO
          return 0
    `,
    tests: [
      { args: [[1, 2, 3, 4, 5]], expect: 3 },
      { args: [[1, 2]], expect: 1 },
      { args: [[1]], expect: 0 },
      { args: [[4, 2, null, 1, 3]], expect: 2 },
      { args: [[1, 2, null, 3, 4, 5, null, null, 6]], expect: 4 },
    ],
    hints: ['The longest path through a node = (height of left subtree) + (height of right subtree).', 'Write <code>height(node)</code> that returns the height, and while computing it, update a <code>best</code> variable (use <code>nonlocal</code>).'],
    solution: py`
      def diameter_of_binary_tree(root):
          best = 0

          def height(node):
              nonlocal best
              if node is None:
                  return 0
              left = height(node.left)
              right = height(node.right)
              best = max(best, left + right)
              return 1 + max(left, right)

          height(root)
          return best
    `,
    explain: '<p>A very common shape: the recursive function <b>returns</b> one thing (height) but also <b>updates</b> a global answer (diameter). O(n).</p>',
  },
})

addQuiz({
  'tr-quiz': [
    { q: 'Which traversal of a BST gives the values in sorted order?', options: ['Pre-order', 'In-order', 'Post-order', 'Level order'], answer: 1, why: 'Left subtree (smaller), node, right subtree (bigger).' },
    { q: 'You need "the shortest number of steps", or "level by level". Which traversal?', options: ['DFS (recursion)', 'BFS (queue)', 'In-order', 'Binary search'], answer: 1, why: 'BFS visits nodes in order of distance from the root.' },
    { q: 'Search in a balanced BST costs…', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1, why: 'Each step goes one level down, and a balanced tree has about log₂ n levels. A badly unbalanced BST (like a line) is O(n).' },
    { q: 'What is the space complexity of recursive DFS on a tree of height h?', options: ['O(1)', 'O(h)', 'O(n²)', 'O(log h)'], answer: 1, why: 'The call stack holds one call per level on the current path.' },
    { q: 'For "max depth", information flows… ', options: ['down, as arguments', 'up, as return values', 'sideways, through a queue', 'nowhere'], answer: 1, why: 'Each node returns its depth to its parent. "Path sum" passes the remaining sum down instead.' },
  ],
})
