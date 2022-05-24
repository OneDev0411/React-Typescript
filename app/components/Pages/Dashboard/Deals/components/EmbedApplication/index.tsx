import { memo, useState } from 'react'

import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Typography
} from '@material-ui/core'
import { mdiReload } from '@mdi/js'
import { useEffectOnce } from 'react-use'
import superagent from 'superagent'

import useNotify from '@app/hooks/use-notify'
import { useQueryParamValue } from '@app/hooks/use-query-param'
import { DialogTitle } from '@app/views/components/DialogTitle'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
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

        console.log(manifest)
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
    <Dialog open fullWidth maxWidth={manifest?.size ?? 'md'}>
      <DialogTitle onClose={onClose}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{manifest.name}</Typography>

          {development && module && (
            <Tooltip title="Reload" placement="top-start">
              <IconButton onClick={loadChunk}>
                <SvgIcon path={mdiReload} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </DialogTitle>

      <DialogContent>{module ? <App /> : <CircularProgress />}</DialogContent>
    </Dialog>
  )
}
