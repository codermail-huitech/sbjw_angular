


export class Customer{
  person_type_id: number;
  mobile1: string;
  mobile2: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  po: string;
  area: string;
  pin: string;
  opening_balance_Gold ?: number;
  opening_balance_LC ?: number;
  job_number ?: string;
  order_details_id ?: number;
  job_master_id ?: number;
  constructor(public id: number, public person_name: string, public email: string, public customer_category_id: number) {
      this.person_type_id = 10;
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

