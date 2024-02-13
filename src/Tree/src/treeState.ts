import { TreeItem, NodeProps, TreeProps } from "../index";

export class TreeState {
  root: NodeProps;
  active = "";
  nodes: { [key: string]: NodeProps } = {};

  rootOffset = 0;
  checked: string[] = [];
  multicheck = false;
  defaultIcons: TreeProps['defaultIcons'];

  constructor({
    root,
    lock = "",
    multicheck = false,
    defaultIcons,
  }: TreeProps) {

    this.defaultIcons = defaultIcons;
    this.multicheck = multicheck;


    if (root instanceof Array) {
      // init root
      this.root = {
        label: "",
        path: "/",
        nestedIndex: 0,
        children: root.map((child) => {
          const n = this.resolveNode(child, "/");
          this.nodes[n.path] = n;
          return this.nodes[n.path];
        })
      } as NodeProps;
    } else {
      // custom root
      this.root = this.resolveNode(root);
      this.nodes[this.root.path] = this.root;
    }

    console.log("this root", this)


    if (lock && this.getNode(lock)) {
      this.rootOffset = lock.split('/').length - 2;
    }

  }

  resolveNode(node: TreeItem, parent?: string): NodeProps {
    const n = { ...node } as NodeProps;

    if (parent) {
      n.path = `${parent}/${n.label}`
    } else {
      // root node
      n.path = `/${n.label}`;
      n.isRoot = true;
    }

    n.nestedIndex = n.path.split('/').length - 3;
    n.active = false;

    if (typeof node.selfExpand === "boolean") {
      n.selfExpand = {
        explorer: node.selfExpand,
        tree: node.selfExpand,
      }
    }

    if (n.children && n.children.length > 0) {
      n.type = "branch";
      n.icon = this.defaultIcons!.branch
      n.children = n.children.map((child) => {
        const childNode = this.resolveNode(child as any, n.path);
        this.nodes[childNode.path] = childNode;
        return this.nodes[childNode.path];
      }
      );
    } else {
      n.type = "item";
      n.icon = this.defaultIcons!.item
    }

    return n;
  }

  registerNode(
    type: "explorer" | "tree",
    path: string,
    dispatch?: <T = NodeProps, P = Partial<T>>(update: P | ((prev: T) => T)) => void,
    selectNode?: (node: any) => void
  ) {

    if (dispatch) {
      // mounted node

      // update state fn
      this.nodes[path].update = (update: any) => {

        // console.log("update state " + path, update)
        let openNode = false;

        if (typeof update === 'function') {
          update = update(this.nodes[path]);
        }

        if (update.children) {
          // TODO add custom callback
          update.children = update.children.map((child) => {
            const childNode = this.resolveNode(child, path);
            this.nodes[childNode.path] = childNode;
            return this.nodes[childNode.path];
          });
        }

        if (type === 'explorer' && update.expanded) {
          // dont update expanded
          delete update.expanded;
          openNode = true;
        }

        for (const k in update) {
          this.nodes[path][k] = update[k];
        }

        if (update.active) {
          if (this.active && this.active !== path) {
            this.nodes[this.active].update({ active: false });
          }
          this.active = path;
        }

        if (openNode && selectNode) {
          selectNode(this.nodes[path]);
          return;
        }

        dispatch(() => ({ ...this.nodes[path], openNode }));

        return this.nodes[path];
      };

      if (this.nodes[path].selfExpand?.[type]) {
        this.nodes[path].selfExpand![type] = false;
        this.nodes[path].update({ expanded: true, active: true });
      }

    } else {
      // unmounted node

      this.nodes[path].update = () => this.nodes[path];
    }
  }

  setActive(path: string) {
    if (this.active === path) return;
    const node = this.nodes[path];
    if (this.active) {
      const activeNode = this.nodes[this.active];
      activeNode.active = false;
      activeNode.update({ active: false });
    }
    this.active = path;
    node.update({ active: true });
  }

  onCheck(path: string, checked: boolean) {
    const node = this.nodes[path];
    node.update({ checked });
    if (checked) {
      this.checked.push(path);
      const parents = path.split('/');
      parents.pop();
      parents.forEach((parent) => {
        console.log(parent)
      })
    } else {
      const index = this.checked.indexOf(path);
      this.checked.splice(index, 1);
    }
    console.log(this.checked)
  }

  logNode(path: string) {
    return this.nodes[path];
  }

  getNode(path: string) {
    console.log(path)
    return this.nodes[path]
  }

  setNode(path: string, update: any) {
    this.nodes[path] = {
      ...this.nodes[path],
      ...update
    }

  }

  log() {
    console.log(this)
  }

}