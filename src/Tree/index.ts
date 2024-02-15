import { Dispatch, MouseEvent, ReactNode, SetStateAction } from "react";
import { Tree } from "./src/Tree";
import { TreeState } from "./src/treeState";

type TreeProps = TreeEvents & {
  view?: "tree" | "folder";
  root: TreeItem[] | TreeItem;
  lock?: string;
  multicheck?: boolean;
  defaultIcons?: {
    item?: ReactNode;
    branch?: ReactNode;
  }
}

type TreeItem = {
  label: string;
  active?: boolean;
  checked?: boolean;
  icon?: ReactNode;
  readonly?: boolean;
  className?: string;
  expandable?: boolean;
  selfExpand?: boolean;
  children?: TreeItem[];
  data?: { [key: string]: unknown };
}

type UpdateProps = Omit<NodeProps, "update">
type NodeUpdateFn = (payload: Partial<UpdateProps> | ((prev: UpdateProps) => Partial<UpdateProps>)) => void

type TreeEvents = {
  onNodeClick?(): void;
  onNodeExpand?(
    node: Omit<NodeProps, "update">,
    update: NodeUpdateFn
  ): void;
  onNodeCheck?(): void;
  onChange?(): void;
  creatable?: boolean | {
    onCreated(): void;
    onConfirmed(): void;
  }
}



type NodeUpdate = TreeItem & {
  active?: boolean;
  loading?: boolean;
  expanded?: boolean;
}

type ExpandNode = { explorer: boolean, tree: boolean };

type NodeProps = Omit<NodeUpdate, "children" | "selfExpand"> & {
  path: string;
  type: "branch" | "item";
  selfExpand?: { explorer: boolean; tree: boolean; }
  isRoot?: boolean;
  children: NodeProps[];
  nestedIndex: number;
  mounted: boolean;
  update(update: any): any;
  open(): void;
}

export type { TreeProps, TreeEvents, TreeItem, NodeProps };
export { Tree }
