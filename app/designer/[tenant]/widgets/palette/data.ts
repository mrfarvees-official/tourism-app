import { ComponentList, ComponentNode } from "./types";
import { FaBullseye, FaHeart, FaChessPawn } from "react-icons/fa";

/* =========================
   HEADER
========================= */
export const header: ComponentNode = {
  id: "frame2",
  type: "Frame",
  parentId: "root",
  props: {},
  layout: {
    display: "flex",
    border: 2,
    justifyContent: "space-between",
    alignItems: "center",
    padding: { top: 12, right: 20, bottom: 12, left: 20 },
  },
  style: {},
  children: [
    {
      id: "link1",
      type: "Link",
      parentId: "frame2",
      props: { href: "?page=home" },
      layout: {},
      style: {},
      children: [
        {
          id: "image1",
          type: "Image",
          parentId: "link1",
          props: {
            src: "https://cdn-icons-png.flaticon.com/128/15465/15465604.png",
          },
          layout: {
            width: { value: 35 },
            height: { value: 35 },
          },
          style: {},
          children: [],
        },
      ],
    },
    {
      id: "frame3",
      type: "Frame",
      parentId: "frame2",
      props: {},
      layout: {
        display: "flex",
        gap: 16,
      },
      style: {},
      children: [
        {
          id: "link2",
          type: "Link",
          parentId: "frame3",
          props: {
            text: "Home",
            href: "?page=home",
          },
          layout: {},
          style: {},
          children: [],
        },
        {
          id: "link3",
          type: "Link",
          parentId: "frame3",
          props: {
            text: "About",
            href: "?page=about",
          },
          layout: {},
          style: {},
          children: [],
        },
      ],
    },
  ],
};

