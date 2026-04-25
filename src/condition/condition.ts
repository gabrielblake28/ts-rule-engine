
enum NodeKind {
  LEAF = "leaf",
  AND = "and",
  OR = "or"
}

interface LeafTrace {
  kind: NodeKind.LEAF,
  label: string,
  result: boolean,
}

interface AndTrace {
  kind: NodeKind.AND,
  label: string,
  result: boolean,
  children: Trace[]
}

interface OrTrace {
  kind: NodeKind.OR,
  label: string,
  result: boolean,
  children: Trace[]
}

export type Trace = LeafTrace | AndTrace | OrTrace;


export abstract class Condition<TFacts> {
  abstract evaluate(facts: TFacts): boolean;

  constructor(public label: string) { }

  and(other: Condition<TFacts>) { return new AndCondition(this.label, [this, other]); }
  or(other: Condition<TFacts>) { return new OrCondition(this.label, [this, other]); }
  // not() { return new NotCondition(this); }
}


export class PredicateCondition<TFacts> extends Condition<TFacts> {

  constructor(public label: string, private fn: (facts: TFacts) => boolean) {
    super(label)
  }

  evaluate(facts: TFacts): boolean {
    return this.fn(facts);
  }
}


export class AndCondition<TFacts> extends Condition<TFacts> {
  constructor(public label: string, private children: Condition<TFacts>[]) {
    super(label)
  }

  evaluate(facts: TFacts) {
    return this.children.every(child => child.evaluate(facts))
  }
}


export class OrCondition<TFacts> extends Condition<TFacts> {
  constructor(public label: string, private children: Condition<TFacts>[]) {
    super(label)
  }

  evaluate(facts: TFacts) {
    return this.children.some(child => child.evaluate(facts))
  }
}

// export class NotCondition<TFacts> extends Condition<TFacts> {
//   constructor(private child: Condition<TFacts>) {
//     super();
//   }
//
//   evaluate(facts: TFacts): boolean {
//     return !this.child.evaluate(facts)
//   }
// }

