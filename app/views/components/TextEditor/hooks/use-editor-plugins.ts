import { useContext, useMemo } from 'react'
import { DraftJsPlugin } from 'draft-js-plugins-editor'
import useUnmount from 'react-use/lib/useUnmount'

import { useInitializer } from 'hooks/use-initializer'

import { EditorContext } from '../index'

export function useEditorPlugins(
  factory: () => { [name: string]: DraftJsPlugin },
  deps: any[]
): ReturnType<typeof factory> {
  const { addPlugins } = useContext(EditorContext)

  const plugins = useMemo(factory, deps)

  const removePlugins = useInitializer(() => addPlugins(plugins))

  useUnmount(removePlugins)

  return plugins
}
