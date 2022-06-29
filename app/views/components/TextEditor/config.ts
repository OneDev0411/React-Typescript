import { CSSProperties } from 'react'

interface ResizablePluginOptions {
  horizontal?: 'relative' | 'absolute' | 'auto'
  vertical?: boolean
  resizeSteps?: number
  style?: CSSProperties
}

export const resizablePluginOptions: ResizablePluginOptions = {
  horizontal: 'absolute'
}

export const TABLE_WRAPPER_CLASS_NAME = 'rechat-table-wrapper'
