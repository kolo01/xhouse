export interface ILocation {

    id: number;
    tenant: {
      user: {
        first_name: string;
        email: string;
      };
    };
    property_details: {
      name: string;
    }
    property: number;
    demand_status: string;
    comment: string;

}
