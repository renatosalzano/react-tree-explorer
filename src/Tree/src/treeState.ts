import { TreeItem, NodeProps, TreeProps } from "../index";

export class TreeState {
  root = {
    path: "/",
    label: "root",
    isRoot: true,
    children: [] as NodeProps[],
  };
  active = "";
  nodes: { [key: string]: NodeProps } = { '/': this.root };

  rootOffset = 0;
  checked: string[] = [];
  multicheck = false;
  defaultIcons: TreeProps['defaultIcons'];

  constructor({
    root = [],
    lock,
    multicheck = false,
    defaultIcons,
  }: TreeProps) {
    this.defaultIcons = defaultIcons;
    this.multicheck = multicheck;
    // init nodes
    this.root.children = root.map((child) => {
      const node = this.resolveNode(child, "/");
      this.nodes[node.path] = node;
      return this.nodes[node.path];
    });

    if (lock && this.nodes[lock]) {
      this.rootOffset += lock.split('/').length - 1;
    }


  }

  resolveNode(node: TreeItem, parent?: string): NodeProps {
    const n = { ...node } as NodeProps;

    n.path = parent === '/'
      ? `/${n.label}`
      : `${parent}/${n.label}`;

    n.nestedIndex = n.path.split('/').length - 2 - this.rootOffset;
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

        console.log("update state " + path, update)
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
          console.log('select node')
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

  getNode(path: string, root?: boolean) {
    try {
      if (path[0] !== "/") path = `/${path}`
      if (root) {
        if (this.nodes[path]) return this.nodes[path];
        return this.root as NodeProps;
      } else if (this.nodes[path]) {
        return this.nodes[path];
      }

    } catch (err) {
      console.error(err)
    }
    return {} as NodeProps
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