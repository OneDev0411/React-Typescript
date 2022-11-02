import { BasicSection } from '../components/Section/Basic'

import LastTouchField from './LastTouchField'
import TouchFrequency from './TouchFrequency'

interface Props {
  contact: INormalizedContact
  onUpdateTouchFreq(newValue: Nullable<number>): void
}

export const LastTouch = ({ contact, onUpdateTouchFreq }: Props) => {
  return (
    <BasicSection title="Last Touch">
      {contact.last_touch && <LastTouchField value={contact?.last_touch} />}

      <TouchFrequency
        onUpdateTouchFreq={onUpdateTouchFreq}
        value={contact?.touch_freq}
      />
    </BasicSection>
  )
}
