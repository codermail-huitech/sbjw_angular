
export class Rate{
  id?: number;
  price_code_id: number;
  price: number;
  p_loss: number;
  customer_category_id: number;
  customer_category_name?: string;
  price_code_name?: string;
  discount?: number;

  constructor() {
  }
}
