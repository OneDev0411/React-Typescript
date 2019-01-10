import React from 'react'
import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import { browserHistory } from 'react-router'
import moment from 'moment'
import _ from 'underscore'

import { getStartRange, getEndRange } from 'reducers/calendar'

import { getCalendar, setDate, resetCalendar } from 'actions/calendar'

import {
  createDateRange,
  createPastRange,
  createFutureRange
} from 'models/Calendar/helpers/create-date-range'

import PageHeader from 'components/PageHeader'
import DatePicker from 'components/DatePicker'
import ActionButton from 'components/Button/ActionButton'
import { TourDrawer } from 'components/tour/TourDrawer'
import { EventDrawer } from 'components/EventDrawer'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'
import { Container, Menu, Trigger, Content } from 'components/SlideMenu'

import {
  viewAs,
  getActiveTeamACL,
  allMembersOfTeam,
  getActiveTeam
} from '../../../../utils/user-teams'

import Export from './Export'
import CalendarTable from './Table'
import { MenuContainer, TableContainer } from './styled'

const LOADING_POSITIONS = {
  Top: 0,
  Bottom: 1,
  Middle: 2
}

const MENU_WIDTH = '18.75rem'

class CalendarContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isMenuOpen: true,
      isOpenEventDrawer: false,
      selectedEvent: null,
      loadingPosition: LOADING_POSITIONS.Middle
    }
    this.myRef = React.createRef()
  }

  componentDidMount() {
    const { selectedDate } = this.props

    const acl = getActiveTeamACL(this.props.user)

    const hasContactsPermission = acl.includes('CRM')

    if (!hasContactsPermission) {
      browserHistory.push('/dashboard/mls')
    }

    this.restartCalendar(selectedDate)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.list.length === 0 &&
      this.state.loadingPosition !== LOADING_POSITIONS.Middle
    ) {
      this.setLoadingPosition(LOADING_POSITIONS.Middle)
    }

    if (
      nextProps.viewAsUsers.length !== this.props.viewAsUsers.length ||
      !_.isEqual(nextProps.viewAsUsers, this.props.viewAsUsers)
    ) {
      this.restartCalendar(this.selectedDate, nextProps.viewAsUsers)
    }
  }

  getCalendar = async (
    startRange,
    endRange,
    viewAsUsers = this.props.viewAsUsers
  ) => {
    this.props.getCalendar(
      startRange,
      endRange,
      viewAsUsers.length === this.props.brandMembers.length ? [] : viewAsUsers
    )
  }

  /**
   * close/open side menu
   */
  toggleSideMenu = () =>
    this.setState(state => ({
      isMenuOpen: !state.isMenuOpen
    }))

  /**
   * open create task menu
   */
  openEventDrawer = () => this.setState({ isOpenEventDrawer: true })

  /**
   * close create task menu
   */
  closeEventDrawer = () =>
    this.setState({
      isOpenEventDrawer: false,
      selectedEvent: null
    })

  /**
   * sets calendar references
   */
  onTableRef = (refId, ref) => {
    this.refs = {
      ...this.refs,
      [refId]: ref
    }
  }

  /**
   * sets the loader position
   * @param { Number } position - the position
   */
  setLoadingPosition = position =>
    this.setState({
      loadingPosition: position
    })

  restartCalendar = async (selectedDate, viewAsUsers) => {
    const [newStartRange, newEndRange] = createDateRange(selectedDate, {
      range: 6
    })

    this.setLoadingPosition(LOADING_POSITIONS.Middle)

    this.props.resetCalendar()
    this.refs = {}

    batchActions([
      this.props.setDate(selectedDate),
      await this.getCalendar(newStartRange, newEndRange, viewAsUsers)
    ])

    this.scrollIntoView(selectedDate)
  }

  handleDateChange = async selectedDate => {
    const { startRange, endRange, setDate } = this.props
    const [newStartRange, newEndRange] = createDateRange(selectedDate)
    const timestamp = moment(selectedDate)
      .utcOffset(0)
      .startOf('day')
      .format('X')

    // check the new range is inside current range or not
    if (timestamp >= startRange && timestamp <= endRange) {
      setDate(selectedDate)
      this.scrollIntoView(selectedDate, {
        behavior: 'smooth'
      })

      return false
    }

    // check range is completly outside the current range or not
    if (timestamp > endRange || timestamp < startRange) {
      return this.restartCalendar(selectedDate)
    }

    this.setLoadingPosition(LOADING_POSITIONS.Middle)
    this.scrollIntoView(selectedDate, {
      behavior: 'smooth'
    })

    batchActions([
      setDate(selectedDate),
      await this.getCalendar(newStartRange, newEndRange)
    ])
  }

  onClickTask = selectedEvent =>
    this.setState(() => ({ selectedEvent }), this.openEventDrawer)

  handleEventChange = async (task, action) => {
    const { startRange, endRange } = this.props
    const timestamp = task.due_date

    const isInRange = timestamp >= startRange && timestamp <= endRange
    const isTaskUpdated = action === 'updated'
    const newSelectedDate = new Date(timestamp * 1000)

    this.closeEventDrawer()

    if (isInRange || isTaskUpdated) {
      this.setLoadingPosition(LOADING_POSITIONS.Middle)

      batchActions([
        this.props.resetCalendar(),
        this.props.setDate(newSelectedDate),
        await this.getCalendar(startRange, endRange)
      ])

      this.scrollIntoView(newSelectedDate)
    }
  }

  scrollIntoView = (date, options = {}) => {
    const refId = moment(date).format('YYYY-MM-DD')

    this.isObserverEnabled = false

    this.refs[refId] &&
      this.refs[refId].scrollIntoView({
        behavior: options.behavior || 'instant',
        block: 'start'
      })

    setTimeout(() => {
      this.isObserverEnabled = true
    }, 500)
  }

  loadPreviousItems = async () => {
    const { startRange } = this.props

    if (this.props.isFetching || _.isEmpty(this.props.calendarDays)) {
      return false
    }

    this.setLoadingPosition(LOADING_POSITIONS.Top)

    const [newStartRange, newEndRange] = createPastRange(startRange)
    const newSelectedDate = new Date(startRange * 1000)

    batchActions([
      this.props.setDate(newSelectedDate),
      await this.getCalendar(newStartRange, newEndRange)
    ])

    this.scrollIntoView(newSelectedDate)
  }

  loadNextItems = async () => {
    const { endRange, isFetching, calendarDays } = this.props

    if (isFetching || _.isEmpty(calendarDays)) {
      return false
    }

    this.setLoadingPosition(LOADING_POSITIONS.Bottom)
    this.getCalendar(...createFutureRange(endRange))
  }

  get SelectedRange() {
    const { startRange, endRange } = this.props
    const offset = new Date().getTimezoneOffset() * 60

    const range = {
      from: new Date((~~startRange + offset) * 1000),
      to: new Date((~~endRange + offset) * 1000)
    }

    return {
      range
    }
  }

  renderCRMEventDrawer = () => {
    const { selectedEvent, isOpenEventDrawer } = this.state

    if (!isOpenEventDrawer) {
      return null
    }

    const _props = {
      deleteCallback: this.handleEventChange,
      isOpen: true,
      onClose: this.closeEventDrawer,
      submitCallback: this.handleEventChange,
      user: this.props.user
    }

    // New Event
    if (!selectedEvent) {
      return <EventDrawer {..._props} />
    }

    const { id } = selectedEvent

    switch (selectedEvent.type) {
      case 'Tour':
        return <TourDrawer {..._props} tourId={id} />
      case 'Open House':
        return <OpenHouseDrawer {..._props} openHouseId={id} />
      default:
        return <EventDrawer {..._props} eventId={id} />
    }
  }

  render() {
    const { isMenuOpen, loadingPosition } = this.state
    const { selectedDate, isFetching } = this.props

    return (
      <Container isOpen={isMenuOpen}>
        {this.renderCRMEventDrawer()}

        <Menu isOpen={isMenuOpen} width={MENU_WIDTH}>
          <MenuContainer>
            <DatePicker
              selectedDate={selectedDate}
              onChange={this.handleDateChange}
              // modifiers={this.SelectedRange}
            />

            <Export />
          </MenuContainer>
        </Menu>

        <Content menuWidth={MENU_WIDTH} isSideMenuOpen={isMenuOpen}>
          <PageHeader>
            <PageHeader.Title showBackButton={false}>
              <Trigger isExpended={isMenuOpen} onClick={this.toggleSideMenu} />
              <PageHeader.Heading>Calendar</PageHeader.Heading>
            </PageHeader.Title>

            <PageHeader.Menu>
              <ActionButton onClick={this.openEventDrawer}>
                Add Event
              </ActionButton>
            </PageHeader.Menu>
          </PageHeader>
          <TableContainer>
            <CalendarTable
              positions={LOADING_POSITIONS}
              selectedDate={selectedDate}
              isFetching={isFetching}
              loadingPosition={loadingPosition}
              onScrollTop={this.loadPreviousItems}
              onScrollBottom={this.loadNextItems}
              onSelectTask={this.onClickTask}
              onRef={this.onTableRef}
            />
          </TableContainer>
        </Content>
      </Container>
    )
  }
}

function mapStateToProps({ user, calendar }) {
  return {
    user,
    list: calendar.list,
    isFetching: calendar.isFetching,
    selectedDate: moment(calendar.selectedDate)
      .utcOffset(0)
      .toDate(),
    calendarDays: calendar.byDay,
    viewAsUsers: viewAs(user),
    startRange: getStartRange(calendar),
    endRange: getEndRange(calendar),
    brandMembers: allMembersOfTeam(getActiveTeam(user))
  }
}

export default connect(
  mapStateToProps,
  {
    getCalendar,
    setDate,
    resetCalendar
  }
)(CalendarContainer)
