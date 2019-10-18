import * as React from 'react'
import { ReactNode, useCallback, useState } from 'react'

import { EditEmailDrawer } from '../EmailCompose/EditEmailDrawer'

interface Props {
  emailId: string
  children: (renderProps: RenderProps) => ReactNode
  onDeleted?: () => void
  onEmailUpdated?: (email: IEmailCampaign & { due_date: number }) => void
}
interface RenderProps {
  onClick: (event: React.MouseEvent) => void
}

export function EditEmailButton({
  children,
  emailId,
  onDeleted,
  onEmailUpdated = () => {}
}: Props) {
  const [isEmailOpen, setEmailOpen] = useState(false)

  return (
    <>
      {children({
        onClick: useCallback(() => {
          setEmailOpen(true)
        }, [])
      })}
      {isEmailOpen && (
        <EditEmailDrawer
          isOpen
          onClose={() => setEmailOpen(false)}
          onDeleted={onDeleted}
          onEdited={emailCampaign =>
            onEmailUpdated({
              ...emailCampaign,
              due_date: emailCampaign.due_at
            })
          }
          emailId={emailId}
        />
      )}
    </>
  )
}
