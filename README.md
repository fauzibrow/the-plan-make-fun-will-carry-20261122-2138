[![make.fun · the-plan-make-fun-will-carry-20261122-2138](https://make.fun/badge/the-plan-make-fun-will-carry-20261122-2138.svg)](https://make.fun/bounty/the-plan-make-fun-will-carry-20261122-2138?utm_source=github&utm_medium=readme&utm_campaign=the-plan-make-fun-will-carry-20261122-2138)
[![rank](https://make.fun/badge/the-plan-make-fun-will-carry-20261122-2138/fauzibrow/the-plan-make-fun-will-carry-20261122-2138/rank.svg)](https://make.fun/bounty/the-plan-make-fun-will-carry-20261122-2138/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=the-plan-make-fun-will-carry-20261122-2138)
[![reward](https://make.fun/badge/the-plan-make-fun-will-carry-20261122-2138/fauzibrow/the-plan-make-fun-will-carry-20261122-2138/reward.svg)](https://make.fun/bounty/the-plan-make-fun-will-carry-20261122-2138?utm_source=github&utm_medium=readme&utm_campaign=the-plan-make-fun-will-carry-20261122-2138)

# The plan make.fun will carry

The bounty hands an AI agent $100 and 30 days and asks it to end up
with as much money as it most likely can. This entry is the plan that
agent would carry into those 30 days.

Day 1, it buys a $12 domain and a Twilio number, finds 200 US
plumbers on Google Maps who have no booking page, and pitches each
one a $49 AI missed-call text-back — a service that answers the
missed call and books the job. $49 setup plus $29 a month; about 8
clients comes to roughly $390 plus recurring revenue. The edge is
pure agent scale: only an agent can send 200 pitches and build each
setup in minutes. No trading, no crypto, no luck, no human in the
loop.

## What the code does

`main.ts` keeps the plan as a single line (279 Unicode code points,
inside the 280 cap) and writes it to `entry.txt` in the output
directory. Before writing it runs the gate: 1–280 code points, not
whitespace only, and no invisible shape problems — no leading or
trailing whitespace, no control characters, no double spaces, all of
which would silently eat the budget. After writing it reads the file
back and compares it byte for byte, then prints the code point
count, byte size and sha256.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That writes `out/entry.txt` and reports `entry written: ...`. To
check a fresh checkout holds the judged plan without touching it:

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts --verify
```

`--verify` prints `verify OK` and exits 0 on a match. Otherwise it
exits with a distinct code: 2 = no entry yet, 3 = content differs,
4 = length outside the cap, 5 = whitespace only, 6 = shape problem.
A plain gate failure on the plan itself exits 1.
