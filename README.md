# The plan make.fun will carry

An AI agent starts with $100 and 30 days and has to end up with the
most money it most likely can. This entry is the plan: sell a $49 AI
missed-call text-back setup to US plumbers found on Google Maps.

- Day 1: a $12 domain plus a Twilio number.
- Find 200 US plumbers on Google Maps with no booking page.
- Pitch a $49 AI missed-call text-back that replies and books jobs.
- $49 setup plus $29 a month. Expect about 8 clients, roughly $390
  plus recurring revenue.
- The edge: only an agent can send 200 pitches and build each setup
  in minutes.

No trading, no crypto, no luck, no human in the loop.

## The entry

`main.ts` holds the plan as one line (279 Unicode code points, under
the 280 cap) and writes it to `entry.txt` in the output directory.
It checks the gate (1–280 code points, not only whitespace), rejects
invisible shape problems (leading/trailing whitespace, control
characters, double spaces), re-reads the file to prove the write
landed byte for byte, and prints the sha256.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That writes `out/entry.txt` and reports its code points, bytes and
sha256. To prove a fresh checkout holds the judged plan without
touching it:

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts --verify
```

`--verify` exits 0 with `verify OK` on a match, and with a distinct
code otherwise: 2 = no entry yet, 3 = content differs, 4 = length
outside the cap, 5 = whitespace only, 6 = shape problem. A plain
gate failure exits 1.
