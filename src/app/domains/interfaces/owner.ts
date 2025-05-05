export interface Owner {

    password: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    cards_type: string;
    num_cni: string;
    folders: Folder[];


  }

  interface Folder {
    acd_number: string;
    property_type: string;
    localization: string;
  }
