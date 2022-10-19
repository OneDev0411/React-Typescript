import { Box } from '@material-ui/core'
import { useSelector } from 'react-redux'

import SaveSegment from '@app/components/Pages/Dashboard/Contacts/List/SavedSegments/Create'
import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import {
  selectExistingTags,
  selectContactAttributeDefs
} from '@app/selectors/contacts'
import Filters from 'components/Grid/Filters'
import { OperatorAndOperandFilter } from 'components/Grid/Filters/FilterTypes/OparatorAndOperand'
import { SimpleList } from 'components/Grid/Filters/FilterTypes/SimpleList'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

import { OPEN_HOUSE_FILTER_ID, FLOW_FILTER_ID, ORIGINS } from '../constants'
import { getPredefinedContactLists } from '../utils/get-predefined-contact-lists'

import createFiltersFromSegment from './helpers/create-filters-from-segment'
import createSegmentFromFilters from './helpers/create-segment-from-filters'
import getFlows from './helpers/get-flows'
import getOpenHouseEvents from './helpers/get-open-house-events'
import getUniqTags from './helpers/get-uniq-tags'
import { useGetCustomFilters } from './hooks/use-get-custom-filters'

const CONTAINER_MIN_HEIGHT = 63

export default function ContactFilters(props) {
  const activeBrandId = useActiveBrandId()
  const { conditionOperator, attributeDefs, tags } = useSelector(state => {
    return {
      tags: selectExistingTags(state),
      conditionOperator: state.contacts?.filterSegments?.conditionOperator,
      attributeDefs: selectContactAttributeDefs(state)
    }
  })
  const customFilters = useGetCustomFilters(attributeDefs)

  if (!props?.show) {
    return null
  }

  const getConfig = () => {
    const tagDefinition = selectDefinitionByName(attributeDefs, 'tag')
    const sourceDefinition = selectDefinitionByName(
      attributeDefs,
      'source_type'
    )

    const baseFilters = [
      {
        id: tagDefinition.id,
        label: 'Tag',
        renderer: props => (
          <OperatorAndOperandFilter {...props} options={getUniqTags(tags)} />
        ),
        tooltip:
          // eslint-disable-next-line max-len
          'A group a person belongs to, based on a tag you’ve manually applied to them.'
      },
      {
        id: OPEN_HOUSE_FILTER_ID,
        label: 'Open House',
        renderer: props => (
          <SimpleList {...props} getOptions={getOpenHouseEvents} />
        ),
        tooltip: 'Contacts invited to a specific Open House'
      },
      {
        id: FLOW_FILTER_ID,
        label: 'Flow',
        renderer: props => (
          <SimpleList {...props} getOptions={() => getFlows(activeBrandId)} />
        ),
        tooltip: 'Contacts who are active in a specific Flow'
      },
      {
        id: sourceDefinition.id,
        label: 'Origin',
        renderer: props => (
          <OperatorAndOperandFilter {...props} options={ORIGINS} />
        ),
        tooltip: 'Source type'
      }
    ]

    return baseFilters.concat(customFilters)
  }

  return (
    <Box display="flex" alignItems="center" minHeight={CONTAINER_MIN_HEIGHT}>
      <Filters
        name="contacts"
        plugins={['segments']}
        config={getConfig()}
        createFiltersFromSegment={createFiltersFromSegment}
        getPredefinedLists={getPredefinedContactLists}
        onChange={() => props.onFilterChange()}
        disableConditionOperators={props.disableConditionOperators}
      >
        <SaveSegment
          createSegmentFromFilters={createSegmentFromFilters(conditionOperator)}
        />
      </Filters>
    </Box>
  )
}
