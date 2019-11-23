import React from 'react'

import ShareInstance from 'components/InstantMarketing/adapters/ShareInstance'
import GeneralFlow from 'components/InstantMarketing/adapters/General'
import ContactFlow from 'components/InstantMarketing/adapters/SendContactCard'
import ListingFlow from 'components/InstantMarketing/adapters/SendMlsListingCard'

import {
  convertToTemplate,
  getMedium,
  getTemplateType
} from 'utils/marketing-center/helpers'

const HOLIDAY_TYPES = [
  'Christmas',
  'NewYear',
  'Valentines',
  'StPatrick',
  'Easter',
  'OtherHoliday'
]
const GENERAL_FLOW_TYPES = [
  'Brand',
  'NewAgent',
  HOLIDAY_TYPES.join(','),
  ...HOLIDAY_TYPES
]

function TemplateAction(props) {
  const { isEdit } = props
  const medium = getMedium(props)

  const sharedProps = {
    mediums: medium,
    selectedTemplate: props.selectedTemplate,
    isTriggered: props.isTriggered,
    isEdit,
    handleTrigger: () => {
      props.setTriggered(false)
      props.setEditActionTriggered(false)
    }
  }

  if (isEdit && !props.isTriggered) {
    return null
  }

  if (!isEdit && props.type === 'history') {
    return (
      <ShareInstance
        {...sharedProps}
        hasExternalTrigger
        instance={props.selectedTemplate}
      />
    )
  }

  const templateType = getTemplateType(props.type, props.selectedTemplate)
  const isBirthdaySocial = templateType === 'Birthday' && medium === 'Social'

  sharedProps.selectedTemplate = convertToTemplate(props.selectedTemplate)

  if (templateType === 'Birthday' && !isBirthdaySocial) {
    return <ContactFlow {...sharedProps} />
  }

  if (GENERAL_FLOW_TYPES.includes(templateType) || isBirthdaySocial) {
    return (
      <GeneralFlow
        {...sharedProps}
        hasExternalTrigger
        types={templateType.split(',')}
      />
    )
  }

  return <ListingFlow {...sharedProps} hasExternalTrigger />
}

export default TemplateAction
