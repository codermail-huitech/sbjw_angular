
export class Stock{
  id: number;
  order_details_id: number;
  job_master_id: number;
  order_name?: string;
  // gold: number;
  set_gold: number;
  quantity: number;
  set_quantity: number;
  amount: number;
  set_amount: number;
  price: number;
  approx_gold: number;
  person_id?: number;
  // tag?: number;
  person_name?: string;

  constructor() {
  }
}
