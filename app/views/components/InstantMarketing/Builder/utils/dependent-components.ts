import type { Editor, Model } from 'grapesjs'

export function makeParentDependentsHidden(
  editor: Editor,
  parent: Model | null
) {
  if (!parent) {
    return
  }

  const parentId = parent.getAttributes().id

  if (!parentId) {
    return
  }

  const hasChildren = parent
    .components()
    .some(item => item.get('type') !== 'comment')

  if (hasChildren) {
    return
  }

  editor
    .getWrapper()
    .find(`[data-depends="${parentId}"]`)
    .forEach(dependModel => {
      dependModel.setStyle({
        ...dependModel.attributes.style,
        display: 'none'
      })
    })
}

export function makeParentDependentsVisible(
  editor: Editor,
  parent: Model | null
) {
  if (!parent) {
    return
  }

  const parentId = parent.getAttributes().id

  if (!parentId) {
    return
  }

  editor
    .getWrapper()
    .find(`[data-depends="${parentId}"]`)
    .forEach(dependModel => {
      if (dependModel.attributes.style.display === 'none') {
        const style = { ...dependModel.attributes.style }

        delete style.display

        dependModel.setStyle(style)
      }
    })
}

export function removeDirectDependents(editor: Editor, model: Model) {
  const modelId = model.getAttributes().id

  if (modelId) {
    editor
      .getWrapper()
      .find(`[data-depends="${modelId}"]`)
      .forEach(dependModel => {
        dependModel.remove()
      })
  }
}