/* =========================
   TEMPLATE / BODY
========================= */
export const template: ComponentNode = {
  id: "frame4",
  type: "Frame",
  parentId: "root",
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
      "https://media.istockphoto.com/id/178642135/photo/mountains-of-snow.jpg?s=1024x1024&w=is&k=20&c=Izd2BMtYNtkBbueLwgGOW_z0mk1my5vZxve2-Ukbyjw=",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
  },
  children: [
    {
      id: "frame5",
      type: "Frame",
      parentId: "frame4",
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
          id: "text3",
          type: "Text",
          parentId: "frame5",
          props: {
            text: "Welcome to Our Website",
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
          id: "text4",
          type: "Text",
          parentId: "frame5",
          props: {
            text: "Build modern layouts with reusable components and beautiful images.",
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
          id: "cta",
          type: "Link",
          parentId: "frame5",
          props: {
            text: "Get Started",
            href: "?page=getStarted",
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
      id: "frame6",
      type: "Frame",
      parentId: "frame4",
      props: {},
      layout: {
        width: { value: 50, unit: "%" },
        padding: { top: 10, right: 10, bottom: 10, left: 10 },
      },
      style: { backgroundColor: "#000" },
      children: [],
    },
  ],
};

/* =========================
   FOOTER (TEMP)
========================= */
export const footer: ComponentNode = {
  id: "footer",
  type: "Frame",
  parentId: "root",
  props: {},
  layout: {
    width: { value: 100, unit: "%" },
    padding: { top: 20, right: 20, bottom: 20, left: 20 },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  style: {
    backgroundColor: "#111111",
  },
  children: [
    {
      id: "footerText",
      type: "Text",
      parentId: "footer",
      props: {
        text: "© 2026 Your Company. All rights reserved.",
        tag: "p",
      },
      layout: {},
      style: {
        textColor: "#ffffff",
        fontSize: 14,
      },
      children: [],
    },
  ],
};

export const components: ComponentList[] = [
  {
    label: "Banners",
    list: [
      {
        label: "Hero",
        icon: "🏞️",
        node: template, //{ id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Hero: Bottom aligned",
        icon: "⬇️",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Hero: Marquee",
        icon: "➿",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Large logo",
        icon: "🔰",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Layered slideshow",
        icon: "🖼️",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Slideshow: Full frame",
        icon: "🎞️",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Slideshow: Inset",
        icon: "🖼️",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Split showcase",
        icon: "▣",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
    ],
  },
  {
    label: "Collections",
    list: [
      {
        label: "Collection links: Spotlight",
        icon: "🔦",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Collection links: Text",
        icon: "🔗",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Collection list: Bento",
        icon: "▦",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Collection list: Carousel",
        icon: "🎠",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Collection list: Editorial",
        icon: "📰",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Collection list: Grid",
        icon: "▦",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
    ],
  },
  {
    label: "Forms",
    list: [
      {
        label: "Contact form",
        icon: "✉️",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Email signup",
        icon: "📧",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
    ],
  },
  {
    label: "Layout",
    list: [
      {
        label: "Custom section",
        icon: "⬚",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Divider",
        icon: "━",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
    ],
  },
  {
    label: "Products",
    list: [
      {
        label: "Featured collection: Carousel",
        icon: "🛍️",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Featured collection: Editorial",
        icon: "📰",
        node: { id: "", parentId: "", type: "Frame", props: {}, children: [] },
      },
      {
        label: "Featured collection: Grid",
        icon: "▦",
        node: {
          id: "featured_collection_grid",
          parentId: null,
          type: "Frame",
          name: "Featured Collection Grid",

          layout: {
            width: { value: 100, unit: "%" },
            height: { value: 760, unit: "px" },

            display: "flex",
            flexDirection: "column",

            padding: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
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
              id: "featured_collection_grid_title",
              parentId: "featured_collection_grid",
              type: "Text",
              name: "Title",

              layout: {},

              style: {
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.1,
                textColor: "#111111",
                textAlign: "left",
              },

              props: {
                text: "Featured products",
                tag: "h2",
              },

              children: [],
            },

            {
              id: "featured_collection_grid_items",
              parentId: "featured_collection_grid",
              type: "Frame",
              name: "Product Grid",

              layout: {
                width: { value: 100, unit: "%" },

                display: "flex",
                flexDirection: "row",

                wrap: true,
                gap: 12,

                overflow: "hidden",
              },

              style: {},

              props: {},

              children: [
                {
                  id: "featured_collection_product_1",
                  parentId: "featured_collection_grid_items",
                  type: "Frame",
                  name: "Product 1",

                  layout: {
                    width: { value: 24, unit: "%" },

                    display: "flex",
                    flexDirection: "column",

                    gap: 6,
                  },

                  style: {},

                  props: {},

                  children: [
                    {
                      id: "featured_collection_product_image_1",
                      parentId: "featured_collection_product_1",
                      type: "Image",
                      name: "Product Image 1",

                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },

                      style: {},

                      props: {
                        src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
                        alt: "Featured product",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_product_title_1",
                      parentId: "featured_collection_product_1",
                      type: "Text",
                      name: "Product Title 1",

                      layout: {},

                      style: {
                        fontSize: 11,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Product title",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_product_price_1",
                      parentId: "featured_collection_product_1",
                      type: "Text",
                      name: "Product Price 1",

                      layout: {},

                      style: {
                        fontSize: 10,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textColor: "#666666",
                        textAlign: "left",
                      },

                      props: {
                        text: "Rs. 19.99",
                        tag: "span",
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "featured_collection_product_2",
                  parentId: "featured_collection_grid_items",
                  type: "Frame",
                  name: "Product 2",

                  layout: {
                    width: { value: 24, unit: "%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  },

                  style: {},
                  props: {},

                  children: [
                    {
                      id: "featured_collection_product_image_2",
                      parentId: "featured_collection_product_2",
                      type: "Image",

                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
                        alt: "Featured product",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_product_title_2",
                      parentId: "featured_collection_product_2",
                      type: "Text",

                      style: {
                        fontSize: 11,
                        fontWeight: 700,
                        textColor: "#111111",
                      },

                      props: {
                        text: "Product title",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_product_price_2",
                      parentId: "featured_collection_product_2",
                      type: "Text",

                      style: {
                        fontSize: 10,
                        fontWeight: 600,
                        textColor: "#666666",
                      },

                      props: {
                        text: "Rs. 19.99",
                        tag: "span",
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "featured_collection_product_3",
                  parentId: "featured_collection_grid_items",
                  type: "Frame",
                  name: "Product 3",

                  layout: {
                    width: { value: 24, unit: "%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  },

                  props: {},
                  style: {},

                  children: [
                    {
                      id: "featured_collection_product_image_3",
                      parentId: "featured_collection_product_3",
                      type: "Image",

                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
                        alt: "Featured product",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_product_title_3",
                      parentId: "featured_collection_product_3",
                      type: "Text",

                      style: {
                        fontSize: 11,
                        fontWeight: 700,
                        textColor: "#111111",
                      },

                      props: {
                        text: "Product title",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_product_price_3",
                      parentId: "featured_collection_product_3",
                      type: "Text",

                      style: {
                        fontSize: 10,
                        fontWeight: 600,
                        textColor: "#666666",
                      },

                      props: {
                        text: "Rs. 19.99",
                        tag: "span",
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "featured_collection_product_4",
                  parentId: "featured_collection_grid_items",
                  type: "Frame",
                  name: "Product 4",

                  layout: {
                    width: { value: 24, unit: "%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  },

                  props: {},
                  style: {},

                  children: [
                    {
                      id: "featured_collection_product_image_4",
                      parentId: "featured_collection_product_4",
                      type: "Image",

                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1523398002811-999ca8dec234",
                        alt: "Featured product",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_product_title_4",
                      parentId: "featured_collection_product_4",
                      type: "Text",

                      style: {
                        fontSize: 11,
                        fontWeight: 700,
                        textColor: "#111111",
                      },

                      props: {
                        text: "Product title",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_product_price_4",
                      parentId: "featured_collection_product_4",
                      type: "Text",

                      style: {
                        fontSize: 10,
                        fontWeight: 600,
                        textColor: "#666666",
                      },

                      props: {
                        text: "Rs. 19.99",
                        tag: "span",
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "featured_collection_product_5",
                  parentId: "featured_collection_grid_items",
                  type: "Frame",
                  name: "Product 5",

                  layout: {
                    width: { value: 24, unit: "%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  },

                  props: {},
                  style: {},

                  children: [
                    {
                      id: "featured_collection_product_image_5",
                      parentId: "featured_collection_product_5",
                      type: "Image",

                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
                        alt: "Featured product",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_product_title_5",
                      parentId: "featured_collection_product_5",
                      type: "Text",

                      props: {
                        text: "Product title",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_product_price_5",
                      parentId: "featured_collection_product_5",
                      type: "Text",

                      props: {
                        text: "Rs. 19.99",
                        tag: "span",
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "featured_collection_product_6",
                  parentId: "featured_collection_grid_items",
                  type: "Frame",
                  name: "Product 6",

                  layout: {
                    width: { value: 24, unit: "%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  },

                  props: {},
                  style: {},

                  children: [
                    {
                      id: "featured_collection_product_image_6",
                      parentId: "featured_collection_product_6",
                      type: "Image",

                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
                        alt: "Featured product",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_product_title_6",
                      parentId: "featured_collection_product_6",
                      type: "Text",

                      props: {
                        text: "Product title",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_product_price_6",
                      parentId: "featured_collection_product_6",
                      type: "Text",

                      props: {
                        text: "Rs. 19.99",
                        tag: "span",
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "featured_collection_product_7",
                  parentId: "featured_collection_grid_items",
                  type: "Frame",
                  name: "Product 7",

                  layout: {
                    width: { value: 24, unit: "%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  },

                  props: {},
                  style: {},

                  children: [
                    {
                      id: "featured_collection_product_image_7",
                      parentId: "featured_collection_product_7",
                      type: "Image",

                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
                        alt: "Featured product",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_product_title_7",
                      parentId: "featured_collection_product_7",
                      type: "Text",

                      props: {
                        text: "Product title",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_product_price_7",
                      parentId: "featured_collection_product_7",
                      type: "Text",

                      props: {
                        text: "Rs. 19.99",
                        tag: "span",
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "featured_collection_product_8",
                  parentId: "featured_collection_grid_items",
                  type: "Frame",
                  name: "Product 8",

                  layout: {
                    width: { value: 24, unit: "%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  },

                  props: {},
                  style: {},

                  children: [
                    {
                      id: "featured_collection_product_image_8",
                      parentId: "featured_collection_product_8",
                      type: "Image",

                      layout: {
                        width: { value: 100, unit: "%" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
                        alt: "Featured product",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_product_title_8",
                      parentId: "featured_collection_product_8",
                      type: "Text",

                      props: {
                        text: "Product title",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "featured_collection_product_price_8",
                      parentId: "featured_collection_product_8",
                      type: "Text",

                      props: {
                        text: "Rs. 19.99",
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
        label: "Featured product",
        icon: "📦",
        node: {
          id: "featured_product",
          parentId: null,
          type: "Frame",
          name: "Featured Product",

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

          props: {},

          children: [
            // LEFT IMAGE
            {
              id: "featured_product_image_wrapper",
              parentId: "featured_product",
              type: "Frame",
              name: "Featured Product Image Wrapper",

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
                  name: "Featured Product Image",

                  layout: {
                    width: { value: 100, unit: "%" },
                    height: { value: 100, unit: "%" },
                  },

                  props: {
                    src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
                    alt: "Featured product",
                    objectFit: "cover",
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
              name: "Featured Product Content",

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
                  name: "Featured Product Title",

                  layout: {},

                  style: {
                    fontSize: 28,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    textColor: "#111111",
                    textAlign: "left",
                  },

                  props: {
                    text: "Product title",
                    tag: "h2",
                  },

                  children: [],
                },

                {
                  id: "featured_product_price",
                  parentId: "featured_product_content",
                  type: "Text",
                  name: "Featured Product Price",

                  layout: {},

                  style: {
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    textColor: "#444444",
                    textAlign: "left",
                  },

                  props: {
                    text: "Rs. 19.99",
                    tag: "span",
                  },

                  children: [],
                },

                {
                  id: "featured_product_reviews",
                  parentId: "featured_product_content",
                  type: "Text",
                  name: "Featured Product Reviews",

                  layout: {},

                  style: {
                    fontSize: 12,
                    fontWeight: 500,
                    lineHeight: 1.2,
                    textColor: "#666666",
                    textAlign: "left",
                  },

                  props: {
                    text: "★★★★★   3 reviews",
                    tag: "span",
                  },

                  children: [],
                },

                {
                  id: "featured_product_button",
                  parentId: "featured_product_content",
                  type: "Frame",
                  name: "Featured Product Button",

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
                      name: "Featured Product Button Text",

                      layout: {},

                      style: {
                        fontSize: 13,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#ffffff",
                        textAlign: "center",
                      },

                      props: {
                        text: "Sold out",
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
        label: "Product highlight",
        icon: "⭐",
        node: {
          id: "product_highlight",
          parentId: null,
          type: "Frame",
          name: "Product Highlight",

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
                  name: "Main Product Image",

                  layout: {
                    width: { value: 100, unit: "%" },
                    height: { value: 100, unit: "%" },
                  },

                  props: {
                    src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
                    alt: "Featured product",
                    objectFit: "cover",
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
                  name: "Secondary Product Image",

                  layout: {
                    width: { value: 100, unit: "%" },
                    height: { value: 100, unit: "%" },
                  },

                  props: {
                    src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
                    alt: "Secondary product",
                    objectFit: "cover",
                  },

                  children: [],
                },

                {
                  id: "product_highlight_title",
                  parentId: "product_highlight_right",
                  type: "Text",
                  name: "Product Title",

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
                    text: "Product title",
                    tag: "span",
                  },

                  children: [],
                },

                {
                  id: "product_highlight_price",
                  parentId: "product_highlight_right",
                  type: "Text",
                  name: "Product Price",

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
                    text: "Rs. 19.99",
                    tag: "span",
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
                    text: "Shop now",
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
        label: "Product hotspots",
        icon: "📍",

        node: {
          id: "product_hotspots",
          parentId: null,
          type: "Frame",
          name: "Product Hotspots",

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
                text: "Shop the look",
                tag: "h2",
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
                    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
                    alt: "Lifestyle scene",
                    objectFit: "cover",
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
        label: "Recommended products",
        icon: "✨",

        node: {
          id: "recommended_products",
          parentId: null,
          type: "Frame",
          name: "Recommended Products",

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
              id: "recommended_products_title",
              parentId: "recommended_products",
              type: "Text",
              name: "Recommended Products Title",

              layout: {},

              style: {
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.1,
                textColor: "#111111",
                textAlign: "left",
              },

              props: {
                text: "Related products",
                tag: "h2",
              },

              children: [],
            },

            {
              id: "recommended_products_grid",
              parentId: "recommended_products",
              type: "Frame",
              name: "Recommended Products Grid",

              layout: {
                width: { value: 100, unit: "%" },
                height: { value: 360, unit: "px" },

                display: "flex",
                flexDirection: "row",

                alignItems: "start",

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
                  name: "Recommended Product 1",

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
                      name: "Recommended Product Image 1",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
                        alt: "Recommended product",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_title_1",
                      parentId: "recommended_product_1",
                      type: "Text",
                      name: "Recommended Product Title 1",

                      layout: {},

                      style: {
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Product title",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_price_1",
                      parentId: "recommended_product_1",
                      type: "Text",
                      name: "Recommended Product Price 1",

                      layout: {},

                      style: {
                        fontSize: 11,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textColor: "#444444",
                        textAlign: "left",
                      },

                      props: {
                        text: "Rs. 999",
                        tag: "span",
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
                  name: "Recommended Product 2",

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
                      name: "Recommended Product Image 2",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
                        alt: "Recommended product",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_title_2",
                      parentId: "recommended_product_2",
                      type: "Text",
                      name: "Recommended Product Title 2",

                      layout: {},

                      style: {
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Product title",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_price_2",
                      parentId: "recommended_product_2",
                      type: "Text",
                      name: "Recommended Product Price 2",

                      layout: {},

                      style: {
                        fontSize: 11,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textColor: "#444444",
                        textAlign: "left",
                      },

                      props: {
                        text: "Rs. 999",
                        tag: "span",
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
                  name: "Recommended Product 3",

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
                      name: "Recommended Product Image 3",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
                        alt: "Recommended product",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_title_3",
                      parentId: "recommended_product_3",
                      type: "Text",
                      name: "Recommended Product Title 3",

                      layout: {},

                      style: {
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Product title",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_price_3",
                      parentId: "recommended_product_3",
                      type: "Text",
                      name: "Recommended Product Price 3",

                      layout: {},

                      style: {
                        fontSize: 11,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textColor: "#444444",
                        textAlign: "left",
                      },

                      props: {
                        text: "Rs. 999",
                        tag: "span",
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
                  name: "Recommended Product 4",

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
                      name: "Recommended Product Image 4",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1523398002811-999ca8dec234",
                        alt: "Recommended product",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_title_4",
                      parentId: "recommended_product_4",
                      type: "Text",
                      name: "Recommended Product Title 4",

                      layout: {},

                      style: {
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Product title",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_price_4",
                      parentId: "recommended_product_4",
                      type: "Text",
                      name: "Recommended Product Price 4",

                      layout: {},

                      style: {
                        fontSize: 11,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textColor: "#444444",
                        textAlign: "left",
                      },

                      props: {
                        text: "Rs. 999",
                        tag: "span",
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "recommended_product_5",
                  parentId: "recommended_products_grid",
                  type: "Frame",
                  name: "Recommended Product 5",

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
                      name: "Recommended Product Image 5",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
                        alt: "Recommended product",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_title_5",
                      parentId: "recommended_product_5",
                      type: "Text",
                      name: "Recommended Product Title 5",

                      layout: {},

                      style: {
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Product title",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_price_5",
                      parentId: "recommended_product_5",
                      type: "Text",
                      name: "Recommended Product Price 5",

                      layout: {},

                      style: {
                        fontSize: 11,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textColor: "#444444",
                        textAlign: "left",
                      },

                      props: {
                        text: "Rs. 999",
                        tag: "span",
                      },

                      children: [],
                    },
                  ],
                },

                {
                  id: "recommended_product_6",
                  parentId: "recommended_products_grid",
                  type: "Frame",
                  name: "Recommended Product 6",

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
                      name: "Recommended Product Image 6",

                      layout: {
                        width: { value: 220, unit: "px" },
                        height: { value: 270, unit: "px" },
                      },

                      props: {
                        src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
                        alt: "Recommended product",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_title_6",
                      parentId: "recommended_product_6",
                      type: "Text",
                      name: "Recommended Product Title 6",

                      layout: {},

                      style: {
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Product title",
                        tag: "h3",
                      },

                      children: [],
                    },

                    {
                      id: "recommended_product_price_6",
                      parentId: "recommended_product_6",
                      type: "Text",
                      name: "Recommended Product Price 6",

                      layout: {},

                      style: {
                        fontSize: 11,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textColor: "#444444",
                        textAlign: "left",
                      },

                      props: {
                        text: "Rs. 999",
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
    label: "Storytelling",
    list: [
      {
        label: "Blog posts: Carousel",
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
              name: "Blog Carousel Title",
              layout: {},
              style: {
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.1,
                textColor: "#111111",
                textAlign: "left",
              },
              props: {
                text: "Blog posts",
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
                        src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
                        alt: "Blog image",
                        objectFit: "cover",
                      },
                      children: [],
                    },
                    {
                      id: "blog_carousel_card_title_1",
                      parentId: "blog_carousel_card_1",
                      type: "Text",
                      name: "Blog Card Title 1",
                      layout: {},
                      style: {
                        fontSize: 13,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },
                      props: { text: "Title", tag: "h3" },
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
                      props: { text: "Date   |   Author", tag: "span" },
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
                        text: "An excerpt of your blog post's content",
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
                        src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
                        alt: "Blog image",
                        objectFit: "cover",
                      },
                      children: [],
                    },
                    {
                      id: "blog_carousel_card_title_2",
                      parentId: "blog_carousel_card_2",
                      type: "Text",
                      name: "Blog Card Title 2",
                      layout: {},
                      style: {
                        fontSize: 13,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },
                      props: { text: "Title", tag: "h3" },
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
                      props: { text: "Date   |   Author", tag: "span" },
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
                        text: "An excerpt of your blog post's content",
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
                        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
                        alt: "Blog image",
                        objectFit: "cover",
                      },
                      children: [],
                    },
                    {
                      id: "blog_carousel_card_title_3",
                      parentId: "blog_carousel_card_3",
                      type: "Text",
                      name: "Blog Card Title 3",
                      layout: {},
                      style: {
                        fontSize: 13,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },
                      props: { text: "Title", tag: "h3" },
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
                      props: { text: "Date   |   Author", tag: "span" },
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
                        text: "An excerpt of your blog post's content",
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
                        src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
                        alt: "Blog image",
                        objectFit: "cover",
                      },
                      children: [],
                    },
                    {
                      id: "blog_carousel_card_title_4",
                      parentId: "blog_carousel_card_4",
                      type: "Text",
                      name: "Blog Card Title 4",
                      layout: {},
                      style: {
                        fontSize: 13,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },
                      props: { text: "Title", tag: "h3" },
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
                      props: { text: "Date   |   Author", tag: "span" },
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
                        text: "An excerpt of your blog post's content",
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
        label: "Blog posts: Editorial",
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
                text: "Blog posts",
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
                        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
                        alt: "Featured blog image",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "featured_title",
                      parentId: "featured_post",
                      type: "Text",

                      name: "Featured Title",

                      layout: {},

                      style: {
                        fontSize: 26,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },

                      props: {
                        text: "Design systems that scale beautifully",
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
                        text: "May 24  •  Editorial",
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
                        text: "A closer look at how modern editorial layouts create hierarchy, rhythm, and visual balance across digital storefronts.",
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
                            src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
                            alt: "Blog image",
                            objectFit: "cover",
                          },

                          children: [],
                        },

                        {
                          id: "side_title_1",
                          parentId: "side_post_1",
                          type: "Text",

                          name: "Side Title 1",

                          layout: {},

                          style: {
                            fontSize: 18,
                            fontWeight: 700,
                            lineHeight: 1.2,
                            textColor: "#111111",
                          },

                          props: {
                            text: "Crafting immersive editorial experiences",
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
                            src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
                            alt: "Blog image",
                            objectFit: "cover",
                          },

                          children: [],
                        },

                        {
                          id: "side_title_2",
                          parentId: "side_post_2",
                          type: "Text",

                          name: "Side Title 2",

                          layout: {},

                          style: {
                            fontSize: 18,
                            fontWeight: 700,
                            lineHeight: 1.2,
                            textColor: "#111111",
                          },

                          props: {
                            text: "Minimal interfaces with maximum clarity",
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
        label: "Blog posts: Grid",
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
              name: "Grid Title",

              layout: {},

              style: {
                fontSize: 28,
                fontWeight: 700,
                textColor: "#111111",
                lineHeight: 1.1,
                textAlign: "left",
              },

              props: {
                text: "Blog posts",
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

                display: "flex",
                flexDirection: "row",

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
                        src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
                        alt: "Blog image",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "blog_card_title_1",
                      parentId: "blog_card_1",
                      type: "Text",
                      name: "Blog Title 1",

                      layout: {},

                      style: {
                        fontSize: 15,
                        fontWeight: 700,
                        textColor: "#111111",
                        lineHeight: 1.1,
                        textAlign: "left",
                      },

                      props: {
                        text: "Title",
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
                        text: "Date   |   Author",
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
                        text: "An excerpt of your blog post's content",
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
                        src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
                        alt: "Blog image",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "blog_card_title_2",
                      parentId: "blog_card_2",
                      type: "Text",
                      name: "Blog Title 2",

                      layout: {},

                      style: {
                        fontSize: 15,
                        fontWeight: 700,
                        textColor: "#111111",
                        lineHeight: 1.1,
                        textAlign: "left",
                      },

                      props: {
                        text: "Title",
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
                        text: "Date   |   Author",
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
                        text: "An excerpt of your blog post's content",
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
                        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
                        alt: "Blog image",
                        objectFit: "cover",
                      },

                      children: [],
                    },

                    {
                      id: "blog_card_title_3",
                      parentId: "blog_card_3",
                      type: "Text",
                      name: "Blog Title 3",

                      layout: {},

                      style: {
                        fontSize: 15,
                        fontWeight: 700,
                        textColor: "#111111",
                        lineHeight: 1.1,
                        textAlign: "left",
                      },

                      props: {
                        text: "Title",
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
                        text: "Date   |   Author",
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
                        text: "An excerpt of your blog post's content",
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
              name: "Carousel Title",
              layout: {},
              style: {
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.1,
                textColor: "#111111",
                textAlign: "left",
              },
              props: {
                text: "Discover elevated design",
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
                        alt: "Carousel item",
                        objectFit: "cover",
                      },
                      children: [],
                    },
                    {
                      id: "carousel_item_title_1",
                      parentId: "carousel_item_1",
                      type: "Text",
                      name: "Item Title 1",
                      layout: {},
                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },
                      props: {
                        text: "Artistry in action",
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
                        text: "Bold style that's recognizable anywhere",
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
                        alt: "Carousel item",
                        objectFit: "cover",
                      },
                      children: [],
                    },
                    {
                      id: "carousel_item_title_2",
                      parentId: "carousel_item_2",
                      type: "Text",
                      name: "Item Title 2",
                      layout: {},
                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },
                      props: {
                        text: "Uncompromising standards",
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
                        text: "Expert construction and an impeccable finish",
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
                        alt: "Carousel item",
                        objectFit: "cover",
                      },
                      children: [],
                    },
                    {
                      id: "carousel_item_title_3",
                      parentId: "carousel_item_3",
                      type: "Text",
                      name: "Item Title 3",
                      layout: {},
                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },
                      props: {
                        text: "Made to last",
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
                        text: "Pieces that only get better with time and wear",
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
                        alt: "Carousel item",
                        objectFit: "cover",
                      },
                      children: [],
                    },
                    {
                      id: "carousel_item_title_4",
                      parentId: "carousel_item_4",
                      type: "Text",
                      name: "Item Title 4",
                      layout: {},
                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        textColor: "#111111",
                        textAlign: "left",
                      },
                      props: {
                        text: "Quality you can feel",
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
                        text: "Authentic materials with refined details",
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
                    alt: "Editorial Product",
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
                  name: "Editorial Title",

                  layout: {},

                  style: {
                    fontSize: 28,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    textColor: "#111111",
                    textAlign: "left",
                  },

                  props: {
                    text: "Our signature product",
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
                    text: "Made with care and intentionally loved by our customers. This signature bestseller is crafted with precision.",
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
                    text: "Shop now",
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
                    text: "UP\nTHE\nANTE",
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
                  name: "Editorial Product Image",

                  layout: {
                    width: { value: 100, unit: "%" },
                    height: { value: 100, unit: "%" },
                  },

                  props: {
                    src: "https://media.istockphoto.com/id/178642135/photo/mountains-of-snow.jpg?s=1024x1024&w=is&k=20&c=Izd2BMtYNtkBbueLwgGOW_z0mk1my5vZxve2-Ukbyjw=",
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
                  props: { text: "Find your perfect fit", tag: "h2" },
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
                  props: { text: "Discover the best of both worlds", tag: "p" },
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
                      props: { text: "View all", href: "#" },
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
                      props: { text: "Shop now", href: "#" },
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
                    text: "Our signature product",
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
                    text: "Made with care and intentionally loved by our customers. This signature bestseller blends comfort and style.",
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
                    text: "Shop now",
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
                text: "Frequently asked questions",
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
                    text: "What is the return policy?",
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
                    text: "Are any purchases final sale?",
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
                    text: "When will I get my order?",
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
                      props: { text: "Intentional design", tag: "h3" },
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
                        text: "Everything we do starts with why",
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
                      props: { text: "Made with care", tag: "h3" },
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
                        text: "We believe in building better",
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
                      props: { text: "A team with a goal", tag: "h3" },
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
                        text: "Real people making great products",
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
                  text: "We make things that work better and last longer.",
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
                        text: "Intentional design",
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
                        text: "We create with intention. Our products solve real problems with clean design and honest materials.",
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
                        text: "Quality first",
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
                        text: "We obsess over the details and strive to deliver the best products at the best prices, every time.",
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
                        text: "Customer care",
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
                        text: "We're always on your side. Keeping our loyal customers happy is our top priority and number one goal.",
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
                    text: "At the heart of every product lies a unique story, driven by our passion for quality and innovation. Each item enhances your everyday life and sparks joy.",
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
                    text: "Shop now",
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
                    text: "New arrivals",
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
                    text: "We make things that work better and last longer. Our products solve real problems with clean design and honest materials.",
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
                    text: "Shop now",
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
