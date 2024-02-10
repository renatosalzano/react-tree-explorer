import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FC, useMemo, useState, memo } from 'react';
import { NodeProps } from '..';
import { useMounted } from '../../utils/lifecycle';
import { Checkbox } from '../../checkbox/Checkbox';
import { Spinner } from './components/Spinner';
import { useSetState } from './hooks/useSetState';
import { useTreeContext } from './Tree';
import { Button } from './components';

const LIST_TRANSISTION_TIME = 200;

export const Node: FC<NodeProps> = memo((props) => {

  const { getNode, registerNode, onNodeClick, onNodeExpand } = useTreeContext();

  const [state, setState] = useSetState(getNode(props.path));

  const [expanded, setExpand] = useState(state.expanded || false);
  const [listState, setListState] = useState("idle");

  const expand = (expand?: boolean) => {

    setListState((p) => {
      if (p === 'idle' || p === "close" || expand) {
        setExpand(true);
        return "open"
      } else {
        // plus 10 because js is more fast than css transistion
        setTimeout(() => setExpand(false), LIST_TRANSISTION_TIME + 10);
        return "close"
      }
    });

  }

  const updateNode = (update: any) => {

    if (typeof update === "function") {
      update = update(state);
    }

    if (typeof update.expanded === "boolean") {
      // expande | collapse node
      expand(update.expanded);
    }

    setState((prev) => ({ ...prev, ...update }));

  }

  const onExpand = (expanded?: boolean) => {
    const node = getNode(state.path);
    expanded = expanded !== undefined ? expanded : !node.expanded;
    node.update({ expanded })
  }

  const onClick = () => {
    const _ = getNode(state.path);

    if (onNodeClick) {
      // TODO
      // context.onNodeClick(node, update as any)
    } else {
      _.update({ active: true });
    }
  }

  useMounted(() => {
    if (state.path === "/Home") {
      console.log("home mounted", state)
    }
    registerNode("tree", state.path, updateNode)
  })

  const nodeClass = useMemo(() => {
    let c = "tree-node";
    if (props.className) c += ` ${props.className}`;
    if (state?.className) c += ` ${state.className}`;
    if (state?.active) c += " node-is-active";
    return c;

  }, [props.className, state.className, state.active]);

  const attributes: any = useMemo(() => {
    return {
      '--nested-index': `${state.nestedIndex}`,
      '--items-count': state.children ? state.children.length : 0,
      '--list-transistion-time': LIST_TRANSISTION_TIME + 'ms'
    }
  }, [state.nestedIndex, state.children])

  return (
    <li
      className={nodeClass}
      style={attributes}>
      <div className='tree-element'>
        <ExpandBtn
          render={state.type === 'branch'}
          isLoading={state.loading}
          isExpanded={expanded}
          onExpand={onExpand}
        />
        {/* <Checkbox checked={!!node.checked} onChange={onCheck} /> */}
        <Button
          type='button'
          className="node-label"
          onClick={onClick}>
          {(state.icon) && state.icon}
          {state.label}
        </Button>
        {state.active && <div className='tree-active' />}
      </div>
      {(expanded && state.children && state.children.length > 0) && (
        <ul
          className={`node-list list-unstyled`}
          data-list-state={listState}>
          <div className='node-list-line' />
          {state.children.map((node) => (
            <Node key={node.path} {...node} />
          ))}
        </ul>
      )}
    </li>
  )
})

const ExpandBtn: FC<{
  render?: boolean;
  isLoading?: boolean;
  isExpanded?: boolean;
  onExpand(): void;
}> = ({
  render,
  isLoading,
  isExpanded,
  onExpand
}) => {
    switch (true) {
      case isLoading:
        return (
          <Spinner />
        )
      case render:
        return (
          <button
            type="button"
            onClick={(evt) => { evt.preventDefault(); evt.stopPropagation(); onExpand(); }}
            className="tree-element--cta tree-expand-button"
          >
            <FontAwesomeIcon className="expand-icon" icon={isExpanded ? faAngleDown : faAngleRight} />
          </button>
        )
      default:
        return (
          <div className="tree-element--cta tree-item-spacer" />
        )
    }
  }

