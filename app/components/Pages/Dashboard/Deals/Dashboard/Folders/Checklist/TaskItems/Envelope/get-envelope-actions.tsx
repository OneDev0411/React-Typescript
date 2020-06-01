import {
  REVIEW_ENVELOPE,
  RESEND_ENVELOPE,
  VOID_ENVELOPE,
  DOCUSIGN_ENVELOPE,
  EMAIL_ENVELOPE,
  VIEW_ENVELOPE
} from '../../../../../components/ActionsButton/data/action-buttons'

export default function getEnvelopeActions(envelope): ActionButtonId[] {
  switch (envelope.status) {
    case 'Created':
      return [
        REVIEW_ENVELOPE,
        RESEND_ENVELOPE,
        VOID_ENVELOPE,
        DOCUSIGN_ENVELOPE,
        EMAIL_ENVELOPE,
        VIEW_ENVELOPE
      ]

    case 'Sent':
    case 'Delivered':
      return [
        VOID_ENVELOPE,
        RESEND_ENVELOPE,
        DOCUSIGN_ENVELOPE,
        EMAIL_ENVELOPE,
        VIEW_ENVELOPE
      ]

    case 'Completed':
    case 'Voided':
    case 'Declined':
    default:
      return [VIEW_ENVELOPE, DOCUSIGN_ENVELOPE, EMAIL_ENVELOPE]
  }
}
