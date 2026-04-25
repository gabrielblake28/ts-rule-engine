import { Trace } from "../condition/condition";
import { Rule } from "../rule/rule";
import { Decision, Kind } from "./engine.types";

type Options = {
  trace: boolean
}

export class RuleEngine<TFacts> {

  evaluate(facts: TFacts, rules: Rule<TFacts>[], opts?: Options): Decision {

    let result: Decision;

    if (opts?.trace) {
      result = this.evaluateWithTrace(facts, rules)
    } else {
      result = this.evaluateWithoutTrace(facts, rules)

    }

    return result;
  }

  private evaluateWithoutTrace(facts: TFacts, rules: Rule<TFacts>[]): Decision {
    const passed: string[] = [];
    const failed: string[] = [];

    for (const rule of rules) {
      if (!rule.condition.evaluate(facts)) {
        failed.push(rule.name)
        continue;
      }

      passed.push(rule.name)
    }

    const result: Decision = failed.length > 0 ? {
      result: Kind.FAIL,
      passed,
      failed
    } : {
      result: Kind.PASS,
      passed,
    }

    return result;
  }

  private evaluateWithTrace(facts: TFacts, rules: Rule<TFacts>[]): Decision {
    const passed: string[] = [];
    const failed: string[] = [];
    const traces: Trace[] = [];

    for (const rule of rules) {

      const result = rule.condition.explain(facts)
      traces.push(result);

      if (!result.result) {
        failed.push(rule.name)
        continue;
      }

      passed.push(rule.name)
    }

    const result: Decision = failed.length > 0 ? {
      result: Kind.FAIL,
      passed,
      failed,
      trace: traces
    } : {
      result: Kind.PASS,
      passed,
      trace: traces
    }

    return result;
  }
}


