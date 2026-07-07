import { ComponentList, ComponentNode } from "./types";

// Tourism-focused component data. Product-style blocks are modeled as tour packages,
// and collection-style blocks are modeled as destination/travel-style collections.

/* 
=========================
  HEADER
========================= 
*/
export const header: ComponentNode = {
  id: "site_header",
  type: "Frame",
  parentId: "root",
  props: {},
  layout: {
    width: { value: 100, unit: "%" },
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: { top: 16, right: 28, bottom: 16, left: 28 },
    position: "sticky",
    top: 0,
    zIndex: 40,
    border: 1,
  },
  style: {
    backgroundColor: "#0b1220",
    borderColor: "#1e293b",
  },
  children: [
    {
      id: "site_brand_link",
      type: "Link",
      parentId: "site_header",
      props: { href: "#home" },
      layout: {
        display: "flex",
        alignItems: "center",
        gap: 10,
      },
      style: { textColor: "#f8fafc", fontWeight: 700, fontSize: 18 },
      children: [
        {
          id: "site_brand_icon",
          type: "Image",
          parentId: "site_brand_link",
          props: {
            src: "https://cdn-icons-png.flaticon.com/512/201/201623.png",
            alt: "logo",
          },
          layout: {
            width: { value: 28, unit: "px" },
            height: { value: 28, unit: "px" },
          },
          style: {},
          children: [],
        },
        {
          id: "site_brand_text",
          type: "Text",
          parentId: "site_brand_link",
          props: {
            text: "TrailNest",
            tag: "span",
          },
          layout: {},
          style: {
            textColor: "#f8fafc",
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1.1,
          },
          children: [],
        },
      ],
    },
    {
      id: "site_nav",
      type: "Frame",
      parentId: "site_header",
      props: {},
      layout: {
        display: "flex",
        alignItems: "center",
        gap: 18,
      },
      style: {},
      children: [
        {
          id: "site_nav_home",
          type: "Link",
          parentId: "site_nav",
          props: {
            text: "Home",
            href: "/",
          },
          layout: {},
          style: { textColor: "#cbd5e1", fontSize: 14 },
          locked: true,
          children: [],
        },
        {
          id: "site_nav_destinations",
          type: "Link",
          parentId: "site_nav",
          props: {
            text: "Destinations",
            href: "/destinations",
          },
          layout: {},
          style: { textColor: "#cbd5e1", fontSize: 14 },
          locked: true,
          children: [],
        },
        {
          id: "site_nav_packages",
          type: "Link",
          parentId: "site_nav",
          props: {
            text: "Packages",
            href: "/packages",
          },
          layout: {},
          style: { textColor: "#cbd5e1", fontSize: 14 },
          locked: true,
          children: [],
        },
        {
          id: "site_nav_services",
          type: "Link",
          parentId: "site_nav",
          props: {
            text: "Services",
            href: "/services",
          },
          layout: {},
          style: { textColor: "#cbd5e1", fontSize: 14 },
          locked: true,
          children: [],
        },
        {
          id: "site_nav_activities",
          type: "Link",
          parentId: "site_nav",
          props: {
            text: "Activities",
            href: "/activities",
          },
          layout: {},
          style: { textColor: "#cbd5e1", fontSize: 14 },
          locked: true,
          children: [],
        },
        {
          id: "site_nav_contact",
          type: "Link",
          parentId: "site_nav",
          props: {
            text: "Contact",
            href: "/contact",
          },
          layout: {},
          style: { textColor: "#cbd5e1", fontSize: 14 },
          locked: true,
          children: [],
        },
        {
          id: "site_nav_signin",
          type: "Link",
          parentId: "site_nav",
          props: {
            text: "Sign In",
            href: "/signin",
          },
          layout: {
            padding: { top: 10, right: 14, bottom: 10, left: 14 },
          },
          style: {
            backgroundColor: "#22c55e",
            textColor: "#052e16",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            textAlign: "center",
          },
          locked: true,
          children: [],
        },
        {
          id: "site_nav_signup",
          type: "Link",
          parentId: "site_nav",
          props: {
            text: "Sign Up",
            href: "/signup",
          },
          layout: {
            padding: { top: 10, right: 14, bottom: 10, left: 14 },
          },
          style: {
            backgroundColor: "#e2e8f0",
            textColor: "#0f172a",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            textAlign: "center",
          },
          locked: true,
          children: [],
        },
      ],
    },
  ],
};

