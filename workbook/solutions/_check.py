"""Test helper used by every workbook file (and by the practice editor in the browser).

You don't need to read this file to do the exercises — but you can, it's plain Python.
"""

import copy
import json
import sys
import traceback


# ───────────── Node classes used by linked-list and tree problems ─────────────
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

    def __repr__(self):
        return f"ListNode({self.val})"


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

    def __repr__(self):
        return f"TreeNode({self.val})"


def build_linked(values):
    """[1, 2, 3] -> 1 -> 2 -> 3 (returns the head node, or None for [])"""
    dummy = ListNode()
    tail = dummy
    for v in values:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next


def build_cycle(values, pos):
    """Linked list whose last node points back to index `pos` (-1 = no cycle)."""
    head = build_linked(values)
    if pos < 0 or head is None:
        return head
    nodes = []
    node = head
    while node:
        nodes.append(node)
        node = node.next
    nodes[-1].next = nodes[pos]
    return head


def linked_to_list(head, limit=10_000):
    out = []
    while head is not None and len(out) < limit:
        out.append(head.val)
        head = head.next
    return out


def build_tree(values):
    """LeetCode style level-order list -> tree.  [1, 2, 3, None, 4] means:
           1
          / \\
         2   3
          \\
           4
    """
    if not values or values[0] is None:
        return None
    root = TreeNode(values[0])
    queue = [root]
    i = 1
    for node in queue:
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
        if i >= len(values):
            break
    return root


def tree_to_list(root):
    """Tree -> LeetCode style level-order list (trailing None removed)."""
    out = []
    queue = [root]
    for node in queue:
        if node is None:
            out.append(None)
            continue
        out.append(node.val)
        queue.append(node.left)
        queue.append(node.right)
    while out and out[-1] is None:
        out.pop()
    return out


def find_node(root, val):
    if root is None or root.val == val:
        return root
    return find_node(root.left, val) or find_node(root.right, val)


CONVERT_IN = {
    "linked": build_linked,
    "tree": build_tree,
    "cycle": lambda pair: build_cycle(pair[0], pair[1]),
}
CONVERT_OUT = {
    "linked": linked_to_list,
    "tree": tree_to_list,
    "node": lambda n: None if n is None else n.val,
}


# ───────────── comparing answers ─────────────
def normalize(x):
    if isinstance(x, (list, tuple)):
        return [normalize(v) for v in x]
    if isinstance(x, (set, frozenset)):
        return sorted(normalize(v) for v in x)
    if isinstance(x, dict):
        return {k: normalize(v) for k, v in x.items()}
    return x


def _sort_key(v):
    return json.dumps(v, sort_keys=True)


def same(got, expected, compare="exact"):
    got = normalize(got)
    if compare == "float":
        if isinstance(got, list):
            return len(got) == len(expected) and all(abs(a - b) < 1e-5 for a, b in zip(got, expected))
        return isinstance(got, (int, float)) and abs(got - expected) < 1e-5
    if compare == "sorted":
        return isinstance(got, list) and sorted(got, key=_sort_key) == sorted(expected, key=_sort_key)
    if compare == "nested":  # order doesn't matter at either level, e.g. [[1,2],[3]] == [[3],[2,1]]
        if not isinstance(got, list) or not all(isinstance(g, list) for g in got):
            return False
        a = sorted((sorted(g, key=_sort_key) for g in got), key=_sort_key)
        b = sorted((sorted(e, key=_sort_key) for e in expected), key=_sort_key)
        return a == b
    if compare == "outer":  # inner lists keep their order, outer order doesn't matter
        return isinstance(got, list) and sorted(got, key=_sort_key) == sorted(expected, key=_sort_key)
    return got == expected


# ───────────── running tests ─────────────
class TooLong(Exception):
    pass


def _guard(budget):
    count = [0]

    def tracer(frame, event, arg):
        if event == "line":
            count[0] += 1
            if count[0] > budget:
                raise TooLong("Your code ran too many steps (over 3 million lines) — an infinite loop, "
                              "or too slow for this big input? Think about the Big-O.")
        return tracer

    return tracer


