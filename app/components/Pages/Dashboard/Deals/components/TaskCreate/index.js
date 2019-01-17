import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { getChecklistById } from 'reducers/deals/checklists'
import { createFormTask } from 'actions/deals'

import OverlayDrawer from 'components/OverlayDrawer'
import Search from 'components/Grid/Search'
import ActionButton from 'components/Button/ActionButton'

import Spinner from 'components/Spinner'

import IconAdd from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

import CreateCustomTask from './CustomTask'
import { ListItem } from './styled'

const initialState = {
  isSaving: false,
  showCustomTaskDrawer: false,
  searchFilter: ''
}

class TaskCreate extends React.Component {
  state = initialState

  handleChangeSearchFilter = searchFilter => this.setState({ searchFilter })

  handleClearSearch = () => this.setState({ searchFilter: '' })

  toggleCustomTaskDrawer = () =>
    this.setState(state => ({
      showCustomTaskDrawer: !state.showCustomTaskDrawer
    }))

  handleClose = () => {
    this.setState(initialState)

    if (this.searchInput) {
      this.searchInput.clear()
    }

    this.props.onClose()
  }

  createTask = async form => {
    this.setState({
      isSaving: true
    })

    try {
      const task = await this.props.createFormTask(
        this.props.deal.id,
        form.id,
        form.name,
        this.props.checklist.id
      )

      this.setState({ isSaving: false }, this.handleClose)

      return task
    } catch (error) {
      this.setState({ isSaving: null })
    }
  }

  render() {
    return (
      <Fragment>
        <OverlayDrawer
          isOpen={
            this.props.isOpen && this.state.showCustomTaskDrawer === false
          }
          onClose={this.handleClose}
        >
          <OverlayDrawer.Header title="Add New Task" />
          <OverlayDrawer.Body>
            {this.state.isSaving && <Spinner />}

            {this.state.isSaving === false && (
              <Fragment>
                {_.size(this.props.forms) > 5 && (
                  <Search
                    disableOnSearch={false}
                    placeholder="Type in to search ..."
                    debounceTime={0}
                    minimumLength={1}
                    onChange={this.handleChangeSearchFilter}
                    onClearSearch={this.handleClearSearch}
                    inputRef={ref => (this.searchInput = ref)}
                    style={{ margin: '1rem 0' }}
                  />
                )}

                {_.chain(this.props.forms)
                  .filter(form =>
                    form.name
                      .toLowerCase()
                      .includes(this.state.searchFilter.toLowerCase())
                  )
                  .map((form, index) => (
                    <ListItem
                      key={`${form.id}_${index}`}
                      onClick={() => this.createTask(form)}
                      onDoubleClick={() => null}
                    >
                      {form.name}
                    </ListItem>
                  ))
                  .value()}
              </Fragment>
            )}
          </OverlayDrawer.Body>

          <OverlayDrawer.Footer style={{ flexDirection: 'row-reverse' }}>
            <ActionButton
              disabled={this.state.isSaving}
              onClick={this.toggleCustomTaskDrawer}
            >
              <IconAdd
                style={{ fill: '#fff', width: '1rem', marginRight: '0.5rem' }}
              />
              &nbsp;Add New Item
            </ActionButton>
          </OverlayDrawer.Footer>
        </OverlayDrawer>

        <CreateCustomTask
          isOpen={this.state.showCustomTaskDrawer}
          onClose={this.toggleCustomTaskDrawer}
          handleCreateTask={this.createTask}
        />
      </Fragment>
    )
  }
}

function mapStateToProps({ deals }, ownProps) {
  const checklist = getChecklistById(deals.checklists, ownProps.checklist.id)

  return {
    forms: checklist && checklist.allowed_forms
  }
}

export default connect(
  mapStateToProps,
  { createFormTask }
)(TaskCreate)
