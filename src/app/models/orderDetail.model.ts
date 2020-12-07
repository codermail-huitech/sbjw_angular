


export class OrderDetail{
  id?: number;
  order_master_id ?: number;
  material_id: number;
  product_id?: number;
  model_number: string;
  p_loss: number;
  price: number;
  price_code: string;
  approx_gold: number;
  size: string;
  quantity: number;
  amount: number;
  status_id ?: number;
  order_number?: string;
  person_name?: string;
  status?: any;
  discount?: number;
  constructor() {
  }
}

// export class CustomerModel {
//   mobile1: string;
//   mobile2: string;
//   address1: string;
//   address2: string;
//   city: string;
//   state: string;
//   po: string;
//   area: string;
//   pin: string;
//   constructor(public id: number,
//               public person_name: string,
//               public email: string,
//               public customer_category_id: number
//   ) {}
// }

