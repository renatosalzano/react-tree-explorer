import { Tree, TreeEvents } from './Tree';
import { treeData, buildTree } from './_data/faketree';
import { useMounted } from './utils/lifecycle';


function App() {


  const onNodeExpand: TreeEvents['onNodeExpand'] = async (node, update) => {

    update({ expanded: !node.expanded })

  }

  /*  useMounted(() => {
     getNode('Home')
   })
  */
  return (
    <div className="App">
      <main>
        <aside>
          <Tree root={treeData} lock='Home/Folder' />

        </aside>
        <section>

        </section>
      </main>
    </div>
  )
}

async function delay(ret: any = null, delay = 3000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ret)
    }, delay)
  })
}

export default App
