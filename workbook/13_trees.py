"""
Lesson 13 · Trees & BST — workbook
The visual lesson: lessons/13-trees.html

How to use:
  1. Write your code inside each function (replace the `pass` / TODO lines).
  2. Run:  python3 workbook/13_trees.py
  3. Fix until every problem shows ✅. Use print() freely while debugging.
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Maximum depth of a binary tree  ·  Easy  ·  DFS (answers flow up)
#
# Return the number of nodes on the longest path from the root down to a leaf. (Trees are
# given in LeetCode's level-order format: [3, 9, 20, None, None, 15, 7].)
#
# LeetCode: 104. Maximum Depth of Binary Tree
# ────────────────────────────────────────────────────────────────────────────────────────
# TreeNode is ready to use: TreeNode(val, left=None, right=None) with .val .left .right
def max_depth(root):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Invert a binary tree  ·  Easy  ·  DFS
#
# Mirror the tree: swap every node's left and right children. Return the root.
#
# LeetCode: 226. Invert Binary Tree
# ────────────────────────────────────────────────────────────────────────────────────────
# TreeNode is ready to use: TreeNode(val, left=None, right=None) with .val .left .right
def invert_tree(root):
    # TODO
    return root


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Same tree  ·  Easy  ·  DFS on two trees at once
#
# Return True if the two trees have the same shape and the same values.
#
# LeetCode: 100. Same Tree
# ────────────────────────────────────────────────────────────────────────────────────────
# TreeNode is ready to use: TreeNode(val, left=None, right=None) with .val .left .right
def is_same_tree(p, q):
    # TODO
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Path sum  ·  Easy  ·  DFS (pass information down)
#
# Return True if some path from the root down to a leaf (a node with no children) adds up to
# target.
#
# LeetCode: 112. Path Sum
# ────────────────────────────────────────────────────────────────────────────────────────
# TreeNode is ready to use: TreeNode(val, left=None, right=None) with .val .left .right
def has_path_sum(root, target):
    # TODO
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Level order traversal  ·  Medium  ·  BFS
#
# Return the values level by level, left to right: [[3], [9, 20], [15, 7]].
#
# LeetCode: 102. Binary Tree Level Order Traversal
# ────────────────────────────────────────────────────────────────────────────────────────
# TreeNode is ready to use: TreeNode(val, left=None, right=None) with .val .left .right
from collections import deque

def level_order(root):
    # TODO
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Right side view  ·  Medium  ·  BFS (last of each level)
#
# Return the values you would see standing on the right side of the tree, top to bottom (the
# last node of each level).
#
# LeetCode: 199. Binary Tree Right Side View
# ────────────────────────────────────────────────────────────────────────────────────────
# TreeNode is ready to use: TreeNode(val, left=None, right=None) with .val .left .right
def right_side_view(root):
    # TODO
    return []


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Validate a binary search tree  ·  Medium  ·  DFS with bounds
#
# Return True if the tree is a valid BST: for every node, all values in its left subtree are
# smaller and all values in its right subtree are bigger (no duplicates).
#
# LeetCode: 98. Validate Binary Search Tree
# ────────────────────────────────────────────────────────────────────────────────────────
# TreeNode is ready to use: TreeNode(val, left=None, right=None) with .val .left .right
def is_valid_bst(root):
    # TODO
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. K-th smallest in a BST  ·  Medium  ·  In-order traversal
#
# Return the k-th smallest value (1-indexed) in the BST.
#
# LeetCode: 230. Kth Smallest Element in a BST
# ────────────────────────────────────────────────────────────────────────────────────────
# TreeNode is ready to use: TreeNode(val, left=None, right=None) with .val .left .right
def kth_smallest(root, k):
    # TODO
    return 0


# ────────────────────────────────────────────────────────────────────────────────────────
# 9. Lowest common ancestor in a BST  ·  Medium  ·  BST walk
#
# Given a BST and two values p and q that are in it, return the lowest node that has both in
# its subtree (a node counts as its own descendant). Return the node; the test shows its
# value.
#
# LeetCode: 235. Lowest Common Ancestor of a Binary Search Tree
# ────────────────────────────────────────────────────────────────────────────────────────
# TreeNode is ready to use: TreeNode(val, left=None, right=None) with .val .left .right
def lowest_common_ancestor(root, p, q):
    # TODO
    return root


# ────────────────────────────────────────────────────────────────────────────────────────
# 10. Diameter of a binary tree  ·  Easy  ·  DFS returning height + global best
#
# Return the number of edges on the longest path between any two nodes (it doesn't have to
# pass through the root).
#
# LeetCode: 543. Diameter of Binary Tree
# ────────────────────────────────────────────────────────────────────────────────────────
# TreeNode is ready to use: TreeNode(val, left=None, right=None) with .val .left .right
def diameter_of_binary_tree(root):
    # TODO
    return 0


if __name__ == "__main__":
    check(max_depth, [
        {"args": [[3, 9, 20, None, None, 15, 7]], "expect": 3},
        {"args": [[1, None, 2]], "expect": 2},
        {"args": [[]], "expect": 0},
        {"args": [[1]], "expect": 1},
    ], convert={"args": ["tree"]})
    check(invert_tree, [
        {"args": [[4, 2, 7, 1, 3, 6, 9]], "expect": [4, 7, 2, 9, 6, 3, 1]},
        {"args": [[2, 1, 3]], "expect": [2, 3, 1]},
        {"args": [[]], "expect": []},
        {"args": [[1, 2]], "expect": [1, None, 2]},
    ], convert={"args": ["tree"], "ret": "tree"})
    check(is_same_tree, [
        {"args": [[1, 2, 3], [1, 2, 3]], "expect": True},
        {"args": [[1, 2], [1, None, 2]], "expect": False},
        {"args": [[1, 2, 1], [1, 1, 2]], "expect": False},
        {"args": [[], []], "expect": True},
    ], convert={"args": ["tree", "tree"]})
    check(has_path_sum, [
        {"args": [[5, 4, 8, 11, None, 13, 4, 7, 2, None, None, None, 1], 22], "expect": True},
        {"args": [[1, 2, 3], 5], "expect": False},
        {"args": [[], 0], "expect": False},
        {"args": [[1, 2], 1], "expect": False},
        {"args": [[-2, None, -3], -5], "expect": True},
    ], convert={"args": ["tree", None]})
    check(level_order, [
        {"args": [[3, 9, 20, None, None, 15, 7]], "expect": [[3], [9, 20], [15, 7]]},
        {"args": [[1]], "expect": [[1]]},
        {"args": [[]], "expect": []},
        {"args": [[1, 2, 3, 4, None, None, 5]], "expect": [[1], [2, 3], [4, 5]]},
    ], convert={"args": ["tree"]})
    check(right_side_view, [
        {"args": [[1, 2, 3, None, 5, None, 4]], "expect": [1, 3, 4]},
        {"args": [[1, None, 3]], "expect": [1, 3]},
        {"args": [[]], "expect": []},
        {"args": [[1, 2]], "expect": [1, 2]},
    ], convert={"args": ["tree"]})
    check(is_valid_bst, [
        {"args": [[2, 1, 3]], "expect": True},
        {"args": [[5, 1, 4, None, None, 3, 6]], "expect": False},
        {"args": [[5, 4, 6, None, None, 3, 7]], "expect": False},
        {"args": [[1]], "expect": True},
        {"args": [[2, 2, 2]], "expect": False},
    ], convert={"args": ["tree"]})
    check(kth_smallest, [
        {"args": [[3, 1, 4, None, 2], 1], "expect": 1},
        {"args": [[5, 3, 6, 2, 4, None, None, 1], 3], "expect": 3},
        {"args": [[1], 1], "expect": 1},
        {"args": [[5, 3, 6, 2, 4, None, None, 1], 6], "expect": 6},
    ], convert={"args": ["tree", None]})
    check(lowest_common_ancestor, [
        {"args": [[6, 2, 8, 0, 4, 7, 9, None, None, 3, 5], 2, 8], "expect": 6},
        {"args": [[6, 2, 8, 0, 4, 7, 9, None, None, 3, 5], 2, 4], "expect": 2},
        {"args": [[6, 2, 8, 0, 4, 7, 9, None, None, 3, 5], 3, 5], "expect": 4},
        {"args": [[2, 1], 2, 1], "expect": 2},
    ], convert={"args": ["tree", None, None], "ret": "node"})
    check(diameter_of_binary_tree, [
        {"args": [[1, 2, 3, 4, 5]], "expect": 3},
        {"args": [[1, 2]], "expect": 1},
        {"args": [[1]], "expect": 0},
        {"args": [[4, 2, None, 1, 3]], "expect": 2},
        {"args": [[1, 2, None, 3, 4, 5, None, None, 6]], "expect": 4},
    ], convert={"args": ["tree"]})
