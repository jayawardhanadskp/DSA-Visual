// Lesson 09 — Linked lists
const L09_NODE = py`
  class ListNode:
      def __init__(self, val, next=None):
          self.val = val
          self.next = next
`
const L09_NOTE = '# ListNode is ready to use: ListNode(val, next=None) with .val and .next\n'

addViz({
  'll-insert': {
    title: 'Insert in O(1): just re-point two arrows',
    code: L09_NODE + '\n\n' + py`
      head = ListNode(1, ListNode(2, ListNode(4)))
      node = head.next              # the node holding 2
      new = ListNode(3)             #: a new node — nothing points to it yet
      new.next = node.next          #: step 1: new.next → the node after 2 (it holds {node.next.val})
      node.next = new               #: step 2: 2.next → new. Order matters! Do step 1 first, or you lose the rest of the list
      curr = head
      while curr:
          print(curr.val, end=" ")
          curr = curr.next
    `,
    views: [{ type: 'linked', rows: [['head', 'node', 'curr'], ['new']] }],
  },
  'll-reverse': {
    title: 'Reverse a linked list: prev, curr, nxt',
    code: L09_NODE + '\n\n' + py`
      def reverse(head):
          prev = None
          curr = head
          while curr:
              nxt = curr.next       #: save the rest of the list first: nxt = {curr.next.val if curr.next else None}
              curr.next = prev      #: flip the arrow: {curr.val} now points back to {prev.val if prev else None}
              prev = curr           #: prev steps forward to {curr.val}
              curr = nxt            #: curr steps forward to {nxt.val if nxt else None}
          return prev               #: curr is None → prev ({prev.val}) is the new head

      head = ListNode(1, ListNode(2, ListNode(3, ListNode(4))))
      head = reverse(head)
    `,
    views: [{ type: 'linked', vars: ['head', 'prev', 'curr', 'nxt'] }],
  },
  'll-middle': {
    title: 'Fast & slow pointers: find the middle',
    code: L09_NODE + '\n\n' + py`
      def middle(head):
          slow = fast = head
          while fast and fast.next:     #: {'fast can jump 2 more → keep going' if fast and fast.next else 'fast reached the end → slow is in the middle'}
              slow = slow.next          #: slow: 1 step → {slow.next.val}
              fast = fast.next.next     #: fast: 2 steps → {fast.next.next.val if fast.next.next else None}
          return slow

      head = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
      mid = middle(head)
      print(mid.val)
    `,
    views: [{ type: 'linked', vars: ['head', 'slow', 'fast', 'mid'] }],
  },
  'll-merge': {
    title: 'Merge two sorted lists with a dummy node',
    code: L09_NODE + '\n\n' + py`
      def merge(a, b):
          dummy = ListNode(0)           # fake first node: no special case for the head
          tail = dummy
          while a and b:
              if a.val <= b.val:        #: compare {a.val} and {b.val} → take {min(a.val, b.val)}
                  tail.next = a
                  a = a.next
              else:
                  tail.next = b
                  b = b.next
              tail = tail.next          #: tail moves to the node we just attached
          tail.next = a or b            #: one list is empty → attach whatever is left of the other
          return dummy.next

      l1 = ListNode(1, ListNode(4, ListNode(6)))
      l2 = ListNode(2, ListNode(3, ListNode(7)))
      merged = merge(l1, l2)
    `,
    views: [{ type: 'linked', rows: [['dummy', 'tail', 'merged'], ['l1', 'a'], ['l2', 'b']], rowStart: [0, 1, 1] }],
    wide: true,
  },
  'll-cycle': {
    title: 'Cycle detection: the tortoise and the hare',
    code: L09_NODE + '\n\n' + py`
      def has_cycle(head):
          slow = fast = head
          while fast and fast.next:
              slow = slow.next
              fast = fast.next.next
              if slow is fast:          #: slow is at {slow.val}, fast is at {fast.val} → {'SAME NODE → there is a cycle!' if slow is fast else 'not the same node yet'}
                  return True
          return False

      nodes = [ListNode(v) for v in [1, 2, 3, 4, 5]]
      for i in range(4):
          nodes[i].next = nodes[i + 1]
      nodes[4].next = nodes[2]          # 5 points back to 3: a cycle!
      head = nodes[0]
      print(has_cycle(head))
    `,
    views: [{ type: 'linked', vars: ['head', 'slow', 'fast'] }],
    hide: ['nodes'],
  },
})

