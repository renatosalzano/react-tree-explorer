import { FC, useMemo } from "react";
import { NodeProps } from "..";
import { useMounted, useUnmounted } from "../../utils/lifecycle";
import { Button } from "./components";
import { useSetState } from "./hooks/useSetState";
import { useTreeContext } from "./Tree";

export const ExplorerNode: FC<NodeProps> = (props) => {

  const { getNode, setNode, registerNode } = useTreeContext();

  const [state, setState] = useSetState(() => getNode(props.path));

  const updateNode = (update: any) => {

    console.log('folder')

    if (typeof update === "function") {
      update = update(state);
    }

    setState((prev) => ({ ...prev, ...update }));

  }

  useMounted(() => {
    registerNode("explorer", state.path, updateNode);
  })

  return (
    <div className="folder-node">
      <Breadcrumb {...state} />
      <ul className="list-unstyled">
        {state.children.map((node) => (
          <Node key={node.path} {...node} />
        ))}
      </ul>
    </div>
  )
}

const Breadcrumb: FC<NodeProps> = (currentNode) => {

  const { rootOffset, getNode } = useTreeContext();

  const setActive = () => {
    getNode(currentNode.path).update({ active: true });
  }

  const nodes = useMemo(() => {
    if (currentNode) {
      if (currentNode.isRoot) return []

      let items = currentNode.path.split("/");
      items = items.slice(1, items.length - 1);

      let paths = items.reduce((prev, curr, i) => {
        const path = prev.length > 0 ? `${prev[i - 1]}/${curr}` : `/${curr}`;
        prev.push(path)
        return prev
      }, [] as any[]);

      paths = paths
        .slice(rootOffset)
        .map((path) => getNode(path));

      return paths;
    }
    return []
  }, [currentNode]);



  return (
    <ul className="node-breadcrumb list-unstyled">
      {nodes.map((node, i) => (
        <Node key={node.path + i}  {...node} breadcrumbItem />
      ))}
      <BreadcrumbItem {...currentNode} onClick={setActive} />
    </ul>
  )
}

type ExplorerNode = NodeProps & {
  breadcrumbItem?: boolean;
}

const Node: FC<ExplorerNode> = ({ breadcrumbItem, ...props }) => {

  const {
    getNode,
    registerNode,
    selectNode,
    onNodeClick,
    onNodeExpand
  } = useTreeContext();

  const [state, setState] = useSetState(getNode(props.path));

  const updateNode = (update: any) => {

    if (typeof update === "function") {
      update = update(state);
    }

    setState((p) => ({ ...p, ...update }))
  }

  const onClick = () => {
    const _ = getNode(state.path);

    if (breadcrumbItem) {
      _.update({ expanded: true, active: true });
      return;
    }
    if (onNodeClick) {
      // TODO
      // context.onNodeClick(node, update as any)
    } else {
      _.update({ active: true });
    }
  }

  const onDoubleClick = () => {
    const _ = getNode(state.path);
    if (onNodeExpand) {
      onNodeExpand(state, updateNode as any)
    } else {
      _.update({ expanded: true, active: true });
    }
  }

  useMounted(() => {
    registerNode("explorer", state.path, updateNode, selectNode);
  })

  useUnmounted(() => {
    registerNode("explorer", state.path);
  })

  switch (true) {
    case breadcrumbItem:
      return <BreadcrumbItem {...state} onClick={onClick} />;
    default:
      return (
        <li className="explorer-node tree-node">
          <div className='tree-element'>
            {/* <Checkbox checked={!!node.checked} onChange={onCheck} /> */}
            <Button
              type='button'
              className="node-label"
              onClick={onClick}
              onDoubleClick={state.type === "branch" ? onDoubleClick : undefined}
            >
              {(state.icon) && state.icon}
              {state.label}
            </Button>
            {state.active && <div className='tree-active' />}
          </div>
        </li>
      )
  }
}

const BreadcrumbItem: FC<NodeProps & { onClick: () => void }> = ({ label, active, onClick }) => {
  return (
    <li className="breadcrumb-node tree-node">
      <div className='tree-element'>
        {/* <Checkbox checked={!!node.checked} onChange={onCheck} /> */}
        <Button
          type='button'
          className="node-label"
          onClick={onClick}
        >
          {label}
        </Button>
        {active && <div className='tree-active' />}
        <ul className="list-unstyled">

        </ul>
      </div>
    </li>
  )
}

