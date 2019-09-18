export const RCCC_APP_MENUES = [
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
        routeLink: 'rccc/overall-capacity',
        href: null,
        childs: null
      },
      {
        icon: '/graphics/distribution-business-unit-capacity.svg',
        title: 'rccc.landing_page.modules.documents',
        shortTitle: 'rccc.landing_page.modules.distributed_business_unit_capacity_short_title',
        description: 'rccc.landing_page.modules.distributed_business_unit_capacity',
        active: true,
        routeLink: 'rccc/distributed-capacity',
        href: null,
        childs: null
      },
      {
        icon: '/graphics/distribution-business-unit-capacity.svg',
        title: 'rccc.landing_page.modules.documents',
        shortTitle: 'rccc.landing_page.modules.documents',
        description: 'rccc.landing_page.modules.documents',
        active: true,
        routeLink: 'rccc/documents',
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
    routeLink: 'rccc/availability-inquiries',
    href: null,
    childs: null
  }
];
