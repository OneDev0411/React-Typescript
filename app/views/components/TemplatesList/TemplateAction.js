import React from 'react'
import { withRouter } from 'react-router'

import ShareInstance from 'components/InstantMarketing/adapters/ShareInstance'
import GeneralFlow from 'components/InstantMarketing/adapters/General'
import ContactFlow from 'components/InstantMarketing/adapters/SendContactCard'
import ListingFlow from 'components/InstantMarketing/adapters/SendMlsListingCard'
import StatefulUrlFlow from 'components/InstantMarketing/adapters/StatefulUrl'

import {
  convertToTemplate,
  getMedium,
  getTemplateType
} from 'utils/marketing-center/helpers'

import { SAVED_TEMPLATE_VARIANT } from '../InstantMarketing/Builder/AddToMarketingCenter/constants'

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
  'Newsletter',
  'Layout',
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

  if (props.location.query.templateType && props.location.query.medium) {
    return (
      <StatefulUrlFlow
        {...sharedProps}
        isTemplatesColumnHiddenDefault={false}
      />
    )
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

  // TODO: Refactor this logic as it's not right and it's fragile!
  // There's a "inputs" (inputs: string[]) key inside the template which we should check it for deciding about the flow!
  // We should check that inputs and use it for showing the proper flow based on template needs.
  if (
    props.selectedTemplate &&
    props.selectedTemplate.variant === SAVED_TEMPLATE_VARIANT
  ) {
    return (
      <GeneralFlow
        {...sharedProps}
        hasExternalTrigger
        types={templateType.split(',')}
      />
    )
  }

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

export default withRouter(TemplateAction)
