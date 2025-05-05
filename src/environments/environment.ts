export const environmentDev = {
  baseUrl:  'https://yeleman.pythonanywhere.com/api',
    endPoint: {
    properties: {
      getAll: "properties",
      getOne: "property",
      getOneByOwner: "property/owner-property",
      getOwnerProperties: "properties/owner-properties",
      create: "properties",
      delete: "property",
      update: "property"
    },
    images: {
      getAll: "images",
      create: "images",

    },
    dashboard: {
      getAll: "owner-dashboard/",
    },
    demandsVisit: {
        getAll: "visit-demands",
        create: "visit-demands",
        delete: "visit-demands",
        update: "visit-demands",
        getOne: "visit-demands",
        getOneByOwner: "visit-demands/owner-demand",
        getOwnerDemands: "visit-demands/owner-demands",
    },
    demandsLocation: {
        getAll: "location-demands",
        create: "location-demands",
        delete: "location-demands",
        update: "location-demands",
        getOne: "location-demands",
        getOneByOwner: "location-demands/owner-demand",
        getOwnerDemands: "location-demands/owner-demands",
    },
  },
  production: true
};
