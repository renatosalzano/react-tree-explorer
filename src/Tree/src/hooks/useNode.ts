import { MouseEventHandler, useMemo, useRef, useState } from "react";
import { useMounted } from "../../../utils/lifecycle";
import type { NodeProps, TreeContext } from "../..";


export const useNode = (context: TreeContext, props: Omit<NodeProps, "context">) => {

  const [node, setNode] = useState(context.getNode(props.path));

  const methods = useRef({
    // custom methods
    expand() { },
    click() {
      if (context.onNodeClick) {
        // TODO define this
        context.onNodeClick();
      } else {
        context.setActive(node.path)
      }
    },
    open() { },
  }).current;

  const update = (update: any) => {
    // fake react dispatch
    const n = context.getNode(node.path);
    if (typeof update === 'function') {
      update = update(n);
    }
    if (update.expanded !== undefined) {
      methods.onexpand(update.expanded);
    }
    setNode((prev) => ({ ...prev, ...update }));
  }

  const lastClick = useRef(0);

  const onClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const now = new Date().getTime();
    if (lastClick.current > 0 && lastClick.current <= 500) {
      // double click
      methods.onopen();
    } else {
      methods.onselect();
    }

    lastClick.current = now;

  }

  useMounted(() => {
    context.registerNode(props.path, update)
  })

  return {
    node, onClick, update, methods
  }

}

export const useNodeState = (context: TreeContext, path: string) => {
  const [node, setNode] = useState(context.getNode(path));
  return { node, setNode }
}
