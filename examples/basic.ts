import { PredicateCondition, AndCondition, OrCondition } from "../src/condition/condition";
import { Rule } from "../src/rule/rule";
import { RuleEngine } from "../src/engine/engine";

// Facts
type UserFacts = {
  age: number;
  country: string;
  memberType: string;
};

const facts: UserFacts = { age: 15, country: "US", memberType: "free" };

// Conditions
const ageCheck = new PredicateCondition("age > 18", (f: UserFacts) => f.age > 18);
const usCheck = new PredicateCondition("country === US", (f: UserFacts) => f.country === "US");
const proCheck = new PredicateCondition("memberType === pro", (f: UserFacts) => f.memberType === "pro");

// Rules
const ageRule: Rule<UserFacts> = {
  name: "age-rule",
  description: "User must be over 18",
  condition: ageCheck,
  priority: 1,
};

const andRule: Rule<UserFacts> = {
  name: "and-rule",
  description: "User must be over 18 AND from US",
  condition: new AndCondition("age > 18 AND country === US", [ageCheck, usCheck]),
  priority: 2,
};

const orRule: Rule<UserFacts> = {
  name: "or-rule",
  description: "User must be over 18 OR pro member",
  condition: new OrCondition("age > 18 OR pro member", [ageCheck, proCheck]),
  priority: 3,
};

const engine = new RuleEngine<UserFacts>();

console.log("=== Simple predicate (fails) ===");
const simple = engine.evaluate(facts, [ageRule], { trace: true });
console.log(JSON.stringify(simple, null, 2));

console.log("\n=== AND with short-circuit (fails on first child) ===");
const andResult = engine.evaluate(facts, [andRule], { trace: true });
console.log(JSON.stringify(andResult, null, 2));

console.log("\n=== OR with short-circuit (passes on second child... wait, first child fails) ===");
const orResult = engine.evaluate(facts, [orRule], { trace: true });
console.log(JSON.stringify(orResult, null, 2));

console.log("\n=== Multiple rules ===");
const multi = engine.evaluate(facts, [ageRule, andRule, orRule], { trace: true });
console.log(JSON.stringify(multi, null, 2));

console.log("\n=== Without trace (fast path) ===");
const noTrace = engine.evaluate(facts, [ageRule, andRule, orRule]);
console.log(JSON.stringify(noTrace, null, 2));
