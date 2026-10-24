"""
Lesson 08 · Stacks & queues — SOLUTIONS
The visual lesson: lessons/08-stacks-queues.html

Only open this after you've really tried (15+ minutes per problem).
"""
from _check import check, ListNode, TreeNode  # noqa: F401  (helpers for linked-list / tree problems)


# ────────────────────────────────────────────────────────────────────────────────────────
# 1. Valid parentheses  ·  Easy  ·  Stack
#
# s contains only ()[]{}. Return True if every bracket is closed by the same type, in the
# right order.
#
# LeetCode: 20. Valid Parentheses
# ────────────────────────────────────────────────────────────────────────────────────────
def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return not stack


# ────────────────────────────────────────────────────────────────────────────────────────
# 2. Min stack (design)  ·  Medium  ·  Stack of pairs
#
# Design a stack with push(x), pop(), top() and get_min() — all O(1). pop returns nothing.
#
# LeetCode: 155. Min Stack
# ────────────────────────────────────────────────────────────────────────────────────────
class MinStack:
    def __init__(self):
        self.items = []          # (value, min of the stack up to here)

    def push(self, x):
        current = min(x, self.items[-1][1]) if self.items else x
        self.items.append((x, current))

    def pop(self):
        self.items.pop()

    def top(self):
        return self.items[-1][0]

    def get_min(self):
        return self.items[-1][1]


# ────────────────────────────────────────────────────────────────────────────────────────
# 3. Backspace string compare  ·  Easy  ·  Stack
#
# In s and t, # means "backspace" (delete the previous character, if any). Return True if both
# give the same final text.
#
# LeetCode: 844. Backspace String Compare
# ────────────────────────────────────────────────────────────────────────────────────────
def backspace_compare(s, t):
    def build(text):
        stack = []
        for ch in text:
            if ch == "#":
                if stack:
                    stack.pop()
            else:
                stack.append(ch)
        return stack
    return build(s) == build(t)


# ────────────────────────────────────────────────────────────────────────────────────────
# 4. Evaluate reverse Polish notation  ·  Medium  ·  Stack
#
# Evaluate an expression in postfix form: ["2", "1", "+", "3", "*"] means (2 + 1) * 3 = 9.
# Operators: + - * /. Division truncates toward zero (use int(a / b)).
#
# LeetCode: 150. Evaluate Reverse Polish Notation
# ────────────────────────────────────────────────────────────────────────────────────────
def eval_rpn(tokens):
    stack = []
    for tok in tokens:
        if tok in "+-*/":
            b = stack.pop()
            a = stack.pop()
            if tok == "+":
                stack.append(a + b)
            elif tok == "-":
                stack.append(a - b)
            elif tok == "*":
                stack.append(a * b)
            else:
                stack.append(int(a / b))
        else:
            stack.append(int(tok))
    return stack[0]


# ────────────────────────────────────────────────────────────────────────────────────────
# 5. Queue using two stacks (design)  ·  Easy  ·  Two stacks
#
# Implement a FIFO queue with push(x), pop() (returns the front item), peek() and empty(),
# using only two lists used as stacks (only append and pop() from the end).
#
# LeetCode: 232. Implement Queue using Stacks
# ────────────────────────────────────────────────────────────────────────────────────────
class MyQueue:
    def __init__(self):
        self.inbox = []
        self.outbox = []

    def push(self, x):
        self.inbox.append(x)

    def _move(self):
        if not self.outbox:
            while self.inbox:
                self.outbox.append(self.inbox.pop())

    def pop(self):
        self._move()
        return self.outbox.pop()

    def peek(self):
        self._move()
        return self.outbox[-1]

    def empty(self):
        return not self.inbox and not self.outbox


# ────────────────────────────────────────────────────────────────────────────────────────
# 6. Number of recent calls (design)  ·  Easy  ·  Queue (deque)
#
# RecentCounter() starts empty. ping(t) records a request at time t (milliseconds, always
# increasing) and returns how many requests happened in [t − 3000, t].
#
# LeetCode: 933. Number of Recent Calls
# ────────────────────────────────────────────────────────────────────────────────────────
from collections import deque

class RecentCounter:
    def __init__(self):
        self.times = deque()

    def ping(self, t):
        self.times.append(t)
        while self.times[0] < t - 3000:
            self.times.popleft()
        return len(self.times)


# ────────────────────────────────────────────────────────────────────────────────────────
# 7. Daily temperatures  ·  Medium  ·  Monotonic stack
#
# For each day, return how many days you wait for a warmer temperature (0 if never). O(n) —
# the big test has 100,000 days.
#
# LeetCode: 739. Daily Temperatures
# ────────────────────────────────────────────────────────────────────────────────────────
def daily_temperatures(temps):
    answer = [0] * len(temps)
    stack = []
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            answer[j] = i - j
        stack.append(i)
    return answer


