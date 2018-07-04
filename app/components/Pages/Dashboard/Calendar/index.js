import React from 'react'
import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'

import moment from 'moment'
import _ from 'underscore'

import { getStartRange, getEndRange } from '../../../../reducers/calendar'

import {
  getCalendar,
  setDate,
  resetCalendar
} from '../../../../store_actions/calendar'

import {
  createDateRange,
  createPastRange,
  createFutureRange,
  createDayRange
} from '../../../../models/Calendar/helpers/create-date-range'

import {
  Container,
  Menu,
  Trigger
} from '../../../../views/components/SlideMenu'

import TaskDrawer from './TaskDrawer'
import PageHeader from '../../../../views/components/PageHeader'
import DatePicker from '../../../../views/components/DatePicker'

import CalendarTable from './Table'

import {
  MenuContainer,
  CalendarContent,
  PageContent,
  HeroTitle
} from './styled'

import ActionButton from '../../../../views/components/Button/ActionButton'

const LOADING_POSITIONS = {
  Top: 0,
  Bottom: 1,
  Middle: 2
}

class CalendarContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isMenuOpen: true,
      showCreateTaskMenu: false,
      selectedTask: null,
      loadingPosition: LOADING_POSITIONS.Middle
    }

    this.isObserverEnabled = false
    // this.onEventObserve = _.debounce(this.onEventObserve, 150)
  }

  componentDidMount() {
    const { selectedDate } = this.props

    this.restartCalendar(selectedDate)

    // this.observer = new IntersectionObserver(this.onEventObserve, {
    //   root: this.calendarTableContainer,
    //   rootMargin: '100px',
    //   threshold: 0.8
    // })
  }

  // onEventObserve = entities => {
  //   const { setDate, selectedDate } = this.props
  //   const ref = entities && entities[0].target
  //   const { refid } = ref.dataset

  //   if (this.isObserverEnabled === false) {
  //     return false
  //   }

  //   if (refid !== moment(selectedDate).format('YYYY-MM-DD')) {
  //     setDate(moment(refid).toDate())
  //   }
  // }

  /**
   * close/open side menu
   */
  toggleSideMenu = () =>
    this.setState(state => ({
      isMenuOpen: !state.isMenuOpen
    }))

  /**
   * close/open create task menu
   */
  toggleShowCreateTask = () =>
    this.setState(state => ({
      showCreateTaskMenu: !state.showCreateTaskMenu,
      selectedTask: null
    }))

  /**
   * sets calendar references
   */
  onTableRef = (refId, ref) => {
    this.refs = {
      ...this.refs,
      [refId]: ref
    }

    // if (this.observer && ref !== null) {
    //   this.observer.observe(ref)
    // }
  }

  /**
   * sets the loader position
   * @param { Number } position - the position
   */
  setLoadingPosition = position =>
    this.setState({
      loadingPosition: position
    })

  restartCalendar = async selectedDate => {
    const { resetCalendar, setDate, getCalendar } = this.props
    const [newStartRange, newEndRange] = createDateRange(selectedDate)

    this.setLoadingPosition(LOADING_POSITIONS.Middle)
    resetCalendar()
    this.refs = {}

    batchActions([
      setDate(selectedDate),
      await getCalendar(newStartRange, newEndRange)
    ])

    this.scrollIntoView(selectedDate)
  }

  handleDateChange = async selectedDate => {
    const { startRange, endRange, setDate, getCalendar } = this.props
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
      await getCalendar(newStartRange, newEndRange)
    ])
  }

  handleChangeTask = async task => {
    const { startRange, endRange, getCalendar, setDate } = this.props
    const timestamp = task.due_date
    const newSelectedDate = new Date(timestamp * 1000)

    if (timestamp >= startRange && timestamp <= endRange) {
      this.setLoadingPosition(LOADING_POSITIONS.Middle)

      const [startRange, endRange] = createDayRange(timestamp)

      batchActions([
        setDate(newSelectedDate),
        getCalendar(startRange, endRange)
      ])

      this.scrollIntoView(newSelectedDate)
    }

    this.setState({
      showCreateTaskMenu: false
    })
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
    const {
      startRange,
      getCalendar,
      setDate,
      isFetching,
      calendarDays
    } = this.props

    if (isFetching || _.isEmpty(calendarDays)) {
      return false
    }

    this.setLoadingPosition(LOADING_POSITIONS.Top)

    const [newStartRange, newEndRange] = createPastRange(startRange)
    const newSelectedDate = new Date(startRange * 1000)

    batchActions([
      setDate(newSelectedDate),
      await getCalendar(newStartRange, newEndRange)
    ])

    this.scrollIntoView(newSelectedDate)
  }

  loadNextItems = async () => {
    const { endRange, getCalendar, isFetching, calendarDays } = this.props

    if (isFetching || _.isEmpty(calendarDays)) {
      return false
    }

    this.setLoadingPosition(LOADING_POSITIONS.Bottom)
    getCalendar(...createFutureRange(endRange))
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

  handleSelectTask = row => {
    this.setState({
      showCreateTaskMenu: true,
      selectedTask: row.crm_task
    })
  }

  render() {
    const {
      isMenuOpen,
      showCreateTaskMenu,
      loadingPosition,
      selectedTask
    } = this.state
    const { user, selectedDate, isFetching } = this.props

    return (
      <Container>
        <TaskDrawer
          isOpen={showCreateTaskMenu}
          selectedTask={selectedTask}
          onClose={this.toggleShowCreateTask}
          onChangeTask={this.handleChangeTask}
        />

        <Menu isOpen={isMenuOpen} width={265}>
          <MenuContainer>
            <DatePicker
              selectedDate={selectedDate}
              onChange={this.handleDateChange}
              // modifiers={this.SelectedRange}
            />
          </MenuContainer>
        </Menu>

        <PageContent>
          <PageHeader isFlat>
            <PageHeader.Title backButton={false}>
              <Trigger onClick={this.toggleSideMenu} />
              <PageHeader.Heading>Calendar</PageHeader.Heading>
            </PageHeader.Title>

            <PageHeader.Menu>
              <ActionButton inverse onClick={this.toggleShowCreateTask}>
                Add Task
              </ActionButton>
            </PageHeader.Menu>
          </PageHeader>

          <CalendarContent>
            <HeroTitle>Hello {user.first_name}</HeroTitle>

            <div ref={ref => (this.calendarTableContainer = ref)}>
              <CalendarTable
                positions={LOADING_POSITIONS}
                selectedDate={selectedDate}
                isFetching={isFetching}
                loadingPosition={loadingPosition}
                onScrollTop={this.loadPreviousItems}
                onScrollBottom={this.loadNextItems}
                onContainerScroll={e => this.handleContainerScroll(e.target)}
                onSelectTask={this.handleSelectTask}
                onRef={this.onTableRef}
              />
            </div>
          </CalendarContent>
        </PageContent>
      </Container>
    )
  }
}

function mapStateToProps({ user, calendar }) {
  return {
    user,
    isFetching: calendar.isFetching,
    selectedDate: moment(calendar.selectedDate)
      .utcOffset(0)
      .toDate(),
    calendarDays: calendar.byDay,
    startRange: getStartRange(calendar),
    endRange: getEndRange(calendar)
  }
}

export default connect(mapStateToProps, {
  getCalendar,
  setDate,
  resetCalendar
})(CalendarContainer)
