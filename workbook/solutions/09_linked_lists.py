"""
Lesson 09 · Linked lists — SOLUTIONS
The visual lesson: lessons/09-linked-lists.html

Only open this after you've really tried (15+ minutes per problem).
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
def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Middle of the linked list  ·  Easy  ·  Fast & slow
#
# Return the middle node. If there are two middles, return the second one. (The test shows the
# list from the node you return to the end.)
#
# LeetCode: 876. Middle of the Linked List
# ────────────────────────────────────────────────────────────────────────────────────────
def middle_node(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Merge two sorted lists  ·  Easy  ·  Dummy node
#
# Merge two sorted linked lists into one sorted list by re-linking the nodes. Return its head.
#
# LeetCode: 21. Merge Two Sorted Lists
# ────────────────────────────────────────────────────────────────────────────────────────
def merge_two_lists(a, b):
    dummy = ListNode(0)
    tail = dummy
    while a and b:
        if a.val <= b.val:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
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
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Remove the n-th node from the end  ·  Medium  ·  Two pointers with a gap
#
# Remove the n-th node from the end and return the head. Try one pass.
#
# LeetCode: 19. Remove Nth Node From End of List
# ────────────────────────────────────────────────────────────────────────────────────────
def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    slow = fast = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        slow = slow.next
        fast = fast.next
    slow.next = slow.next.next
    return dummy.next


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Palindrome linked list  ·  Easy  ·  Middle + reverse
#
# Return True if the values read the same forwards and backwards. Bonus: O(1) extra space.
#
# LeetCode: 234. Palindrome Linked List
# ────────────────────────────────────────────────────────────────────────────────────────
def is_palindrome_list(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    prev = None                       # reverse the second half
    while slow:
        slow.next, prev, slow = prev, slow, slow.next
    left, right = head, prev
    while right:
        if left.val != right.val:
            return False
        left = left.next
        right = right.next
    return True


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Remove duplicates from a sorted list  ·  Easy  ·  Skip nodes
#
# The list is sorted. Remove duplicates so each value appears once. Return the head.
#
# LeetCode: 83. Remove Duplicates from Sorted List
# ────────────────────────────────────────────────────────────────────────────────────────
def delete_duplicates(head):
    curr = head
    while curr and curr.next:
        if curr.next.val == curr.val:
            curr.next = curr.next.next
        else:
            curr = curr.next
    return head


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. Add two numbers  ·  Medium  ·  Dummy node + carry
#
# Two numbers are stored as linked lists of digits in reverse order ([2, 4, 3] is 342). Return
# their sum as a list in the same format.
#
# LeetCode: 2. Add Two Numbers
# ────────────────────────────────────────────────────────────────────────────────────────
def add_two_numbers(a, b):
    dummy = ListNode(0)
    tail = dummy
    carry = 0
    while a or b or carry:
        total = carry
        if a:
            total += a.val
            a = a.next
        if b:
            total += b.val
            b = b.next
        carry = total // 10
        tail.next = ListNode(total % 10)
        tail = tail.next
    return dummy.next


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
