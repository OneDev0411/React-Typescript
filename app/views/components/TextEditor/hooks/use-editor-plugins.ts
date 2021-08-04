import { useContext, useMemo } from 'react'

import { DraftJsPlugin } from 'draft-js-plugins-editor'
import useUnmount from 'react-use/lib/useUnmount'

import { useInitializer } from 'hooks/use-initializer'

import { EditorContext } from '../editor-context'

export function useEditorPlugins<T extends { [name: string]: DraftJsPlugin }>(
  factory: () => T,
  deps: any[]
): T {
  const { addPlugins } = useContext(EditorContext)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const plugins = useMemo(factory, deps)

  const removePlugins = useInitializer(() => addPlugins(plugins))

  useUnmount(removePlugins)

  return plugins
}
