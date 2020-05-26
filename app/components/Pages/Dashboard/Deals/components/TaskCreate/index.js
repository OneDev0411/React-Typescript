import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import { selectForms } from 'reducers/deals/forms'
import { createFormTask } from 'actions/deals'

import LoadingContainer from 'components/LoadingContainer'
import Search from 'components/Grid/Search'
import OverlayDrawer from 'components/OverlayDrawer'
import TextIconButton from 'components/Button/TextIconButton'
import AddIcon from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

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

  renderDrawerHeaderMenu = () => (
    <TextIconButton
      onClick={this.toggleCustomTaskDrawer}
      text="Create New Folder"
      appearance="outline"
      iconLeft={AddIcon}
      iconSize="large"
      disabled={this.state.isSaving}
    />
  )

  render() {
    return (
      <Fragment>
        <OverlayDrawer
          open={this.props.isOpen && this.state.showCustomTaskDrawer === false}
          onClose={this.handleClose}
        >
          <OverlayDrawer.Header
            title="Add New Checklist Item"
            menu={this.renderDrawerHeaderMenu()}
          />
          <OverlayDrawer.Body>
            {this.state.isSaving ? (
              <LoadingContainer
                style={{
                  height: 'calc(100vh - 6em)'
                }}
              />
            ) : (
              <Fragment>
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

                {this.props.forms &&
                  Object.values(this.props.forms)
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
                        <TextMiddleTruncate text={form.name} maxLength={70} />
                      </ListItem>
                    ))}
              </Fragment>
            )}
          </OverlayDrawer.Body>
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
  return {
    forms: selectForms(deals.forms, ownProps.deal.id)
  }
}

export default connect(mapStateToProps, { createFormTask })(TaskCreate)
