
export class Stock{
  id: number;
  order_details_id: number;
  job_master_id: number;
  order_name?: string;
  set_gold: number;
  quantity: number;
  set_quantity: number;
  amount: number;
  set_amount: number;
  price: number;
  approx_gold: number;
  person_id?: number;
  person_name?: string;
  model_number?: string;
  job_number?: string;

  //for showing table
  tag?: number;
  gold?: string;

  constructor() {
  }
}
