import { Box } from '@material-ui/core'

import sortBy from 'lodash/sortBy'

import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import { selectDealEnvelopes } from 'reducers/deals/envelopes'

import { getTaskEnvelopes } from 'views/utils/deal-files/get-task-envelopes'

import { DigitalForm } from './DigitalForm'
import { Attachment } from './Attachment'
import { Envelope } from './Envelope'

interface Props {
  deal: IDeal
  task: IDealTask
  isOpen: boolean
  isBackOffice: boolean
}

export function TaskItems({ deal, task, isBackOffice, isOpen }: Props) {
  const dealEnvelopes = useSelector<IAppState, IDealEnvelope[]>(({ deals }) =>
    selectDealEnvelopes(deal, deals.envelopes)
  )

  const envelopes = getTaskEnvelopes(dealEnvelopes, task)

  if (!isOpen) {
    return null
  }

  const getRows = () => {
    const list: (IFile | IDealTask | IDealEnvelope)[] = [
      ...(task.room.attachments || []),
      ...envelopes,
      task
    ]

    return sortBy(list, item => {
      const time =
        item.type === 'task' && item.submission
          ? item.submission.updated_at
          : item.updated_at

      return time * -1
    })
  }

  return (
    <Box display="flex" flexDirection="column" flexGrow={1}>
      {getRows().map((item, index) => {
        if (item.type === 'task') {
          return <DigitalForm key={index} deal={deal} task={item} />
        }

        if (item.type === 'envelope') {
          return (
            <Envelope key={index} deal={deal} task={task} envelope={item} />
          )
        }

        return (
          <Attachment
            key={index}
            deal={deal}
            task={task}
            file={item}
            isBackOffice={isBackOffice}
          />
        )
      })}
    </Box>
  )
}
