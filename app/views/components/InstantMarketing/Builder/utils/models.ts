import type { Model } from 'grapesjs'

export function makeModelUndraggable(
  model: Model,
  recursive: boolean = true
): void {
  model.set({ draggable: false })

  if (recursive) {
    model.get('components').each(model => makeModelUndraggable(model))
  }
}
