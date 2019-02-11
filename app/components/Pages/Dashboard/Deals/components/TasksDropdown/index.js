import React from 'react'
import { connect } from 'react-redux'

import Downshift from 'downshift'
import { addNotification as notify } from 'reapop'

import { createFormTask, changeNeedsAttention } from 'actions/deals'

import { Tasks } from './ChecklistTasks'
import { Forms } from './ChecklistForms'
import { CreateTaskItem } from './CreateTask/NewItem'
import { CreateTaskForm } from './CreateTask/Form'
import { ChecklistStash } from './ChecklistStash'
import { ChecklistTitle } from './styled'

import { SearchInput } from './SearchInput'
import { DropDownContainer, DropDownMenu } from './styled'

class DropDownTasks extends React.Component {
  state = {
    isMenuOpen: false,
    isSaving: false,
    filterValue: null,
    showCreateTaskForm: false,
    shouldNotifyOffice: true
  }

  /**
   * @param {Object} e - the event
   */
  stopPropagation = e => e.stopPropagation()

  /**
   * set a needs_attention for given task
   * @param {Object} deal - the deal object
   * @param {Object} task - the task object
   */
  notifyOffice = (deal, task) => {
    const { changeNeedsAttention, notify } = this.props

    changeNeedsAttention(deal.id, task.id, true).then(() =>
      notify({
        message: `Office has been notified for "${task.title}"`,
        status: 'success'
      })
    )
  }

  /**
   * @param {UUID} id - the selected task id
   */
  onSelectTask = async id => {
    const { tasks, onSelectTask } = this.props
    const { shouldNotifyOffice } = this.state
    const task = id && tasks[id]

    if (this.state.isSaving) {
      return false
    }

    // close menu
    this.toggleMenuState()

    this.setState({
      isSaving: true
    })

    await onSelectTask(id, shouldNotifyOffice)

    this.setState({
      isSaving: false,
      filterValue: task ? task.title : null,
      shouldNotifyOffice: true
    })
  }

  /**
   * handle when user clicks on "Add new task to <Checklist>"
   * @param {UUID} id - the checklist id
   */
  onRequestNewTask = id => this.setState({ showCreateTaskForm: id })

  /**
   * cancel new task creation
   */
  onCancelNewTask = () => this.setState({ showCreateTaskForm: null })

  /**
   * returns suitable value for dropdown's title
   */
  getSearchValue = () => {
    const { filterValue } = this.state
    const { selectedTask, showStashOption } = this.props

    if (filterValue !== null) {
      return filterValue
    }

    if (selectedTask) {
      return selectedTask.title.trim()
    }

    if (selectedTask === null && showStashOption) {
      return 'Upload directly to my Files'
    }

    return ''
  }

  /**
   * handles when search input changes
   * @param {String} value - the filter's value
   */
  onInputValueChange = value => {
    this.setState({
      filterValue: value,
      isMenuOpen: true
    })
  }

  /**
   * handle when notify office changes
   */
  onChangeNotifyOffice = () =>
    this.setState(state => ({
      shouldNotifyOffice: !state.shouldNotifyOffice
    }))

  /**
   * open/closes the dropdown
   */
  toggleMenuState = () =>
    this.setState(state => ({
      isMenuOpen: !state.isMenuOpen,
      filterValue: null
    }))

  /**
   * creates a new task for given checklist
   * @param {UUID} checklistId - the checklist id
   * @param {String} title - the task title
   * @param {Boolean} shouldNotifyOffice - whether should notify office or not
   */
  createNewTask = async (checklistId, title, shouldNotifyOffice) => {
    const { deal, notify, createFormTask, onSelectTask } = this.props

    this.setState({
      isSaving: true
    })

    // create task
    try {
      const task = await createFormTask(deal.id, null, title, checklistId)

      this.setState({
        showCreateTaskForm: false,
        isSaving: false,
        isMenuOpen: false
      })

      if (shouldNotifyOffice) {
        this.notifyOffice(deal, task)
      }

      onSelectTask(task.id)

      notify({
        message: `Task "${title}" created.`,
        status: 'success'
      })
    } catch (e) {
      this.setState({
        isSaving: false
      })

      notify({
        message: 'Could not create the task. try again.',
        status: 'error'
      })
    }
  }

