# Workbook

The practice problems from every lesson as plain Python files, for VS Code or any editor.

```bash
python3 workbook/05_two_pointers.py
```

Each file:

1. starts with the problems: a description, an example, the LeetCode number, and a function with `pass` / TODO for you to fill in;
2. ends with `check(...)`, which runs every test and prints one line per problem:
   - ✅ all tests pass
   - 🟨 some tests pass, ⬜ none pass yet (for example, still `pass`). Both show the first failing input, what you
     returned, and what was expected.

Tips:

- Use `print()` freely. Its output appears above the results.
- If a run takes too long (an infinite loop, or code that is too slow for the big test), it stops and says so.
- Linked-list and tree problems take real `ListNode` / `TreeNode` objects. The tests convert from lists for you.
- Stuck? Open the same problem in its lesson page and press 🎬 **Watch my code** to watch your function run step by step.
- `solutions/` has a solution to every problem. Use it after a real attempt, then solve the problem again from memory the next day.

`_check.py` is the shared test runner. You don't need to edit it. Running a file creates a `__pycache__/` folder next to
it, which is normal and safe to delete.
