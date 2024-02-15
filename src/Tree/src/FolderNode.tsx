import { FC, MouseEventHandler, RefObject, createContext, useContext, useMemo, useRef, useState } from "react";
import { NodeProps } from "..";
import { useMounted, useUnmounted } from "../../utils/lifecycle";
import { Button } from "./components";
import { useSetState } from "./hooks/useSetState";
import { useTreeContext } from "./Tree";
import { AngleDown, AngleRight } from "./components/Icons";
import { FileNode } from "./FileNode";
import { createPortal } from "react-dom";

export const FolderNode: FC<NodeProps> = (props) => {

  const { getNode, registerNode } = useTreeContext();

  const [state, setState] = useSetState(() => getNode(props.path));

  const updateNode = (update: any) => {

    if (typeof update === "function") {
      update = update(state);
    }

    setState((prev) => ({ ...prev, ...update }));

  }

  useMounted(() => {
    registerNode("folder", state.path, updateNode);
  })

  return (
    <div className="folder-node">
      <Breadcrumb currentNode={state} />
      <ul className="list-unstyled">
        {state.children.map((node) => (
          <FileNode key={node.path} {...node} />
        ))}
      </ul>
    </div>
  )
}

type BreadcrumbStore = {
  registerItem(index: number, ref: RefObject<HTMLLIElement>): void;
}

const BreadcrumbContext = createContext({} as BreadcrumbStore);
const useBreadcrumbContext = () => useContext(BreadcrumbContext);

const Breadcrumb: FC<{ currentNode: NodeProps }> = ({ currentNode }) => {

  const { rootOffset, getNode } = useTreeContext();

  const bradcrumb = useRef<HTMLUListElement>(null);
  const data = useRef<{
    items: HTMLLIElement[];
    totalWidth: number;
  }>({
    items: [],
    totalWidth: 0,
  }).current;

  const setActive = () => {
    getNode(currentNode.path).update({ active: true });
  }

  const [nodes, setNodes] = useState(() => {
    if (currentNode) {
      if (currentNode.isRoot) return [];

      let items = currentNode.path.split("/");
      items = items.slice(0, items.length - 1);

      let paths = items.reduce((prev, curr, i) => {
        const prevPath = prev[i - 1] === "/" ? "" : prev[i - 1];
        const path = prev.length > 0
          ? `${prevPath}/${curr}`
          : `/${curr}`;
        prev.push(path);
        return prev;
      }, [] as any[]);

      paths = paths
        .slice(rootOffset)
        .map((path) => getNode(path));

      return paths;
    }
    return []
  })

  const registerItem: BreadcrumbStore["registerItem"] = (index, ref) => {
    if (ref.current) {
      data.items[index] = ref.current;
      data.totalWidth += ref.current.clientWidth;
    }
  }

  const resize = () => {
    console.log(data.totalWidth)
  }

  useMounted(() => {
    window.addEventListener("resize", resize)
  })

  useUnmounted(() => {
    window.removeEventListener("resize", resize)
  })

  return (
    <BreadcrumbContext.Provider
      value={{
        registerItem
      }}
    >
      <ul ref={bradcrumb} className="folder-breadcrumb list-unstyled">
        {nodes.map((node, i) => (
          <FileNode index={i} key={node.path + i} {...node} breadcrumbItem />
        ))}
        <BreadcrumbItem index={nodes.length}  {...currentNode} onClick={setActive} />
      </ul>
    </BreadcrumbContext.Provider>
  )
}


export const BreadcrumbItem: FC<NodeProps & {
  index: number,
  onClick: () => void
}> = ({ index, path, label, active, children, onClick }) => {
  const { overlay, getNode, setNode, selectNode } = useTreeContext();
  const { registerItem } = useBreadcrumbContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);


  const showList: MouseEventHandler<HTMLButtonElement> = (event) => {
    setOpen(true);
    overlay.open(
      <ul className="breadcrumb-dropdown list-unstyled">
        {children
          .filter(c => c.children)
          .map(({ label, path }, index) => {
            return (
              <li key={`${index}-${label}-breadcrumb-item`} onClick={() => openNode(path)}>
                {label}
              </li>
            )
          })}
      </ul>,
      { target: (event.target as HTMLElement), position: ["bottom", "left"], closeCallback: () => setOpen(false) }
    )
  }

  const openNode = (path: string) => {
    setNode(path, { active: true });
    selectNode(getNode(path));
    overlay.close();
  }


  useMounted(() => {
    registerItem(index, ref)
  })

  return (
    <li ref={ref} className="breadcrumb-node tree-node" data-active={active} data-overlay={path}>
      <div className='tree-element'>
        {/* <Checkbox checked={!!node.checked} onChange={onCheck} /> */}
        <Button
          type='button'
          className="node-label"
          onClick={onClick}
        >
          {label}
        </Button>
      </div>
      <Button
        className="breadcrumb-btn"
        onClick={showList}
      >
        {open ? <AngleDown /> : <AngleRight />}
      </Button>
    </li>
  )
}




