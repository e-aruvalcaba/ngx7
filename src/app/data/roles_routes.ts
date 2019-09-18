export const ROLE_ROUTES = [
    {
        roleName: 'SECM_RCCC_LOGA',
        routes: [
          '/app/rccc/overall-capacity',
          '/app/rccc/availability-inquiries',
          '/app/rccc/index-dashboard',
          '/app/settings/language',
          '/app/rccc/documents'
        ]
    }, {
        roleName: 'SECM_RCCC_LOGP',
        routes: [
          '/app/rccc/distributed-capacity',
          '/app/rccc/availability-inquiries',
          '/app/rccc/index-dashboard',
          '/app/settings/language',
          '/app/rccc/documents'
        ]
    }, {
        roleName: 'SECM_RCCC_WHSM',
        routes: [
          '/app/rccc/overall-capacity',
          '/app/rccc/distributed-capacity',
          '/app/rccc/availability-inquiries',
          '/app/rccc/grco/holidays',
          '/app/rccc/index-dashboard',
          '/app/settings/language'
        ]
    }, {
        roleName: 'SECM_RCCC_TA',
        routes: [
          '/app/rccc/availability-inquiries',
          '/app/rccc/grco/frequency',
          '/app/rccc/index-dashboard',
          '/app/settings/language'
        ]
    }, {
        roleName: 'SECM_RCCC_VIEW',
        routes: [
          '/app/rccc/availability-inquiries',
          '/app/rccc/index-dashboard',
          '/app/rccc/flco/fleet-capacity',
          '/app/settings/language'
        ]
    }, {
        roleName: 'SECM_RCCC_ADLOG',
        routes: [
          '/app/rccc/flco/fleet-business-unit',
          '/app/rccc/flco/fleet-capacity',
          '/app/rccc/availability-inquiries',
          '/app/rccc/index-dashboard',
          '/app/settings/language'
        ]
    }, {
        roleName: 'SECM_RCCC_BSO',
        routes: [
          '/app/rccc/flco/fleet-catalog',
          '/app/rccc/flco/fleet-coverage',
          '/app/rccc/availability-inquiries',
          '/app/rccc/index-dashboard',
          '/app/rccc/grco/holidays'
          ]
    }, {
        roleName: 'SECM_RCCC_LOC',
        routes: [
          '/app/settings/country',
          '/app/rccc/settings/country',
          '/app/settings/business-unit',
          '/app/settings/language'
        ]
    }, {
        roleName: 'SECM_RCCC_BUS',
        routes: [
          '/app/settings/business-unit',
          '/app/rccc/settings/business-unit',
          '/app/settings/language'
        ]
    }
];