/* 
=========================
  TEMPLATE / BODY
========================= */
export const template: ComponentNode = {
  id: "site_template",
  type: "Frame",
  parentId: "root",
  props: {},
  layout: {
    width: { value: 100, unit: "%" },
    minHeight: { value: 1200, unit: "px" },
    display: "flex",
    flexDirection: "column",
    gap: 0,
    overflow: "hidden",
  },
  style: {
    backgroundColor: "#f8fafc",
  },
  children: [
    {
      id: "hero_section",
      type: "Frame",
      parentId: "site_template",
      props: {},
      layout: {
        width: { value: 100, unit: "%" },
        minHeight: { value: 620, unit: "px" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: { top: 70, right: 24, bottom: 70, left: 24 },
      },
      style: {
        backgroundImage:
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
      },
      children: [
        {
          id: "hero_overlay",
          type: "Frame",
          parentId: "hero_section",
          props: {},
          layout: {
            width: { value: 1100, unit: "px" },
            maxWidth: { value: 100, unit: "%" },
            display: "flex",
            flexDirection: "column",
            gap: 18,
            padding: { top: 34, right: 34, bottom: 34, left: 34 },
          },
          style: {
            backgroundColor: "#0f172ab8",
            borderRadius: 16,
          },
          children: [
            {
              id: "hero_title",
              type: "Text",
              parentId: "hero_overlay",
              props: {
                text: "Discover Sri Lanka, One Unforgettable Journey at a Time",
                tag: "h1",
              },
              layout: {},
              style: {
                textColor: "#f8fafc",
                fontSize: 54,
                fontWeight: 800,
                lineHeight: 1.06,
              },
              children: [],
            },
            {
              id: "hero_subtitle",
              type: "Text",
              parentId: "hero_overlay",
              props: {
                text: "Curated destinations, local experiences, and practical planning tools in one complete travel workspace.",
                tag: "p",
              },
              layout: {
                maxWidth: { value: 760, unit: "px" },
              },
              style: {
                textColor: "#dbeafe",
                fontSize: 18,
                lineHeight: 1.6,
              },
              children: [],
            },
            {
              id: "hero_actions",
              type: "Frame",
              parentId: "hero_overlay",
              props: {},
              layout: {
                display: "flex",
                gap: 14,
                wrap: true,
              },
              style: {},
              children: [
                {
                  id: "hero_primary_cta",
                  type: "Link",
                  parentId: "hero_actions",
                  props: {
                    text: "Explore Destinations",
                    href: "/destinations",
                  },
                  layout: {
                    padding: { top: 13, right: 18, bottom: 13, left: 18 },
                  },
                  style: {
                    backgroundColor: "#22c55e",
                    textColor: "#052e16",
                    borderRadius: 10,
                    fontWeight: 700,
                    textAlign: "center",
                  },
                  children: [],
                },
                {
                  id: "hero_secondary_cta",
                  type: "Link",
                  parentId: "hero_actions",
                  props: {
                    text: "Contact Us",
                    href: "/contact",
                  },
                  layout: {
                    padding: { top: 13, right: 18, bottom: 13, left: 18 },
                    border: 1,
                  },
                  style: {
                    borderColor: "#bae6fd",
                    textColor: "#e0f2fe",
                    borderRadius: 10,
                    fontWeight: 700,
                    textAlign: "center",
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "destinations_section",
      type: "Frame",
      parentId: "site_template",
      props: {},
      layout: {
        width: { value: 100, unit: "%" },
        display: "flex",
        justifyContent: "center",
        padding: { top: 56, right: 24, bottom: 56, left: 24 },
      },
      style: {
        backgroundColor: "#f8fafc",
      },
      children: [
        {
          id: "destinations_inner",
          type: "Frame",
          parentId: "destinations_section",
          props: {},
          layout: {
            width: { value: 100, unit: "%" },
            maxWidth: { value: 1180, unit: "px" },
            display: "flex",
            flexDirection: "column",
            gap: 24,
          },
          style: {},
          children: [
            {
              id: "destinations_heading",
              type: "Text",
              parentId: "destinations_inner",
              props: {
                text: "Popular Destinations",
                tag: "h2",
              },
              layout: {},
              style: {
                textColor: "#0f172a",
                fontSize: 34,
                fontWeight: 800,
                lineHeight: 1.1,
              },
              children: [],
            },
            {
              id: "destinations_grid",
              type: "Frame",
              parentId: "destinations_inner",
              props: {},
              layout: {
                width: { value: 100, unit: "%" },
                display: "grid",
                columns: 3,
                gap: 20,
              },
              style: {},
              runtime: {
                repeat: {
                  enabled: true,
                  targetResource: "destination",
                  menu: "destinations",
                  dataPath: "data.items",
                  policyPath: "meta.resourcePolicy",
                  limit: 6,
                },
              },
              children: [
                {
                  id: "destination_card_template",
                  type: "Frame",
                  parentId: "destinations_grid",
                  props: {},
                  layout: {
                    width: { value: 100, unit: "%" },
                    maxWidth: { value: 100, unit: "%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    padding: { top: 14, right: 14, bottom: 14, left: 14 },
                  },
                  style: {
                    backgroundColor: "#ffffff",
                    borderRadius: 14,
                    boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
                  },
                  children: [
                    {
                      id: "destination_card_image",
                      type: "Image",
                      parentId: "destination_card_template",
                      props: {
                        src: "/no-image.jpg",
                        alt: "Destination",
                        objectFit: "cover",
                      },
                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 200, unit: "px" },
                      },
                      style: {
                        borderRadius: 10,
                      },
                      runtime: {
                        columnMap: {
                          src: "image",
                          alt: "title",
                        },
                      },
                      children: [],
                    },
                    {
                      id: "destination_card_title",
                      type: "Text",
                      parentId: "destination_card_template",
                      props: {
                        text: "Destination",
                        tag: "h3",
                      },
                      layout: {},
                      style: {
                        textColor: "#0f172a",
                        fontSize: 22,
                        fontWeight: 700,
                      },
                      runtime: {
                        columnMap: {
                          text: "title",
                        },
                      },
                      children: [],
                    },
                    {
                      id: "destination_card_copy",
                      type: "Text",
                      parentId: "destination_card_template",
                      props: {
                        text: "Description",
                        tag: "p",
                      },
                      layout: {},
                      style: {
                        textColor: "#475569",
                        fontSize: 14,
                        lineHeight: 1.5,
                      },
                      runtime: {
                        columnMap: {
                          text: "description",
                        },
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "plan_cta_band",
      type: "Frame",
      parentId: "site_template",
      props: {},
      layout: {
        width: { value: 100, unit: "%" },
        display: "flex",
        justifyContent: "center",
        padding: { top: 56, right: 24, bottom: 56, left: 24 },
      },
      style: {
        backgroundColor: "#0f172a",
      },
      children: [
        {
          id: "plan_cta_inner",
          type: "Frame",
          parentId: "plan_cta_band",
          props: {},
          layout: {
            width: { value: 980, unit: "px" },
            maxWidth: { value: 100, unit: "%" },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            wrap: true,
          },
          style: {},
          children: [
            {
              id: "plan_cta_text",
              type: "Text",
              parentId: "plan_cta_inner",
              props: {
                text: "Ready to build your trip plan in minutes?",
                tag: "h3",
              },
              layout: {},
              style: {
                textColor: "#e2e8f0",
                fontSize: 30,
                fontWeight: 700,
                lineHeight: 1.2,
              },
              children: [],
            },
            {
              id: "plan_cta_button",
              type: "Link",
              parentId: "plan_cta_inner",
              props: {
                text: "Sign Up",
                href: "/signup",
              },
              layout: {
                padding: { top: 14, right: 20, bottom: 14, left: 20 },
              },
              style: {
                backgroundColor: "#22c55e",
                textColor: "#052e16",
                borderRadius: 10,
                fontWeight: 700,
                textAlign: "center",
              },
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

/* 
=========================
  FOOTER
========================= */
export const footer: ComponentNode = {
  id: "site_footer",
  type: "Frame",
  parentId: "root",
  props: {},
  layout: {
    width: { value: 100, unit: "%" },
    display: "flex",
    justifyContent: "center",
    padding: { top: 44, right: 24, bottom: 44, left: 24 },
  },
  style: {
    backgroundColor: "#020617",
  },
  children: [
    {
      id: "site_footer_inner",
      type: "Frame",
      parentId: "site_footer",
      props: {},
      layout: {
        width: { value: 1120, unit: "px" },
        maxWidth: { value: 100, unit: "%" },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        gap: 24,
        wrap: true,
      },
      style: {},
      children: [
        {
          id: "site_footer_brand",
          type: "Frame",
          parentId: "site_footer_inner",
          props: {},
          layout: {
            width: { value: 320, unit: "px" },
            display: "flex",
            flexDirection: "column",
            gap: 10,
          },
          style: {},
          children: [
            {
              id: "site_footer_brand_name",
              type: "Text",
              parentId: "site_footer_brand",
              props: {
                text: "TrailNest",
                tag: "h3",
              },
              layout: {},
              style: {
                textColor: "#f8fafc",
                fontSize: 24,
                fontWeight: 800,
              },
              children: [],
            },
            {
              id: "site_footer_brand_copy",
              type: "Text",
              parentId: "site_footer_brand",
              props: {
                text: "Practical tools and curated inspiration for smarter travel across Sri Lanka.",
                tag: "p",
              },
              layout: {},
              style: {
                textColor: "#94a3b8",
                fontSize: 14,
                lineHeight: 1.6,
              },
              children: [],
            },
          ],
        },
        {
          id: "site_footer_links",
          type: "Frame",
          parentId: "site_footer_inner",
          props: {},
          layout: {
            display: "flex",
            flexDirection: "column",
            gap: 10,
          },
          style: {},
          children: [
            {
              id: "site_footer_links_title",
              type: "Text",
              parentId: "site_footer_links",
              props: { text: "Explore", tag: "h4" },
              layout: {},
              style: {
                textColor: "#e2e8f0",
                fontSize: 15,
                fontWeight: 700,
              },
              children: [],
            },
            {
              id: "site_footer_link_1",
              type: "Link",
              parentId: "site_footer_links",
              props: { text: "Destinations", href: "/destinations" },
              layout: {},
              style: { textColor: "#94a3b8", fontSize: 14 },
              children: [],
            },
            {
              id: "site_footer_link_2",
              type: "Link",
              parentId: "site_footer_links",
              props: { text: "Packages", href: "/packages" },
              layout: {},
              style: { textColor: "#94a3b8", fontSize: 14 },
              children: [],
            },
            {
              id: "site_footer_link_3",
              type: "Link",
              parentId: "site_footer_links",
              props: { text: "Services", href: "/services" },
              layout: {},
              style: { textColor: "#94a3b8", fontSize: 14 },
              children: [],
            },
            {
              id: "site_footer_link_4",
              type: "Link",
              parentId: "site_footer_links",
              props: { text: "Activities", href: "/activities" },
              layout: {},
              style: { textColor: "#94a3b8", fontSize: 14 },
              children: [],
            },
          ],
        },
        {
          id: "site_footer_copyright",
          type: "Text",
          parentId: "site_footer_inner",
          props: {
            text: "© 2026 TrailNest. All rights reserved.",
            tag: "p",
          },
          layout: {
            margin: { top: 6 },
          },
          style: {
            textColor: "#ffffff",
            fontSize: 13,
            lineHeight: 1.5,
          },
          children: [],
        },
      ],
    },
  ],
};

export const sitePage = {
  header,
  template,
  footer,
};

export const components: ComponentList[] = [
  {
    label: "Banners",
    list: [
      {
        label: "Hero",
        icon: "🏞️",
        node: {
          id: "banner_hero_primary",
          type: "Frame",
          parentId: null,
          name: "Hero Banner",
          props: {},
          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 600, unit: "px" },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            padding: { top: 40, right: 40, bottom: 40, left: 40 },
            overflow: "hidden",
          },
          style: {
            backgroundImage:
              "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          },
          children: [
            {
              id: "banner_hero_primary_left",
              type: "Frame",
              parentId: "banner_hero_primary",
              props: {},
              layout: {
                width: { value: 50, unit: "%" },
                display: "flex",
                flexDirection: "column",
                gap: 16,
              },
              style: {},
              children: [
                {
                  id: "banner_hero_primary_title",
                  type: "Text",
                  parentId: "banner_hero_primary_left",
                  props: {
                    text: "Plan Your Next Sri Lankan Escape",
                    tag: "h1",
                  },
                  layout: {},
                  style: {
                    textColor: "#ffffff",
                    fontSize: 48,
                    fontWeight: 700,
                    lineHeight: 1.2,
                  },
                  children: [],
                },
                {
                  id: "banner_hero_primary_copy",
                  type: "Text",
                  parentId: "banner_hero_primary_left",
                  props: {
                    text: "Discover beaches, mountains, wildlife, culture, and local guided experiences across Sri Lanka.",
                    tag: "p",
                  },
                  layout: {},
                  style: {
                    textColor: "#ffffff",
                    fontSize: 18,
                    lineHeight: 1.6,
                  },
                  children: [],
                },
                {
                  id: "banner_hero_primary_cta",
                  type: "Link",
                  parentId: "banner_hero_primary_left",
                  props: {
                    text: "Sign In",
                    href: "/signin",
                  },
                  layout: {
                    width: { value: 140, unit: "px" },
                    padding: { top: 12, right: 16, bottom: 12, left: 16 },
                  },
                  style: {
                    backgroundColor: "#ffffff",
                    textColor: "#111111",
                    borderRadius: 8,
                    textAlign: "center",
                    fontWeight: 600,
                  },
                  children: [],
                },
              ],
            },
            {
              id: "banner_hero_primary_right",
              type: "Frame",
              parentId: "banner_hero_primary",
              props: {},
              layout: {
                width: { value: 50, unit: "%" },
                padding: { top: 10, right: 10, bottom: 10, left: 10 },
              },
              style: { backgroundColor: "#000" },
              children: [],
            },
          ],
        },
      },
      {
        label: "Hero: Bottom aligned",
        icon: "⬇️",
        node: {
          id: "banner_hero_bottom_aligned",
          parentId: null,
          type: "Frame",
          name: "Hero Bottom Aligned",
          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 560, unit: "px" },
            display: "flex",
            alignItems: "end",
            padding: { top: 32, right: 32, bottom: 32, left: 32 },
          },
          style: {
            backgroundImage:
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            borderRadius: 10,
          },
          props: {},
          children: [
            {
              id: "banner_hero_bottom_panel",
              parentId: "banner_hero_bottom_aligned",
              type: "Frame",
              layout: {
                width: { value: 680, unit: "px" },
                maxWidth: { value: 100, unit: "%" },
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: { top: 20, right: 20, bottom: 20, left: 20 },
              },
              style: {
                backgroundColor: "#0f172ac7",
                borderRadius: 10,
              },
              props: {},
              children: [
                {
                  id: "banner_hero_bottom_title",
                  parentId: "banner_hero_bottom_panel",
                  type: "Text",
                  props: { text: "Island escapes for every season", tag: "h2" },
                  layout: {},
                  style: {
                    fontSize: 34,
                    fontWeight: 700,
                    lineHeight: 1.15,
                    textColor: "#f8fafc",
                  },
                  children: [],
                },
                {
                  id: "banner_hero_bottom_copy",
                  parentId: "banner_hero_bottom_panel",
                  type: "Text",
                  props: {
                    text: "Book curated Sri Lanka tours with flexible dates and trusted local guides.",
                    tag: "p",
                  },
                  layout: {},
                  style: {
                    fontSize: 15,
                    lineHeight: 1.5,
                    textColor: "#dbeafe",
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Hero: Marquee",
        icon: "➿",
        node: {
          id: "banner_hero_marquee",
          parentId: null,
          type: "Frame",
          name: "Hero Marquee",
          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 460, unit: "px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: { top: 24, right: 24, bottom: 24, left: 24 },
            gap: 18,
            overflow: "hidden",
          },
          style: {
            backgroundColor: "#0b1220",
            borderRadius: 10,
          },
          props: {},
          children: [
            {
              id: "banner_hero_marquee_headline",
              parentId: "banner_hero_marquee",
              type: "Text",
              props: {
                text: "Your Sri Lanka adventure starts here",
                tag: "h2",
              },
              layout: {},
              style: {
                fontSize: 44,
                fontWeight: 800,
                lineHeight: 1.05,
                textColor: "#f8fafc",
              },
              children: [],
            },
            {
              id: "banner_hero_marquee_track",
              parentId: "banner_hero_marquee",
              type: "Frame",
              layout: { display: "flex", gap: 18, overflow: "hidden" },
              style: {},
              props: {},
              children: [
                {
                  id: "banner_hero_marquee_t1",
                  parentId: "banner_hero_marquee_track",
                  type: "Text",
                  props: { text: "HILL COUNTRY", tag: "span" },
                  layout: {},
                  style: {
                    fontSize: 48,
                    fontWeight: 700,
                    textColor: "#22c55e",
                  },
                  children: [],
                },
                {
                  id: "banner_hero_marquee_t2",
                  parentId: "banner_hero_marquee_track",
                  type: "Text",
                  props: { text: "•", tag: "span" },
                  layout: {},
                  style: {
                    fontSize: 48,
                    fontWeight: 700,
                    textColor: "#38bdf8",
                  },
                  children: [],
                },
                {
                  id: "banner_hero_marquee_t3",
                  parentId: "banner_hero_marquee_track",
                  type: "Text",
                  props: { text: "WILDLIFE PARKS", tag: "span" },
                  layout: {},
                  style: {
                    fontSize: 48,
                    fontWeight: 700,
                    textColor: "#f59e0b",
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Large logo",
        icon: "🔰",
        node: {
          id: "banner_large_logo",
          parentId: null,
          type: "Frame",
          name: "Large Logo Banner",
          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 360, unit: "px" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: { top: 28, right: 28, bottom: 28, left: 28 },
          },
          style: { backgroundColor: "#f8fafc", borderRadius: 10 },
          props: {},
          children: [
            {
              id: "banner_large_logo_wrap",
              parentId: "banner_large_logo",
              type: "Frame",
              layout: {
                width: { value: 540, unit: "px" },
                maxWidth: { value: 100, unit: "%" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              },
              style: {},
              props: {},
              children: [
                {
                  id: "banner_large_logo_img",
                  parentId: "banner_large_logo_wrap",
                  type: "Image",
                  props: {
                    src: "https://cdn-icons-png.flaticon.com/512/854/854929.png",
                    alt: "logo",
                    objectFit: "contain",
                  },
                  layout: {
                    width: { value: 130, unit: "px" },
                    height: { value: 130, unit: "px" },
                  },
                  style: {},
                  children: [],
                },
                {
                  id: "banner_large_logo_text",
                  parentId: "banner_large_logo_wrap",
                  type: "Text",
                  props: { text: "TrailNest Sri Lanka Tours", tag: "h2" },
                  layout: {},
                  style: {
                    fontSize: 34,
                    fontWeight: 800,
                    textColor: "#0f172a",
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Layered slideshow",
        icon: "🖼️",
        node: {
          id: "banner_layered_slideshow",
          parentId: null,
          type: "Frame",
          name: "Layered Slideshow",
          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 520, unit: "px" },
            position: "relative",
            overflow: "hidden",
            padding: { top: 24, right: 24, bottom: 24, left: 24 },
          },
          style: { backgroundColor: "#0f172a", borderRadius: 10 },
          props: {},
          children: [
            {
              id: "banner_layered_img_back",
              parentId: "banner_layered_slideshow",
              type: "Image",
              props: {
                src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
                alt: "slide",
                objectFit: "cover",
              },
              layout: {
                width: { value: 100, unit: "%" },
                height: { value: 100, unit: "%" },
              },
              style: { opacity: 0.35, borderRadius: 8 },
              children: [],
            },
            {
              id: "banner_layered_img_mid",
              parentId: "banner_layered_slideshow",
              type: "Image",
              props: {
                src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
                alt: "slide",
                objectFit: "cover",
              },
              layout: {
                position: "absolute",
                top: 38,
                right: 46,
                width: { value: 340, unit: "px" },
                height: { value: 220, unit: "px" },
              },
              style: {
                borderRadius: 8,
                boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
              },
              children: [],
            },
            {
              id: "banner_layered_img_front",
              parentId: "banner_layered_slideshow",
              type: "Image",
              props: {
                src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
                alt: "slide",
                objectFit: "cover",
              },
              layout: {
                position: "absolute",
                bottom: 36,
                left: 44,
                width: { value: 380, unit: "px" },
                height: { value: 250, unit: "px" },
              },
              style: {
                borderRadius: 8,
                boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
              },
              children: [],
            },
          ],
        },
      },
      {
        label: "Slideshow: Full frame",
        icon: "🎞️",
        node: {
          id: "banner_slideshow_full",
          parentId: null,
          type: "Frame",
          name: "Slideshow Full Frame",
          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 500, unit: "px" },
            position: "relative",
            overflow: "hidden",
          },
          style: { borderRadius: 10 },
          props: {},
          children: [
            {
              id: "banner_slideshow_full_img",
              parentId: "banner_slideshow_full",
              type: "Image",
              props: {
                src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
                alt: "hero",
                objectFit: "cover",
              },
              layout: {
                width: { value: 100, unit: "%" },
                height: { value: 100, unit: "%" },
              },
              style: {},
              children: [],
            },
            {
              id: "banner_slideshow_full_caption",
              parentId: "banner_slideshow_full",
              type: "Text",
              props: {
                text: "Golden beaches. Misty hills. Ancient kingdoms.",
                tag: "h3",
              },
              layout: { position: "absolute", left: 28, bottom: 28 },
              style: { fontSize: 30, fontWeight: 700, textColor: "#ffffff" },
              children: [],
            },
          ],
        },
      },
      {
        label: "Slideshow: Inset",
        icon: "🖼️",
        node: {
          id: "banner_slideshow_inset",
          parentId: null,
          type: "Frame",
          name: "Slideshow Inset",
          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 460, unit: "px" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: { top: 24, right: 24, bottom: 24, left: 24 },
          },
          style: { backgroundColor: "#e2e8f0", borderRadius: 10 },
          props: {},
          children: [
            {
              id: "banner_slideshow_inset_card",
              parentId: "banner_slideshow_inset",
              type: "Frame",
              layout: {
                width: { value: 900, unit: "px" },
                maxWidth: { value: 100, unit: "%" },
                height: { value: 360, unit: "px" },
                overflow: "hidden",
                padding: { top: 10, right: 10, bottom: 10, left: 10 },
              },
              style: { backgroundColor: "#ffffff", borderRadius: 10 },
              props: {},
              children: [
                {
                  id: "banner_slideshow_inset_img",
                  parentId: "banner_slideshow_inset_card",
                  type: "Image",
                  props: {
                    src: "https://images.unsplash.com/photo-1482192505345-5655af888cc4",
                    alt: "inset",
                    objectFit: "cover",
                  },
                  layout: {
                    width: { value: 100, unit: "%" },
                    height: { value: 100, unit: "%" },
                  },
                  style: { borderRadius: 8 },
                  children: [],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Split showcase",
        icon: "▣",
        node: {
          id: "banner_split_showcase",
          parentId: null,
          type: "Frame",
          name: "Split Showcase",
          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 460, unit: "px" },
            display: "flex",
            flexDirection: "row",
            gap: 16,
            overflow: "hidden",
          },
          style: {},
          props: {},
          children: [
            {
              id: "banner_split_left",
              parentId: "banner_split_showcase",
              type: "Image",
              props: {
                src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
                alt: "left",
                objectFit: "cover",
              },
              layout: {
                width: { value: 50, unit: "%" },
                height: { value: 460, unit: "px" },
              },
              style: { borderRadius: 8 },
              children: [],
            },
            {
              id: "banner_split_right_wrap",
              parentId: "banner_split_showcase",
              type: "Frame",
              layout: {
                width: { value: 50, unit: "%" },
                height: { value: 460, unit: "px" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 12,
                padding: { top: 24, right: 24, bottom: 24, left: 24 },
              },
              style: { backgroundColor: "#0f172a", borderRadius: 8 },
              props: {},
              children: [
                {
                  id: "banner_split_title",
                  parentId: "banner_split_right_wrap",
                  type: "Text",
                  props: {
                    text: "Find your next unforgettable Sri Lanka journey",
                    tag: "h2",
                  },
                  layout: {},
                  style: {
                    fontSize: 34,
                    fontWeight: 800,
                    lineHeight: 1.1,
                    textColor: "#f8fafc",
                  },
                  children: [],
                },
                {
                  id: "banner_split_copy",
                  parentId: "banner_split_right_wrap",
                  type: "Text",
                  props: {
                    text: "Compare destinations, plan better stops, and book trusted local travel experiences.",
                    tag: "p",
                  },
                  layout: {},
                  style: {
                    fontSize: 15,
                    lineHeight: 1.6,
                    textColor: "#cbd5e1",
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    label: "Tourism Collections",
    list: [
      {
        label: "Destination collection: Bento",
        icon: "🧩",
        node: {
          id: "collection_list_bento",
          parentId: null,
          type: "Frame",
          name: "Destination Collection Bento",

          layout: {
            width: { value: 100, unit: "%" },
            height: { value: 460, unit: "px" },
            display: "flex",
            flexDirection: "column",
            padding: { top: 20, right: 20, bottom: 20, left: 20 },
            gap: 16,
            overflow: "hidden",
          },

          style: {
            backgroundColor: "#ffffff",
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
          },

          props: {},
          dataBinding: { source: "destination_collection" },
          runtime: {
            repeat: {
              enabled: true,
              targetResource: "destination_collection",
              menu: "tourism-collections",
              dataPath: "data.items",
              policyPath: "meta.resourcePolicy",
              limit: 5,
            },
          },

          children: [
            {
              id: "collection_list_bento_heading",
              parentId: "collection_list_bento",
              type: "Text",
              name: "Bento Heading",
              layout: {},
              style: {
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.1,
                textColor: "#111111",
                textAlign: "left",
              },
              props: {
                text: "Explore by travel style",
                tag: "h2",
              },
              children: [],
            },

            {
              id: "collection_list_bento_grid",
              parentId: "collection_list_bento",
              type: "Frame",
              name: "Bento Grid",

              layout: {
                width: { value: 100, unit: "%" },
                height: { value: 620, unit: "px" },
                display: "flex",
                flexDirection: "column",
                gap: 10,
                overflow: "hidden",
              },

              style: {},
              props: {},

              children: [
                {
                  id: "collection_bento_top_row",
                  parentId: "collection_list_bento_grid",
                  type: "Frame",
                  name: "Top Row",

                  layout: {
                    width: { value: 100, unit: "%" },
                    height: { value: 360, unit: "px" },
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    overflow: "hidden",
                  },

                  style: {},
                  props: {},

                  children: [
                    {
                      id: "collection_bento_card_1",
                      parentId: "collection_bento_top_row",
                      type: "Frame",
                      name: "Destination Card 1",

                      layout: {
                        width: { value: 32, unit: "%" },
                        height: { value: 360, unit: "px" },
                        overflow: "hidden",
                      },

                      style: {
                        borderRadius: 8,
                      },

                      props: {},

                      children: [
                        {
                          id: "collection_bento_card_1_image",
                          parentId: "collection_bento_card_1",
                          type: "Image",
                          name: "Destination Image 1",

                          layout: {
                            width: { value: 100, unit: "%" },
                            height: { value: 100, unit: "%" },
                          },

                          props: {
                            src: "/no-image.jpg",
                            alt: "Sri Lanka destination collection image",
                            objectFit: "cover",
                          },

                          runtime: {
                            columnMap: {
                              src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                              alt: "name|title|tour_name|destination|collection_name",
                            },
                          },

                          children: [],
                        },

                        {
                          id: "collection_bento_card_1_text",
                          parentId: "collection_bento_card_1",
                          type: "Text",
                          name: "Destination Label 1",

                          layout: {
                            position: "absolute",
                            left: 10,
                            bottom: 10,
                          },

                          style: {
                            fontSize: 10,
                            fontWeight: 700,
                            textColor: "#ffffff",
                            textAlign: "left",
                          },

                          props: {
                            text: "Curated Sri Lanka escape",
                            tag: "span",
                          },

                          runtime: {
                            columnMap: {
                              text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                            },
                          },

                          children: [],
                        },
                      ],
                    },

                    {
                      id: "collection_bento_card_2",
                      parentId: "collection_bento_top_row",
                      type: "Frame",
                      name: "Destination Card 2",

                      layout: {
                        width: { value: 32, unit: "%" },
                        height: { value: 360, unit: "px" },
                        overflow: "hidden",
                      },

                      style: {
                        borderRadius: 8,
                      },

                      props: {},

                      children: [
                        {
                          id: "collection_bento_card_2_image",
                          parentId: "collection_bento_card_2",
                          type: "Image",
                          name: "Destination Image 2",

                          layout: {
                            width: { value: 100, unit: "%" },
                            height: { value: 100, unit: "%" },
                          },

                          props: {
                            src: "/no-image.jpg",
                            alt: "Sri Lanka destination collection image",
                            objectFit: "cover",
                          },

                          runtime: {
                            columnMap: {
                              src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                              alt: "name|title|tour_name|destination|collection_name",
                            },
                          },

                          children: [],
                        },

                        {
                          id: "collection_bento_card_2_text",
                          parentId: "collection_bento_card_2",
                          type: "Text",
                          name: "Destination Label 2",

                          layout: {
                            position: "absolute",
                            left: 10,
                            bottom: 10,
                          },

                          style: {
                            fontSize: 10,
                            fontWeight: 700,
                            textColor: "#ffffff",
                            textAlign: "left",
                          },

                          props: {
                            text: "Curated Sri Lanka escape",
                            tag: "span",
                          },

                          runtime: {
                            columnMap: {
                              text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                            },
                          },

                          children: [],
                        },
                      ],
                    },

                    {
                      id: "collection_bento_card_3",
                      parentId: "collection_bento_top_row",
                      type: "Frame",
                      name: "Destination Card 3",

                      layout: {
                        width: { value: 32, unit: "%" },
                        height: { value: 360, unit: "px" },
                        overflow: "hidden",
                      },

                      style: {
                        borderRadius: 8,
                      },

                      props: {},

                      children: [
                        {
                          id: "collection_bento_card_3_image",
                          parentId: "collection_bento_card_3",
                          type: "Image",
                          name: "Destination Image 3",

                          layout: {
                            width: { value: 100, unit: "%" },
                            height: { value: 100, unit: "%" },
                          },

                          props: {
                            src: "/no-image.jpg",
                            alt: "Sri Lanka destination collection image",
                            objectFit: "cover",
                          },

                          runtime: {
                            columnMap: {
                              src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                              alt: "name|title|tour_name|destination|collection_name",
                            },
                          },

                          children: [],
                        },

                        {
                          id: "collection_bento_card_3_text",
                          parentId: "collection_bento_card_3",
                          type: "Text",
                          name: "Destination Label 3",

                          layout: {
                            position: "absolute",
                            left: 10,
                            bottom: 10,
                          },

                          style: {
                            fontSize: 10,
                            fontWeight: 700,
                            textColor: "#ffffff",
                            textAlign: "left",
                          },

                          props: {
                            text: "Curated Sri Lanka escape",
                            tag: "span",
                          },

                          runtime: {
                            columnMap: {
                              text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                            },
                          },

                          children: [],
                        },
                      ],
                    },
                  ],
                },

                {
                  id: "collection_bento_bottom_row",
                  parentId: "collection_list_bento_grid",
                  type: "Frame",
                  name: "Bottom Row",

                  layout: {
                    width: { value: 100, unit: "%" },
                    height: { value: 360, unit: "px" },
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    overflow: "hidden",
                  },

                  style: {},
                  props: {},

                  children: [
                    {
                      id: "collection_bento_card_4",
                      parentId: "collection_bento_bottom_row",
                      type: "Frame",
                      name: "Destination Card 4",

                      layout: {
                        width: { value: 65, unit: "%" },
                        height: { value: 360, unit: "px" },
                        overflow: "hidden",
                      },

                      style: {
                        borderRadius: 8,
                      },

                      props: {},

                      children: [
                        {
                          id: "collection_bento_card_4_image",
                          parentId: "collection_bento_card_4",
                          type: "Image",
                          name: "Destination Image 4",

                          layout: {
                            width: { value: 100, unit: "%" },
                            height: { value: 100, unit: "%" },
                          },

                          props: {
                            src: "/no-image.jpg",
                            alt: "Sri Lanka destination collection image",
                            objectFit: "cover",
                          },

                          runtime: {
                            columnMap: {
                              src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                              alt: "name|title|tour_name|destination|collection_name",
                            },
                          },

                          children: [],
                        },

                        {
                          id: "collection_bento_card_4_text",
                          parentId: "collection_bento_card_4",
                          type: "Text",
                          name: "Destination Label 4",

                          layout: {
                            position: "absolute",
                            left: 10,
                            bottom: 10,
                          },

                          style: {
                            fontSize: 10,
                            fontWeight: 700,
                            textColor: "#ffffff",
                            textAlign: "left",
                          },

                          props: {
                            text: "Curated Sri Lanka escape",
                            tag: "span",
                          },

                          runtime: {
                            columnMap: {
                              text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                            },
                          },

                          children: [],
                        },
                      ],
                    },

                    {
                      id: "collection_bento_card_5",
                      parentId: "collection_bento_bottom_row",
                      type: "Frame",
                      name: "Destination Card 5",

                      layout: {
                        width: { value: 32, unit: "%" },
                        height: { value: 360, unit: "px" },
                        overflow: "hidden",
                      },

                      style: {
                        borderRadius: 8,
                      },

                      props: {},

                      children: [
                        {
                          id: "collection_bento_card_5_image",
                          parentId: "collection_bento_card_5",
                          type: "Image",
                          name: "Destination Image 5",

                          layout: {
                            width: { value: 100, unit: "%" },
                            height: { value: 100, unit: "%" },
                          },

                          props: {
                            src: "/no-image.jpg",
                            alt: "Sri Lanka destination collection image",
                            objectFit: "cover",
                          },

                          runtime: {
                            columnMap: {
                              src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                              alt: "name|title|tour_name|destination|collection_name",
                            },
                          },

                          children: [],
                        },

                        {
                          id: "collection_bento_card_5_text",
                          parentId: "collection_bento_card_5",
                          type: "Text",
                          name: "Destination Label 5",

                          layout: {
                            position: "absolute",
                            left: 10,
                            bottom: 10,
                          },

                          style: {
                            fontSize: 10,
                            fontWeight: 700,
                            textColor: "#ffffff",
                            textAlign: "left",
                          },

                          props: {
                            text: "Curated Sri Lanka escape",
                            tag: "span",
                          },

                          runtime: {
                            columnMap: {
                              text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                            },
                          },

                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Travel styles: Carousel",
        icon: "🎠",
        node: {
          id: "collection_list_carousel",
          parentId: null,
          type: "Frame",
          name: "Travel Style Collection Carousel",

          layout: {
            width: { value: 100, unit: "%" },
            height: { value: 300, unit: "px" },
            display: "flex",
            flexDirection: "column",
            padding: { top: 20, right: 20, bottom: 20, left: 20 },
            gap: 16,
            overflow: "hidden",
          },

          style: {
            backgroundColor: "#ffffff",
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
          },

          props: {},
          dataBinding: { source: "destination_collection" },
          runtime: {
            repeat: {
              enabled: true,
              targetResource: "destination_collection",
              menu: "tourism-collections",
              dataPath: "data.items",
              policyPath: "meta.resourcePolicy",
              limit: 8,
            },
          },

          children: [
            {
              id: "collection_list_carousel_heading",
              parentId: "collection_list_carousel",
              type: "Text",
              name: "Carousel Heading",

              layout: {},

              style: {
                fontSize: 20,
                fontWeight: 700,
                lineHeight: 1.1,
                textColor: "#111111",
                textAlign: "left",
              },

              props: {
                text: "Explore by travel style",
                tag: "h2",
              },

              children: [],
            },

            {
              id: "collection_list_carousel_track",
              parentId: "collection_list_carousel",
              type: "Frame",
              name: "Collection Carousel Track",

              props: {
                marquee: true,
              } as any,

              layout: {
                width: { value: 100, unit: "%" },
                height: { value: 210, unit: "px" },
                display: "grid",
                columns: 3,
                gap: 12,
                overflow: "hidden",
              },

              style: {},

              children: [
                {
                  id: "collection_carousel_item_1",
                  parentId: "collection_list_carousel_track",
                  type: "Frame",
                  name: "Collection Item 1",

                  layout: {
                    width: { value: 220, unit: "px" },
                    minWidth: { value: 220, unit: "px" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    overflow: "hidden",
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "collection_carousel_item_1_image",
                      parentId: "collection_carousel_item_1",
                      type: "Image",
                      name: "Destination Image 1",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 170, unit: "px" },
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Sri Lanka destination collection image",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "collection_carousel_item_1_title",
                      parentId: "collection_carousel_item_1",
                      type: "Text",
                      name: "Collection Sri Lanka travel guide 1",

                      layout: {},

                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Curated Sri Lanka escape",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "collection_carousel_item_2",
                  parentId: "collection_list_carousel_track",
                  type: "Frame",
                  name: "Collection Item 2",

                  layout: {
                    width: { value: 220, unit: "px" },
                    minWidth: { value: 220, unit: "px" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    overflow: "hidden",
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "collection_carousel_item_2_image",
                      parentId: "collection_carousel_item_2",
                      type: "Image",
                      name: "Destination Image 2",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 170, unit: "px" },
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Sri Lanka destination collection image",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "collection_carousel_item_2_title",
                      parentId: "collection_carousel_item_2",
                      type: "Text",
                      name: "Collection Sri Lanka travel guide 2",

                      layout: {},

                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Curated Sri Lanka escape",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "collection_carousel_item_3",
                  parentId: "collection_list_carousel_track",
                  type: "Frame",
                  name: "Collection Item 3",

                  layout: {
                    width: { value: 220, unit: "px" },
                    minWidth: { value: 220, unit: "px" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    overflow: "hidden",
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "collection_carousel_item_3_image",
                      parentId: "collection_carousel_item_3",
                      type: "Image",
                      name: "Destination Image 3",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 170, unit: "px" },
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Sri Lanka destination collection image",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "collection_carousel_item_3_title",
                      parentId: "collection_carousel_item_3",
                      type: "Text",
                      name: "Collection Sri Lanka travel guide 3",

                      layout: {},

                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Curated Sri Lanka escape",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "collection_carousel_item_4",
                  parentId: "collection_list_carousel_track",
                  type: "Frame",
                  name: "Collection Item 4",

                  layout: {
                    width: { value: 220, unit: "px" },
                    minWidth: { value: 220, unit: "px" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    overflow: "hidden",
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "collection_carousel_item_4_image",
                      parentId: "collection_carousel_item_4",
                      type: "Image",
                      name: "Destination Image 4",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 170, unit: "px" },
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Sri Lanka destination collection image",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "collection_carousel_item_4_title",
                      parentId: "collection_carousel_item_4",
                      type: "Text",
                      name: "Collection Sri Lanka travel guide 4",

                      layout: {},

                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Curated Sri Lanka escape",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Destination collection: Editorial",
        icon: "📰",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Destination collection: Grid",
        icon: "▦",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
    ],
  },
  {
    label: "Travel Forms",
    list: [
      {
        label: "Contact form",
        icon: "📝",
        node: {
          id: "contact_form_section",
          parentId: null,
          type: "Frame",
          name: "Contact Form Section",

          layout: {
            width: { value: 100, unit: "%" },
            height: { value: 560, unit: "px" },

            display: "flex",
            flexDirection: "column",

            justifyContent: "center",
            alignItems: "center",

            padding: {
              top: 32,
              right: 32,
              bottom: 32,
              left: 32,
            },
          },

          style: {
            backgroundColor: "#ffffff",
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
          },

          props: {},

          children: [
            {
              id: "contact_form_container",
              parentId: "contact_form_section",
              type: "Form",
              name: "Contact Form Container",

              layout: {
                width: { value: 100, unit: "%" },
                maxWidth: { value: 520, unit: "px" },

                display: "flex",
                flexDirection: "column",

                gap: 16,
              },

              style: {},

              props: {},

              children: [
                {
                  id: "contact_form_heading",
                  parentId: "contact_form_container",
                  type: "Text",
                  name: "Contact Heading",

                  layout: {},

                  style: {
                    fontSize: 38,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    textColor: "#111111",
                    textAlign: "center",
                  },

                  props: {
                    text: "Plan your trip with us",
                    tag: "h2",
                  },

                  children: [],
                },

                {
                  id: "contact_form_name_email_row",
                  parentId: "contact_form_container",
                  type: "Frame",
                  name: "Traveler name Email Row",

                  layout: {
                    width: { value: 100, unit: "%" },

                    display: "flex",
                    flexDirection: "row",

                    gap: 12,
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "contact_form_name_wrapper",
                      parentId: "contact_form_name_email_row",
                      type: "Frame",

                      layout: {
                        width: { value: 50, unit: "%" },

                        display: "flex",
                        flexDirection: "column",

                        gap: 6,
                      },

                      style: {},

                      props: {},

                      children: [
                        {
                          id: "contact_form_name_label",
                          parentId: "contact_form_name_wrapper",
                          type: "Text",

                          style: {
                            fontSize: 13,
                            fontWeight: 600,
                            textColor: "#111111",
                          },

                          props: {
                            text: "Traveler name",
                            tag: "span",
                          },

                          children: [],
                        },

                        {
                          id: "contact_form_name_input",
                          parentId: "contact_form_name_wrapper",
                          type: "Input",

                          layout: {
                            width: { value: 100, unit: "%" },
                            height: { value: 46, unit: "px" },
                            border: 1,
                            padding: {
                              left: 14,
                              right: 14,
                            },
                          },

                          style: {
                            backgroundColor: "#f3f3f3",
                            borderColor: "#dcdcdc",
                            borderRadius: 6,
                          },

                          props: {
                            name: "name",
                            placeholder: "Enter traveler name",
                            inputType: "text",
                          },

                          children: [],
                        },
                      ],
                    },

                    {
                      id: "contact_form_email_wrapper",
                      parentId: "contact_form_name_email_row",
                      type: "Frame",

                      layout: {
                        width: { value: 50, unit: "%" },

                        display: "flex",
                        flexDirection: "column",

                        gap: 6,
                      },

                      style: {},

                      props: {},

                      children: [
                        {
                          id: "contact_form_email_label",
                          parentId: "contact_form_email_wrapper",
                          type: "Text",

                          style: {
                            fontSize: 13,
                            fontWeight: 600,
                            textColor: "#111111",
                          },

                          props: {
                            text: "Email",
                            tag: "span",
                          },

                          children: [],
                        },

                        {
                          id: "contact_form_email_input",
                          parentId: "contact_form_email_wrapper",
                          type: "Input",

                          layout: {
                            width: { value: 100, unit: "%" },
                            height: { value: 46, unit: "px" },
                            border: 1,
                            padding: {
                              left: 14,
                              right: 14,
                            },
                          },

                          style: {
                            backgroundColor: "#f3f3f3",
                            borderColor: "#dcdcdc",
                            borderRadius: 6,
                          },

                          props: {
                            name: "email",
                            placeholder: "Enter your email",
                            inputType: "email",
                          },

                          children: [],
                        },
                      ],
                    },
                  ],
                },

                {
                  id: "contact_form_phone_wrapper",
                  parentId: "contact_form_container",
                  type: "Frame",

                  layout: {
                    width: { value: 100, unit: "%" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 6,
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "contact_form_phone_label",
                      parentId: "contact_form_phone_wrapper",
                      type: "Text",

                      style: {
                        fontSize: 13,
                        fontWeight: 600,
                        textColor: "#111111",
                      },

                      props: {
                        text: "WhatsApp / phone",
                        tag: "span",
                      },

                      children: [],
                    },

                    {
                      id: "contact_form_phone_input",
                      parentId: "contact_form_phone_wrapper",
                      type: "Input",

                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 46, unit: "px" },
                        border: 1,
                        padding: {
                          left: 14,
                          right: 14,
                        },
                      },

                      style: {
                        backgroundColor: "#f3f3f3",
                        borderColor: "#dcdcdc",
                        borderRadius: 6,
                      },

                      props: {
                        name: "phone",
                        placeholder: "Enter your WhatsApp number",
                        inputType: "text",
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "contact_form_comment_wrapper",
                  parentId: "contact_form_container",
                  type: "Frame",

                  layout: {
                    width: { value: 100, unit: "%" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 6,
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "contact_form_comment_label",
                      parentId: "contact_form_comment_wrapper",
                      type: "Text",

                      style: {
                        fontSize: 13,
                        fontWeight: 600,
                        textColor: "#111111",
                      },

                      props: {
                        text: "Trip request",
                        tag: "span",
                      },

                      children: [],
                    },

                    {
                      id: "contact_form_comment_box",
                      parentId: "contact_form_comment_wrapper",
                      type: "Frame",

                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 160, unit: "px" },
                        border: 1,
                        padding: {
                          top: 14,
                          left: 14,
                          right: 14,
                        },
                      },

                      style: {
                        backgroundColor: "#f3f3f3",
                        borderColor: "#dcdcdc",
                        borderRadius: 6,
                      },

                      props: {},

                      children: [
                        {
                          id: "contact_form_comment_placeholder",
                          parentId: "contact_form_comment_box",
                          type: "Text",

                          style: {
                            fontSize: 13,
                            textColor: "#999999",
                          },

                          props: {
                            text: "Tell us your destination, travel dates, group size, and preferred experiences...",
                            tag: "span",
                          },

                          children: [],
                        },
                      ],
                    },
                  ],
                },

                {
                  id: "contact_form_submit_button",
                  parentId: "contact_form_container",
                  type: "Button",

                  layout: {
                    width: { value: 120, unit: "px" },
                    height: { value: 44, unit: "px" },
                  },

                  style: {
                    backgroundColor: "#111111",
                    borderRadius: 6,
                    textColor: "#ffffff",
                  },

                  props: {
                    label: "Send Inquiry",
                    variant: "primary",
                  },

                  children: [],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Email signup",
        icon: "📧",
        node: {
          id: "email_signup_section",
          parentId: null,
          type: "Frame",
          name: "Email Signup Section",

          layout: {
            width: { value: 100, unit: "%" },
            height: { value: 220, unit: "px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: { top: 24, right: 24, bottom: 24, left: 24 },
          },

          style: {
            backgroundColor: "#ffffff",
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
          },

          props: {},

          children: [
            {
              id: "email_signup_inner_container",
              parentId: "email_signup_section",
              type: "Frame",
              name: "Signup Inner Container",

              layout: {
                width: { value: 100, unit: "%" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
                padding: { top: 28, right: 28, bottom: 28, left: 28 },
              },

              style: {
                backgroundColor: "#f5f5f5",
                borderRadius: 6,
              },

              props: {},

              children: [
                {
                  id: "email_signup_heading",
                  parentId: "email_signup_inner_container",
                  type: "Text",
                  name: "Signup Heading",
                  layout: {},
                  style: {
                    fontSize: 32,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    textColor: "#111111",
                    textAlign: "center",
                  },
                  props: {
                    text: "Get Sri Lanka travel inspiration",
                    tag: "h2",
                  },
                  children: [],
                },

                {
                  id: "email_signup_subheading",
                  parentId: "email_signup_inner_container",
                  type: "Text",
                  name: "Signup Subheading",
                  layout: {},
                  style: {
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: 1.4,
                    textColor: "#666666",
                    textAlign: "center",
                  },
                  props: {
                    text: "Receive destination guides, seasonal travel tips, and curated tour ideas.",
                    tag: "p",
                  },
                  children: [],
                },

                {
                  id: "email_signup_input_wrapper",
                  parentId: "email_signup_inner_container",
                  type: "Frame",
                  name: "Signup Input Wrapper",

                  layout: {
                    width: { value: 100, unit: "%" },
                    maxWidth: { value: 420, unit: "px" },
                    height: { value: 46, unit: "px" },
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: { top: 0, right: 16, bottom: 0, left: 16 },
                    border: 1,
                  },

                  style: {
                    backgroundColor: "#ffffff",
                    borderColor: "#dddddd",
                    borderRadius: 999,
                  },

                  props: {},

                  children: [
                    {
                      id: "email_signup_placeholder",
                      parentId: "email_signup_input_wrapper",
                      type: "Text",
                      name: "Email Placeholder",
                      layout: {},
                      style: {
                        fontSize: 12,
                        textColor: "#999999",
                      },
                      props: {
                        text: "Email address for travel updates",
                        tag: "span",
                      },
                      children: [],
                    },

                    {
                      id: "email_signup_arrow",
                      parentId: "email_signup_input_wrapper",
                      type: "Text",
                      name: "Arrow Icon",
                      layout: {},
                      style: {
                        fontSize: 18,
                        fontWeight: 600,
                        textColor: "#666666",
                      },
                      props: {
                        text: "→",
                        tag: "span",
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    label: "Layout",
    list: [
      {
        label: "Custom section",
        icon: "🧩",
        node: {
          id: "custom_section_block",
          parentId: null,
          type: "Frame",
          name: "Custom Section",

          layout: {
            width: { value: 100, unit: "%" },
            height: { value: 420, unit: "px" },

            display: "flex",
            flexDirection: "column",

            padding: {
              top: 24,
              right: 24,
              bottom: 24,
              left: 24,
            },
          },

          style: {
            backgroundColor: "#ffffff",
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
          },

          props: {},

          children: [],
        },
      },
      {
        label: "Divider",
        icon: "➖",

        node: {
          id: "layout_divider_block",
          parentId: null,
          type: "Frame",
          name: "Divider Block",

          layout: {
            width: { value: 100, unit: "%" },
            height: { value: 20, unit: "px" },

            display: "flex",
            flexDirection: "column",
          },

          style: {
            backgroundColor: "#ffffff",
            borderRadius: 8,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          },

          props: {},

          children: [],
        },
      },
    ],
  },
  {
    label: "Tour Packages",
    list: [
      {
        label: "Featured tours: Carousel",
        icon: "🎠",
        node: {
          id: "featured_collection_carousel_large",
          parentId: null,
          type: "Frame",
          name: "Featured Collection Carousel Large",

          layout: {
            width: { value: 100, unit: "%" },
            height: { value: 420, unit: "px" },

            display: "flex",
            flexDirection: "column",

            padding: {
              top: 24,
              right: 24,
              bottom: 24,
              left: 24,
            },

            gap: 18,
            overflow: "hidden",
          },

          style: {
            backgroundColor: "#ffffff",
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
          },

          props: {},
          dataBinding: { source: "tour_package" },
          runtime: {
            repeat: {
              enabled: true,
              targetResource: "tour_package",
              menu: "featured-tour-packages",
              dataPath: "data.items",
              policyPath: "meta.resourcePolicy",
              limit: 8,
            },
          },

          children: [
            {
              id: "featured_collection_carousel_large_title",
              parentId: "featured_collection_carousel_large",
              type: "Text",
              name: "Carousel Sri Lanka travel guide",

              layout: {},

              style: {
                fontSize: 20,
                fontWeight: 700,
                lineHeight: 1.1,
                textColor: "#111111",
                textAlign: "left",
              },

              props: {
                text: "Featured travel experiences",
                tag: "h2",
              },

              runtime: {
                columnMap: {
                  text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                },
              },

              children: [],
            },

            {
              id: "featured_collection_carousel_large_track",
              parentId: "featured_collection_carousel_large",
              type: "Frame",
              name: "Carousel Track",

              props: {
                marquee: true,
              } as any,

              layout: {
                width: { value: 100, unit: "%" },
                height: { value: 320, unit: "px" },

                display: "flex",
                flexDirection: "row",

                gap: 20,
                overflow: "hidden",
              },

              style: {},

              children: [
                {
                  id: "featured_collection_carousel_large_product_1",
                  parentId: "featured_collection_carousel_large_track",
                  type: "Frame",

                  layout: {
                    width: { value: 220, unit: "px" },
                    minWidth: { value: 220, unit: "px" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 8,
                  },

                  style: {},
                  props: {},

                  children: [
                    {
                      id: "featured_collection_carousel_large_product_1_image",
                      parentId: "featured_collection_carousel_large_product_1",
                      type: "Image",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 220, unit: "px" },
                      },

                      style: {
                        borderRadius: 6,
                        backgroundColor: "#f3f3f3",
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Sri Lanka tour package image",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_carousel_large_product_1_title",
                      parentId: "featured_collection_carousel_large_product_1",
                      type: "Text",

                      style: {
                        fontSize: 12,
                        fontWeight: 700,
                        textColor: "#111111",
                      },

                      props: {
                        text: "Ella scenic rail tour",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_carousel_large_product_1_price",
                      parentId: "featured_collection_carousel_large_product_1",
                      type: "Text",

                      style: {
                        fontSize: 10,
                        textColor: "#777777",
                      },

                      props: {
                        text: "From Rs. 19,500",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "price|starting_price|package_price|rate|from_price",
                        },
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "featured_collection_carousel_large_product_2",
                  parentId: "featured_collection_carousel_large_track",
                  type: "Frame",

                  layout: {
                    width: { value: 220, unit: "px" },
                    minWidth: { value: 220, unit: "px" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 8,
                  },

                  style: {},
                  props: {},

                  children: [
                    {
                      id: "featured_collection_carousel_large_product_2_image",
                      parentId: "featured_collection_carousel_large_product_2",
                      type: "Image",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 220, unit: "px" },
                      },

                      style: {
                        borderRadius: 6,
                        backgroundColor: "#f3f3f3",
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Sri Lanka tour package image",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_carousel_large_product_2_title",
                      parentId: "featured_collection_carousel_large_product_2",
                      type: "Text",

                      style: {
                        fontSize: 12,
                        fontWeight: 700,
                        textColor: "#111111",
                      },

                      props: {
                        text: "Sigiriya heritage climb",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_carousel_large_product_2_price",
                      parentId: "featured_collection_carousel_large_product_2",
                      type: "Text",

                      style: {
                        fontSize: 10,
                        textColor: "#777777",
                      },

                      props: {
                        text: "From Rs. 24,500",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "price|starting_price|package_price|rate|from_price",
                        },
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "featured_collection_carousel_large_product_3",
                  parentId: "featured_collection_carousel_large_track",
                  type: "Frame",

                  layout: {
                    width: { value: 220, unit: "px" },
                    minWidth: { value: 220, unit: "px" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 8,
                  },

                  style: {},
                  props: {},

                  children: [
                    {
                      id: "featured_collection_carousel_large_product_3_image",
                      parentId: "featured_collection_carousel_large_product_3",
                      type: "Image",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 220, unit: "px" },
                      },

                      style: {
                        borderRadius: 6,
                        backgroundColor: "#f3f3f3",
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Sri Lanka tour package image",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_carousel_large_product_3_title",
                      parentId: "featured_collection_carousel_large_product_3",
                      type: "Text",

                      style: {
                        fontSize: 12,
                        fontWeight: 700,
                        textColor: "#111111",
                      },

                      props: {
                        text: "Galle fort walking tour",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_carousel_large_product_3_price",
                      parentId: "featured_collection_carousel_large_product_3",
                      type: "Text",

                      style: {
                        fontSize: 10,
                        textColor: "#777777",
                      },

                      props: {
                        text: "From Rs. 21,500",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "price|starting_price|package_price|rate|from_price",
                        },
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "featured_collection_carousel_large_product_4",
                  parentId: "featured_collection_carousel_large_track",
                  type: "Frame",

                  layout: {
                    width: { value: 220, unit: "px" },
                    minWidth: { value: 220, unit: "px" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 8,
                  },

                  style: {},
                  props: {},

                  children: [
                    {
                      id: "featured_collection_carousel_large_product_4_image",
                      parentId: "featured_collection_carousel_large_product_4",
                      type: "Image",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 220, unit: "px" },
                      },

                      style: {
                        borderRadius: 6,
                        backgroundColor: "#f3f3f3",
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Sri Lanka tour package image",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_carousel_large_product_4_title",
                      parentId: "featured_collection_carousel_large_product_4",
                      type: "Text",

                      style: {
                        fontSize: 12,
                        fontWeight: 700,
                        textColor: "#111111",
                      },

                      props: {
                        text: "Mirissa whale watching",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_carousel_large_product_4_price",
                      parentId: "featured_collection_carousel_large_product_4",
                      type: "Text",

                      style: {
                        fontSize: 10,
                        textColor: "#777777",
                      },

                      props: {
                        text: "From Rs. 27,500",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "price|starting_price|package_price|rate|from_price",
                        },
                      },

                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Featured tours: Editorial",
        icon: "📰",
        node: {
          id: "featured_collection_editorial_v2",
          parentId: null,
          type: "Frame",
          name: "Featured Collection Editorial V2",

          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 900, unit: "px" },

            display: "flex",
            flexDirection: "column",

            padding: {
              top: 24,
              right: 24,
              bottom: 24,
              left: 24,
            },

            gap: 24,
            overflow: "scroll",
          },

          style: {
            backgroundColor: "#f5f5f5",
            borderRadius: 8,
          },

          props: {},
          dataBinding: { source: "tour_package" },
          runtime: {
            repeat: {
              enabled: true,
              targetResource: "tour_package",
              menu: "featured-tour-packages",
              dataPath: "data.items",
              policyPath: "meta.resourcePolicy",
              limit: 8,
            },
          },

          children: [
            {
              id: "featured_collection_editorial_v2_title",
              parentId: "featured_collection_editorial_v2",
              type: "Text",
              name: "Editorial Sri Lanka travel guide",

              layout: {},

              style: {
                fontSize: 18,
                fontWeight: 700,
                textColor: "#111111",
                lineHeight: 1.2,
              },

              props: {
                text: "Featured travel experiences",
                tag: "h2",
              },

              runtime: {
                columnMap: {
                  text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                },
              },

              children: [],
            },

            {
              id: "featured_collection_editorial_v2_grid",
              parentId: "featured_collection_editorial_v2",
              type: "Frame",
              name: "Editorial Grid",

              layout: {
                width: { value: 100, unit: "%" },

                display: "grid",
                columns: 2,
                gap: 32,
              },

              style: {},

              props: {},

              children: [
                {
                  id: "featured_collection_editorial_v2_product_1",
                  parentId: "featured_collection_editorial_v2_grid",
                  type: "Frame",
                  name: "Editorial Tour 1",

                  layout: {
                    width: { value: 280, unit: "px" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 6,
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "featured_collection_editorial_v2_product_1_image",
                      parentId: "featured_collection_editorial_v2_product_1",
                      type: "Image",

                      layout: {
                        width: { value: 280, unit: "px" },
                        height: { value: 280, unit: "px" },
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Sri Lanka tour package image",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_editorial_v2_product_1_title",
                      parentId: "featured_collection_editorial_v2_product_1",
                      type: "Text",

                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        textColor: "#111111",
                      },

                      props: {
                        text: "Tour package title",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_editorial_v2_product_1_price",
                      parentId: "featured_collection_editorial_v2_product_1",
                      type: "Text",

                      style: {
                        fontSize: 9,
                        textColor: "#666666",
                      },

                      props: {
                        text: "From Rs. 19,500",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "price|starting_price|package_price|rate|from_price",
                        },
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "featured_collection_editorial_v2_product_2",
                  parentId: "featured_collection_editorial_v2_grid",
                  type: "Frame",
                  name: "Editorial Tour 2",

                  layout: {
                    width: { value: 180, unit: "px" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 6,
                    margin: {
                      top: 120,
                    },
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "featured_collection_editorial_v2_product_2_image",
                      parentId: "featured_collection_editorial_v2_product_2",
                      type: "Image",

                      layout: {
                        width: { value: 180, unit: "px" },
                        height: { value: 180, unit: "px" },
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Sri Lanka tour package image",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_editorial_v2_product_2_title",
                      parentId: "featured_collection_editorial_v2_product_2",
                      type: "Text",

                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        textColor: "#111111",
                      },

                      props: {
                        text: "Tour package title",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_editorial_v2_product_2_price",
                      parentId: "featured_collection_editorial_v2_product_2",
                      type: "Text",

                      style: {
                        fontSize: 9,
                        textColor: "#666666",
                      },

                      props: {
                        text: "From Rs. 19,500",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "price|starting_price|package_price|rate|from_price",
                        },
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "featured_collection_editorial_v2_product_3",
                  parentId: "featured_collection_editorial_v2_grid",
                  type: "Frame",
                  name: "Editorial Tour 3",

                  layout: {
                    width: { value: 220, unit: "px" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 6,
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "featured_collection_editorial_v2_product_3_image",
                      parentId: "featured_collection_editorial_v2_product_3",
                      type: "Image",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 220, unit: "px" },
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Sri Lanka tour package image",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_editorial_v2_product_3_title",
                      parentId: "featured_collection_editorial_v2_product_3",
                      type: "Text",

                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        textColor: "#111111",
                      },

                      props: {
                        text: "Tour package title",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_editorial_v2_product_3_price",
                      parentId: "featured_collection_editorial_v2_product_3",
                      type: "Text",

                      style: {
                        fontSize: 9,
                        textColor: "#666666",
                      },

                      props: {
                        text: "From Rs. 19,500",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "price|starting_price|package_price|rate|from_price",
                        },
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "featured_collection_editorial_v2_product_4",
                  parentId: "featured_collection_editorial_v2_grid",
                  type: "Frame",
                  name: "Editorial Tour 4",

                  layout: {
                    width: { value: 340, unit: "px" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 6,
                    margin: {
                      left: 120,
                    },
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "featured_collection_editorial_v2_product_4_image",
                      parentId: "featured_collection_editorial_v2_product_4",
                      type: "Image",

                      layout: {
                        width: { value: 340, unit: "px" },
                        height: { value: 340, unit: "px" },
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Sri Lanka tour package image",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_editorial_v2_product_4_title",
                      parentId: "featured_collection_editorial_v2_product_4",
                      type: "Text",

                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        textColor: "#111111",
                      },

                      props: {
                        text: "Tour package title",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_editorial_v2_product_4_price",
                      parentId: "featured_collection_editorial_v2_product_4",
                      type: "Text",

                      style: {
                        fontSize: 9,
                        textColor: "#666666",
                      },

                      props: {
                        text: "From Rs. 19,500",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "price|starting_price|package_price|rate|from_price",
                        },
                      },

                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Featured tour package",
        icon: "📦",
        node: {
          id: "featured_product",
          parentId: null,
          type: "Frame",
          name: "Featured Tour Package",

          layout: {
            width: { value: 100, unit: "%" },
            height: { value: 460, unit: "px" },

            display: "flex",
            flexDirection: "row",

            padding: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            },

            gap: 28,
            overflow: "hidden",
          },

          style: {
            backgroundColor: "#ffffff",
            borderRadius: 8,
            boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
          },
          dataBinding: { source: "tour_package" },
          runtime: {
            repeat: {
              enabled: true,
              targetResource: "tour_package",
              menu: "featured-tour-package",
              dataPath: "data.items",
              policyPath: "meta.resourcePolicy",
              limit: 1,
            },
          },

          props: {},

          children: [
            // LEFT IMAGE
            {
              id: "featured_product_image_wrapper",
              parentId: "featured_product",
              type: "Frame",
              name: "Featured Tour Package Image Wrapper",

              layout: {
                width: { value: 35, unit: "%" },
                minWidth: { value: 35, unit: "%" },
                height: { value: 100, unit: "%" },

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                overflow: "hidden",
              },

              style: {
                backgroundColor: "#ececeb",
                borderRadius: 4,
              },

              props: {},

              children: [
                {
                  id: "featured_product_image",
                  parentId: "featured_product_image_wrapper",
                  type: "Image",
                  name: "Featured Tour Package Image",

                  layout: {
                    width: { value: 100, unit: "%" },
                    height: { value: 100, unit: "%" },
                  },

                  props: {
                    src: "/no-image.jpg",
                    alt: "Featured tour package",
                    objectFit: "cover",
                  },

                  runtime: {
                    columnMap: {
                      src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                      alt: "name|title|tour_name|destination|collection_name",
                    },
                  },

                  children: [],
                },
              ],
            },

            // RIGHT CONTENT
            {
              id: "featured_product_content",
              parentId: "featured_product",
              type: "Frame",
              name: "Featured Tour Package Content",

              layout: {
                width: { value: 100, unit: "%" },
                height: { value: 100, unit: "%" },

                display: "flex",
                flexDirection: "column",

                justifyContent: "center",

                gap: 14,
              },

              style: {},

              props: {},

              children: [
                {
                  id: "featured_product_title",
                  parentId: "featured_product_content",
                  type: "Text",
                  name: "Featured Tour Package Sri Lanka travel guide",

                  layout: {},

                  style: {
                    fontSize: 28,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    textColor: "#111111",
                    textAlign: "left",
                  },

                  props: {
                    text: "Tour package title",
                    tag: "h2",
                  },

                  runtime: {
                    columnMap: {
                      text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                    },
                  },

                  children: [],
                },

                {
                  id: "featured_product_price",
                  parentId: "featured_product_content",
                  type: "Text",
                  name: "Featured Tour Package Price",

                  layout: {},

                  style: {
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    textColor: "#444444",
                    textAlign: "left",
                  },

                  props: {
                    text: "From Rs. 19,500",
                    tag: "span",
                  },

                  runtime: {
                    columnMap: {
                      text: "price|starting_price|package_price|rate|from_price",
                    },
                  },

                  children: [],
                },

                {
                  id: "featured_product_reviews",
                  parentId: "featured_product_content",
                  type: "Text",
                  name: "Featured Tour Package Reviews",

                  layout: {},

                  style: {
                    fontSize: 12,
                    fontWeight: 500,
                    lineHeight: 1.2,
                    textColor: "#666666",
                    textAlign: "left",
                  },

                  props: {
                    text: "★★★★★   128 traveler reviews",
                    tag: "span",
                  },

                  children: [],
                },

                {
                  id: "featured_product_button",
                  parentId: "featured_product_content",
                  type: "Frame",
                  name: "Featured Tour Package Button",

                  layout: {
                    width: { value: 220, unit: "px" },
                    height: { value: 42, unit: "px" },

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },

                  style: {
                    backgroundColor: "#8f8d8a",
                    borderRadius: 6,
                  },

                  props: {},

                  children: [
                    {
                      id: "featured_product_button_text",
                      parentId: "featured_product_button",
                      type: "Text",
                      name: "Featured Tour Package Button Text",

                      layout: {},

                      style: {
                        fontSize: 13,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#ffffff",
                        textAlign: "center",
                      },

                      props: {
                        text: "Check availability",
                        tag: "span",
                      },

                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Tour highlight",
        icon: "⭐",
        node: {
          id: "product_highlight",
          parentId: null,
          type: "Frame",
          name: "Tour Highlight",

          layout: {
            width: { value: 100, unit: "%" },
            height: { value: 300, unit: "px" },

            display: "flex",
            flexDirection: "row",

            overflow: "hidden",
          },

          style: {
            backgroundColor: "#ffffff",
            borderRadius: 8,
            boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
          },
          dataBinding: { source: "tour_package" },
          runtime: {
            repeat: {
              enabled: true,
              targetResource: "tour_package",
              menu: "tour-highlight",
              dataPath: "data.items",
              policyPath: "meta.resourcePolicy",
              limit: 1,
            },
          },

          props: {},

          children: [
            // LEFT FEATURE IMAGE
            {
              id: "product_highlight_left",
              parentId: "product_highlight",
              type: "Frame",
              name: "Highlight Left",

              layout: {
                width: { value: 52, unit: "%" },
                height: { value: 100, unit: "%" },

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                overflow: "hidden",
              },

              style: {
                backgroundColor: "#e8ebe5",
              },

              props: {},

              children: [
                {
                  id: "product_highlight_main_image",
                  parentId: "product_highlight_left",
                  type: "Image",
                  name: "Main Tour Image",

                  layout: {
                    width: { value: 100, unit: "%" },
                    height: { value: 100, unit: "%" },
                  },

                  props: {
                    src: "/no-image.jpg",
                    alt: "Featured tour package",
                    objectFit: "cover",
                  },

                  runtime: {
                    columnMap: {
                      src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                      alt: "name|title|tour_name|destination|collection_name",
                    },
                  },

                  children: [],
                },
              ],
            },

            // RIGHT SIDE
            {
              id: "product_highlight_right",
              parentId: "product_highlight",
              type: "Frame",
              name: "Highlight Right",

              layout: {
                width: { value: 48, unit: "%" },
                height: { value: 100, unit: "%" },
                position: "relative",
                overflow: "hidden",
              },

              style: {
                backgroundColor: "#f7f8f3",
              },

              props: {},

              children: [
                {
                  id: "product_highlight_secondary_image",
                  parentId: "product_highlight_right",
                  type: "Image",
                  name: "Secondary Tour Image",

                  layout: {
                    width: { value: 100, unit: "%" },
                    height: { value: 100, unit: "%" },
                  },

                  props: {
                    src: "/no-image.jpg",
                    alt: "Secondary Sri Lanka tour image",
                    objectFit: "cover",
                  },

                  runtime: {
                    columnMap: {
                      src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                      alt: "name|title|tour_name|destination|collection_name",
                    },
                  },

                  children: [],
                },

                {
                  id: "product_highlight_title",
                  parentId: "product_highlight_right",
                  type: "Text",
                  name: "Product Sri Lanka travel guide",

                  layout: {
                    position: "absolute",
                    top: 24,
                    left: 24,
                  },

                  style: {
                    fontSize: 36,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    textColor: "#111111",
                    textAlign: "left",
                  },

                  props: {
                    text: "Tour package title",
                    tag: "span",
                  },

                  runtime: {
                    columnMap: {
                      text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                    },
                  },

                  children: [],
                },

                {
                  id: "product_highlight_price",
                  parentId: "product_highlight_right",
                  type: "Text",
                  name: "Tour Price",

                  layout: {
                    position: "absolute",
                    top: 24,
                    right: 24,
                  },

                  style: {
                    fontSize: 36,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    textColor: "#111111",
                    textAlign: "right",
                  },

                  props: {
                    text: "From Rs. 19,500",
                    tag: "span",
                  },

                  runtime: {
                    columnMap: {
                      text: "price|starting_price|package_price|rate|from_price",
                    },
                  },

                  children: [],
                },

                {
                  id: "product_highlight_cta",
                  parentId: "product_highlight_right",
                  type: "Text",
                  name: "CTA",

                  layout: {
                    position: "absolute",
                    left: 24,
                    bottom: 24,
                  },

                  style: {
                    fontSize: 36,
                    fontWeight: 600,
                    lineHeight: 1.2,
                    textColor: "#111111",
                    textAlign: "left",
                  },

                  props: {
                    text: "View itinerary",
                    tag: "span",
                  },

                  children: [],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Trip hotspots",
        icon: "📍",

        node: {
          id: "product_hotspots",
          parentId: null,
          type: "Frame",
          name: "Trip Hotspots",

          layout: {
            width: { value: 100, unit: "%" },
            height: { value: 580, unit: "px" },

            display: "flex",
            flexDirection: "column",

            padding: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            },

            gap: 14,
            overflow: "hidden",
          },

          style: {
            backgroundColor: "#ffffff",
            borderRadius: 8,
            boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
          },
          dataBinding: { source: "tour_package" },
          runtime: {
            repeat: {
              enabled: true,
              targetResource: "tour_package",
              menu: "trip-hotspots",
              dataPath: "data.items",
              policyPath: "meta.resourcePolicy",
              limit: 1,
            },
          },

          props: {},

          children: [
            {
              id: "hotspot_heading",
              parentId: "product_hotspots",
              type: "Text",
              name: "Hotspot Heading",

              layout: {},

              style: {
                fontSize: 20,
                fontWeight: 700,
                lineHeight: 1.1,
                textColor: "#111111",
                textAlign: "left",
              },

              props: {
                text: "Explore trip highlights",
                tag: "h2",
              },

              runtime: {
                columnMap: {
                  text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                },
              },

              children: [],
            },

            {
              id: "hotspot_image_wrapper",
              parentId: "product_hotspots",
              type: "Frame",
              name: "Hotspot Image Wrapper",

              layout: {
                width: { value: 100, unit: "%" },
                height: { value: 100, unit: "%" },

                position: "relative",
                overflow: "hidden",
              },

              style: {
                borderRadius: 6,
              },

              props: {},

              children: [
                {
                  id: "hotspot_image",
                  parentId: "hotspot_image_wrapper",
                  type: "Image",
                  name: "Hotspot Image",

                  layout: {
                    width: { value: 100, unit: "%" },
                    height: { value: 100, unit: "%" },
                  },

                  props: {
                    src: "/no-image.jpg",
                    alt: "Lifestyle scene",
                    objectFit: "cover",
                  },

                  runtime: {
                    columnMap: {
                      src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                      alt: "name|title|tour_name|destination|collection_name",
                    },
                  },

                  children: [],
                },

                // HOTSPOT 1
                {
                  id: "hotspot_1",
                  parentId: "hotspot_image_wrapper",
                  type: "Frame",
                  name: "Hotspot 1",

                  layout: {
                    position: "absolute",

                    top: 90,
                    left: 520,

                    width: { value: 22, unit: "px" },
                    height: { value: 22, unit: "px" },
                  },

                  style: {
                    backgroundColor: "#ffffff",
                    borderRadius: 999,
                    borderWidth: 2,
                    borderColor: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                  },

                  props: {},

                  children: [],
                },

                // HOTSPOT 2
                {
                  id: "hotspot_2",
                  parentId: "hotspot_image_wrapper",
                  type: "Frame",
                  name: "Hotspot 2",

                  layout: {
                    position: "absolute",

                    top: 150,
                    left: 420,

                    width: { value: 22, unit: "px" },
                    height: { value: 22, unit: "px" },
                  },

                  style: {
                    backgroundColor: "#ffffff",
                    borderRadius: 999,
                    borderWidth: 2,
                    borderColor: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                  },

                  props: {},

                  children: [],
                },

                // HOTSPOT 3
                {
                  id: "hotspot_3",
                  parentId: "hotspot_image_wrapper",
                  type: "Frame",
                  name: "Hotspot 3",

                  layout: {
                    position: "absolute",

                    top: 45,
                    left: 320,

                    width: { value: 22, unit: "px" },
                    height: { value: 22, unit: "px" },
                  },

                  style: {
                    backgroundColor: "#ffffff",
                    borderRadius: 999,
                    borderWidth: 2,
                    borderColor: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                  },

                  props: {},

                  children: [],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Recommended tours",
        icon: "✨",

        node: {
          id: "recommended_products",
          parentId: null,
          type: "Frame",
          name: "Recommended Tours",

          layout: {
            width: { value: 100, unit: "%" },
            height: { value: 420, unit: "px" },

            display: "flex",
            flexDirection: "column",

            padding: {
              top: 24,
              right: 24,
              bottom: 24,
              left: 24,
            },

            gap: 18,
            overflow: "hidden",
          },

          style: {
            backgroundColor: "#ffffff",
            borderRadius: 8,
            boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
          },

          props: {},
          dataBinding: { source: "tour_package" },
          runtime: {
            repeat: {
              enabled: true,
              targetResource: "tour_package",
              menu: "recommended-tours",
              dataPath: "data.items",
              policyPath: "meta.resourcePolicy",
              limit: 4,
            },
          },

          children: [
            {
              id: "recommended_products_title",
              parentId: "recommended_products",
              type: "Text",
              name: "Recommended Tours Sri Lanka travel guide",

              layout: {},

              style: {
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.1,
                textColor: "#111111",
                textAlign: "left",
              },

              props: {
                text: "Recommended tours",
                tag: "h2",
              },

              runtime: {
                columnMap: {
                  text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                },
              },

              children: [],
            },

            {
              id: "recommended_products_grid",
              parentId: "recommended_products",
              type: "Frame",
              name: "Recommended Tours Grid",

              layout: {
                width: { value: 100, unit: "%" },
                height: { value: 360, unit: "px" },

                display: "grid",
                columns: 3,

                gap: 24,
                overflow: "hidden",
              },

              style: {},

              props: {},

              children: [
                // PRODUCT 1
                {
                  id: "recommended_product_1",
                  parentId: "recommended_products_grid",
                  type: "Frame",
                  name: "Recommended Tour 1",

                  layout: {
                    width: { value: 220, unit: "px" },
                    minWidth: { value: 220, unit: "px" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 10,
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "recommended_product_image_1",
                      parentId: "recommended_product_1",
                      type: "Image",
                      name: "Recommended Tour Image 1",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Recommended Sri Lanka tour",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_title_1",
                      parentId: "recommended_product_1",
                      type: "Text",
                      name: "Recommended Tour Sri Lanka travel guide 1",

                      layout: {},

                      style: {
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Tour package title",
                        tag: "h3",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_price_1",
                      parentId: "recommended_product_1",
                      type: "Text",
                      name: "Recommended Tour Price 1",

                      layout: {},

                      style: {
                        fontSize: 11,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textColor: "#444444",
                        textAlign: "left",
                      },

                      props: {
                        text: "From Rs. 9,900",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "price|starting_price|package_price|rate|from_price",
                        },
                      },

                      children: [],
                    },
                  ],
                },

                // PRODUCT 2
                {
                  id: "recommended_product_2",
                  parentId: "recommended_products_grid",
                  type: "Frame",
                  name: "Recommended Tour 2",

                  layout: {
                    width: { value: 220, unit: "px" },
                    minWidth: { value: 220, unit: "px" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 10,
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "recommended_product_image_2",
                      parentId: "recommended_product_2",
                      type: "Image",
                      name: "Recommended Tour Image 2",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Recommended Sri Lanka tour",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_title_2",
                      parentId: "recommended_product_2",
                      type: "Text",
                      name: "Recommended Tour Sri Lanka travel guide 2",

                      layout: {},

                      style: {
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Tour package title",
                        tag: "h3",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_price_2",
                      parentId: "recommended_product_2",
                      type: "Text",
                      name: "Recommended Tour Price 2",

                      layout: {},

                      style: {
                        fontSize: 11,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textColor: "#444444",
                        textAlign: "left",
                      },

                      props: {
                        text: "From Rs. 9,900",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "price|starting_price|package_price|rate|from_price",
                        },
                      },

                      children: [],
                    },
                  ],
                },

                // PRODUCT 3
                {
                  id: "recommended_product_3",
                  parentId: "recommended_products_grid",
                  type: "Frame",
                  name: "Recommended Tour 3",

                  layout: {
                    width: { value: 220, unit: "px" },
                    minWidth: { value: 220, unit: "px" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 10,
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "recommended_product_image_3",
                      parentId: "recommended_product_3",
                      type: "Image",
                      name: "Recommended Tour Image 3",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Recommended Sri Lanka tour",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_title_3",
                      parentId: "recommended_product_3",
                      type: "Text",
                      name: "Recommended Tour Sri Lanka travel guide 3",

                      layout: {},

                      style: {
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Tour package title",
                        tag: "h3",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_price_3",
                      parentId: "recommended_product_3",
                      type: "Text",
                      name: "Recommended Tour Price 3",

                      layout: {},

                      style: {
                        fontSize: 11,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textColor: "#444444",
                        textAlign: "left",
                      },

                      props: {
                        text: "From Rs. 9,900",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "price|starting_price|package_price|rate|from_price",
                        },
                      },

                      children: [],
                    },
                  ],
                },

                // PRODUCT 4
                {
                  id: "recommended_product_4",
                  parentId: "recommended_products_grid",
                  type: "Frame",
                  name: "Recommended Tour 4",

                  layout: {
                    width: { value: 220, unit: "px" },
                    minWidth: { value: 220, unit: "px" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 10,
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "recommended_product_image_4",
                      parentId: "recommended_product_4",
                      type: "Image",
                      name: "Recommended Tour Image 4",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Recommended Sri Lanka tour",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_title_4",
                      parentId: "recommended_product_4",
                      type: "Text",
                      name: "Recommended Tour Sri Lanka travel guide 4",

                      layout: {},

                      style: {
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Tour package title",
                        tag: "h3",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_price_4",
                      parentId: "recommended_product_4",
                      type: "Text",
                      name: "Recommended Tour Price 4",

                      layout: {},

                      style: {
                        fontSize: 11,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textColor: "#444444",
                        textAlign: "left",
                      },

                      props: {
                        text: "From Rs. 9,900",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "price|starting_price|package_price|rate|from_price",
                        },
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "recommended_product_5",
                  parentId: "recommended_products_grid",
                  type: "Frame",
                  name: "Recommended Tour 5",

                  layout: {
                    width: { value: 220, unit: "px" },
                    minWidth: { value: 220, unit: "px" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 10,
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "recommended_product_image_5",
                      parentId: "recommended_product_5",
                      type: "Image",
                      name: "Recommended Tour Image 5",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Recommended Sri Lanka tour",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_title_5",
                      parentId: "recommended_product_5",
                      type: "Text",
                      name: "Recommended Tour Sri Lanka travel guide 5",

                      layout: {},

                      style: {
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Tour package title",
                        tag: "h3",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_price_5",
                      parentId: "recommended_product_5",
                      type: "Text",
                      name: "Recommended Tour Price 5",

                      layout: {},

                      style: {
                        fontSize: 11,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textColor: "#444444",
                        textAlign: "left",
                      },

                      props: {
                        text: "From Rs. 9,900",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "price|starting_price|package_price|rate|from_price",
                        },
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "recommended_product_6",
                  parentId: "recommended_products_grid",
                  type: "Frame",
                  name: "Recommended Tour 6",

                  layout: {
                    width: { value: 220, unit: "px" },
                    minWidth: { value: 220, unit: "px" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 10,
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "recommended_product_image_6",
                      parentId: "recommended_product_6",
                      type: "Image",
                      name: "Recommended Tour Image 6",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "/no-image.jpg",
                        alt: "Recommended Sri Lanka tour",
                        objectFit: "cover",
                      },

                      runtime: {
                        columnMap: {
                          src: "image|image_url|thumbnail|cover|tour_image|destination_image|collection_image",
                          alt: "name|title|tour_name|destination|collection_name",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_title_6",
                      parentId: "recommended_product_6",
                      type: "Text",
                      name: "Recommended Tour Sri Lanka travel guide 6",

                      layout: {},

                      style: {
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Tour package title",
                        tag: "h3",
                      },

                      runtime: {
                        columnMap: {
                          text: "name|title|tour_name|destination|package_name|collection_name|travel_style",
                        },
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_price_6",
                      parentId: "recommended_product_6",
                      type: "Text",
                      name: "Recommended Tour Price 6",

                      layout: {},

                      style: {
                        fontSize: 11,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textColor: "#444444",
                        textAlign: "left",
                      },

                      props: {
                        text: "From Rs. 9,900",
                        tag: "span",
                      },

                      runtime: {
                        columnMap: {
                          text: "price|starting_price|package_price|rate|from_price",
                        },
                      },

                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    label: "Travel Stories",
    list: [
      {
        label: "Travel stories: Carousel",
        icon: "🎠",

        node: {
          id: "blog_posts_carousel",
          parentId: null,
          type: "Frame",
          name: "Blog Posts Carousel",

          layout: {
            width: { value: 100, unit: "%" },
            height: { value: 420, unit: "px" },
            display: "flex",
            flexDirection: "column",
            padding: { top: 28, right: 28, bottom: 28, left: 28 },
            gap: 16,
            overflow: "hidden",
          },

          style: {
            backgroundColor: "#ffffff",
            borderRadius: 8,
            boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
          },

          props: {},

          children: [
            {
              id: "blog_carousel_title",
              parentId: "blog_posts_carousel",
              type: "Text",
              name: "Blog Carousel Sri Lanka travel guide",
              layout: {},
              style: {
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.1,
                textColor: "#111111",
                textAlign: "left",
              },
              props: {
                text: "Travel stories",
                tag: "h2",
              },
              children: [],
            },

            {
              id: "blog_carousel_track",
              parentId: "blog_posts_carousel",
              type: "Frame",
              name: "Blog Carousel Track",
              props: { marquee: true } as any,
              layout: {
                width: { value: 100, unit: "%" },
                height: { value: 360, unit: "px" },
                display: "flex",
                flexDirection: "row",
                gap: 12,
                overflow: "hidden",
              },
              style: {},
              children: [
                {
                  id: "blog_carousel_card_1",
                  parentId: "blog_carousel_track",
                  type: "Frame",
                  name: "Blog Card 1",
                  layout: {
                    width: { value: 260, unit: "px" },
                    minWidth: { value: 260, unit: "px" },
                    height: { value: 100, unit: "%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    overflow: "hidden",
                  },
                  style: {},
                  props: {},
                  children: [
                    {
                      id: "blog_carousel_image_1",
                      parentId: "blog_carousel_card_1",
                      type: "Image",
                      name: "Blog Image 1",
                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },
                      props: {
                        src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                        alt: "Blog image",
                        objectFit: "cover",
                      },
                      children: [],
                    },
                    {
                      id: "blog_carousel_card_title_1",
                      parentId: "blog_carousel_card_1",
                      type: "Text",
                      name: "Blog Card Sri Lanka travel guide 1",
                      layout: {},
                      style: {
                        fontSize: 13,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },
                      props: { text: "Sri Lanka travel guide", tag: "h3" },
                      children: [],
                    },
                    {
                      id: "blog_carousel_meta_1",
                      parentId: "blog_carousel_card_1",
                      type: "Text",
                      name: "Blog Meta 1",
                      layout: {},
                      style: {
                        fontSize: 9,
                        textColor: "#777777",
                        lineHeight: 1.2,
                        textAlign: "left",
                      },
                      props: {
                        text: "Travel Guide   |   TrailNest",
                        tag: "span",
                      },
                      children: [],
                    },
                    {
                      id: "blog_carousel_excerpt_1",
                      parentId: "blog_carousel_card_1",
                      type: "Text",
                      name: "Blog Excerpt 1",
                      layout: {},
                      style: {
                        fontSize: 10,
                        lineHeight: 1.35,
                        textColor: "#333333",
                        textAlign: "left",
                      },
                      props: {
                        text: "Helpful tips, destination ideas, and local insights for planning a better Sri Lanka journey.",
                        tag: "p",
                      },
                      children: [],
                    },
                  ],
                },

                {
                  id: "blog_carousel_card_2",
                  parentId: "blog_carousel_track",
                  type: "Frame",
                  name: "Blog Card 2",
                  layout: {
                    width: { value: 260, unit: "px" },
                    minWidth: { value: 260, unit: "px" },
                    height: { value: 100, unit: "%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    overflow: "hidden",
                  },
                  style: {},
                  props: {},
                  children: [
                    {
                      id: "blog_carousel_image_2",
                      parentId: "blog_carousel_card_2",
                      type: "Image",
                      name: "Blog Image 2",
                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },
                      props: {
                        src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                        alt: "Blog image",
                        objectFit: "cover",
                      },
                      children: [],
                    },
                    {
                      id: "blog_carousel_card_title_2",
                      parentId: "blog_carousel_card_2",
                      type: "Text",
                      name: "Blog Card Sri Lanka travel guide 2",
                      layout: {},
                      style: {
                        fontSize: 13,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },
                      props: { text: "Sri Lanka travel guide", tag: "h3" },
                      children: [],
                    },
                    {
                      id: "blog_carousel_meta_2",
                      parentId: "blog_carousel_card_2",
                      type: "Text",
                      name: "Blog Meta 2",
                      layout: {},
                      style: {
                        fontSize: 9,
                        textColor: "#777777",
                        lineHeight: 1.2,
                        textAlign: "left",
                      },
                      props: {
                        text: "Travel Guide   |   TrailNest",
                        tag: "span",
                      },
                      children: [],
                    },
                    {
                      id: "blog_carousel_excerpt_2",
                      parentId: "blog_carousel_card_2",
                      type: "Text",
                      name: "Blog Excerpt 2",
                      layout: {},
                      style: {
                        fontSize: 10,
                        lineHeight: 1.35,
                        textColor: "#333333",
                        textAlign: "left",
                      },
                      props: {
                        text: "Helpful tips, destination ideas, and local insights for planning a better Sri Lanka journey.",
                        tag: "p",
                      },
                      children: [],
                    },
                  ],
                },

                {
                  id: "blog_carousel_card_3",
                  parentId: "blog_carousel_track",
                  type: "Frame",
                  name: "Blog Card 3",
                  layout: {
                    width: { value: 260, unit: "px" },
                    minWidth: { value: 260, unit: "px" },
                    height: { value: 100, unit: "%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    overflow: "hidden",
                  },
                  style: {},
                  props: {},
                  children: [
                    {
                      id: "blog_carousel_image_3",
                      parentId: "blog_carousel_card_3",
                      type: "Image",
                      name: "Blog Image 3",
                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },
                      props: {
                        src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
                        alt: "Blog image",
                        objectFit: "cover",
                      },
                      children: [],
                    },
                    {
                      id: "blog_carousel_card_title_3",
                      parentId: "blog_carousel_card_3",
                      type: "Text",
                      name: "Blog Card Sri Lanka travel guide 3",
                      layout: {},
                      style: {
                        fontSize: 13,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },
                      props: { text: "Sri Lanka travel guide", tag: "h3" },
                      children: [],
                    },
                    {
                      id: "blog_carousel_meta_3",
                      parentId: "blog_carousel_card_3",
                      type: "Text",
                      name: "Blog Meta 3",
                      layout: {},
                      style: {
                        fontSize: 9,
                        textColor: "#777777",
                        lineHeight: 1.2,
                        textAlign: "left",
                      },
                      props: {
                        text: "Travel Guide   |   TrailNest",
                        tag: "span",
                      },
                      children: [],
                    },
                    {
                      id: "blog_carousel_excerpt_3",
                      parentId: "blog_carousel_card_3",
                      type: "Text",
                      name: "Blog Excerpt 3",
                      layout: {},
                      style: {
                        fontSize: 10,
                        lineHeight: 1.35,
                        textColor: "#333333",
                        textAlign: "left",
                      },
                      props: {
                        text: "Helpful tips, destination ideas, and local insights for planning a better Sri Lanka journey.",
                        tag: "p",
                      },
                      children: [],
                    },
                  ],
                },

                {
                  id: "blog_carousel_card_4",
                  parentId: "blog_carousel_track",
                  type: "Frame",
                  name: "Blog Card 4",
                  layout: {
                    width: { value: 260, unit: "px" },
                    minWidth: { value: 260, unit: "px" },
                    height: { value: 100, unit: "%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    overflow: "hidden",
                  },
                  style: {},
                  props: {},
                  children: [
                    {
                      id: "blog_carousel_image_4",
                      parentId: "blog_carousel_card_4",
                      type: "Image",
                      name: "Blog Image 4",
                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },
                      props: {
                        src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
                        alt: "Blog image",
                        objectFit: "cover",
                      },
                      children: [],
                    },
                    {
                      id: "blog_carousel_card_title_4",
                      parentId: "blog_carousel_card_4",
                      type: "Text",
                      name: "Blog Card Sri Lanka travel guide 4",
                      layout: {},
                      style: {
                        fontSize: 13,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },
                      props: { text: "Sri Lanka travel guide", tag: "h3" },
                      children: [],
                    },
                    {
                      id: "blog_carousel_meta_4",
                      parentId: "blog_carousel_card_4",
                      type: "Text",
                      name: "Blog Meta 4",
                      layout: {},
                      style: {
                        fontSize: 9,
                        textColor: "#777777",
                        lineHeight: 1.2,
                        textAlign: "left",
                      },
                      props: {
                        text: "Travel Guide   |   TrailNest",
                        tag: "span",
                      },
                      children: [],
                    },
                    {
                      id: "blog_carousel_excerpt_4",
                      parentId: "blog_carousel_card_4",
                      type: "Text",
                      name: "Blog Excerpt 4",
                      layout: {},
                      style: {
                        fontSize: 10,
                        lineHeight: 1.35,
                        textColor: "#333333",
                        textAlign: "left",
                      },
                      props: {
                        text: "Helpful tips, destination ideas, and local insights for planning a better Sri Lanka journey.",
                        tag: "p",
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Travel stories: Editorial",
        icon: "📝",
        node: {
          id: "blog_editorial",
          parentId: null,
          type: "Frame",
          name: "Blog Editorial",

          layout: {
            width: { value: 100, unit: "%" },
            height: { value: 620, unit: "px" },

            display: "flex",
            flexDirection: "column",

            padding: {
              top: 32,
              right: 32,
              bottom: 32,
              left: 32,
            },

            gap: 24,
            overflow: "hidden",
          },

          style: {
            backgroundColor: "#ffffff",
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
          },

          props: {},

          children: [
            {
              id: "blog_editorial_heading",
              parentId: "blog_editorial",
              type: "Text",
              name: "Heading",

              layout: {},

              style: {
                fontSize: 24,
                fontWeight: 700,
                textColor: "#111111",
                lineHeight: 1.1,
                textAlign: "left",
              },

              props: {
                text: "Travel stories",
                tag: "h2",
              },

              children: [],
            },

            {
              id: "editorial_layout",
              parentId: "blog_editorial",
              type: "Frame",
              name: "Editorial Layout",

              layout: {
                display: "flex",
                flexDirection: "row",
                gap: 24,

                width: { value: 100, unit: "%" },
                height: { value: 500, unit: "px" },
              },

              style: {},

              props: {},

              children: [
                // LEFT FEATURED CARD
                {
                  id: "featured_post",
                  parentId: "editorial_layout",
                  type: "Frame",
                  name: "Featured Post",

                  layout: {
                    width: { value: 58, unit: "%" },
                    height: { value: 100, unit: "%" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 14,
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "featured_image",
                      parentId: "featured_post",
                      type: "Image",

                      name: "Featured Image",

                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 340, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
                        alt: "Featured blog image",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "featured_title",
                      parentId: "featured_post",
                      type: "Text",

                      name: "Featured Sri Lanka travel guide",

                      layout: {},

                      style: {
                        fontSize: 26,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "A slow travel guide to Sri Lanka’s hill country",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "featured_meta",
                      parentId: "featured_post",
                      type: "Text",

                      name: "Featured Meta",

                      layout: {},

                      style: {
                        fontSize: 11,
                        textColor: "#777777",
                        lineHeight: 1.2,
                        textAlign: "left",
                      },

                      props: {
                        text: "Travel Guide  •  Sri Lanka",
                        tag: "span",
                      },

                      children: [],
                    },

                    {
                      id: "featured_excerpt",
                      parentId: "featured_post",
                      type: "Text",

                      name: "Featured Excerpt",

                      layout: {},

                      style: {
                        fontSize: 14,
                        lineHeight: 1.6,
                        textColor: "#444444",
                        textAlign: "left",
                      },

                      props: {
                        text: "Ride scenic trains, visit tea estates, hike misty viewpoints, and plan a peaceful mountain itinerary.",
                        tag: "p",
                      },

                      children: [],
                    },
                  ],
                },

                // RIGHT STACK
                {
                  id: "side_posts",
                  parentId: "editorial_layout",
                  type: "Frame",
                  name: "Side Posts",

                  layout: {
                    width: { value: 42, unit: "%" },
                    height: { value: 100, unit: "%" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 24,
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "side_post_1",
                      parentId: "side_posts",
                      type: "Frame",

                      name: "Side Post 1",

                      layout: {
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      },

                      style: {},

                      props: {},

                      children: [
                        {
                          id: "side_image_1",
                          parentId: "side_post_1",
                          type: "Image",

                          name: "Side Image 1",

                          layout: {
                            width: { value: 100, unit: "%" },
                            height: { value: 180, unit: "px" },
                          },

                          props: {
                            src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                            alt: "Blog image",
                            objectFit: "cover",
                          },

                          children: [],
                        },

                        {
                          id: "side_title_1",
                          parentId: "side_post_1",
                          type: "Text",

                          name: "Side Sri Lanka travel guide 1",

                          layout: {},

                          style: {
                            fontSize: 18,
                            fontWeight: 700,
                            lineHeight: 1.2,
                            textColor: "#111111",
                          },

                          props: {
                            text: "Best coastal towns for beach lovers",
                            tag: "h4",
                          },

                          children: [],
                        },
                      ],
                    },

                    {
                      id: "side_post_2",
                      parentId: "side_posts",
                      type: "Frame",

                      name: "Side Post 2",

                      layout: {
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      },

                      style: {},

                      props: {},

                      children: [
                        {
                          id: "side_image_2",
                          parentId: "side_post_2",
                          type: "Image",

                          name: "Side Image 2",

                          layout: {
                            width: { value: 100, unit: "%" },
                            height: { value: 180, unit: "px" },
                          },

                          props: {
                            src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                            alt: "Blog image",
                            objectFit: "cover",
                          },

                          children: [],
                        },

                        {
                          id: "side_title_2",
                          parentId: "side_post_2",
                          type: "Text",

                          name: "Side Sri Lanka travel guide 2",

                          layout: {},

                          style: {
                            fontSize: 18,
                            fontWeight: 700,
                            lineHeight: 1.2,
                            textColor: "#111111",
                          },

                          props: {
                            text: "Cultural triangle itinerary ideas",
                            tag: "h4",
                          },

                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Travel stories: Grid",
        icon: "📰",

        node: {
          id: "blog_grid",
          parentId: null,
          type: "Frame",
          name: "Blog Grid",

          layout: {
            width: { value: 100, unit: "%" },
            height: { value: 420, unit: "px" },

            display: "flex",
            flexDirection: "column",

            padding: {
              top: 24,
              right: 24,
              bottom: 24,
              left: 24,
            },

            gap: 18,
            overflow: "hidden",
          },

          style: {
            backgroundColor: "#ffffff",
            borderRadius: 8,
            boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
          },

          props: {},

          children: [
            {
              id: "blog_grid_title",
              parentId: "blog_grid",
              type: "Text",
              name: "Grid Sri Lanka travel guide",

              layout: {},

              style: {
                fontSize: 28,
                fontWeight: 700,
                textColor: "#111111",
                lineHeight: 1.1,
                textAlign: "left",
              },

              props: {
                text: "Travel stories",
                tag: "h2",
              },

              children: [],
            },

            {
              id: "blog_grid_items",
              parentId: "blog_grid",
              type: "Frame",
              name: "Blog Grid Items",

              layout: {
                width: { value: 100, unit: "%" },
                height: { value: 360, unit: "px" },

                display: "grid",
                columns: 3,

                gap: 12,
              },

              style: {},

              props: {},

              children: [
                // CARD 1
                {
                  id: "blog_card_1",
                  parentId: "blog_grid_items",
                  type: "Frame",
                  name: "Blog Card 1",

                  layout: {
                    width: { value: 33.33, unit: "%" },
                    height: { value: 100, unit: "%" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 8,
                    overflow: "hidden",
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "blog_card_image_1",
                      parentId: "blog_card_1",
                      type: "Image",
                      name: "Blog Image 1",

                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                        alt: "Blog image",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "blog_card_title_1",
                      parentId: "blog_card_1",
                      type: "Text",
                      name: "Blog Sri Lanka travel guide 1",

                      layout: {},

                      style: {
                        fontSize: 15,
                        fontWeight: 700,
                        textColor: "#111111",
                        lineHeight: 1.1,
                        textAlign: "left",
                      },

                      props: {
                        text: "Sri Lanka travel guide",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "blog_card_meta_1",
                      parentId: "blog_card_1",
                      type: "Text",
                      name: "Blog Meta 1",

                      layout: {},

                      style: {
                        fontSize: 10,
                        textColor: "#777777",
                        lineHeight: 1.2,
                        textAlign: "left",
                      },

                      props: {
                        text: "Travel Guide   |   TrailNest",
                        tag: "span",
                      },

                      children: [],
                    },

                    {
                      id: "blog_card_excerpt_1",
                      parentId: "blog_card_1",
                      type: "Text",
                      name: "Blog Excerpt 1",

                      layout: {},

                      style: {
                        fontSize: 11,
                        lineHeight: 1.4,
                        textColor: "#444444",
                        textAlign: "left",
                      },

                      props: {
                        text: "Helpful tips, destination ideas, and local insights for planning a better Sri Lanka journey.",
                        tag: "p",
                      },

                      children: [],
                    },
                  ],
                },

                // CARD 2
                {
                  id: "blog_card_2",
                  parentId: "blog_grid_items",
                  type: "Frame",
                  name: "Blog Card 2",

                  layout: {
                    width: { value: 33.33, unit: "%" },
                    height: { value: 100, unit: "%" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 8,
                    overflow: "hidden",
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "blog_card_image_2",
                      parentId: "blog_card_2",
                      type: "Image",
                      name: "Blog Image 2",

                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                        alt: "Blog image",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "blog_card_title_2",
                      parentId: "blog_card_2",
                      type: "Text",
                      name: "Blog Sri Lanka travel guide 2",

                      layout: {},

                      style: {
                        fontSize: 15,
                        fontWeight: 700,
                        textColor: "#111111",
                        lineHeight: 1.1,
                        textAlign: "left",
                      },

                      props: {
                        text: "Sri Lanka travel guide",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "blog_card_meta_2",
                      parentId: "blog_card_2",
                      type: "Text",
                      name: "Blog Meta 2",

                      layout: {},

                      style: {
                        fontSize: 10,
                        textColor: "#777777",
                        lineHeight: 1.2,
                        textAlign: "left",
                      },

                      props: {
                        text: "Travel Guide   |   TrailNest",
                        tag: "span",
                      },

                      children: [],
                    },

                    {
                      id: "blog_card_excerpt_2",
                      parentId: "blog_card_2",
                      type: "Text",
                      name: "Blog Excerpt 2",

                      layout: {},

                      style: {
                        fontSize: 11,
                        lineHeight: 1.4,
                        textColor: "#444444",
                        textAlign: "left",
                      },

                      props: {
                        text: "Helpful tips, destination ideas, and local insights for planning a better Sri Lanka journey.",
                        tag: "p",
                      },

                      children: [],
                    },
                  ],
                },

                // CARD 3
                {
                  id: "blog_card_3",
                  parentId: "blog_grid_items",
                  type: "Frame",
                  name: "Blog Card 3",

                  layout: {
                    width: { value: 33.33, unit: "%" },
                    height: { value: 100, unit: "%" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 8,
                    overflow: "hidden",
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "blog_card_image_3",
                      parentId: "blog_card_3",
                      type: "Image",
                      name: "Blog Image 3",

                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
                        alt: "Blog image",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "blog_card_title_3",
                      parentId: "blog_card_3",
                      type: "Text",
                      name: "Blog Sri Lanka travel guide 3",

                      layout: {},

                      style: {
                        fontSize: 15,
                        fontWeight: 700,
                        textColor: "#111111",
                        lineHeight: 1.1,
                        textAlign: "left",
                      },

                      props: {
                        text: "Sri Lanka travel guide",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "blog_card_meta_3",
                      parentId: "blog_card_3",
                      type: "Text",
                      name: "Blog Meta 3",

                      layout: {},

                      style: {
                        fontSize: 10,
                        textColor: "#777777",
                        lineHeight: 1.2,
                        textAlign: "left",
                      },

                      props: {
                        text: "Travel Guide   |   TrailNest",
                        tag: "span",
                      },

                      children: [],
                    },

                    {
                      id: "blog_card_excerpt_3",
                      parentId: "blog_card_3",
                      type: "Text",
                      name: "Blog Excerpt 3",

                      layout: {},

                      style: {
                        fontSize: 11,
                        lineHeight: 1.4,
                        textColor: "#444444",
                        textAlign: "left",
                      },

                      props: {
                        text: "Helpful tips, destination ideas, and local insights for planning a better Sri Lanka journey.",
                        tag: "p",
                      },

                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Carousel",
        icon: "🎠",
        node: {
          id: "story_carousel",
          parentId: null,
          type: "Frame",
          name: "Carousel",

          layout: {
            width: { value: 100, unit: "%" },
            height: { value: 420, unit: "px" },
            display: "flex",
            flexDirection: "column",
            padding: { top: 28, right: 28, bottom: 28, left: 28 },
            gap: 14,
            overflow: "hidden",
          },

          style: {
            backgroundColor: "#ffffff",
            borderRadius: 8,
            boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
          },

          props: {},

          children: [
            {
              id: "carousel_title",
              parentId: "story_carousel",
              type: "Text",
              name: "Carousel Sri Lanka travel guide",
              layout: {},
              style: {
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.1,
                textColor: "#111111",
                textAlign: "left",
              },
              props: {
                text: "Discover unforgettable Sri Lanka journeys",
                tag: "h2",
              },
              children: [],
            },

            {
              id: "carousel_track",
              parentId: "story_carousel",
              type: "Frame",
              name: "Carousel Track",
              layout: {
                display: "flex",
                flexDirection: "row",
                gap: 8,
                width: { value: 100, unit: "%" },
                height: { value: 360, unit: "px" },
                overflow: "hidden",
              },
              style: {},
              props: { marquee: true },
              children: [
                {
                  id: "carousel_item_1",
                  parentId: "carousel_track",
                  type: "Frame",
                  name: "Carousel Item 1",
                  layout: {
                    width: { value: 25, unit: "%" },
                    height: { value: 100, unit: "%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    overflow: "hidden",
                  },
                  style: {},
                  props: {},
                  children: [
                    {
                      id: "carousel_image_1",
                      parentId: "carousel_item_1",
                      type: "Image",
                      name: "Carousel Image 1",
                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },
                      props: {
                        src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
                        alt: "Sri Lanka travel experience",
                        objectFit: "cover",
                      },
                      children: [],
                    },
                    {
                      id: "carousel_item_title_1",
                      parentId: "carousel_item_1",
                      type: "Text",
                      name: "Item Sri Lanka travel guide 1",
                      layout: {},
                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },
                      props: {
                        text: "Scenic hill country",
                        tag: "h3",
                      },
                      children: [],
                    },
                    {
                      id: "carousel_item_body_1",
                      parentId: "carousel_item_1",
                      type: "Text",
                      name: "Item Body 1",
                      layout: {},
                      style: {
                        fontSize: 9,
                        lineHeight: 1.25,
                        textColor: "#333333",
                        textAlign: "left",
                      },
                      props: {
                        text: "Tea trails, waterfalls, viewpoints, and slow mountain mornings",
                        tag: "p",
                      },
                      children: [],
                    },
                  ],
                },

                {
                  id: "carousel_item_2",
                  parentId: "carousel_track",
                  type: "Frame",
                  name: "Carousel Item 2",
                  layout: {
                    width: { value: 25, unit: "%" },
                    height: { value: 100, unit: "%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    overflow: "hidden",
                  },
                  style: {},
                  props: {},
                  children: [
                    {
                      id: "carousel_image_2",
                      parentId: "carousel_item_2",
                      type: "Image",
                      name: "Carousel Image 2",
                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },
                      props: {
                        src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
                        alt: "Sri Lanka travel experience",
                        objectFit: "cover",
                      },
                      children: [],
                    },
                    {
                      id: "carousel_item_title_2",
                      parentId: "carousel_item_2",
                      type: "Text",
                      name: "Item Sri Lanka travel guide 2",
                      layout: {},
                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },
                      props: {
                        text: "Trusted local guides",
                        tag: "h3",
                      },
                      children: [],
                    },
                    {
                      id: "carousel_item_body_2",
                      parentId: "carousel_item_2",
                      type: "Text",
                      name: "Item Body 2",
                      layout: {},
                      style: {
                        fontSize: 9,
                        lineHeight: 1.25,
                        textColor: "#333333",
                        textAlign: "left",
                      },
                      props: {
                        text: "Carefully planned routes, reliable transfers, and authentic local experiences",
                        tag: "p",
                      },
                      children: [],
                    },
                  ],
                },

                {
                  id: "carousel_item_3",
                  parentId: "carousel_track",
                  type: "Frame",
                  name: "Carousel Item 3",
                  layout: {
                    width: { value: 25, unit: "%" },
                    height: { value: 100, unit: "%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    overflow: "hidden",
                  },
                  style: {},
                  props: {},
                  children: [
                    {
                      id: "carousel_image_3",
                      parentId: "carousel_item_3",
                      type: "Image",
                      name: "Carousel Image 3",
                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },
                      props: {
                        src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
                        alt: "Sri Lanka travel experience",
                        objectFit: "cover",
                      },
                      children: [],
                    },
                    {
                      id: "carousel_item_title_3",
                      parentId: "carousel_item_3",
                      type: "Text",
                      name: "Item Sri Lanka travel guide 3",
                      layout: {},
                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },
                      props: {
                        text: "Memories made to last",
                        tag: "h3",
                      },
                      children: [],
                    },
                    {
                      id: "carousel_item_body_3",
                      parentId: "carousel_item_3",
                      type: "Text",
                      name: "Item Body 3",
                      layout: {},
                      style: {
                        fontSize: 9,
                        lineHeight: 1.25,
                        textColor: "#333333",
                        textAlign: "left",
                      },
                      props: {
                        text: "Journeys designed for meaningful moments, not rushed checklists",
                        tag: "p",
                      },
                      children: [],
                    },
                  ],
                },

                {
                  id: "carousel_item_4",
                  parentId: "carousel_track",
                  type: "Frame",
                  name: "Carousel Item 4",
                  layout: {
                    width: { value: 25, unit: "%" },
                    height: { value: 100, unit: "%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    overflow: "hidden",
                  },
                  style: {},
                  props: {},
                  children: [
                    {
                      id: "carousel_image_4",
                      parentId: "carousel_item_4",
                      type: "Image",
                      name: "Carousel Image 4",
                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },
                      props: {
                        src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
                        alt: "Sri Lanka travel experience",
                        objectFit: "cover",
                      },
                      children: [],
                    },
                    {
                      id: "carousel_item_title_4",
                      parentId: "carousel_item_4",
                      type: "Text",
                      name: "Item Sri Lanka travel guide 4",
                      layout: {},
                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },
                      props: {
                        text: "Island beauty you can feel",
                        tag: "h3",
                      },
                      children: [],
                    },
                    {
                      id: "carousel_item_body_4",
                      parentId: "carousel_item_4",
                      type: "Text",
                      name: "Item Body 4",
                      layout: {},
                      style: {
                        fontSize: 9,
                        lineHeight: 1.25,
                        textColor: "#333333",
                        textAlign: "left",
                      },
                      props: {
                        text: "Golden beaches, ancient temples, wildlife parks, and warm hospitality",
                        tag: "p",
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Editorial",
        icon: "📖",
        node: {
          id: "editorial_card",
          parentId: null,
          type: "Frame",
          name: "Editorial Card",

          layout: {
            display: "flex",
            flexDirection: "row",

            width: { value: 100, unit: "%" },
            height: { value: 240, unit: "px" },

            overflow: "hidden",
          },

          style: {
            backgroundColor: "#ffffff",
            borderRadius: 8,
            boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
          },

          props: {},

          children: [
            // IMAGE
            {
              id: "editorial_image_side",
              parentId: "editorial_card",
              type: "Frame",
              name: "Editorial Image Side",

              layout: {
                width: { value: 50, unit: "%" },
                height: { value: 100, unit: "%" },

                display: "flex",
                overflow: "hidden",
              },

              style: {
                backgroundColor: "#dddddd",
              },

              props: {},

              children: [
                {
                  id: "editorial_image",
                  parentId: "editorial_image_side",
                  type: "Image",
                  name: "Editorial Image",

                  layout: {
                    width: { value: 100, unit: "%" },
                    height: { value: 100, unit: "%" },
                  },

                  props: {
                    src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
                    alt: "Sri Lanka featured travel experience",
                    objectFit: "cover",
                  },

                  children: [],
                },
              ],
            },

            // CONTENT
            {
              id: "editorial_content_side",
              parentId: "editorial_card",
              type: "Frame",
              name: "Editorial Content Side",

              layout: {
                width: { value: 50, unit: "%" },
                height: { value: 100, unit: "%" },

                display: "flex",
                flexDirection: "column",

                justifyContent: "center",
                alignItems: "start",

                padding: {
                  top: 28,
                  right: 34,
                  bottom: 28,
                  left: 34,
                },

                gap: 12,
              },

              style: {
                backgroundColor: "#dfeaf4",
              },

              props: {},

              children: [
                {
                  id: "editorial_label",
                  parentId: "editorial_content_side",
                  type: "Text",
                  name: "Editorial Label",

                  layout: {},

                  style: {
                    fontSize: 10,
                    fontWeight: 600,
                    textColor: "#222222",
                    textAlign: "left",
                  },

                  props: {
                    text: "Editorial",
                    tag: "span",
                  },

                  children: [],
                },

                {
                  id: "editorial_title",
                  parentId: "editorial_content_side",
                  type: "Text",
                  name: "Editorial Sri Lanka travel guide",

                  layout: {},

                  style: {
                    fontSize: 28,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    textColor: "#111111",
                    textAlign: "left",
                  },

                  props: {
                    text: "Our signature Sri Lanka journey",
                    tag: "h2",
                  },

                  children: [],
                },

                {
                  id: "editorial_body",
                  parentId: "editorial_content_side",
                  type: "Text",
                  name: "Editorial Body",

                  layout: {
                    maxWidth: { value: 320, unit: "px" },
                  },

                  style: {
                    fontSize: 13,
                    lineHeight: 1.5,
                    textColor: "#444444",
                    textAlign: "left",
                  },

                  props: {
                    text: "Curated with local insight and loved by travelers, this journey blends iconic sights with authentic Sri Lankan experiences.",
                    tag: "p",
                  },

                  children: [],
                },

                {
                  id: "editorial_button",
                  parentId: "editorial_content_side",
                  type: "Link",
                  name: "Editorial Button",

                  layout: {
                    margin: {
                      top: 10,
                    },
                  },

                  style: {
                    fontSize: 12,
                    fontWeight: 600,
                    textColor: "#111111",
                    textAlign: "left",
                  },

                  props: {
                    text: "View itinerary",
                    href: "#",
                  },

                  children: [],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Editorial: Jumbo text",
        icon: "🔠",

        node: {
          id: "editorial_jumbo_text",
          parentId: null,
          type: "Frame",
          name: "Editorial Jumbo Text",

          layout: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "stretch",

            width: { value: 100, unit: "%" },
            height: { value: 260, unit: "px" },

            overflow: "hidden",
          },

          style: {
            backgroundColor: "#f3f5ef",
            borderRadius: 8,
            boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
          },

          props: {},

          children: [
            // LEFT SIDE
            {
              id: "frame1",
              parentId: "editorial_jumbo_text",
              type: "Frame",
              name: "Text Column",

              layout: {
                display: "flex",
                flexDirection: "column",

                justifyContent: "center",
                alignItems: "start",

                width: { value: 50, unit: "%" },
                height: { value: 100, unit: "%" },

                padding: {
                  top: 0,
                  right: 20,
                  bottom: 0,
                  left: 34,
                },

                overflow: "hidden",
              },

              style: {
                backgroundColor: "#f4f7ef",
              },

              props: {},

              children: [
                {
                  id: "text1",
                  parentId: "frame1",
                  type: "Text",
                  name: "Headline",

                  layout: {
                    width: { value: 100, unit: "%" },
                  },

                  style: {
                    textColor: "#000000",

                    fontSize: 144,
                    fontWeight: 700,

                    lineHeight: 0.78,
                    letterSpacing: -7,

                    textAlign: "right",
                  },

                  props: {
                    text: "EXPLORE\nTHE\nISLAND",
                    tag: "h1",
                  },

                  children: [],
                },
              ],
            },

            // RIGHT SIDE
            {
              id: "frame2",
              parentId: "editorial_jumbo_text",
              type: "Frame",
              name: "Image Column",

              layout: {
                display: "flex",

                justifyContent: "center",
                alignItems: "center",

                width: { value: 50, unit: "%" },
                height: { value: 100, unit: "%" },

                position: "relative",
                overflow: "hidden",
              },

              style: {
                backgroundColor: "#e9ece8",
              },

              props: {},

              children: [
                {
                  id: "image1",
                  parentId: "frame2",
                  type: "Image",
                  name: "Editorial Travel Image",

                  layout: {
                    width: { value: 100, unit: "%" },
                    height: { value: 100, unit: "%" },
                  },

                  props: {
                    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80",
                    alt: "Editorial Image",
                    objectFit: "cover",
                  },

                  children: [],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Image compare",
        icon: "↔️",
        node: {
          id: "image_compare_section",
          type: "Frame",
          parentId: "root",
          props: {},
          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 420, unit: "px" },
            display: "flex",
            padding: { top: 24, right: 24, bottom: 24, left: 24 },
          },
          style: {
            backgroundColor: "#ffffff",
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
          },
          children: [
            {
              id: "compare_text",
              type: "Frame",
              parentId: "image_compare_section",
              props: {},
              layout: {
                width: { value: 40, unit: "%" },
                minHeight: { value: 372, unit: "px" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "start",
                gap: 12,
                padding: { top: 48, right: 48, bottom: 48, left: 24 },
              },
              style: {},
              children: [
                {
                  id: "compare_title",
                  type: "Text",
                  parentId: "compare_text",
                  props: { text: "Find your perfect travel style", tag: "h2" },
                  layout: {},
                  style: {
                    fontSize: 28,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    textColor: "#111111",
                    textAlign: "left",
                  },
                  children: [],
                },
                {
                  id: "compare_body",
                  type: "Text",
                  parentId: "compare_text",
                  props: {
                    text: "Compare culture, coast, wildlife, and hill-country experiences",
                    tag: "p",
                  },
                  layout: {},
                  style: {
                    fontSize: 13,
                    textColor: "#555555",
                    textAlign: "left",
                  },
                  children: [],
                },
                {
                  id: "compare_buttons",
                  type: "Frame",
                  parentId: "compare_text",
                  props: {},
                  layout: {
                    display: "flex",
                    gap: 10,
                    margin: { top: 8 },
                  },
                  style: {},
                  children: [
                    {
                      id: "compare_view_all",
                      type: "Link",
                      parentId: "compare_buttons",
                      props: { text: "View tours", href: "#" },
                      layout: {
                        padding: { top: 8, right: 14, bottom: 8, left: 14 },
                        border: 1,
                      },
                      style: {
                        borderColor: "#111111",
                        borderRadius: 6,
                        fontSize: 12,
                        textColor: "#111111",
                        textAlign: "center",
                      },
                      children: [],
                    },
                    {
                      id: "compare_shop_now",
                      type: "Link",
                      parentId: "compare_buttons",
                      props: { text: "View itinerary", href: "#" },
                      layout: {
                        padding: { top: 8, right: 14, bottom: 8, left: 14 },
                      },
                      style: {
                        backgroundColor: "#000000",
                        textColor: "#ffffff",
                        borderRadius: 6,
                        fontSize: 12,
                        textAlign: "center",
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              id: "compare_image_slider",
              type: "ImageCompare",
              parentId: "image_compare_section",
              props: {
                beforeSrc:
                  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
                afterSrc:
                  "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
                beforeAlt: "Before image",
                afterAlt: "After image",
                value: 50,
              },
              layout: {
                width: { value: 60, unit: "%" },
                minHeight: { value: 372, unit: "px" },
                overflow: "hidden",
              },
              style: {
                backgroundColor: "#eeeeee",
                borderRadius: 8,
              },
              children: [],
            },
          ],
        },
      },
      {
        label: "Image with text",
        icon: "🖼️",
        node: {
          id: "image_text_section",
          type: "Frame",
          parentId: "root",
          props: {},
          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 480, unit: "px" },
            display: "flex",
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
          },
          style: {
            backgroundColor: "#ffffff",
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
          },
          children: [
            {
              id: "image_text_image",
              type: "Frame",
              parentId: "image_text_section",
              props: {},
              layout: {
                width: { value: 35, unit: "%" },
                minHeight: { value: 480, unit: "px" },
                margin: { top: 24, right: 24, bottom: 24, left: 24 },
              },
              style: {
                backgroundColor: "#eeeeee",
                backgroundImage:
                  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
              },
              children: [],
            },
            {
              id: "image_text_content",
              type: "Frame",
              parentId: "image_text_section",
              props: {},
              layout: {
                width: { value: 65, unit: "%" },
                minHeight: { value: 480, unit: "px" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "start",
                gap: 14,
                padding: { top: 48, right: 64, bottom: 48, left: 64 },
              },
              style: {},
              children: [
                {
                  id: "image_text_title",
                  type: "Text",
                  parentId: "image_text_content",
                  props: {
                    text: "Our signature Sri Lanka journey",
                    tag: "h3",
                  },
                  layout: {
                    margin: { top: 16, right: 16, bottom: 16, left: 16 },
                  },
                  style: {
                    fontSize: 20,
                    fontWeight: 700,
                    textColor: "#111111",
                    textAlign: "left",
                  },
                  children: [],
                },
                {
                  id: "image_text_body",
                  type: "Text",
                  parentId: "image_text_content",
                  props: {
                    text: "Curated with local insight and traveler comfort, this signature journey blends culture, nature, and relaxation.",
                    tag: "p",
                  },
                  layout: {
                    maxWidth: { value: 420, unit: "px" },
                  },
                  style: {
                    fontSize: 13,
                    lineHeight: 1.6,
                    textColor: "#555555",
                    textAlign: "left",
                  },
                  children: [],
                },
                {
                  id: "image_text_button",
                  type: "Link",
                  parentId: "image_text_content",
                  props: {
                    text: "View itinerary",
                    href: "#",
                  },
                  layout: {
                    padding: { top: 10, right: 16, bottom: 10, left: 16 },
                  },
                  style: {
                    backgroundColor: "#000000",
                    textColor: "#ffffff",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    textAlign: "center",
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Video",
        icon: "▶️",
        node: {
          id: "video_section",
          type: "Frame",
          parentId: "root",
          props: {},
          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 810, unit: "px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: { top: 48, right: 48, bottom: 48, left: 48 },
          },
          style: {
            backgroundColor: "#ffffff",
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
          },
          children: [
            {
              id: "video_thumbnail",
              type: "Frame",
              parentId: "video_section",
              props: {},
              layout: {
                width: { value: 100, unit: "%" },
                height: { value: 714, unit: "px" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              },
              style: {
                backgroundColor: "#f3f3f3",
                backgroundImage:
                  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
                backgroundSize: "cover",
                backgroundPosition: "center center",
              },
              children: [
                {
                  id: "video_play_button",
                  type: "Frame",
                  parentId: "video_thumbnail",
                  props: {},
                  layout: {
                    width: { value: 44, unit: "px" },
                    height: { value: 44, unit: "px" },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  style: {
                    backgroundColor: "#ffffff",
                    borderRadius: 999,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  },
                  children: [
                    {
                      id: "video_play_icon",
                      type: "Text",
                      parentId: "video_play_button",
                      props: {
                        text: "▶",
                        tag: "span",
                      },
                      layout: {},
                      style: {
                        fontSize: 16,
                        textColor: "#4b8ee8",
                        lineHeight: 1,
                        textAlign: "center",
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    label: "Text",
    list: [
      {
        label: "Paragraph",
        icon: "T",
        node: {
          id: "basic_text_block",
          type: "Text",
          parentId: null,
          name: "Text",
          props: {
            text: "Write your text here.",
            tag: "p",
          },
          layout: {
            width: { value: 100, unit: "%" },
          },
          style: {
            fontSize: 18,
            lineHeight: 1.6,
            textColor: "#1f2937",
          },
          children: [],
        },
      },
      {
        label: "Heading",
        icon: "H",
        node: {
          id: "basic_heading_block",
          type: "Text",
          parentId: null,
          name: "Heading",
          props: {
            text: "Add a heading here.",
            tag: "h2",
          },
          layout: {
            width: { value: 100, unit: "%" },
          },
          style: {
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1.15,
            textColor: "#111827",
          },
          children: [],
        },
      },
    ],
  },
  {
    label: "Travel Content",
    list: [
      {
        label: "FAQ",
        icon: "❓",
        node: {
          id: "faq_section",
          type: "Frame",
          parentId: "root",
          props: {},
          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 320, unit: "px" },
            padding: { top: 48, right: 40, bottom: 48, left: 40 },
          },
          style: {
            backgroundColor: "#ffffff",
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
          },
          children: [
            {
              id: "faq_title",
              type: "Text",
              parentId: "faq_section",
              props: {
                text: "Travel planning FAQs",
                tag: "h2",
              },
              layout: {
                margin: { bottom: 32 },
              },
              style: {
                fontSize: 22,
                fontWeight: 700,
                textColor: "#111111",
              },
              children: [],
            },

            {
              id: "faq_item_1",
              type: "Frame",
              parentId: "faq_section",
              props: {},
              layout: {
                width: { value: 100, unit: "%" },
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: { top: 12, right: 0, bottom: 12, left: 0 },
                border: 1,
              },
              style: { borderColor: "#eeeeee" },
              children: [
                {
                  id: "faq_q_1",
                  type: "Text",
                  parentId: "faq_item_1",
                  props: {
                    text: "Can I customize my itinerary?",
                    tag: "span",
                  },
                  layout: {},
                  style: {
                    fontSize: 13,
                    fontWeight: 600,
                    textColor: "#111111",
                  },
                  children: [],
                },
                {
                  id: "faq_icon_1",
                  type: "Icon",
                  parentId: "faq_item_1",
                  props: {
                    library: "fa",
                    name: "FaChevronDown",
                  },
                  layout: {},
                  style: {
                    fontSize: 10,
                    textColor: "#111111",
                  },
                  children: [],
                },
              ],
            },

            {
              id: "faq_item_2",
              type: "Frame",
              parentId: "faq_section",
              props: {},
              layout: {
                width: { value: 100, unit: "%" },
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: { top: 12, right: 0, bottom: 12, left: 0 },
                border: 1,
              },
              style: { borderColor: "#eeeeee" },
              children: [
                {
                  id: "faq_q_2",
                  type: "Text",
                  parentId: "faq_item_2",
                  props: {
                    text: "Are bookings flexible?",
                    tag: "span",
                  },
                  layout: {},
                  style: {
                    fontSize: 13,
                    fontWeight: 600,
                    textColor: "#111111",
                  },
                  children: [],
                },
                {
                  id: "faq_icon_2",
                  type: "Icon",
                  parentId: "faq_item_2",
                  props: {
                    library: "fa",
                    name: "FaChevronDown",
                  },
                  layout: {},
                  style: {
                    fontSize: 10,
                    textColor: "#111111",
                  },
                  children: [],
                },
              ],
            },

            {
              id: "faq_item_3",
              type: "Frame",
              parentId: "faq_section",
              props: {},
              layout: {
                width: { value: 100, unit: "%" },
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: { top: 12, right: 0, bottom: 12, left: 0 },
                border: 1,
              },
              style: { borderColor: "#eeeeee" },
              children: [
                {
                  id: "faq_q_3",
                  type: "Text",
                  parentId: "faq_item_3",
                  props: {
                    text: "When should I confirm my tour?",
                    tag: "span",
                  },
                  layout: {},
                  style: {
                    fontSize: 13,
                    fontWeight: 600,
                    textColor: "#111111",
                  },
                  children: [],
                },
                {
                  id: "faq_icon_3",
                  type: "Icon",
                  parentId: "faq_item_3",
                  props: {
                    library: "fa",
                    name: "FaChevronDown",
                  },
                  layout: {},
                  style: {
                    fontSize: 10,
                    textColor: "#111111",
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Icons with text",
        icon: "🧩",
        node: {
          id: "icons_text_section",
          type: "Frame",
          parentId: "root",
          props: {},
          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 220, unit: "px" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: { top: 48, right: 20, bottom: 48, left: 20 },
          },
          style: {
            backgroundColor: "#ffffff",
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
          },
          children: [
            {
              id: "icons_text_inner",
              type: "Frame",
              parentId: "icons_text_section",
              props: {},
              layout: {
                width: { value: 980, unit: "px" },
                maxWidth: { value: 100, unit: "%" },
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 48,
              },
              style: {},
              children: [
                {
                  id: "icon_text_1",
                  type: "Frame",
                  parentId: "icons_text_inner",
                  props: {},
                  layout: {
                    width: { value: 280, unit: "px" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  },
                  style: {},
                  children: [
                    {
                      id: "icon_text_1_icon",
                      type: "Icon",
                      parentId: "icon_text_1",
                      props: {
                        library: "md",
                        name: "MdOutlineRemoveRedEye",
                      },
                      layout: {},
                      style: {
                        fontSize: 24,
                        textColor: "#111111",
                      },
                      children: [],
                    },
                    {
                      id: "icon_text_1_title",
                      type: "Text",
                      parentId: "icon_text_1",
                      props: { text: "Thoughtful itineraries", tag: "h3" },
                      layout: {},
                      style: {
                        fontSize: 18,
                        fontWeight: 700,
                        lineHeight: 1.15,
                        textColor: "#111111",
                        textAlign: "center",
                      },
                      children: [],
                    },
                    {
                      id: "icon_text_1_body",
                      type: "Text",
                      parentId: "icon_text_1",
                      props: {
                        text: "Every route is planned around your travel goals",
                        tag: "p",
                      },
                      layout: {},
                      style: {
                        fontSize: 12,
                        lineHeight: 1.4,
                        textColor: "#555555",
                        textAlign: "center",
                      },
                      children: [],
                    },
                  ],
                },
                {
                  id: "icon_text_2",
                  type: "Frame",
                  parentId: "icons_text_inner",
                  props: {},
                  layout: {
                    width: { value: 280, unit: "px" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  },
                  style: {},
                  children: [
                    {
                      id: "icon_text_1_icon",
                      type: "Icon",
                      parentId: "icon_text_2",
                      props: {
                        library: "hi",
                        name: "HiOutlineHeart",
                      },
                      layout: {},
                      style: {
                        fontSize: 24,
                        textColor: "#111111",
                      },
                      children: [],
                    },
                    {
                      id: "icon_text_2_title",
                      type: "Text",
                      parentId: "icon_text_2",
                      props: { text: "Guided with care", tag: "h3" },
                      layout: {},
                      style: {
                        fontSize: 18,
                        fontWeight: 700,
                        lineHeight: 1.15,
                        textColor: "#111111",
                        textAlign: "center",
                      },
                      children: [],
                    },
                    {
                      id: "icon_text_2_body",
                      type: "Text",
                      parentId: "icon_text_2",
                      props: {
                        text: "We believe travel should feel personal, safe, and memorable",
                        tag: "p",
                      },
                      layout: {},
                      style: {
                        fontSize: 12,
                        lineHeight: 1.4,
                        textColor: "#555555",
                        textAlign: "center",
                      },
                      children: [],
                    },
                  ],
                },
                {
                  id: "icon_text_3",
                  type: "Frame",
                  parentId: "icons_text_inner",
                  props: {},
                  layout: {
                    width: { value: 280, unit: "px" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  },
                  style: {},
                  children: [
                    {
                      id: "icon_text_1_icon",
                      type: "Icon",
                      parentId: "icon_text_3",
                      props: {
                        library: "hi",
                        name: "HiOutlineUser",
                      },
                      layout: {},
                      style: {
                        fontSize: 24,
                        textColor: "#111111",
                      },
                      children: [],
                    },
                    {
                      id: "icon_text_3_title",
                      type: "Text",
                      parentId: "icon_text_3",
                      props: { text: "Local experts with a goal", tag: "h3" },
                      layout: {},
                      style: {
                        fontSize: 18,
                        fontWeight: 700,
                        lineHeight: 1.15,
                        textColor: "#111111",
                        textAlign: "center",
                      },
                      children: [],
                    },
                    {
                      id: "icon_text_3_body",
                      type: "Text",
                      parentId: "icon_text_3",
                      props: {
                        text: "Real local experts creating better journeys",
                        tag: "p",
                      },
                      layout: {},
                      style: {
                        fontSize: 12,
                        lineHeight: 1.4,
                        textColor: "#555555",
                        textAlign: "center",
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Marquee",
        icon: "➿",
        node: {
          id: "marquee_section",
          type: "Frame",
          parentId: "root",
          props: { marquee: true } as any,
          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 80, unit: "px" },
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            padding: { top: 18, right: 0, bottom: 18, left: 0 },
          },
          style: {
            backgroundColor: "#ffffff",
          },
          children: [
            {
              id: "marquee_track",
              type: "Frame",
              parentId: "marquee_section",
              props: {},
              layout: {
                display: "flex",
                alignItems: "center",
                gap: 64,
              },
              style: {},
              children: Array.from({ length: 8 }).map((_, index) => ({
                id: `marquee_text_${index}`,
                type: "Text",
                parentId: "marquee_track",
                props: {
                  text: "We create Sri Lanka journeys that feel easier, richer, and more memorable.",
                  tag: "span",
                },
                layout: {},
                style: {
                  fontSize: 32,
                  fontWeight: 400,
                  textColor: "#111111",
                  lineHeight: 1,
                },
                children: [],
              })),
            },
          ],
        },
      },
      {
        label: "Multicolumn",
        icon: "▥",
        node: {
          id: "multicolumn_section",
          type: "Frame",
          parentId: "root",
          props: {},
          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 200, unit: "px" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: { top: 60, right: 20, bottom: 60, left: 20 },
          },
          style: {
            backgroundColor: "#ffffff",
          },
          children: [
            {
              id: "multicolumn_inner",
              type: "Frame",
              parentId: "multicolumn_section",
              props: {},
              layout: {
                width: { value: 1000, unit: "px" },
                maxWidth: { value: 100, unit: "%" },
                display: "flex",
                justifyContent: "space-between",
                alignItems: "stretch",
                gap: 40,
              },
              style: {},
              children: [
                {
                  id: "col_1",
                  type: "Frame",
                  parentId: "multicolumn_inner",
                  props: {},
                  layout: {
                    width: { value: 33, unit: "%" },
                    maxWidth: { value: 280, unit: "px" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  },
                  style: {},
                  children: [
                    {
                      id: "col1_title",
                      type: "Text",
                      parentId: "col_1",
                      props: {
                        text: "Thoughtful itineraries",
                        tag: "h3",
                      },
                      layout: {},
                      style: {
                        fontSize: 16,
                        fontWeight: 600,
                        textColor: "#111111",
                        textAlign: "center",
                      },
                      children: [],
                    },
                    {
                      id: "col1_body",
                      type: "Text",
                      parentId: "col_1",
                      props: {
                        text: "We plan with intention. Our tours solve real travel challenges with clear routes, local insight, and flexible support.",
                        tag: "p",
                      },
                      layout: {},
                      style: {
                        fontSize: 13,
                        lineHeight: 1.6,
                        textColor: "#555555",
                        textAlign: "center",
                      },
                      children: [],
                    },
                  ],
                },
                {
                  id: "col_2",
                  type: "Frame",
                  parentId: "multicolumn_inner",
                  props: {},
                  layout: {
                    width: { value: 33, unit: "%" },
                    maxWidth: { value: 280, unit: "px" },
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  },
                  style: {},
                  children: [
                    {
                      id: "col2_title",
                      type: "Text",
                      parentId: "col_2",
                      props: {
                        text: "Experience first",
                        tag: "h3",
                      },
                      layout: {},
                      style: {
                        fontSize: 16,
                        fontWeight: 600,
                        textColor: "#111111",
                        textAlign: "center",
                      },
                      children: [],
                    },
                    {
                      id: "col2_body",
                      type: "Text",
                      parentId: "col_2",
                      props: {
                        text: "We obsess over timing, transfers, guides, and stops so every trip feels smooth and worthwhile.",
                        tag: "p",
                      },
                      layout: {},
                      style: {
                        fontSize: 13,
                        lineHeight: 1.6,
                        textColor: "#555555",
                        textAlign: "center",
                      },
                      children: [],
                    },
                  ],
                },
                {
                  id: "col_3",
                  type: "Frame",
                  parentId: "multicolumn_inner",
                  props: {},
                  layout: {
                    width: { value: 33, unit: "%" },
                    maxWidth: { value: 280, unit: "px" },
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  },
                  style: {},
                  children: [
                    {
                      id: "col3_title",
                      type: "Text",
                      parentId: "col_3",
                      props: {
                        text: "Traveler care",
                        tag: "h3",
                      },
                      layout: {},
                      style: {
                        fontSize: 16,
                        fontWeight: 600,
                        textColor: "#111111",
                        textAlign: "center",
                      },
                      children: [],
                    },
                    {
                      id: "col3_body",
                      type: "Text",
                      parentId: "col_3",
                      props: {
                        text: "We're always on your side. Keeping travelers informed, comfortable, and confident is our top priority.",
                        tag: "p",
                      },
                      layout: {},
                      style: {
                        fontSize: 13,
                        lineHeight: 1.6,
                        textColor: "#555555",
                        textAlign: "center",
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Pull quote",
        icon: "❝",
        node: {
          id: "pull_quote_centered",
          type: "Frame",
          parentId: "root",
          props: {},
          layout: {
            width: { value: 100, unit: "%" },
            minHeight: { value: 360, unit: "px" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: { top: 80, right: 20, bottom: 80, left: 20 },
          },
          style: {
            backgroundColor: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          },
          children: [
            {
              id: "pull_quote_inner",
              type: "Frame",
              parentId: "pull_quote_centered",
              props: {},
              layout: {
                width: { value: 720, unit: "px" },
                maxWidth: { value: 100, unit: "%" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              },
              style: {},
              children: [
                {
                  id: "pull_quote_text",
                  type: "Text",
                  parentId: "pull_quote_inner",
                  props: {
                    text: "At the heart of every journey is a story: misty hills, ancient cities, coastal sunsets, wildlife encounters, and the people who make Sri Lanka unforgettable.",
                    tag: "h2",
                  },
                  layout: {},
                  style: {
                    fontSize: 34,
                    fontWeight: 700,
                    lineHeight: 1.3,
                    textAlign: "center",
                    textColor: "#111111",
                    letterSpacing: -0.2,
                  },
                  children: [],
                },
                {
                  id: "pull_quote_cta",
                  type: "Link",
                  parentId: "pull_quote_inner",
                  props: {
                    text: "View itinerary",
                    href: "#",
                  },
                  layout: {
                    padding: { top: 10, right: 16, bottom: 10, left: 16 },
                  },
                  style: {
                    fontSize: 14,
                    fontWeight: 500,
                    textColor: "#555555",
                    textAlign: "center",
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Rich text",
        icon: "T",
        node: {
          id: "rich_text_centered",
          type: "Frame",
          parentId: "root",
          props: {},
          layout: {
            minHeight: { value: 360, unit: "px" },
            width: { value: 100, unit: "%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: { top: 80, right: 20, bottom: 80, left: 20 },
          },
          style: {
            backgroundColor: "#fff",
          },
          children: [
            {
              id: "rich_text_inner",
              type: "Frame",
              parentId: "rich_text_centered",
              props: {},
              layout: {
                width: { value: 640, unit: "px" },
                maxWidth: { value: 100, unit: "%" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              },
              style: {},
              children: [
                {
                  id: "rich_text_title",
                  type: "Text",
                  parentId: "rich_text_inner",
                  props: {
                    text: "New travel experiences",
                    tag: "h2",
                  },
                  layout: {},
                  style: {
                    fontSize: 32,
                    fontWeight: 700,
                    textColor: "#111111",
                    textAlign: "center",
                    lineHeight: 1.2,
                  },
                  children: [],
                },
                {
                  id: "rich_text_body",
                  type: "Text",
                  parentId: "rich_text_inner",
                  props: {
                    text: "We design travel experiences that work better from start to finish, with clear itineraries, trusted guides, and authentic Sri Lankan moments.",
                    tag: "p",
                  },
                  layout: {
                    maxWidth: { value: 520, unit: "px" },
                  },
                  style: {
                    fontSize: 15,
                    lineHeight: 1.6,
                    textColor: "#555555",
                    textAlign: "center",
                  },
                  children: [],
                },
                {
                  id: "rich_text_button",
                  type: "Link",
                  parentId: "rich_text_inner",
                  props: {
                    text: "View itinerary",
                    href: "#",
                  },
                  layout: {
                    padding: { top: 10, right: 18, bottom: 10, left: 18 },
                  },
                  style: {
                    backgroundColor: "#000000",
                    textColor: "#ffffff",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: "center",
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      },
    ],
  },
];
