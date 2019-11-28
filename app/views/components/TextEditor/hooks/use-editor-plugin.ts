import { useContext, useMemo } from 'react'

import { DraftJsPlugin } from 'draft-js-plugins-editor'

import useUnmount from 'react-use/lib/useUnmount'

import { useInitializer } from 'hooks/use-initializer'

import { EditorContext } from '../index'

export function useEditorPlugin(factory: () => DraftJsPlugin, deps: any[]) {
  const { addPlugin } = useContext(EditorContext)

  const plugin = useMemo(factory, deps)

  const removePlugin = useInitializer(() => addPlugin(plugin))

  useUnmount(removePlugin)
}
