
export enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

export enum MemberType {
  Free = "FREE",
  Pro = "PRO",
  Max = "MAX"
}

export type Fact = {
  name: string,
  direction: Direction,
  memberType: MemberType,
  value: number
}
