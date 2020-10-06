


export class GoldReceipt{
  id: number;
  received_date: string;
  customer_id: number;
  agent_id: number;
  gold_received: number;
  bill_master_id : number;
  bill_number ?: number;
  customer_name ?: string;
  agent_name ?: string;

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