# ────────────────────────────────────────────────────────────────────────────────────────
# 8. Decode string  ·  Medium  ·  Stack of (previous text, count)
#
# Decode k[text] as text repeated k times. Brackets can be nested. "3[a2[c]]" → "accaccacc".
#
# LeetCode: 394. Decode String
# ────────────────────────────────────────────────────────────────────────────────────────
def decode_string(s):
    stack = []
    current = ""
    num = 0
    for ch in s:
        if ch.isdigit():
            num = num * 10 + int(ch)
        elif ch == "[":
            stack.append((current, num))
            current, num = "", 0
        elif ch == "]":
            prev, k = stack.pop()
            current = prev + current * k
        else:
            current += ch
    return current


if __name__ == "__main__":
    check(is_valid, [
        {"args": ["()"], "expect": True},
        {"args": ["()[]{}"], "expect": True},
        {"args": ["(]"], "expect": False},
        {"args": ["([)]"], "expect": False},
        {"args": ["{[]}"], "expect": True},
        {"args": [""], "expect": True},
        {"args": ["(("], "expect": False},
        {"args": [")("], "expect": False},
    ])
    check(MinStack, [
        {"ops": ["MinStack", "push", "push", "push", "get_min", "pop", "top", "get_min"], "args": [[], [-2], [0], [-3], [], [], [], []], "expect": [None, None, None, None, -3, None, 0, -2]},
        {"ops": ["MinStack", "push", "push", "get_min", "pop", "get_min"], "args": [[], [5], [5], [], [], []], "expect": [None, None, None, 5, None, 5]},
        {"ops": ["MinStack", "push", "push", "push", "get_min", "pop", "get_min", "pop", "get_min"], "args": [[], [3], [1], [2], [], [], [], [], []], "expect": [None, None, None, None, 1, None, 1, None, 3]},
    ])
    check(backspace_compare, [
        {"args": ["ab#c", "ad#c"], "expect": True},
        {"args": ["ab##", "c#d#"], "expect": True},
        {"args": ["a#c", "b"], "expect": False},
        {"args": ["a##c", "#a#c"], "expect": True},
        {"args": ["xy#z", "xzz#"], "expect": True},
    ])
    check(eval_rpn, [
        {"args": [["2", "1", "+", "3", "*"]], "expect": 9},
        {"args": [["4", "13", "5", "/", "+"]], "expect": 6},
        {"args": [["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]], "expect": 22},
        {"args": [["7"]], "expect": 7},
        {"args": [["3", "-4", "/"]], "expect": 0},
    ])
    check(MyQueue, [
        {"ops": ["MyQueue", "push", "push", "peek", "pop", "empty"], "args": [[], [1], [2], [], [], []], "expect": [None, None, None, 1, 1, False]},
        {"ops": ["MyQueue", "push", "pop", "empty", "push", "push", "pop", "peek"], "args": [[], [5], [], [], [6], [7], [], []], "expect": [None, None, 5, True, None, None, 6, 7]},
    ])
    check(RecentCounter, [
        {"ops": ["RecentCounter", "ping", "ping", "ping", "ping"], "args": [[], [1], [100], [3001], [3002]], "expect": [None, 1, 2, 3, 3]},
        {"ops": ["RecentCounter", "ping", "ping", "ping"], "args": [[], [5000], [9000], [9001]], "expect": [None, 1, 1, 2]},
    ])
    check(daily_temperatures, [
        {"args": [[73, 74, 75, 71, 69, 72, 76, 73]], "expect": [1, 1, 4, 2, 1, 1, 0, 0]},
        {"args": [[30, 40, 50, 60]], "expect": [1, 1, 1, 0]},
        {"args": [[30, 60, 90]], "expect": [1, 1, 0]},
        {"args": [[50]], "expect": [0]},
        {"args": [{"__py__": "list(range(100_000, 0, -1))"}], "expect": {"__py__": "[0] * 100_000"}},
    ])
    check(decode_string, [
        {"args": ["3[a]2[bc]"], "expect": "aaabcbc"},
        {"args": ["3[a2[c]]"], "expect": "accaccacc"},
        {"args": ["2[abc]3[cd]ef"], "expect": "abcabccdcdcdef"},
        {"args": ["abc"], "expect": "abc"},
        {"args": ["10[x]"], "expect": "xxxxxxxxxx"},
    ])
