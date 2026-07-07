export type SizeUnit = "px" | "%" | "auto" | "rem" | "vh" | "vw";

export type Dimension = {
  value: number | "auto";
  unit?: SizeUnit;
};

export type Spacing = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export type LayoutProps = {
  width?: Dimension;
  height?: Dimension;
  minWidth?: Dimension;
  minHeight?: Dimension;
  maxWidth?: Dimension;
  maxHeight?: Dimension;
  unit?: SizeUnit;

  display?: "block" | "flex" | "grid" | "inline-flex";
  columns?: number;
  flexDirection?: "row" | "column";
  justifyContent?: "start" | "center" | "end" | "space-between";
  alignItems?: "start" | "center" | "end" | "stretch";
  gap?: number;
  wrap?: boolean;
  position?: "static" | "relative" | "absolute" | "sticky" | "fixed";
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  zIndex?: number;
  margin?: Spacing;
  padding?: Spacing;
  border?: number;
  overflow?: "visible" | "hidden" | "auto" | "scroll";
};

export type BackgroundSize = "cover" | "contain" | "auto";
export type BackgroundRepeat = "repeat" | "no-repeat" | "repeat-x" | "repeat-y";
export type BackgroundPosition =
  | "left"
  | "center"
  | "right"
  | "top"
  | "bottom"
  | "left top"
  | "left center"
  | "left bottom"
  | "center top"
  | "center center"
  | "center bottom"
  | "right top"
  | "right center"
  | "right bottom";

export type StyleProps = {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: BackgroundSize;
  backgroundRepeat?: BackgroundRepeat;
  backgroundPosition?: BackgroundPosition;

  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  opacity?: number;
  boxShadow?: string;
  fontSize?: number;
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: "left" | "center" | "right";
};

export type TextProps = {
  text: string;
  tag?: "p" | "span" | "h1" | "h2" | "h3";
};

export type ImageProps = {
  src: string;
  alt?: string;
  objectFit?: "cover" | "contain";
};

export type ButtonProps = {
  label: string;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
};

export type LabelProps = {
  text: string;
  htmlFor?: string;
};

export type LinkProps = {
  text?: string;
  href: string;
  src?: string;
  alt?: string;
};

export type InputProps = {
  name: string;
  placeholder?: string;
  inputType?: "text" | "email" | "password" | "number";
  required?: boolean;
};

export type IconProps = {
  library: "fa" | "md" | "io" | "bs" | "hi" | "lu";
  name: string;
};

export type VideoProvider =
  | "youtube"
  | "vimeo"
  | "facebook"
  | "tiktok"
  | "instagram"
  | "file"
  | "custom";

export type VideoProps = {
  href: string;
  provider?: VideoProvider;
  video?: boolean;
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
};

export type ImageCompareProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  value?: number; // 0-100 default 50
};

export type NodePropsMap = {
  Frame: {};
  Link: LinkProps;
  Video: VideoProps;
  ImageCompare: ImageCompareProps;
  Text: TextProps;
  Image: ImageProps;
  Button: ButtonProps;
  List: {};
  Card: {};
  Slider: {};
  Model: {};
  Form: {};
  Input: InputProps;
  Icon: IconProps;
  Label: { text: string; htmlFor?: string };
};

export type Component =
  | "Frame"
  | "Text"
  | "Link"
  | "Image"
  | "Button"
  | "List"
  | "Card"
  | "Slider"
  | "Model"
  | "Form"
  | "Input"
  | "Label"
  | "Icon"
  | "Video"
  | "ImageCompare";

export type ChildrenPosition = "Left" | "Right" | "Top" | "Bottom" | "Center";

export type Scroll =
  | "Scrollable"
  | "VerticalScroll"
  | "HorizontalScroll"
  | undefined;

export type ComponentNode<K extends Component = Component> = {
  id: string;
  type: K;
  name?: string;
  parentId: string | null;
  children: ComponentNode[];

  childrenPosition?: ChildrenPosition;
  scroll?: Scroll;

  layout?: LayoutProps;
  style?: StyleProps;
  props: NodePropsMap[K];
  dataBinding?: DataBinding;
  runtime?: {
    resourceContainer?: boolean;
    repeat?: {
      enabled?: boolean;
      targetResource?:
        | "tour_package"
        | "destination_collection"
        | "destination"
        | "cart"
        | "form"
        | "custom";
      endpoint?: string;
      menu?: string;
      limit?: number;
      dataPath?: string;
      policyPath?: string;
      policy?: {
        columnVisibility?: Record<string, boolean>;
      };
    };
    exposedLabel?: string;
    columnMap?: {
      text?: string;
      label?: string;
      src?: string;
      href?: string;
      alt?: string;
      htmlFor?: string;
    };
  };

  hidden?: boolean;
  locked?: boolean;
};

export type ComponentRules = {
  canHaveChildren: boolean;
  allowedChildren?: Component[];
  allowedParents?: Component[];
};

export const componentRegistry: Record<Component, ComponentRules> = {
  Frame: { canHaveChildren: true },
  Link: { canHaveChildren: true },
  Video: { canHaveChildren: false },
  ImageCompare: { canHaveChildren: false },
  Text: { canHaveChildren: false },
  Image: { canHaveChildren: false },
  Button: { canHaveChildren: false },
  List: { canHaveChildren: true },
  Card: { canHaveChildren: true },
  Slider: { canHaveChildren: true },
  Model: { canHaveChildren: false },
  Icon: {
    canHaveChildren: false,
  },
  Form: {
    canHaveChildren: true,
    allowedChildren: ["Input", "Label", "Button", "Frame", "Text"],
  },
  Input: { canHaveChildren: false },
  Label: { canHaveChildren: false },
};

export type ResponsiveValue<T> = {
  desktop?: T;
  tablet?: T;
  mobile?: T;
};

export type DataBinding = {
  source: "static" | "tour_package" | "destination_collection" | "destination" | "cart" | "form";
  path?: string;
};

export type Action =
  | { type: "link"; url: string; newTab?: boolean }
  | { type: "scrollTo"; targetId: string }
  | { type: "submitForm" }
  | { type: "openModal"; modalId: string };

export type VariantState = "default" | "hover" | "active" | "disabled";

export type VariantStyles = Partial<Record<VariantState, StyleProps>>;

export type DesignSection = {
  nodes: Record<string, ComponentNode>;
  rootIds: string[];
};

export type DesignerSnapshot = {
  header: DesignSection;
  template: DesignSection;
  footer: DesignSection;
};

export type DesignerState = {
  header: DesignSection;
  template: DesignSection;
  footer: DesignSection;

  selectedSection: "header" | "template" | "footer" | null;
  selectedId: string | null;
  insertIndex: number | null;
  hoveredSection: "header" | "template" | "footer" | null;
  hoveredId: string | null;

  history: DesignerSnapshot[];
  future: DesignerSnapshot[];
};

export type ComponentListItem = {
  label: string;
  icon?: React.ReactNode; // ← supports anything
  node: ComponentNode;
};

export type ComponentList = {
  label: string;
  list: ComponentListItem[];
};