  /**
   * creates a new form for given checklist
   * @param {Object} form - the given form object
   * @param {UUID} checklistId - the checklist id
   */
  onSelectChecklistForm = async (form, checklistId) => {
    const { deal, onSelectTask, createFormTask } = this.props
    const { shouldNotifyOffice } = this.state

    this.toggleMenuState()

    this.setState({
      filterValue: form.name.trim()
    })

    try {
      const task = await createFormTask(
        deal.id,
        form.id,
        form.name,
        checklistId
      )

      if (shouldNotifyOffice) {
        this.notifyOffice(deal, task)
      }

      this.setState({
        filterValue: null
      })

      notify({
        message: `Form Task "${form.name}" created.`,
        status: 'success'
      })

      onSelectTask(task.id)
    } catch (e) {
      this.setState({
        isSaving: false
      })

      notify({
        message: 'Could not create the task. try again.',
        status: 'error'
      })
    }
  }

  handleClickSearchInput = e => {
    this.stopPropagation(e)

    if (e.screenX == 0 && e.screenY == 0) {
      return false
    }

    this.toggleMenuState()
  }

  render() {
    const {
      isMenuOpen,
      isSaving,
      showCreateTaskForm,
      filterValue,
      shouldNotifyOffice
    } = this.state

    const {
      deal,
      checklists,
      tasks,
      searchable,
      selectedTask,
      subTitle = null,
      placeholder = 'Folder',
      showNotifyOption,
      showStashOption,
      stashOptionText,
      disabled = false
    } = this.props

    return (
      <Downshift
        isOpen={isMenuOpen}
        onOuterClick={this.toggleMenuState}
        defaultInputValue={filterValue}
        onInputValueChange={this.onInputValueChange}
      >
        {({ getInputProps, isOpen }) => (
          <div style={this.props.style}>
            <DropDownContainer>
              <SearchInput
                disabled={disabled}
                getInputProps={getInputProps}
                isSaving={isSaving}
                isMenuOpen={isMenuOpen}
                searchable={searchable}
                selectedTask={selectedTask}
                placeholder={placeholder}
                subTitle={subTitle}
                value={this.getSearchValue()}
                onClick={this.handleClickSearchInput}
                onFocus={this.stopPropagation}
              />

              {isOpen && (
                <DropDownMenu pullRight={this.props.pullRight}>
                  {showStashOption && (
                    <ChecklistStash
                      onSelect={e => {
                        this.stopPropagation(e)
                        this.onSelectTask(null)
                      }}
                      stashOptionText={stashOptionText}
                      selectedTask={selectedTask}
                    />
                  )}

                  {deal.checklists &&
                    deal.checklists
                      .filter(chId => !checklists[chId].is_terminated)
                      .map(chId => (
                        <div key={chId}>
                          <ChecklistTitle
                            className="checklist"
                            onClick={e => e.stopPropagation()}
                          >
                            {checklists[chId].title}
                          </ChecklistTitle>

                          <Tasks
                            filterValue={filterValue}
                            checklist={checklists[chId]}
                            tasks={tasks}
                            onSelectItem={this.onSelectTask}
                            selectedTask={selectedTask}
                            showNotifyOption={showNotifyOption}
                            onChangeNotifyOffice={this.onChangeNotifyOffice}
                            shouldNotifyOffice={shouldNotifyOffice}
                          />

                          <Forms
                            filterValue={filterValue}
                            checklist={checklists[chId]}
                            tasks={tasks}
                            onSelectItem={this.onSelectChecklistForm}
                            showNotifyOption={showNotifyOption}
                            onChangeNotifyOffice={this.onChangeNotifyOffice}
                            shouldNotifyOffice={shouldNotifyOffice}
                          />

                          {showCreateTaskForm === chId ? (
                            <CreateTaskForm
                              isSaving={isSaving}
                              showNotifyOption={showNotifyOption}
                              checklist={checklists[chId]}
                              onCancel={this.onCancelNewTask}
                              onFinish={this.createNewTask}
                            />
                          ) : (
                            <CreateTaskItem
                              checklist={checklists[chId]}
                              onSelect={this.onRequestNewTask}
                            />
                          )}
                        </div>
                      ))}
                </DropDownMenu>
              )}
            </DropDownContainer>
          </div>
        )}
      </Downshift>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    checklists: deals.checklists,
    tasks: deals.tasks
  }
}

export default connect(
  mapStateToProps,
  {
    notify,
    createFormTask,
    changeNeedsAttention
  }
)(DropDownTasks)
