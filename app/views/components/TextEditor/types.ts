import { ContentState } from 'draft-js'

export interface ReferenceObject {
  clientHeight: number
  clientWidth: number

  getBoundingClientRect(): ClientRect
}

export type Entity = ReturnType<ContentState['getEntity']>
