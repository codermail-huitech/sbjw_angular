
export class Stock{
  id: number;
  order_details_id: number;
  job_master_id: number;
  order_name?: string;
  set_gold: number;
  quantity: number;
  set_quantity: number;
  set_gross_weight: number;
  amount: number;
  set_amount: number;
  price: number;
  approx_gold: number;
  person_id?: number;
  person_name?: string;
  model_number?: string;
  job_number?: string;
  mv?: number;

  size?: string;
  material_id?: number;
  gross_weight?: number;
  totalGold?: number;
  // for showing table
  tag?: string;
  gold?: string;
  total?: number;
  pure_gold?: number;
  cost?: number;
  isSet?: boolean;
  isAgentSet?: boolean;
  // isSet ?= false;
  agent_id?: number;
  in_stock?: number;
  // bill_number?: string;
  constructor() {
  }
}
