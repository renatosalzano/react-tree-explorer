import { Tree, TreeEvents } from './Tree';
import { treeData, buildTree } from './_data/faketree';
import { useMounted } from './utils/lifecycle';

const Root = {
  label: "news",
  children: [
    {
      label: "2020", children: [
        {
          label: "01", children: [
            {
              label: "15", children: [
                { label: "article-1" },
                { label: "article-2" },
                { label: "article-3" }

              ]
            }
          ]
        }
      ]
    },
    { label: "article-1" },
    { label: "article-2" },
    { label: "article-3" }
  ]
}


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
          <Tree root={Root} lock='/news/2020/01' />

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
