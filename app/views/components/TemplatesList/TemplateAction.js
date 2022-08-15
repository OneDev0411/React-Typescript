import { useState, useEffect, useCallback } from 'react'

import { withRouter } from 'react-router'

import useNotify from '@app/hooks/use-notify'
import { getTemplateInstance } from '@app/models/instant-marketing/get-template-instance'
import {
  isBrandAsset,
  convertToTemplate,
  getMedium,
  getTemplateType
} from '@app/utils/marketing-center/helpers'
import SocialDrawer from '@app/views/components/InstantMarketing/components/SocialDrawer'
import LoadingContainer from '@app/views/components/LoadingContainer'
import Drawer from '@app/views/components/OverlayDrawer'
import GeneralFlow from 'components/InstantMarketing/adapters/General'
import PublishWebsiteFlow from 'components/InstantMarketing/adapters/PublishWebsite'
import ContactFlow from 'components/InstantMarketing/adapters/SendContactCard'
import ListingFlow from 'components/InstantMarketing/adapters/SendMlsListingCard'
import ShareInstance from 'components/InstantMarketing/adapters/ShareInstance'
import getTemplateObject from 'components/InstantMarketing/helpers/get-template-object'

import { SAVED_TEMPLATE_VARIANT } from '../InstantMarketing/Builder/AddToMarketingCenterButton/constants'

const HOLIDAY_TYPES = [
  'BackToSchool',
  'BoxingDay',
  'ChineseNewYear',
  'Christmas',
  'ColumbusDay',
  'DaylightSaving',
  'Diwali',
  'Easter',
  'EidalFitr',
  'FathersDay',
  'FourthOfJuly',
  'Halloween',
  'Hanukkah',
  'Kwanzaa',
  'LaborDay',
  'MemorialDay',
  'MLKDay',
  'MothersDay',
  'NewYear',
  'OtherHoliday',
  'Passover',
  'PatriotsDay',
  'Ramadan',
  'RoshHashanah',
  'September11',
  'StPatrick',
  'Thanksgiving',
  'Valentines',
  'VeteransDay',
  'WomansDay',
  'JuneTeenth',
  'FirstDayOfSummer',
  'Pride',
  'AsianAmericanAndPacificIslanderHeritageMonth',
  'BlackHistoryMonth',
  'EarthDay',
  'FirstDayOfSpring',
  'CincoDeMayo',
  'FirstDayOfFall',
  'FirstDayOfWinter',
  'YomKippur'
]

const GENERAL_FLOW_TYPES = [
  'Blank',
  'Blog',
  'Brand',
  'Event',
  'Layout',
  'MarketReport',
  'NewAgent',
  'Recruiting',
  'Announcements',
  'News',
  'Newsletter',
  'Recruitment',
  HOLIDAY_TYPES.join(','),
  ...HOLIDAY_TYPES
]

const CONTACT_FLOW_TYPES = ['WeddingAnniversary', 'HomeAnniversary']

const WEBSITE_FLOW_TYPES = ['Listing', 'Agent', 'Listings', 'CMA']

function TemplateAction(props) {
  const {
    isEdit,
    setTriggered,
    isTriggered,
    selectedTemplate,
    setEditActionTriggered,
    shouldLoadTemplateInstance
  } = props
  const notify = useNotify()
  const medium = getMedium(props)
  const [templateInstance, setTemplateInstance] = useState(null)
  const [isLoadingTemplateInstance, setIsLoadingTemplateInstance] = useState(
    shouldLoadTemplateInstance
  )

  const templateInstanceId = selectedTemplate?.id

  const handleTrigger = useCallback(() => {
    setTriggered(false)
    setEditActionTriggered(false)
    setTemplateInstance(null)
  }, [setEditActionTriggered, setTriggered])

  const sharedProps = {
    mediums: medium,
    selectedTemplate: templateInstance ?? selectedTemplate,
    isTriggered,
    isEdit,
    handleTrigger
  }

  useEffect(() => {
    async function loadTemplateInstance() {
      setIsLoadingTemplateInstance(true)

      try {
        const selectedTemplate = await getTemplateInstance(templateInstanceId)

        setTemplateInstance(selectedTemplate)
      } catch {
        notify({
          status: 'error',
          message: 'Could not load the template instance. Please try again.'
        })
        handleTrigger()
      } finally {
        setIsLoadingTemplateInstance(false)
      }
    }

    if (isTriggered && shouldLoadTemplateInstance && templateInstanceId) {
      loadTemplateInstance()
    }
  }, [
    templateInstanceId,
    shouldLoadTemplateInstance,
    isTriggered,
    notify,
    handleTrigger
  ])

  if (isLoadingTemplateInstance) {
    return (
      <Drawer open>
        <Drawer.Body>
          <LoadingContainer title="Preparing template data..." />
        </Drawer.Body>
      </Drawer>
    )
  }

  if (isEdit && !isTriggered) {
    return null
  }

  if (
    sharedProps.selectedTemplate &&
    isBrandAsset(sharedProps.selectedTemplate) &&
    !isTriggered
  ) {
    return null
  }

  if (
    sharedProps.selectedTemplate &&
    isBrandAsset(sharedProps.selectedTemplate) &&
    isTriggered
  ) {
    return (
      <SocialDrawer
        brandAsset={sharedProps.selectedTemplate}
        onClose={sharedProps.handleTrigger}
      />
    )
  }

  if (!isEdit && props.type === 'history') {
    return (
      <ShareInstance
        {...sharedProps}
        hasExternalTrigger
        instance={sharedProps.selectedTemplate}
      />
    )
  }

  sharedProps.selectedTemplate = convertToTemplate(sharedProps.selectedTemplate)

  const templateTypeFallback = shouldLoadTemplateInstance
    ? sharedProps.selectedTemplate.template_type
    : props.type

  const templateType = getTemplateType(
    templateTypeFallback || '',
    sharedProps.selectedTemplate
  )

  const isBirthdaySocial = templateType === 'Birthday' && medium === 'Social'

  // TODO: Refactor this logic as it's not right and it's fragile!
  // There's a "inputs" (inputs: string[]) key inside the template which we should check it for deciding about the flow!
  // We should check that inputs and use it for showing the proper flow based on template needs.

  if (
    sharedProps.selectedTemplate &&
    getTemplateObject(sharedProps.selectedTemplate).variant ===
      SAVED_TEMPLATE_VARIANT
  ) {
    return (
      <GeneralFlow
        {...sharedProps}
        hasExternalTrigger
        types={templateType.split(',')}
      />
    )
  }

  if (
    CONTACT_FLOW_TYPES.includes(templateType) ||
    (templateType === 'Birthday' && !isBirthdaySocial)
  ) {
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

  if (WEBSITE_FLOW_TYPES.includes(templateType) && medium === 'Website') {
    return (
      <PublishWebsiteFlow
        {...sharedProps}
        templateType={templateType}
        onFinish={sharedProps.handleTrigger}
      />
    )
  }

  return <ListingFlow {...sharedProps} hasExternalTrigger />
}

export default withRouter(TemplateAction)
