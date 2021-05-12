import { connect } from 'react-redux'

import {
  Box,
  Checkbox,
  Tooltip,
  createStyles,
  makeStyles
} from '@material-ui/core'
import cn from 'classnames'

import { selectTags } from 'reducers/contacts/tags'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

import { useGridContext } from 'components/Grid/Table/hooks/use-grid-context'
import { SELECTION__TOGGLE_ENTIRE_ROWS } from 'components/Grid/Table/context/constants'

import Filters from 'components/Grid/Filters'
import SaveSegment from 'components/Grid/SavedSegments/Create'
import { SimpleList } from 'components/Grid/Filters/FilterTypes/SimpleList'
import { OperatorAndOperandFilter } from 'components/Grid/Filters/FilterTypes/OparatorAndOperand'

import { FLOW_FILTER_ID, OPEN_HOUSE_FILTER_ID, ORIGINS } from '../constants'

import createFiltersFromSegment from './helpers/create-filters-from-segment'
import createSegmentFromFilters from './helpers/create-segment-from-filters'
import getFlows from './helpers/get-flows'
import getOpenHouseEvents from './helpers/get-open-house-events'
import getUniqTags from './helpers/get-uniq-tags'
import { getPredefinedContactLists } from '../utils/get-predefined-contact-lists'

const useStyles = makeStyles(theme =>
  createStyles({
    infoContainer: {
      display: 'inline-block',
      marginLeft: theme.spacing(2)
    },
    toggleAll: {
      padding: 0,
      marginRight: theme.spacing(1)
    },
    totalRow: {
      display: 'inline-flex',
      marginRight: theme.spacing(2),
      fontSize: theme.typography.overline.fontSize,
      color: theme.palette.grey['500']
    },
    totalRowDisable: {
      color: theme.palette.text.disabled
    }
  })
)

function ContactFilters(props) {
  const [state, dispatch] = useGridContext()
  const classes = useStyles()
  const {
    isAllRowsSelected,
    isEntireRowsSelected,
    selectedRowIds,
    excludedRows
  } = state.selection
  const isAllSelected =
    isAllRowsSelected ||
    selectedRowIds.length === props.contactCount ||
    (isEntireRowsSelected && excludedRows.length === 0)

  const isSomeRowsSelected =
    (isAllRowsSelected === false &&
      selectedRowIds.length > 0 &&
      selectedRowIds.length < props.contactCount) ||
    (isEntireRowsSelected && excludedRows.length > 0)

  const tooltipTitle =
    isAllSelected || isEntireRowsSelected
      ? 'Deselect All Rows'
      : 'Select All Rows'

  const getConfig = () => {
    const { attributeDefs, tags, user } = props

    const tagDefinition = selectDefinitionByName(attributeDefs, 'tag')
    const sourceDefinition = selectDefinitionByName(
      attributeDefs,
      'source_type'
    )

    return [
      {
        id: tagDefinition.id,
        label: 'Tag',
        renderer: props => (
          <OperatorAndOperandFilter {...props} options={getUniqTags(tags)} />
        ),
        tooltip:
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
          <SimpleList {...props} getOptions={() => getFlows(user)} />
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
  }
  const getSummeryInfo = () => {
    let selectedCount

    if (isEntireRowsSelected) {
      selectedCount = props.contactCount - excludedRows.length
    } else if (selectedRowIds.length > 0) {
      selectedCount = selectedRowIds.length
    }

    return selectedCount
      ? `${selectedCount} of ${props.contactCount} selected`
      : `${props.contactCount} CONTACTS`
  }
  const toggleAll = () =>
    dispatch({
      type: SELECTION__TOGGLE_ENTIRE_ROWS
    })

  const defaultSelectAllValue =
    Number(props.contactCount) === 0 ? false : isAllSelected

  const isSelectAllDisable = Number(props.contactCount) === 0

  return (
    <Box display="flex" alignItems="center">
      <div className={classes.infoContainer}>
        <Tooltip title={tooltipTitle}>
          <Checkbox
            disableRipple
            className={classes.toggleAll}
            disabled={isSelectAllDisable}
            checked={defaultSelectAllValue}
            indeterminate={isSomeRowsSelected}
            onChange={toggleAll}
            data-tour-id="select-deselect-checkbox"
          />
        </Tooltip>
        <span
          className={cn(classes.totalRow, {
            [classes.totalRowDisable]: isSelectAllDisable
          })}
        >
          {getSummeryInfo()}
        </span>
      </div>
      {props?.show && (
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
            createSegmentFromFilters={createSegmentFromFilters(
              props.conditionOperator
            )}
          />
        </Filters>
      )}
    </Box>
  )
}

function mapStateToProps({ contacts, user }) {
  const { tags, attributeDefs } = contacts

  return {
    user,
    tags: selectTags(tags),
    conditionOperator: contacts.filterSegments.conditionOperator,
    attributeDefs
  }
}

export default connect(mapStateToProps)(ContactFilters)