def py_repr(v, limit=300):
    if isinstance(v, dict) and "__py__" in v:
        return v["__py__"]
    text = repr(v)
    return text if len(text) <= limit else text[: limit - 20] + f" … ({len(text)} characters)"


def materialize(a):
    """Test inputs like {"__py__": "list(range(100000))"} are built by Python (big inputs for speed tests)."""
    if isinstance(a, dict) and "__py__" in a:
        return eval(a["__py__"], {"__builtins__": __builtins__})
    return a


def run_test(target, test, compare="exact", convert=None, inplace=None, budget=3_000_000):
    """Runs one test. `target` is a function, or a class for design problems."""
    convert = convert or {}
    result = {"ok": False, "error": None}
    old = sys.gettrace()
    try:
        if "ops" in test:  # design problem, LeetCode style: ["MinStack","push","top"], [[],[1],[]]
            result["input"] = f"{test['ops']}\n{test['args']}"
            result["expected"] = py_repr(test["expect"])
            got = []
            obj = None
            sys.settrace(_guard(budget))
            try:
                for op, args in zip(test["ops"], test["args"]):
                    if obj is None:
                        obj = target(*copy.deepcopy(args))
                        got.append(None)
                    else:
                        got.append(getattr(obj, op)(*copy.deepcopy(args)))
            finally:
                sys.settrace(old)
            result["got"] = py_repr(got)
            result["ok"] = same(got, test["expect"], compare)
            return result

        result["input"] = ", ".join(py_repr(a) for a in test["args"])
        args = [materialize(a) for a in copy.deepcopy(test["args"])]
        kinds = convert.get("args") or []
        call_args = [CONVERT_IN[kinds[i]](a) if i < len(kinds) and kinds[i] else a for i, a in enumerate(args)]
        expected = materialize(test["expect"])
        result["expected"] = py_repr(expected) if "anyOf" not in test else " or ".join(map(py_repr, test["anyOf"]))
        sys.settrace(_guard(budget))
        try:
            got = target(*call_args)
        finally:
            sys.settrace(old)
        if inplace is not None:
            got = call_args[inplace]
        if convert.get("ret"):
            got = CONVERT_OUT[convert["ret"]](got)
        result["got"] = py_repr(got)
        options = test.get("anyOf", [expected])
        result["ok"] = any(same(got, e, compare) for e in options)
    except TooLong as e:
        result["error"] = str(e)
    except RecursionError:
        result["error"] = "RecursionError: too many nested calls — check your base case"
    except Exception as e:  # show the learner the real error, with the line in their code
        where = ""
        for fr in traceback.extract_tb(e.__traceback__):
            if not fr.filename.endswith("_check.py"):
                where = f"  (line {fr.lineno})"
        result["error"] = f"{type(e).__name__}: {e}{where}"
    finally:
        sys.settrace(old)
    return result


def run_all(namespace, name, tests, compare="exact", convert=None, inplace=None):
    """Used by the browser: returns JSON with one result per test."""
    target = namespace.get(name)
    if target is None:
        return json.dumps({"fatal": f"I can't find `{name}` — did you rename or delete it?"})
    return json.dumps({"results": [run_test(target, t, compare, convert, inplace) for t in tests]})


def check(target, tests, compare="exact", convert=None, inplace=None):
    """Used by the workbook files: prints ✅ / ❌ for each problem (details for the first failing test)."""
    name = getattr(target, "__name__", str(target))
    results = [run_test(target, t, compare, convert, inplace) for t in tests]
    passed = sum(r["ok"] for r in results)
    if passed == len(tests):
        print(f"✅ {name}: all {passed} tests pass")
        return True
    first = next(i for i, r in enumerate(results) if not r["ok"])
    r = results[first]
    print(f"{'⬜' if passed == 0 else '🟨'} {name}: {passed}/{len(tests)} tests pass — first failing test (#{first + 1}):")
    print(f"       input:    {r.get('input')}")
    print(f"       expected: {r.get('expected')}")
    if r["error"]:
        print(f"       error:    {r['error']}")
    else:
        print(f"       got:      {r.get('got')}")
    return False
