export const ORDER_FULFILLMENT_APP_MENUES = [
  {
    icon: '/graphics/rccc.png',
    title: 'rccc.landing_page.modules.rccc',
    shortTitle: 'rccc.landing_page.modules.rccc_short_title',
    description: 'rccc.landing_page.modules.rccc',
    active: true,
    routeLink: null,
    href: null,
    childs: [
      {
        icon: '/graphics/business-unit-capacity.svg',
        title: 'rccc.landing_page.modules.business_unit_capacity',
        shortTitle: 'rccc.landing_page.modules.business_unit_capacity_short_title',
        description: 'rccc.landing_page.modules.business_unit_capacity',
        active: true,
        routeLink: null,
        href: null,
        childs: [
          {
            icon: '/graphics/overall-business-unit-capacity.svg',
            title: 'rccc.landing_page.modules.overall_business_unit_capacity',
            shortTitle: 'rccc.landing_page.modules.overall_business_unit_capacity_short_title',
            description: 'rccc.landing_page.modules.overall_business_unit_capacity',
            active: true,
            routeLink: '/deliverysch/plant-capacity',
            href: null,
            childs: null
          },
          {
            icon: '/graphics/distribution-business-unit-capacity.svg',
            title: 'rccc.landing_page.modules.distributed_business_unit_capacity',
            shortTitle: 'rccc.landing_page.modules.distributed_business_unit_capacity_short_title',
            description: 'rccc.landing_page.modules.distributed_business_unit_capacity',
            active: true,
            routeLink: 'deliverysch/plant-capacity-distribution',
            href: null,
            childs: null
          }
        ]
      },
      {
        icon: '/graphics/availability-inquiries.svg',
        title: 'rccc.landing_page.modules.availability_inquiries',
        shortTitle: 'rccc.landing_page.modules.availability_inquiries_short_title',
        description: 'rccc.landing_page.modules.availability_inquiries',
        active: true,
        routeLink: 'availability-inquiries',
        href: null,
        childs: null
      }
    ]
  },
  {
    icon: '/graphics/vendor-managed-inventory.png',
    title: 'rccc.landing_page.modules.vendor_management_inventory',
    shortTitle: 'rccc.landing_page.modules.vendor_management_inventory',
    description: 'rccc.landing_page.modules.vendor_management_inventory',
    active: false,
    routeLink: null,
    href: "#",
    childs: null
  },
  {
    icon: '/graphics/order-taking-for-service-agent.png',
    title: 'rccc.landing_page.modules.order_taking_for_service_agent',
    shortTitle: 'rccc.landing_page.modules.order_taking_for_service_agent',
    description: 'rccc.landing_page.modules.order_taking_for_service_agent',
    active: false,
    routeLink: null,
    href: "#",
    childs: null
  },
  {
    icon: '/graphics/backorder-management.png',
    title: 'rccc.landing_page.modules.backorder_management',
    shortTitle: 'rccc.landing_page.modules.backorder_management',
    description: 'rccc.landing_page.modules.backorder_management',
    active: false,
    routeLink: null,
    href: "#",
    childs: null
  },
  {
    icon: '/graphics/user-management.png',
    title: 'rccc.landing_page.modules.user_management',
    shortTitle: 'rccc.landing_page.modules.user_management',
    description: 'rccc.landing_page.modules.user_management',
    active: false,
    routeLink: null,
    href: "#",
    childs: null
  }
] // end export const OF_MODULES
