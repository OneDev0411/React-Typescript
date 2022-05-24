import { memo, useState } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider
} from '@material-ui/core'
import { useEffectOnce } from 'react-use'
import superagent from 'superagent'

import useNotify from '@app/hooks/use-notify'
import { useQueryParamValue } from '@app/hooks/use-query-param'
import Logo from 'components/Logo'
import {
  QuestionWizard,
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'
import config from 'config'

import { Manifest } from './types'

interface Props {
  task: IDealTask
  onClose: () => void
}

export function EmbedApplication({ task, onClose }: Props) {
  const development = useQueryParamValue('dev')
  const host = useQueryParamValue('host', 'localhost:8081')

  const [module, setModule] = useState<any>(null)
  const [manifest, setManifest] = useState<Partial<Manifest>>({})

  const notify = useNotify()

  const loadChunk = () => {
    try {
      ;(async () => {
        const baseUrl = development ? `http://${host}` : task.application.url

        const { body: manifest } = await superagent.get(
          `${baseUrl}/manifest.json`
        )

        setManifest(manifest)

        const chunkUrl = development
          ? `${baseUrl}/bundle.js?${Math.random()}`
          : `${baseUrl}/bundle.${manifest.build}.js`

        const module = await import(
          /* webpackIgnore: true */ `${
            config.app.share_url ?? ''
          }/api/apps?url=${chunkUrl}`
        )

        setModule(module)
      })()
    } catch (e) {
      console.log(e)
    }
  }

  useEffectOnce(() => {
    loadChunk()
  })

  const App = memo(() => {
    if (!module) {
      return null
    }

    return module.default({
      name: 'E-Deals',
      notify,
      Components: {
        Logo,
        Wizard: {
          QuestionWizard,
          QuestionSection,
          QuestionTitle,
          QuestionForm
        }
      },
      onSubmit: () => {}
    })
  })

  return (
    <Dialog open fullWidth maxWidth={manifest?.size ?? 'md'} onClose={onClose}>
      <DialogContent>
        {module ? <App /> : <CircularProgress />}

        {development && module && (
          <>
            <Box my={2}>
              <Divider />
            </Box>
            <Button variant="contained" onClick={loadChunk}>
              Reload
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
