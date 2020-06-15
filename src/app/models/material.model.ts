


export class Material{
  material_name: string;
  material_category_id: number;
  gold: number;
  silver: number;
  is_main_production_material: number;

  constructor(public id: number, public material_name: string, public material_category_id: number, public gold: number,public silver: number,public is_main_production_material: number){}
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

