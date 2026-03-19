import { ComponentNode } from "./types";

export const componentTree: Record<string, ComponentNode> = {
  root: {
    id: "root",
    type: "Frame",
    parentId: null,
    props: {},
    layout: {},
    style: {},
    children: [
      {
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
            props: {
              href: "?page=home",
            },
            layout: {},
            style: {},
            children: [
              {
                id: "image1",
                type: "Image",
                parentId: "link1",
                props: {
                  src: "https://cdn-icons-png.flaticon.com/128/15465/15465604.png"
                },
                layout: {
                  width: { value: 35 },
                  height: { value: 35 }
                },
                style: {},
                children: []
              }
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
                name: "Home",
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
                name: "About",
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
      },

      {
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
                name: "Welcome to Our Website",
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
                name: "Build modern layouts with reusable components and beautiful images.",
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
                id: "link3",
                type: "Link",
                name: "Get Started",
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
              padding: { top: 10, right: 10, bottom: 10, left: 10}
            },
            style: { backgroundColor: "#000"},
            children: [],
          },
        ],
      },
    ],
  },
};