
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

  size?: string;
  material_id?: number;
  gross_weight?: number;
  // for showing table
  tag?: string;
  gold?: string;
  constructor() {
  }
}
