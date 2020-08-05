import React, { Fragment } from 'react'

import Flex from 'styled-flex-component'

import { Button } from '@material-ui/core'
import { mdiClose, mdiCheck, mdiCircleOutline } from '@mdi/js'

import ToolTip from 'views/components/tooltip'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import RequiredAction from './RequiredAction'

import { StatusButton, Loading } from './styled'

export default function BackOffice(props) {
  const { task, onSendComment, hasComment, isSaving } = props

  const status = task.review ? task.review.status : ''
  const { attention_requested } = task
  const isDeclined = !attention_requested && status === 'Declined'
  const isApproved = !attention_requested && status === 'Approved'
  const isNotReviewed = !isDeclined && !isApproved && !attention_requested

  return (
    <Flex alignCenter justifyBetween style={{ width: '100%' }}>
      <div>
        <RequiredAction task={task} />
      </div>

      <div>
        {!isSaving ? (
          <Fragment>
            <ToolTip caption={isDeclined ? 'Declined' : 'Decline'}>
              <StatusButton
                button="decline"
                isActive={isDeclined}
                onClick={() =>
                  onSendComment(attention_requested ? false : null, 'Declined')
                }
              >
                <SvgIcon path={mdiClose} />
              </StatusButton>
            </ToolTip>

            <ToolTip caption={isApproved ? 'Approved' : 'Approve'}>
              <StatusButton
                button="approve"
                isActive={isApproved}
                onClick={() =>
                  onSendComment(attention_requested ? false : null, 'Approved')
                }
              >
                <SvgIcon path={mdiCheck} />
              </StatusButton>
            </ToolTip>

            <ToolTip caption="Not Reviewed">
              <StatusButton
                button="reset"
                isActive={isNotReviewed && attention_requested !== true}
                onClick={() =>
                  onSendComment(
                    attention_requested ? false : null,
                    'Incomplete'
                  )
                }
              >
                <SvgIcon path={mdiCircleOutline} />
              </StatusButton>
            </ToolTip>
          </Fragment>
        ) : (
          <Loading>Saving ...</Loading>
        )}

        <Button
          variant="contained"
          color="secondary"
          disabled={isSaving || !hasComment}
          onClick={() => onSendComment(false)}
        >
          Comment
        </Button>
      </div>
    </Flex>
  )
}
