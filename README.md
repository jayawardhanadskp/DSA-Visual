# DSA with Python — a visual course

A hands-on course in data structures and algorithms (DSA) for a Flutter / Dart developer who knows a little Python.
It is not a video or a wall of text. You **watch real Python code run line by line**, **predict** what it does next,
learn each **pattern** from a template, **write the code yourself** with tests checking it, and **review** it until it sticks.

## Start

```bash
cd dsa-python-visual
python3 -m http.server 8000
```

Open **http://localhost:8000** and click **Start lesson 00**.

You can also double-click `index.html`. The visualizers work either way. Running Python in the browser (Pyodide) needs
internet the first time, about 10 MB, and then it is cached.

## The method (every lesson)

| Step | What you do |
| --- | --- |
| 👀 **SEE** | Step through the algorithm on real data: code on the left, pictures and variables on the right. Use ← / →. |
| 🧠 **PREDICT** | Turn on *Predict mode* and click the line you think runs next. Fill in the trace tables by hand. |
| 🧩 **PATTERN** | Each pattern has a template and the *signals* in a problem's wording that point to it. |
| 🛠 **BUILD** | Solve problems in the browser editor. Real Python runs and tests check you. If a test fails, press 🎬 *Watch my code* to step through **your** code. |
| 🔁 **REVIEW** | Solved problems come back after 1, 3, 7, 21 and 60 days, listed on the home page. Solve them again without looking. |

Each problem uses the same 6-step routine: understand → examples → brute force → find the waste → pattern → code and test.

## Roadmap (about 10–12 weeks at 60–90 minutes a day)

| Stage | Lessons |
| --- | --- |
| 1 · Foundations | 00 Start here · 01 Python for DSA (from Dart) · 02 Big-O |
| 2 · Arrays & hashing | 03 Arrays & strings · 04 Hash maps & sets · 05 Two pointers · 06 Sliding window · 07 Prefix sums |
| 3 · Linear structures | 08 Stacks & queues · 09 Linked lists |
| 4 · Recursion & searching | 10 Recursion · 11 Sorting · 12 Binary search |
| 5 · Trees & graphs | 13 Trees · 14 Heaps · 15 Graphs |
| 6 · Advanced techniques | 16 Backtracking · 17 Dynamic programming · 18 Greedy & intervals · 19 Tries & bits |
| 7 · Interview mode | 20 Pattern playbook: recognising the pattern on your own, plus a LeetCode plan |

In total: 21 lessons, 71 step-by-step visualizers and 171 practice problems, each linked to its LeetCode number.

## Practising offline (VS Code)

Every problem is also in `workbook/`, one file per lesson:

```bash
python3 workbook/05_two_pointers.py    # prints ✅ / ❌ for each problem
```

Solutions are in `workbook/solutions/`. Try for 20–30 minutes before you open them. See `workbook/README.md`.

## Folder layout

```
index.html            home: progress, reviews due today, roadmap
lessons/              one HTML page per lesson
lessons/data/         the lesson's visualizers, problems and quizzes (NN-name.js)
                      plus the pre-recorded Python runs (NN-name.traces.js, generated)
assets/               the engine: core.js, player.js (visualizer), python.js (editor + Pyodide), app.js, style.css
workbook/             the same problems as .py files, with solutions/
tools/tracer.py       records each step of a Python run (sys.settrace) as JSON
tools/build.mjs       regenerates traces + workbook and checks every solution
```

## Changing or adding content

You don't need to build anything to use the course. Run the build only after you edit a lesson's `lessons/data/*.js`:

```bash
node tools/build.mjs        # every lesson
node tools/build.mjs 05     # just one lesson
```

It reruns every visualizer's Python through the tracer, regenerates the workbook files, and checks that every solution
passes its tests. It needs Node 18+ and Python 3.10+.

## Progress

Your code, the problems you've solved, review dates and finished lessons are saved in this browser (localStorage). Use the
same browser, and the same address (`localhost:8000` or the file), each time. The home page has a reset button.
