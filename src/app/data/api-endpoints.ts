export const API_ENDPOINTS = {
  productTypeGroups: 'v2/oe/producttypegroup',
  countrySettings: 'v2/oe/settings/countrysettings',
  businessUnitSettings: 'v2/oe/settings/{countryCode}/plantSettings',
  configuredPlants: 'v2/oe/settings/configuredPlants?countryCode={countryCode}',
  shippingConditions: 'v2/im/shippingconditions',
  shippingTypes: 'v2/im/shippingtypes',
  productTypes: 'v2/im/producttypes',
  digitalConfirmationProcess: 'v2/digitalconfirmationprocesses',
  geolocationServices: 'v2/im/geolocationservices',
  deliveryWindows: 'v2/im/deliveryWindows',
  applicationClients: 'v2/im/applicationclients'
}; // end const
