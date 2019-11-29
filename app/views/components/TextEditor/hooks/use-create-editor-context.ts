import { RefObject, useMemo, useState } from 'react'
import PluginsEditor, { DraftJsPlugin } from 'draft-js-plugins-editor'
import { EditorState } from 'draft-js'

import { useLatestValueRef } from 'hooks/use-latest-value-ref'

import { DropzonePropsInterceptor, EditorContextApi } from '../types'

interface EditorContextParams {
  editorState: EditorState
  onChange: (editorState: EditorState) => void
  editorRef: RefObject<PluginsEditor>
}

interface PluginsMap {
  [name: string]: DraftJsPlugin
}

export function useCreateEditorContext({
  editorState,
  onChange,
  editorRef
}: EditorContextParams): {
  editorContext: EditorContextApi
  plugins: PluginsMap
  getDropzoneProps: DropzonePropsInterceptor
} {
  const [plugins, setPlugins] = useState<PluginsMap>({})
  const [dropzonePropsInterceptors, setDropzonePropsInterceptors] = useState<
    DropzonePropsInterceptor[]
  >([])

  const setEditorStateRef = useLatestValueRef(onChange)

  const editorContext: EditorContextApi = useMemo(() => {
    return {
      editorState,
      setEditorState: setEditorStateRef.current,
      editorRef,
      addDropzonePropsInterceptor: interceptor => {
        setDropzonePropsInterceptors(interceptors => {
          if (!interceptors.includes(interceptor)) {
            return [...interceptors, interceptor]
          }

          return interceptors
        })

        return () => {
          setDropzonePropsInterceptors(interceptors =>
            interceptors.filter(anInterceptor => anInterceptor !== interceptor)
          )
        }
      },
      addPlugins: newPlugins => {
        setPlugins(plugins => {
          return Object.entries(newPlugins).reduce(
            (pluginsSoFar, [name, plugin]) => {
              if (plugins[name] !== plugin) {
                if (plugins[name]) {
                  console.error(
                    new Error(`Attempting to override editor plugin "${name}"`),
                    'Old plugin:',
                    plugins[name],
                    'New plugin',
                    plugin
                  )
                }

                return { ...pluginsSoFar, [name]: plugin }
              }

              return pluginsSoFar
            },
            plugins
          )
        })

        return () => {
          setPlugins(plugins => {
            const newPlugins = { ...plugins }

            Object.keys(newPlugins).forEach(name => {
              delete newPlugins[name]
            })

            return newPlugins
          })
        }
      }
    }
    // eslint-disable-next-line
  }, [editorState])

  editorContext.setEditorState = setEditorStateRef.current

  const getDropzoneProps = props =>
    dropzonePropsInterceptors.reduce(
      (soFar, interceptor) => interceptor(soFar),
      props
    )

  return { editorContext, plugins, getDropzoneProps }
}
