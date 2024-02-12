import React, { Dispatch, FC, Fragment, MutableRefObject, ReactElement, ReactNode, SetStateAction, createContext, createElement, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { TreeProps, TreeItem, NodeProps } from '../index';


import { Node } from './Node';
import { TreeState } from './treeState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFolderTree, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import "./scss/index.scss";
import { Button } from './components';
import { ExplorerNode } from './ExplorerNode';

const DEFAULT_ICONS = {
  branch: <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><path fill="currentColor" d="M216 74h-85.51l-27.9-27.9a13.94 13.94 0 0 0-9.9-4.1H40a14 14 0 0 0-14 14v144.62A13.39 13.39 0 0 0 39.38 214h177.51A13.12 13.12 0 0 0 230 200.89V88a14 14 0 0 0-14-14ZM40 54h52.69a2 2 0 0 1 1.41.59L113.51 74H38V56a2 2 0 0 1 2-2Zm178 146.89a1.11 1.11 0 0 1-1.11 1.11H39.38a1.4 1.4 0 0 1-1.38-1.38V86h178a2 2 0 0 1 2 2Z" /></svg>,
  item: <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><path fill="currentColor" d="m212.24 83.76l-56-56A6 6 0 0 0 152 26H56a14 14 0 0 0-14 14v176a14 14 0 0 0 14 14h144a14 14 0 0 0 14-14V88a6 6 0 0 0-1.76-4.24ZM158 46.48L193.52 82H158ZM200 218H56a2 2 0 0 1-2-2V40a2 2 0 0 1 2-2h90v50a6 6 0 0 0 6 6h50v122a2 2 0 0 1-2 2Z" /></svg>

}

type TreeView = "tree" | "folder"

type TreeContext = Partial<Omit<TreeProps, "view">> & {
  active?: string;
  view: MutableRefObject<TreeView>;
  rootOffset: number;
  rootNode: NodeProps;
  currentNode: NodeProps;
  currentPath: string;
  setView(update: TreeView | ((prev: TreeView) => TreeView)): void;
  getNode: TreeState['getNode'];
  setNode: TreeState['setNode'];
  selectNode(node: NodeProps): void;
  registerNode: TreeState['registerNode'];
}

const TreeStateContext = createContext<TreeContext>({} as TreeContext);

export const useTreeContext = () => useContext(TreeStateContext);

const Tree: FC<TreeProps> = ({
  view = "tree",
  root = [],
  lock,
  defaultIcons = DEFAULT_ICONS,
  multicheck = true,
  onNodeClick,
  onNodeExpand,
  onNodeCheck,
}) => {

  const tree = useRef(new TreeState({ root, lock, view, multicheck, defaultIcons })).current;

  const { getNode, setNode, registerNode } = {
    getNode: tree.getNode.bind(tree),
    setNode: tree.setNode.bind(tree),
    registerNode: tree.registerNode.bind(tree)
  }

  // TREE VIEW

  const [treeView, setTreeView] = useState<TreeView>(view);
  const _treeView = useRef(treeView);

  const setView = (update: TreeView | ((prev: TreeView) => TreeView)) => {
    if (typeof update === 'function') {
      update = update(_treeView.current);
    }
    _treeView.current = update;
    setTreeView(update);
  }



  const newNode = () => {
    /* if (tree.active) {
      const node = context.getNode(tree.active);
      console.log(tree.active)
      if (node.type === 'branch') {
        // open folder
        const children = [...node.children, { label: "test" }]
        node.update({ expanded: true, children })
        if (context.updateExplorer) {
          // because I suck
          context.updateExplorer();
        }
      }
    } */
  }

  const rootNode = useMemo(() => {

    let _rootNode = tree.root as NodeProps;

    if (lock && getNode(lock)?.path) {
      _rootNode = getNode(lock);
    }

    console.log("_rootNode", _rootNode);

    return _rootNode;
  }, [lock]);

  // explorer
  const [currentNode, setCurrentNode] = useState(rootNode);
  const currentPath = useRef(rootNode.path);

  const selectNode = (node) => {
    // open node
    /* if (prevNode.current === node.path) return; */
    setCurrentNode(() => node);
  }

  const value: TreeContext = {
    view: _treeView,
    setView,
    rootOffset: tree.rootOffset,
    rootNode,
    currentNode,
    currentPath: currentPath.current,
    getNode,
    setNode,
    registerNode,
    onNodeClick,
    onNodeCheck,
    onNodeExpand,
    selectNode,
  }

  return (
    <TreeStateContext.Provider value={value}>
      <div className='tree-container'>
        <Header />
        {treeView === "tree"
          ? (
            <Node key={rootNode.path} {...rootNode} isRoot />
          ) : (
            <div className="tree--explorer">
              <ExplorerNode key={currentNode.path} {...currentNode} />
            </div>
          )
        }
        <Button onClick={tree.log.bind(tree)}>
          test button
        </Button>
      </div>
    </TreeStateContext.Provider>
  )
}

const Header: FC = () => {

  const { view, setView } = useTreeContext();

  return (
    <div className="tree-header">
      <div className="view-controls">
        <Button
          label='tree-view'
          active={view.current === "tree"}
          onClick={() => setView("tree")}>
          <FontAwesomeIcon icon={faFolderTree} />
        </Button>
        <Button
          label='folder-view'
          active={view.current === "folder"}
          onClick={() => setView("folder")}>
          <FontAwesomeIcon icon={faFolder} />
        </Button>
      </div>
    </div>
  )
}


export { Tree }