export interface Space {
  id: number;
  account_id: number;
  name: string;
  color: string;
  balance: number;
  goal_balance: number;
  is_default: boolean;
}

export interface Rule {
  id: number;
  tag: string;
  percentage: number;
  space_id: number;
}
