import { EditorState } from 'draft-js'

export function getBlocksWhereEntityData(
  editorState: EditorState,
  filter: (entityData: any) => boolean
) {
  const contentState = editorState.getCurrentContent()

  return contentState.get('blockMap').filter(block => {
    const entityData = block.getEntityAt(0)
      ? contentState.getEntity(block.getEntityAt(0)).getData()
      : null

    return entityData && filter(entityData)
  })
}
