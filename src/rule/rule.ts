import { Condition } from "../condition/condition";



export interface Rule<TFacts> {
  name: string,
  condition: Condition<TFacts>;
}

