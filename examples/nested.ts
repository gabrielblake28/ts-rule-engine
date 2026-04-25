import { PredicateCondition, AndCondition, OrCondition } from "../src/condition/condition";
import { Rule } from "../src/rule/rule";
import { RuleEngine } from "../src/engine/engine";

// Facts
type OrderFacts = {
  total: number;
  itemCount: number;
  country: string;
  customerTier: string;
  couponCode: string;
};

const facts: OrderFacts = {
  total: 250,
  itemCount: 5,
  country: "CA",
  customerTier: "silver",
  couponCode: "SAVE20",
};

// Leaf conditions
const highValue = new PredicateCondition("total > 200", (f: OrderFacts) => f.total > 200);
const manyItems = new PredicateCondition("itemCount > 10", (f: OrderFacts) => f.itemCount > 10);
const usCustomer = new PredicateCondition("country === US", (f: OrderFacts) => f.country === "US");
const caCustomer = new PredicateCondition("country === CA", (f: OrderFacts) => f.country === "CA");
const goldTier = new PredicateCondition("tier === gold", (f: OrderFacts) => f.customerTier === "gold");
const validCoupon = new PredicateCondition("coupon === SAVE20", (f: OrderFacts) => f.couponCode === "SAVE20");

// Nested: (highValue AND manyItems) OR (usCustomer AND goldTier) OR (caCustomer AND validCoupon)
const complexCondition = new OrCondition("complex eligibility", [
  new AndCondition("premium order", [highValue, manyItems]),
  new AndCondition("US gold customer", [usCustomer, goldTier]),
  new AndCondition("CA coupon customer", [caCustomer, validCoupon]),
]);

const rule: Rule<OrderFacts> = {
  name: "nested-eligibility",
  description: "Complex nested eligibility",
  condition: complexCondition,
  priority: 1,
};

const engine = new RuleEngine<OrderFacts>();

console.log("=== Deep nested tree ===");
const result = engine.evaluate(facts, [rule], { trace: true });
console.log(JSON.stringify(result, null, 2));

// Walk the trace manually to show the shape
function printTrace(trace: any, indent = 0) {
  const prefix = "  ".repeat(indent);
  console.log(`${prefix}[${trace.kind}] ${trace.label} => ${trace.result}`);
  if (trace.children) {
    for (const child of trace.children) {
      printTrace(child, indent + 1);
    }
  }
}

console.log("\n=== Pretty trace ===");
if ("trace" in result && result.trace) {
  for (const t of result.trace) {
    printTrace(t);
  }
}
