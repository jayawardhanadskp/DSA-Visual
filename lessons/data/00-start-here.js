// Lesson 00 — Start here
addViz({
  'start-total': {
    title: 'Your first trace: adding up a list',
    code: py`
      def total(nums):
          result = 0
          for x in nums:           #: take the next value from nums
              result += x          #: result = {result} + {x} = {result + x}
          return result

      answer = total([4, 7, 1])
      print(answer)
    `,
    views: [{ type: 'array', var: 'nums' }],
  },
  'start-max': {
    title: 'The routine in action: largest number',
    code: py`
      def largest(nums):
          best = nums[0]                 # the best we have seen so far
          for i in range(1, len(nums)):
              if nums[i] > best:         #: is nums[{i}] = {nums[i]} bigger than best = {best}? {'YES' if nums[i] > best else 'no'}
                  best = nums[i]         #: new best: {nums[i]}
          return best

      print(largest([3, 9, 2, 12, 5]))
    `,
    views: [{ type: 'array', var: 'nums', pointers: ['i'] }],
  },
})

addProblems({
  'start-total': {
    title: 'Add up a list (without sum())',
    level: 'Easy',
    pattern: 'Warm-up',
    prompt: `<p>Return the total of all numbers in <code>nums</code>. Don't use the built-in <code>sum()</code> — use a loop, like the visualizer above. An empty list has total <code>0</code>.</p><p>This exercise is mostly to try the editor: type, press <kbd>▶ Run tests</kbd>, read the results.</p>`,
    fn: 'total',
    starter: py`
      def total(nums):
          result = 0
          # TODO: loop over nums and add each number to result
          return result
    `,
    tests: [
      { args: [[4, 7, 1]], expect: 12 },
      { args: [[]], expect: 0 },
      { args: [[-2, 2, 5]], expect: 5 },
      { args: [[100]], expect: 100 },
    ],
    views: [{ type: 'array', var: 'nums' }],
    hints: ['<code>for x in nums:</code> gives you each number, one by one.', 'Inside the loop: <code>result += x</code>.'],
    solution: py`
      def total(nums):
          result = 0
          for x in nums:
              result += x
          return result
    `,
    explain: '<p>One pass over the list → <b>O(n)</b> time. Only one extra variable → <b>O(1)</b> space. You will see these two words in every lesson.</p>',
  },
  'start-count-evens': {
    title: 'Count the even numbers',
    level: 'Easy',
    pattern: 'Warm-up',
    prompt: `<p>Return how many numbers in <code>nums</code> are even. A number <code>x</code> is even when <code>x % 2 == 0</code> (<code>%</code> is "remainder after dividing").</p>`,
    fn: 'count_evens',
    starter: py`
      def count_evens(nums):
          # TODO
          pass
    `,
    tests: [
      { args: [[1, 2, 3, 4]], expect: 2 },
      { args: [[]], expect: 0 },
      { args: [[1, 3, 5]], expect: 0 },
      { args: [[0, -2, 7]], expect: 2 },
    ],
    hints: ['Start a counter at 0 before the loop.', '<code>if x % 2 == 0: count += 1</code>, and <code>return count</code> after the loop (not inside it!).'],
    solution: py`
      def count_evens(nums):
          count = 0
          for x in nums:
              if x % 2 == 0:
                  count += 1
          return count
    `,
    explain: '<p>A very common bug: putting <code>return count</code> <i>inside</i> the loop, so it returns after the first number. Indentation is logic in Python.</p>',
  },
})

addQuiz({
  'start-quiz': [
    {
      q: 'You watched a video and the solution made total sense. What should you do next?',
      options: ['Move on to the next problem', 'Close the video and write the solution yourself from a blank editor', 'Watch it again', 'Copy it into your notes'],
      answer: 1,
      why: 'Understanding a solution and being able to <i>produce</i> it are different skills. Only the second one counts in an interview.',
    },
    {
      q: 'What is the FIRST step when you start a new problem?',
      options: ['Start typing code', 'Search for the solution', 'Understand it: restate it, write 2–3 examples by hand, think of edge cases', 'Pick a data structure'],
      answer: 2,
      why: 'Most "I don\'t know how to start" moments come from not understanding the problem yet. Examples by hand reveal the steps.',
    },
    {
      q: 'You solved a problem today. When is the best time to solve it again?',
      options: ['Never — it\'s done', 'Tomorrow, then in 3 days, then in a week', 'Right now, 5 times in a row', 'Only before an interview'],
      answer: 1,
      why: 'Spaced repetition. The course reminds you on the home page when a problem is due for review.',
    },
  ],
})
