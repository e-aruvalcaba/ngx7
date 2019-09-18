export const RCCC_NAVBAR_ITEMS = [
  {
    icon: "/graphics/rccc.png",
    title: "rccc.landing_page.modules.rccc",
    shortTitle: "rccc.landing_page.modules.rccc_short_title",
    description: "rccc.landing_page.modules.rccc",
    active: true,
    routeLink: null,
    href: null,
    childs: [
      {
        icon: "/graphics/business-unit-capacity.svg",
        title: "rccc.landing_page.modules.business_unit_capacity",
        shortTitle: "rccc.landing_page.modules.business_unit_capacity_short_title",
        description: "rccc.landing_page.modules.business_unit_capacity",
        active: true,
        routeLink: null,
        href: null,
        childs: [
          {
            icon: "/graphics/overall-business-unit-capacity.svg",
            title: "rccc.landing_page.modules.overall_business_unit_capacity",
            shortTitle: "rccc.landing_page.modules.overall_business_unit_capacity_short_title",
            description: "rccc.landing_page.modules.overall_business_unit_capacity",
            active: true,
            routeLink: "/deliverysch/plant-capacity",
            href: null,
            childs: null
          },
          {
            icon: "/graphics/distribution-business-unit-capacity.svg",
            title: "rccc.landing_page.modules.distributed_business_unit_capacity",
            shortTitle: "rccc.landing_page.modules.distributed_business_unit_capacity_short_title",
            description: "rccc.landing_page.modules.distributed_business_unit_capacity",
            active: true,
            routeLink: "deliverysch/plant-capacity-distribution",
            href: null,
            childs: null
          }
        ]
      },
      {
        icon: "/graphics/availability-inquiries.svg",
        title: "rccc.landing_page.modules.availability_inquiries",
        shortTitle: "rccc.landing_page.modules.availability_inquiries_short_title",
        description: "rccc.landing_page.modules.availability_inquiries",
        active: true,
        routeLink: "availability-inquiries",
        href: null,
        childs: null
      }
    ]
  }
]
