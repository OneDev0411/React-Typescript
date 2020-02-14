import { QuickSuggestion } from 'components/EmailRecipientsChipsInput/types'

import { areRecipientsEqual } from './are-recipients-equal'

export interface MoreQuickSuggestion {
  level: number
  quickSuggestion: QuickSuggestion
  visible: boolean
  subtreeVisible: boolean
  enabled: boolean
}

export default function extractMoreQuickSuggestions(
  brandTree: IBrand,
  currentRecipients?: IDenormalizedEmailRecipientInput[]
): MoreQuickSuggestion[] {
  const result: MoreQuickSuggestion[] = []

  extractNode(0, brandTree)

  return result

  function extractNode(level: number, brandNode: IBrand): void {
    const isDesiredType =
      brandNode.brand_type === 'Office' || brandNode.brand_type === 'Brokerage'
    const recipient: IDenormalizedEmailRecipientBrandInput = {
      recipient_type: 'Brand',
      brand: brandNode
    }
    const isUnused =
      !currentRecipients ||
      !currentRecipients.find(areRecipientsEqual(recipient))

    let childrenStartIndex = result.push({
      level,
      quickSuggestion: {
        recipient,
        sendType: 'BCC'
      },
      visible: isDesiredType,
      subtreeVisible: isDesiredType,
      enabled: isDesiredType && isUnused
    })
    const item = result[childrenStartIndex - 1]

    if (brandNode.children) {
      brandNode.children.forEach(c => extractNode(level + 1, c))
    }

    while (childrenStartIndex < result.length) {
      const child = result[childrenStartIndex++]

      item.subtreeVisible = item.subtreeVisible || child.visible
    }
  }
}
