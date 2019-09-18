export const ROLE_ROUTES = [
    {
        roleName: 'SECM_RCCC_LOGA',
        routes: ['/app/rccc/overall-capacity', '/app/rccc/availability-inquiries', '/app/rccc/grco/user-settings', '/app/rccc/grco/frequency']
    }, {
        roleName: 'SECM_RCCC_LOGP',
        routes: ['/app/rccc/distributed-capacity', '/app/rccc/availability-inquiries', '/app/rccc/grco/user-settings', '/app/rccc/grco/frequency']
    }, {
        roleName: 'SECM_RCCC_WHSM',
        routes: ['/app/rccc/overall-capacity', '/app/rccc/distributed-capacity', '/app/rccc/availability-inquiries', '/app/rccc/grco/user-settings', '/app/rccc/grco/holidays', '/app/rccc/grco/frequency']
    }, {
        roleName: 'SECM_RCCC_TA',
        routes: ['/app/rccc/flco/configuration-console', '/app/rccc/availability-inquiries', '/app/rccc/grco/user-settings', '/app/rccc/grco/frequency']
    }, {
        roleName: 'SECM_RCCC_VIEW',
        routes: ['/app/rccc/availability-inquiries', '/app/rccc/grco/user-settings', '/app/rccc/grco/frequency']
    }, {
        roleName: 'SECM_RCCC_ADLOG',
        routes: ['/app/rccc/flco/fleet-business-unit', '/app/rccc/flco/fleet-capacity', '/app/rccc/grco/loading-time ', '/app/rccc/cons/contingencies', '/app/rccc/availability-inquiries', '/app/rccc/grco/user-settings', '/app/rccc/flco/balance-transfer', '/app/rccc/grco/frequency']
    }, {
        roleName: 'SECM_RCCC_BSO',
        routes: ['/app/rccc/flco/fleet-catalog', '/app/rccc/flco/fleet-coverage', '/app/rccc/grco/loading-time ', '/app/rccc/grco/delivery-windows', '/app/rccc/grco/counter-offer-horizon', '/app/rccc/flco/configuration-console', '/app/rccc/availability-inquiries', '/app/rccc/grco/user-settings', '/app/rccc/grco/frequency']
    }
];
