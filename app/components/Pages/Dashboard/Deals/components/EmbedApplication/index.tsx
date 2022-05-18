import { useState } from 'react'

import { CircularProgress, Dialog, DialogContent } from '@material-ui/core'
import { useEffectOnce } from 'react-use'

import useNotify from '@app/hooks/use-notify'
import {
  QuestionWizard,
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

const APP_URL = '/static/apps/hello-world/dist/bundle.js'

interface Props {
  task: IDealTask
  onClose: () => void
}

export function EmbedApplication({ task, onClose }: Props) {
  const [module, setModule] = useState<any>(null)
  const notify = useNotify()

  useEffectOnce(() => {
    ;(async () => {
      const module = await import(/* webpackIgnore: true */ APP_URL)

      setModule(module)
    })()
  })

  const App = () => {
    if (!module) {
      return null
    }

    return module.default({
      name: 'Appz',
      notify,
      Wizard: {
        QuestionWizard,
        QuestionSection,
        QuestionTitle,
        QuestionForm
      },
      onSubmit: () => {}
    })
  }

  return (
    <Dialog open fullWidth maxWidth="md" onClose={onClose}>
      <DialogContent>{module ? <App /> : <CircularProgress />}</DialogContent>
    </Dialog>
  )
}
