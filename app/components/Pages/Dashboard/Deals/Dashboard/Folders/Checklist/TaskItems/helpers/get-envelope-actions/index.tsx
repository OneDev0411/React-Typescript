import {
  REVIEW_ENVELOPE,
  RESEND_ENVELOPE,
  VOID_ENVELOPE,
  DOCUSIGN_ENVELOPE,
  EMAIL_ENVELOPE,
  VIEW_ENVELOPE,
  SPLIT_PDF
} from 'deals/components/ActionsButton/data/action-buttons'

export function getEnvelopeActions(envelope: IDealEnvelope): ActionButtonId[] {
  switch (envelope.status) {
    case 'Created':
      return [
        REVIEW_ENVELOPE,
        RESEND_ENVELOPE,
        VOID_ENVELOPE,
        DOCUSIGN_ENVELOPE,
        EMAIL_ENVELOPE,
        VIEW_ENVELOPE,
        SPLIT_PDF
      ]

    case 'Sent':
    case 'Delivered':
      return [
        VOID_ENVELOPE,
        RESEND_ENVELOPE,
        DOCUSIGN_ENVELOPE,
        EMAIL_ENVELOPE,
        VIEW_ENVELOPE,
        SPLIT_PDF
      ]

    case 'Completed':
    case 'Voided':
    case 'Declined':
    default:
      return [VIEW_ENVELOPE, DOCUSIGN_ENVELOPE, EMAIL_ENVELOPE, SPLIT_PDF]
  }
}