addProblems({
  'll-reverse': {
    title: 'Reverse a linked list',
    level: 'Easy',
    pattern: 'prev / curr / nxt',
    leetcode: '206. Reverse Linked List',
    prompt: '<p>Reverse the list and return the new head. (Tests show lists as Python lists: <code>[1, 2, 3]</code> means 1 → 2 → 3.)</p>',
    fn: 'reverse_list',
    convert: { args: ['linked'], ret: 'linked' },
    starter: L09_NOTE + py`
      def reverse_list(head):
          # TODO
          return head
    `,
    tests: [
      { args: [[1, 2, 3, 4, 5]], expect: [5, 4, 3, 2, 1] },
      { args: [[1, 2]], expect: [2, 1] },
      { args: [[]], expect: [] },
      { args: [[7]], expect: [7] },
    ],
    views: [{ type: 'linked', vars: ['head', 'prev', 'curr', 'nxt'] }],
    hints: ['Three variables: <code>prev = None</code>, <code>curr = head</code>, and inside the loop <code>nxt</code>.', 'Order inside the loop: save next, flip arrow, move prev, move curr.'],
    solution: py`
      def reverse_list(head):
          prev = None
          curr = head
          while curr:
              nxt = curr.next
              curr.next = prev
              prev = curr
              curr = nxt
          return prev
    `,
    explain: '<p>O(n) time, O(1) space. Probably the most common linked-list interview question — be able to write it in your sleep (and draw it!).</p>',
  },
  'll-middle': {
    title: 'Middle of the linked list',
    level: 'Easy',
    pattern: 'Fast & slow',
    leetcode: '876. Middle of the Linked List',
    prompt: '<p>Return the middle node. If there are two middles, return the second one. (The test shows the list from the node you return to the end.)</p>',
    fn: 'middle_node',
    convert: { args: ['linked'], ret: 'linked' },
    starter: L09_NOTE + py`
      def middle_node(head):
          # TODO: slow moves 1, fast moves 2
          return head
    `,
    tests: [
      { args: [[1, 2, 3, 4, 5]], expect: [3, 4, 5] },
      { args: [[1, 2, 3, 4, 5, 6]], expect: [4, 5, 6] },
      { args: [[1]], expect: [1] },
      { args: [[1, 2]], expect: [2] },
    ],
    views: [{ type: 'linked', vars: ['head', 'slow', 'fast'] }],
    hints: ['When fast has walked the whole list, slow has walked half of it.', '<code>while fast and fast.next:</code> slow one step, fast two steps.'],
    solution: py`
      def middle_node(head):
          slow = fast = head
          while fast and fast.next:
              slow = slow.next
              fast = fast.next.next
          return slow
    `,
    explain: '<p>One pass, O(1) space. Without fast/slow you would need two passes (count, then walk n // 2).</p>',
  },
  'll-merge': {
    title: 'Merge two sorted lists',
    level: 'Easy',
    pattern: 'Dummy node',
    leetcode: '21. Merge Two Sorted Lists',
    prompt: '<p>Merge two sorted linked lists into one sorted list by re-linking the nodes. Return its head.</p>',
    fn: 'merge_two_lists',
    convert: { args: ['linked', 'linked'], ret: 'linked' },
    starter: L09_NOTE + py`
      def merge_two_lists(a, b):
          dummy = ListNode(0)
          tail = dummy
          # TODO
          return dummy.next
    `,
    tests: [
      { args: [[1, 2, 4], [1, 3, 4]], expect: [1, 1, 2, 3, 4, 4] },
      { args: [[], []], expect: [] },
      { args: [[], [0]], expect: [0] },
      { args: [[5], [1, 2, 3]], expect: [1, 2, 3, 5] },
    ],
    views: [{ type: 'linked', rows: [['dummy', 'tail'], ['a'], ['b']], rowStart: [0, 1, 1] }],
    hints: ['Same as merging two Python lists (lesson 03), but you attach nodes: <code>tail.next = a</code>.', 'At the end: <code>tail.next = a or b</code>.'],
    solution: py`
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
    `,
    explain: '<p>The <b>dummy node</b> trick: start with a fake node so "the first node" isn\'t a special case. Return <code>dummy.next</code>.</p>',
  },
  'll-cycle': {
    title: 'Linked list cycle',
    level: 'Easy',
    pattern: 'Fast & slow',
    leetcode: '141. Linked List Cycle',
    prompt: '<p>Return <code>True</code> if the list has a cycle (some node\'s <code>next</code> points back to an earlier node). The test input <code>[[3, 2, 0, -4], 1]</code> means values 3 → 2 → 0 → −4 and the last node points back to index 1 (−1 = no cycle). Use O(1) memory.</p>',
    fn: 'has_cycle',
    convert: { args: ['cycle'] },
    starter: L09_NOTE + py`
      def has_cycle(head):
          # TODO
          return False
    `,
    tests: [
      { args: [[[3, 2, 0, -4], 1]], expect: true },
      { args: [[[1, 2], 0]], expect: true },
      { args: [[[1], -1]], expect: false },
      { args: [[[1, 2, 3, 4, 5], -1]], expect: false },
      { args: [[[], -1]], expect: false },
      { args: [[[1], 0]], expect: true },
    ],
    views: [{ type: 'linked', vars: ['head', 'slow', 'fast'] }],
    hints: ['A set of visited nodes works, but uses O(n) memory.', 'Fast &amp; slow: if there is a cycle, fast laps slow and they meet. If there isn\'t, fast reaches <code>None</code>.', 'Compare nodes with <code>is</code> (same object), not values.'],
    solution: py`
      def has_cycle(head):
          slow = fast = head
          while fast and fast.next:
              slow = slow.next
              fast = fast.next.next
              if slow is fast:
                  return True
          return False
    `,
    explain: '<p>Floyd\'s algorithm. Inside the cycle, fast gains 1 step on slow every move, so it must catch up. O(n) time, O(1) space.</p>',
  },
  'll-remove-nth': {
    title: 'Remove the n-th node from the end',
    level: 'Medium',
    pattern: 'Two pointers with a gap',
    leetcode: '19. Remove Nth Node From End of List',
    prompt: '<p>Remove the <code>n</code>-th node from the end and return the head. Try one pass.</p>',
    fn: 'remove_nth_from_end',
    convert: { args: ['linked', null], ret: 'linked' },
    starter: L09_NOTE + py`
      def remove_nth_from_end(head, n):
          # TODO
          return head
    `,
    tests: [
      { args: [[1, 2, 3, 4, 5], 2], expect: [1, 2, 3, 5] },
      { args: [[1], 1], expect: [] },
      { args: [[1, 2], 1], expect: [1] },
      { args: [[1, 2], 2], expect: [2] },
    ],
    views: [{ type: 'linked', vars: ['dummy', 'slow', 'fast'] }],
    hints: ['Use a dummy node before head (removing the head is then not special).', 'Move <code>fast</code> n + 1 steps ahead of <code>slow</code>. Then move both until fast is <code>None</code>: slow is just before the node to remove.', '<code>slow.next = slow.next.next</code>'],
    solution: py`
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
    `,
    explain: '<p>Two pointers with a fixed gap: when the front one falls off the end, the back one is exactly n + 1 from the end.</p>',
  },
  'll-palindrome': {
    title: 'Palindrome linked list',
    level: 'Easy',
    pattern: 'Middle + reverse',
    leetcode: '234. Palindrome Linked List',
    prompt: '<p>Return <code>True</code> if the values read the same forwards and backwards. Bonus: O(1) extra space.</p>',
    fn: 'is_palindrome_list',
    convert: { args: ['linked'] },
    starter: L09_NOTE + py`
      def is_palindrome_list(head):
          # TODO
          return False
    `,
    tests: [
      { args: [[1, 2, 2, 1]], expect: true },
      { args: [[1, 2]], expect: false },
      { args: [[1]], expect: true },
      { args: [[1, 2, 3, 2, 1]], expect: true },
      { args: [[1, 2, 3]], expect: false },
    ],
    hints: ['Easy way: copy the values into a Python list and compare with its reverse (O(n) space).', 'O(1) way: find the middle (fast/slow), reverse the second half, then compare the two halves node by node.'],
    solution: py`
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
    `,
    explain: '<p>Combines two patterns you just learned (middle + reverse). Interviewers love problems that are "two easy problems glued together".</p>',
  },
  'll-dedupe': {
    title: 'Remove duplicates from a sorted list',
    level: 'Easy',
    pattern: 'Skip nodes',
    leetcode: '83. Remove Duplicates from Sorted List',
    prompt: '<p>The list is sorted. Remove duplicates so each value appears once. Return the head.</p>',
    fn: 'delete_duplicates',
    convert: { args: ['linked'], ret: 'linked' },
    starter: L09_NOTE + py`
      def delete_duplicates(head):
          # TODO
          return head
    `,
    tests: [
      { args: [[1, 1, 2]], expect: [1, 2] },
      { args: [[1, 1, 2, 3, 3]], expect: [1, 2, 3] },
      { args: [[]], expect: [] },
      { args: [[1, 1, 1]], expect: [1] },
    ],
    views: [{ type: 'linked', vars: ['head', 'curr'] }],
    hints: ['Walk with <code>curr</code>. If <code>curr.next</code> has the same value, skip it: <code>curr.next = curr.next.next</code> (and don\'t move curr).', 'Otherwise move <code>curr = curr.next</code>.'],
    solution: py`
      def delete_duplicates(head):
          curr = head
          while curr and curr.next:
              if curr.next.val == curr.val:
                  curr.next = curr.next.next
              else:
                  curr = curr.next
          return head
    `,
    explain: '<p>Removing a node = making the previous node skip it. O(n).</p>',
  },
  'll-add-two': {
    title: 'Add two numbers',
    level: 'Medium',
    pattern: 'Dummy node + carry',
    leetcode: '2. Add Two Numbers',
    prompt: '<p>Two numbers are stored as linked lists of digits in <b>reverse</b> order (<code>[2, 4, 3]</code> is 342). Return their sum as a list in the same format.</p>',
    fn: 'add_two_numbers',
    convert: { args: ['linked', 'linked'], ret: 'linked' },
    starter: L09_NOTE + py`
      def add_two_numbers(a, b):
          # TODO
          return None
    `,
    tests: [
      { args: [[2, 4, 3], [5, 6, 4]], expect: [7, 0, 8] },
      { args: [[0], [0]], expect: [0] },
      { args: [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]], expect: [8, 9, 9, 9, 0, 0, 0, 1] },
      { args: [[5], [5]], expect: [0, 1] },
    ],
    hints: ['Add digit by digit like on paper, keeping a <code>carry</code>.', 'Loop <code>while a or b or carry</code>. Digit = <code>total % 10</code>, carry = <code>total // 10</code>. Build with a dummy node.'],
    solution: py`
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
    `,
    explain: '<p>The reverse order makes it easy — the ones digit comes first, just like adding on paper from the right. O(max(n, m)).</p>',
  },
})

