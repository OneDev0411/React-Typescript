import React, { Fragment } from 'react'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import cn from 'classnames'
import _ from 'underscore'

import PageTitle from '../components/PageTitle'
import Search from '../../../../Partials/headerSearch'
import ActionButton from '../../../../../views/components/Button/ActionButton'

import { getForms } from '../../../../../store_actions/deals'

class DealTemplates extends React.Component {
  state = {
    filter: ''
  }

  componentDidMount() {
    const { getForms, forms } = this.props

    if (!forms) {
      getForms()
    }
  }

  get Forms() {
    const { forms } = this.props
    const { filter } = this.state

    if (!forms) {
      return []
    }

    return Object.values(forms).filter(form =>
      form.name.toLowerCase().includes(filter.toLowerCase())
    )
  }

  get Columns() {
    return [
      {
        id: 'name',
        Header: 'Name',
        style: { paddingLeft: '15px', cursor: 'auto' },
        accessor: 'name',
        Cell: ({ original: form }) => form.name
      },
      {
        style: { flexDirection: 'row-reverse' },
        Cell: ({ original: form }) => (
          <Fragment>
            <ActionButton onClick={() => this.editTemplate(form)}>
              Edit Template
            </ActionButton>
          </Fragment>
        )
      }
    ]
  }

  editTemplate = form =>
    browserHistory.push(`/dashboard/account/deal/templates/${form.id}`)

  render() {
    const data = this.Forms

    return (
      <Fragment>
        <PageTitle title="Form Templates" />
        <div className="c-deal-templates">
          <Search
            onInputChange={filter => this.setState({ filter })}
            debounceTime={100}
            placeholder="Search all forms"
          />

          <ReactTable
            showPagination={false}
            data={data}
            pageSize={data.length}
            columns={this.Columns}
            defaultSorted={[
              {
                id: 'name'
              }
            ]}
            sortable
            resizable
          />
        </div>
      </Fragment>
    )
  }
}

export default connect(
  ({ deals }) => ({
    forms: deals.forms
  }),
  { getForms }
)(DealTemplates)
