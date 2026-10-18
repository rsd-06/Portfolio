# Blog source notes — The Infinite Hotel Paradox

Research notes for a future post. Not published (not under `public/` or `src/content`).

Sources:
- TED-Ed, "The Infinite Hotel Paradox" — https://youtu.be/Uj3_KqkI9Zo
- Follow-up on sizes of infinity — https://youtu.be/OxGsU8oIWjY?si=IMGhK81IosD7o_j0

Story arc for the post: **Hilbert's Hotel → Cantor (sizes of infinity) → Russell → Gödel → Turing → Theory of Computation → computers / smartphones.** Keep the closing claim honest: Cantor did not "invent the phone"; his work fed a long chain of foundational questions that became part of the theory underneath computing.

---

## Part 1 — Hilbert's Hotel

"Paradox" here doesn't mean the maths is wrong; it means the result is wildly counter-intuitive.

1. **Normal hotel.** 100 rooms, all occupied. One more guest → no room. That's what we expect.
2. **Infinite hotel.** Rooms 1, 2, 3, … forever, every one occupied. A new guest arrives. "It's full" — but infinity behaves differently.
3. **Manager's trick (one guest).** Everyone moves from room n to n+1. Room 1 frees up. *Full hotel + 1 guest still fits.*
4. **Ten guests.** Move n → n+10. Rooms 1–10 free up.
5. **An infinite bus.** Move every guest n → 2n. Existing guests now fill the even rooms; all the odd rooms (1, 3, 5, …) — infinitely many — are free. Passenger k → room 2k−1. In this sense of countable infinity, ∞ + ∞ = ∞.
6. **Why it's a "paradox".** In a finite hotel, "full" means nothing more fits. In the infinite one we can add infinitely many more. The root fact: *an infinite set can have the same size as a proper subset of itself.* ℕ = {1,2,3,…} and evens E = {2,4,6,…} pair perfectly (n ↔ 2n), so |ℕ| = |E| even though E ⊂ ℕ.

| Finite | Infinite |
|---|---|
| Full means no more can fit | "Full" doesn't mean no more can be added |
| 100 rooms can't hold 101 people | Infinitely many rooms can take infinitely many more |
| 100 + 1 = 101 | ∞ + 1 = ∞ |
| A proper subset is smaller | A proper subset can have the same cardinality |

It isn't a contradiction in modern mathematics — it's a counter-intuitive thought experiment about infinite sets, and what was once called a paradox is now standard set theory.

---

## Part 2 — Different sizes of infinity

**Countable infinity (ℵ₀, "aleph-null").** Naturals, evens and integers all have the same size — each can be listed / paired with ℕ.

**Cantor's question:** are *all* infinities the same size? **No.**

**Naturals vs reals.** You can list the naturals. You *cannot* list all real numbers between 0 and 1 — not because no one has found a clever list, but because it's impossible. So the reals (cardinality 𝔠, "the continuum") are a bigger infinity: ℵ₀ < 𝔠.

**How can one infinity be bigger?** Cantor's definition: two sets are the same size if there's a one-to-one correspondence between them. That's exactly why Hilbert's hotel works.

**Diagonal argument.** Suppose someone claims a complete list of reals in (0,1):

```
1. 0.123456...
2. 0.738291...
3. 0.555555...
4. 0.913827...
```

Take the 1st digit of #1, 2nd of #2, 3rd of #3, … and change each one. The new number X differs from #1 in digit 1, from #2 in digit 2, and so on — so X is on no row. The list wasn't complete. Contradiction ⇒ the reals can't be listed.

**Power sets.** For any set A, its power set P(A) (all subsets) is strictly larger: |P(A)| > |A|. So from any infinity you can build a bigger one — an endless hierarchy ℵ₀, ℵ₁, ℵ₂, …

---

## Part 3 — From infinity to the foundations of maths

```
Infinity → Cantor → sizes of infinity → set theory → foundations of mathematics
→ paradoxes → "can mathematics prove everything?" → Gödel → limits of formal systems
→ Turing → theory of computation → computers → digital electronics + communication
→ modern computers / smartphones
```

- **Russell's paradox.** Let R be the set of all sets that don't contain themselves. Does R contain itself? Yes ⇒ No, No ⇒ Yes. Mathematicians realised the foundations needed real care.
- **Gödel.** Any sufficiently powerful, consistent formal system contains statements it can neither prove nor disprove. Mathematics has built-in limits.
- **Turing.** Asked what it means for something to be *computable* — and found limits there too (below).

The smartphone needs many independent branches meeting: electromagnetism → electronics → transistor → integrated circuit → microprocessor; and communication theory → digital communication → wireless → cellular. The Cantor → logic → computation → computer-science branch is one of several.

> Remember it as: the investigation of infinity reshaped the foundations of mathematics; those questions fed logic and theoretical computer science, part of the intellectual foundation of computing; computing, electronics and communications then developed along many paths into devices like smartphones.

---

## Part 4 — What Turing did, and the Theory of Computation

**The question.** Given a program and its input, can we always decide whether it eventually stops or runs forever?

```python
x = 10
while x > 0:
    x = x - 1      # stops

while True:
    print("Hello")  # never stops
```

Could a universal `CHECK(program, input)` → `STOPS` / `RUNS FOREVER` exist?

**The Turing machine (1936).** A mathematical model, not hardware: an infinite tape of symbols, a read/write head, an internal state. It can read, write, move left/right, change state, repeat. Simple — yet it captures general algorithmic computation, and gives a rigorous meaning to "computable".

**The Halting Problem.** Assume `HALT(program, input)` exists. Build:

```
EVIL(program):
    if HALT(program, program) says "STOPS":
        loop forever
    else:
        stop
```

Run `EVIL(EVIL)`. If HALT says it stops, it loops; if HALT says it loops, it stops. HALT is wrong either way ⇒ no universal HALT can exist. Not "not written yet", not "computers too slow" — mathematically impossible. (Same self-reference flavour as Cantor's diagonal and Russell's paradox.)

**Theory of Computation** = the mathematical study of what can be computed, what can't, and how efficiently.

```
            THEORY OF COMPUTATION
        ┌───────────┼────────────┐
     Automata   Computability   Complexity
```

- **Automata theory** — simplified machines: finite automata, pushdown automata, Turing machines. (A vending machine is a finite-state machine: ₹0 → ₹10 → ₹20 → ₹30 → dispense.)
- **Computability theory** — can any algorithm solve it at all? Sorting: yes. General halting: no.
- **Complexity theory** — if it's solvable, how expensive? Time/space, P vs NP, NP-complete, polynomial vs exponential.

Three layers:
1. Can it be solved at all? → computability
2. How efficiently? → complexity
3. Which algorithm should I implement? → algorithms / DSA (e.g. linear search O(n) vs binary search O(log n) on sorted data)

**The universal machine.** Turing also described a machine that can simulate any other Turing machine. Instead of one machine per task, one general machine + a program. That's the idea behind the general-purpose computer — and why the same phone processor can play music, run WhatsApp, process photos and run AI models: hardware + program.

**One sentence to remember:** Turing showed that computation itself has mathematical limits; Theory of Computation studies what machines can compute, what they can't, and how efficiently they can do it.