addQuiz({
  'll-quiz': [
    { q: 'Getting the k-th element of a linked list costs…', options: ['O(1)', 'O(k)', 'O(log n)', 'O(n²)'], answer: 1, why: 'No indexes: you must follow k arrows from the head.' },
    { q: 'You hold a reference to a node. Inserting a new node right after it costs…', options: ['O(1)', 'O(n)', 'O(log n)', 'Depends on the values'], answer: 0, why: 'Two pointer changes, no shifting — the big advantage over arrays.' },
    { q: 'In the reverse loop, what happens if you write <code>curr.next = prev</code> <b>before</b> <code>nxt = curr.next</code>?', options: ['Nothing changes', 'You lose the rest of the list', 'It becomes faster', 'Python raises an error'], answer: 1, why: 'After flipping, <code>curr.next</code> points backwards — the only reference to the rest of the list is gone.' },
    { q: 'Why use a dummy node?', options: ['It saves memory', 'So the head isn\'t a special case when building or removing', 'Python needs it', 'To detect cycles'], answer: 1, why: 'Every real node then has a node before it. Return <code>dummy.next</code>.' },
    { q: 'Which problem is NOT solved with fast &amp; slow pointers?', options: ['Find the middle', 'Detect a cycle', 'Merge two sorted lists', 'Find where a cycle starts'], answer: 2, why: 'Merging uses a dummy node and two "walking" pointers, one per list.' },
  ],
})
