import { updateTree } from 'utils/tree-utils/update-tree'


const sampleTree = {
  name: 'a',
  children: [
    {
      name: 'b',
      children: []
    },
    {
      name: 'c',
      children:[
        {
          name: 'd',
          children: []
        },
        {
          name: 'e',
          children:[
            {
              name: 'f',
              children: []
            },
            {
              name: 'g',
              children: []
            }
          ]
        }
      ]
    }
  ]
}

describe('updateTree',() => {
  it('should work', () =>{
      const newTree = updateTree(sampleTree, (node) => node.name === 'c', () => ({
        name: 'c2'
      }))
      expect(newTree).toEqual({ name: 'a', children: [ { name: 'b' }, { name: 'c2' } ] })

      expect(newTree).not.toBe(sampleTree) // no mutation
  })

  it('should replace the whole tree if root is to be replaced', () =>{
      const newTree = updateTree(sampleTree, (node) => node.name==='a', () => ({
        name: 'a2'
      }))
      expect(newTree).toEqual({      name: 'a2', })

      expect(newTree).not.toBe(sampleTree) // no mutation
  })
  it('should replace the leaves', () =>{
      const newTree = updateTree(sampleTree, (node) => node.name==='f', () => ({
        name: 'f2'
      }))
      expect(newTree).toEqual({
          name: 'a',
          children: [
            {name: 'b'},
            {
              name: 'c',
              children:[
                {name: 'd'},
                {
                  name: 'e',
                  children:[ {name: 'f2'},{name: 'g'}]
                }
              ]
            }
          ]
        }
      )

      expect(newTree).not.toBe(sampleTree) // no mutation
  })
})
