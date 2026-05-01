# TypeScript Rule Engine

A type-safe, composable rule engine built from scratch in TypeScript. It evaluates business rules against a typed set of facts using a tree-based condition model, with optional deep tracing to explain exactly why a rule passed or failed.

## What It Does

The engine takes a set of typed **facts** (e.g., a user profile, an order) and a list of **rules**, then evaluates each rule's condition to produce a **pass/fail decision**. Conditions can be combined with `AND`, `OR`, and `NOT` logic, nested arbitrarily deep, and are evaluated with short-circuiting for performance. The engine exposes `evaluate` for a fast pass/fail decision and `evaluateWithTrace` when you need a full execution trace down to every leaf.

### Quick Example

```typescript
const isAdult = new PredicateCondition((f: UserFacts) => f.age >= 18, "age >= 18");
const isUS = new PredicateCondition((f: UserFacts) => f.country === "US", "country = US");

const rule: Rule<UserFacts> = {
  name: "eligible",
  condition: new AndCondition([isAdult, isUS], "adult and US"),
};

const engine = new RuleEngine<UserFacts>();
const decision = engine.evaluate(facts, [rule]);
// or, when you need the full trace tree per rule:
const traced = engine.evaluateWithTrace(facts, [rule]);
```

## Architecture Highlights

- **Type-safe facts** — Rules are generic over `TFacts`, so the compiler guarantees conditions only access valid fields.
- **Composite pattern** — `PredicateCondition` (leaf) and `AndCondition` / `OrCondition` / `NotCondition` (branches) share a common `Condition<TFacts>` base, enabling arbitrary nesting.
- **Short-circuit evaluation** — `AND` stops at the first false child; `OR` stops at the first true child, avoiding unnecessary work.
- **Two evaluation paths** — `evaluate` returns a fast pass/fail decision; `evaluateWithTrace` returns the same decision plus a typed `Trace` tree per rule. The return type narrows automatically, so `result.trace` only exists on the traced path.
- **Strategies** — Evaluate every rule (`all`, the default), stop at the first failure (`allPass`), or stop at the first pass (`anyPass`). Rule order in the input array determines priority.
- **Clean separation** — `Rule` (name + condition), `Condition` (logic tree), and `RuleEngine` (orchestration + decision formatting) are decoupled.

## Tech Stack

- **TypeScript** — Strict typing, generics, and discriminated unions for trace nodes.
- **Vitest** — Unit tests covering leaf predicates, composite logic, and edge cases.

## Learning Goals

I built this project to practice:

1. **Generics & type-level design** — Using `TFacts` to make the entire rule graph type-safe without leaking implementation details.
2. **Composite & Strategy patterns** — Designing a small internal DSL where leaf predicates and composite logic are interchangeable.
3. **Performance-aware evaluation** — Implementing short-circuit logic manually and separating traced vs. untraced evaluation paths.
4. **Observability in rule systems** — Adding first-class tracing (`explain`) so failures are inspectable, not opaque boolean results.
5. **TDD with Vitest** — Writing tests before/while building the `And`, `Or`, `Not`, and `Predicate` condition classes.

## Running It

```bash
# Run tests
npm test

# Run examples
npx tsx examples/basic.ts
npx tsx examples/nested.ts
```
