import { LeadChannels } from '../constants'

export const isValidLeadChannelSource = (
  value: string
): value is LeadChannelSourceType => {
  return LeadChannels.some(leadChannel => leadChannel.source === value)
}
