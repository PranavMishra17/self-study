# Mock interviews

Full mocks run in the Claude Code chat, not in a page. Single questions ("introduce
yourself in forty seconds") are practised on the loop page's drills, with Win+H
dictating into the box.

## Starting one

Say **"run the ZenML mock, 15 minutes"**, or name any loop and a length between ten
and fifteen minutes.

## How the interviewer behaves

- **A person, not a grader.** A named interviewer from the loop (for ZenML: Hamza, or
  Alex, or both taking turns), with a personality, opinions and their own way of
  getting to know you. They react, disagree, get curious, and follow the thread you
  opened.
- **Never summarises you back to yourself.** No "so you said X and Y, what do you think
  about Z". People ask the next question; they do not recap.
- **Opens with one question and adapts.** Follow-ups come from your answer, and go
  down, not sideways, the way the real round will.
- **Keeps the clock.** Time is tracked in the chat; at the end it wraps like a real
  interviewer ("we're about at time, any questions for me?").
- **No critique during the mock.** Nothing in-character hints at a grade.

## After the time is up

The critique comes out of character: what landed, what to fix, and the best version
of the weakest answer, in the words to say it.

## Keeping them

Each mock's transcript and critique go into `interviews/<loop>.mocks.json` as
`{ title, when, critique, transcript }`, and the loop page is rebuilt with
`python interviews/build.py <loop>`. The page shows only the latest two; older ones
drop off the page but stay in git history.
