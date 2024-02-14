import { FC } from "react";
import { useTreeContext } from "./Tree";
import { useMounted, useUnmounted } from "../../utils/lifecycle";
import { useSetState } from "./hooks/useSetState";
import { BreadcrumbItem } from "./FolderNode";
import { Button } from "./components";
import type { NodeProps } from "..";

type Props = NodeProps & {
  index?: number;
  breadcrumbItem?: boolean;
}

export const FileNode: FC<Props> = ({ breadcrumbItem, index, ...props }) => {

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
    registerNode("folder", state.path, updateNode, selectNode);
  })

  useUnmounted(() => {
    registerNode("folder", state.path);
  })

  switch (true) {
    case breadcrumbItem:
      return <BreadcrumbItem {...state} index={index || 0} onClick={onClick} />;
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