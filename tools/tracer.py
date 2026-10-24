"""Runs a Python program line by line and records every step as JSON.

The visualizers in the lessons replay these steps. The same file runs in two places:
  * on your computer, when tools/build.mjs pre-computes the lesson animations
  * inside the browser (Pyodide), when you press "Edit & visualize"

A line can carry a note for the step explanation:   x = a + b   #: add {a} and {b}
Text after "#:" is an f-string, evaluated with the variables just BEFORE the line runs.
"""

import io
import json
import re
import sys
import types

FILENAME = "<lesson>"
NOTE_RE = re.compile(r"\s*#:\s?(.*)$")
DEF_RE = re.compile(r"(def|class)\s+(\w+)")
SKIP_TYPES = (types.FunctionType, types.ModuleType, type, types.BuiltinFunctionType, types.MethodType)


class StepLimit(Exception):
    pass


class Tracer:
    def __init__(self, src, max_steps=1000):
        self.max_steps = max_steps
        self.notes = {}
        self.lines = src.split("\n")
        for i, line in enumerate(self.lines, 1):
            m = NOTE_RE.search(line)
            if m:
                self.notes[i] = m.group(1)
        self.steps = []
        self.ids = {}
        self.keep = []  # keeps objects alive so Python never reuses their id()
        self.out = io.StringIO()

    # ---------- turning Python values into JSON ----------
    def ref_id(self, obj):
        key = id(obj)
        if key not in self.ids:
            self.ids[key] = len(self.ids) + 1
            self.keep.append(obj)
        return self.ids[key]

    def enc(self, v, heap):
        if v is None or isinstance(v, (bool, int)):
            return v
        if isinstance(v, float):
            if v != v or v in (float("inf"), float("-inf")):
                return {"f": repr(v)}
            return v
        if isinstance(v, str):
            return v
        rid = self.ref_id(v)
        out = {"ref": rid}
        if rid in heap:
            return out
        entry = {}
        heap[rid] = entry
        name = type(v).__name__
        if isinstance(v, dict):
            entry["t"] = "dict"
            if name != "dict":
                entry["cls"] = name
            entry["v"] = [[self.enc(k, heap), self.enc(x, heap)] for k, x in list(v.items())[:200]]
        elif isinstance(v, (list, tuple)) or name == "deque":
            entry["t"] = "tuple" if isinstance(v, tuple) else ("deque" if name == "deque" else "list")
            entry["v"] = [self.enc(x, heap) for x in list(v)[:300]]
        elif isinstance(v, (set, frozenset)):
            entry["t"] = "set"
            try:
                items = sorted(v)
            except TypeError:
                items = sorted(v, key=repr)
            entry["v"] = [self.enc(x, heap) for x in items[:200]]
        elif hasattr(v, "__dict__") and not isinstance(v, SKIP_TYPES):
            entry["t"] = "obj"
            entry["cls"] = name
            entry["v"] = {k: self.enc(x, heap) for k, x in vars(v).items() if not k.startswith("_")}
        else:
            entry["t"] = "other"
            entry["repr"] = repr(v)[:80]
        return out

    # ---------- recording ----------
    def visible_frames(self, frame):
        stack = []
        while frame is not None:
            if frame.f_code.co_filename == FILENAME:
                stack.append(frame)
            frame = frame.f_back
        stack.reverse()
        return stack

    def note_for(self, frame, lineno):
        tpl = self.notes.get(lineno)
        if not tpl:
            return None
        try:
            return eval("f" + repr(tpl), frame.f_globals, dict(frame.f_locals))
        except Exception:
            return None

    def record(self, frame, kind, arg=None):
        if len(self.steps) >= self.max_steps:
            raise StepLimit()
        heap = {}
        frames = []
        for f in self.visible_frames(frame):
            fn = f.f_code.co_name
            scope = f.f_globals if fn == "<module>" else f.f_locals
            names = {}
            for k, v in list(scope.items()):
                if k.startswith("_") or isinstance(v, SKIP_TYPES):
                    continue
                names[k] = self.enc(v, heap)
            frames.append({"fn": "global" if fn == "<module>" else fn, "vars": names})
        step = {"l": frame.f_lineno, "k": kind, "s": frames, "h": heap, "o": self.out.getvalue()}
        if kind == "line":
            note = self.note_for(frame, frame.f_lineno)
            if note:
                step["n"] = note
            elif frame.f_code.co_name == "<module>":
                m = DEF_RE.match(self.lines[frame.f_lineno - 1]) if frame.f_lineno <= len(self.lines) else None
                if m:
                    step["n"] = (f"Python remembers the function {m.group(2)}() — its body runs only when you call it"
                                 if m.group(1) == "def" else f"Python creates the class {m.group(2)}")
        elif kind == "call":
            args = ", ".join(f"{k}={self.short(v)}" for k, v in list(frame.f_locals.items())[: frame.f_code.co_argcount])
            step["n"] = f"Call {frame.f_code.co_name}({args})"
        elif kind == "return":
            if frame.f_code.co_name == "<module>":
                step["n"] = "Program finished"
            else:
                step["r"] = self.enc(arg, heap)
                step["n"] = f"{frame.f_code.co_name} returns {self.short(arg)}"
        elif kind == "exc":
            step["n"] = f"{arg[0].__name__}: {arg[1]}"
        self.steps.append(step)

    @staticmethod
    def short(v):
        if hasattr(v, "__dict__") and not isinstance(v, SKIP_TYPES):
            val = getattr(v, "val", getattr(v, "value", None))
            return f"{type(v).__name__}({val!r})" if val is not None else type(v).__name__
        text = repr(v)
        return text if len(text) <= 40 else text[:37] + "..."

    def trace(self, frame, event, arg):
        code = frame.f_code
        if code.co_filename != FILENAME:
            return None
        if code.co_name != "<module>" and (code.co_name.startswith(("<", "_")) or not code.co_flags & 1):
            return None  # skip lambdas, generator expressions, class bodies and _helpers/__init__
        if event == "call" and code.co_name != "<module>":
            self.record(frame, "call")
        elif event == "line":
            self.record(frame, "line")
        elif event == "return":
            self.record(frame, "return", arg)
        elif event == "exception" and arg[0] is not StepLimit:
            self.record(frame, "exc", arg)
        return self.trace

    def run(self, src):
        error = None
        truncated = False
        g = {"__name__": "__main__", "__builtins__": __builtins__}
        old_out = sys.stdout
        sys.stdout = self.out
        try:
            code = compile(src, FILENAME, "exec")
            sys.settrace(self.trace)
            try:
                exec(code, g)
            finally:
                sys.settrace(None)
        except StepLimit:
            truncated = True
        except SyntaxError as e:
            error = f"SyntaxError on line {e.lineno}: {e.msg}"
        except Exception as e:  # show the error as the last step
            error = f"{type(e).__name__}: {e}"
        finally:
            sys.stdout = old_out
        if self.steps and self.steps[-1]["k"] == "exc" and error is None:
            pass
        # drop the exception steps that Python reports again for every frame while unwinding
        cleaned = []
        for s in self.steps:
            if s["k"] == "exc" and cleaned and cleaned[-1]["k"] == "exc":
                continue
            cleaned.append(s)
        return {"steps": cleaned, "error": error, "truncated": truncated, "out": self.out.getvalue()}


def display_code(src):
    """The source the learner sees: same lines, with the #: notes removed."""
    return "\n".join(NOTE_RE.sub("", line).rstrip() for line in src.split("\n"))


def run(src, max_steps=1000):
    src = src.strip("\n")
    result = Tracer(src, max_steps).run(src)
    result["code"] = display_code(src)
    return json.dumps(result, separators=(",", ":"))


if __name__ == "__main__":
    print(run(sys.stdin.read(), int(sys.argv[1]) if len(sys.argv) > 1 else 1000))
