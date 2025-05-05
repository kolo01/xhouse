export interface Visit {

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
    visit_date: string;
    demand_status: string;
    comment: string;
}
