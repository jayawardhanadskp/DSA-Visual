"""
Lesson 09 · Linked lists — workbook
The visual lesson: lessons/09-linked-lists.html

How to use:
  1. Write your code inside each function (replace the `pass` / TODO lines).
  2. Run:  python3 workbook/09_linked_lists.py
  3. Fix until every problem shows ✅. Use print() freely while debugging.
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Reverse a linked list  ·  Easy  ·  prev / curr / nxt
#
# Reverse the list and return the new head. (Tests show lists as Python lists: [1, 2, 3] means
# 1 → 2 → 3.)
#
# LeetCode: 206. Reverse Linked List
# ────────────────────────────────────────────────────────────────────────────────────────
# ListNode is ready to use: ListNode(val, next=None) with .val and .next
def reverse_list(head):
    # TODO
    return head


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Middle of the linked list  ·  Easy  ·  Fast & slow
#
# Return the middle node. If there are two middles, return the second one. (The test shows the
# list from the node you return to the end.)
#
# LeetCode: 876. Middle of the Linked List
# ────────────────────────────────────────────────────────────────────────────────────────
# ListNode is ready to use: ListNode(val, next=None) with .val and .next
def middle_node(head):
    # TODO: slow moves 1, fast moves 2
    return head


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Merge two sorted lists  ·  Easy  ·  Dummy node
#
# Merge two sorted linked lists into one sorted list by re-linking the nodes. Return its head.
#
# LeetCode: 21. Merge Two Sorted Lists
# ────────────────────────────────────────────────────────────────────────────────────────
# ListNode is ready to use: ListNode(val, next=None) with .val and .next
def merge_two_lists(a, b):
    dummy = ListNode(0)
    tail = dummy
    # TODO
    return dummy.next


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Linked list cycle  ·  Easy  ·  Fast & slow
#
# Return True if the list has a cycle (some node's next points back to an earlier node). The
# test input [[3, 2, 0, -4], 1] means values 3 → 2 → 0 → −4 and the last node points back to
# index 1 (−1 = no cycle). Use O(1) memory.
#
# LeetCode: 141. Linked List Cycle
# ────────────────────────────────────────────────────────────────────────────────────────
# ListNode is ready to use: ListNode(val, next=None) with .val and .next
def has_cycle(head):
    # TODO
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Remove the n-th node from the end  ·  Medium  ·  Two pointers with a gap
#
# Remove the n-th node from the end and return the head. Try one pass.
#
# LeetCode: 19. Remove Nth Node From End of List
# ────────────────────────────────────────────────────────────────────────────────────────
# ListNode is ready to use: ListNode(val, next=None) with .val and .next
def remove_nth_from_end(head, n):
    # TODO
    return head


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Palindrome linked list  ·  Easy  ·  Middle + reverse
#
# Return True if the values read the same forwards and backwards. Bonus: O(1) extra space.
#
# LeetCode: 234. Palindrome Linked List
# ────────────────────────────────────────────────────────────────────────────────────────
# ListNode is ready to use: ListNode(val, next=None) with .val and .next
def is_palindrome_list(head):
    # TODO
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Remove duplicates from a sorted list  ·  Easy  ·  Skip nodes
#
# The list is sorted. Remove duplicates so each value appears once. Return the head.
#
# LeetCode: 83. Remove Duplicates from Sorted List
# ────────────────────────────────────────────────────────────────────────────────────────
# ListNode is ready to use: ListNode(val, next=None) with .val and .next
def delete_duplicates(head):
    # TODO
    return head


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. Add two numbers  ·  Medium  ·  Dummy node + carry
#
# Two numbers are stored as linked lists of digits in reverse order ([2, 4, 3] is 342). Return
# their sum as a list in the same format.
#
# LeetCode: 2. Add Two Numbers
# ────────────────────────────────────────────────────────────────────────────────────────
# ListNode is ready to use: ListNode(val, next=None) with .val and .next
def add_two_numbers(a, b):
    # TODO
    return None


if __name__ == "__main__":
    check(reverse_list, [
        {"args": [[1, 2, 3, 4, 5]], "expect": [5, 4, 3, 2, 1]},
        {"args": [[1, 2]], "expect": [2, 1]},
        {"args": [[]], "expect": []},
        {"args": [[7]], "expect": [7]},
    ], convert={"args": ["linked"], "ret": "linked"})
    check(middle_node, [
        {"args": [[1, 2, 3, 4, 5]], "expect": [3, 4, 5]},
        {"args": [[1, 2, 3, 4, 5, 6]], "expect": [4, 5, 6]},
        {"args": [[1]], "expect": [1]},
        {"args": [[1, 2]], "expect": [2]},
    ], convert={"args": ["linked"], "ret": "linked"})
    check(merge_two_lists, [
        {"args": [[1, 2, 4], [1, 3, 4]], "expect": [1, 1, 2, 3, 4, 4]},
        {"args": [[], []], "expect": []},
        {"args": [[], [0]], "expect": [0]},
        {"args": [[5], [1, 2, 3]], "expect": [1, 2, 3, 5]},
    ], convert={"args": ["linked", "linked"], "ret": "linked"})
    check(has_cycle, [
        {"args": [[[3, 2, 0, -4], 1]], "expect": True},
        {"args": [[[1, 2], 0]], "expect": True},
        {"args": [[[1], -1]], "expect": False},
        {"args": [[[1, 2, 3, 4, 5], -1]], "expect": False},
        {"args": [[[], -1]], "expect": False},
        {"args": [[[1], 0]], "expect": True},
    ], convert={"args": ["cycle"]})
    check(remove_nth_from_end, [
        {"args": [[1, 2, 3, 4, 5], 2], "expect": [1, 2, 3, 5]},
        {"args": [[1], 1], "expect": []},
        {"args": [[1, 2], 1], "expect": [1]},
        {"args": [[1, 2], 2], "expect": [2]},
    ], convert={"args": ["linked", None], "ret": "linked"})
    check(is_palindrome_list, [
        {"args": [[1, 2, 2, 1]], "expect": True},
        {"args": [[1, 2]], "expect": False},
        {"args": [[1]], "expect": True},
        {"args": [[1, 2, 3, 2, 1]], "expect": True},
        {"args": [[1, 2, 3]], "expect": False},
    ], convert={"args": ["linked"]})
    check(delete_duplicates, [
        {"args": [[1, 1, 2]], "expect": [1, 2]},
        {"args": [[1, 1, 2, 3, 3]], "expect": [1, 2, 3]},
        {"args": [[]], "expect": []},
        {"args": [[1, 1, 1]], "expect": [1]},
    ], convert={"args": ["linked"], "ret": "linked"})
    check(add_two_numbers, [
        {"args": [[2, 4, 3], [5, 6, 4]], "expect": [7, 0, 8]},
        {"args": [[0], [0]], "expect": [0]},
        {"args": [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]], "expect": [8, 9, 9, 9, 0, 0, 0, 1]},
        {"args": [[5], [5]], "expect": [0, 1]},
    ], convert={"args": ["linked", "linked"], "ret": "linked"})
