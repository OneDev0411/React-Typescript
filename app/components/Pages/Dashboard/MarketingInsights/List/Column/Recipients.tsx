import pluralize from 'pluralize'

interface Props {
  data: IEmailCampaign<'recipients'>
}

function RecipientsColumn({ data }: Props) {
  if (data.recipients_count === null) {
    return null
  }

  return <span>{pluralize('Recipient', data.recipients_count, true)}</span>
}

export default RecipientsColumn
