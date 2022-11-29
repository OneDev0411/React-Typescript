import pluralize from 'pluralize'

interface Props {
  item: IEmailCampaign<'template'>
}

export function RecipientsColumn({ item }: Props) {
  if (item.recipients_count === null) {
    return null
  }

  return <span>{pluralize('Recipient', item.recipients_count, true)}</span>
}
