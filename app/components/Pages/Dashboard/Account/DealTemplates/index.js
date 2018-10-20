import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import styled from 'styled-components'

import ActionButton from '../../../../../views/components/Button/ActionButton'

import { getForms } from '../../../../../store_actions/deals'
import Grid from '../../../../../views/components/Grid/Table'
import Search from '../../../../../views/components/Grid/Search'
import PageHeader from '../../../../../views/components/PageHeader'
import { grey } from '../../../../../views/utils/colors'

const GridContainer = styled.div`
  margin-top: 2rem;
`

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
        header: 'Name',
        accessor: 'name',
        render: ({ rowData: form }) => form.name
      },
      {
        width: '116px',
        render: ({ rowData: form }) => (
          <Fragment>
            <ActionButton size="small" onClick={() => this.editTemplate(form)}>
              Edit Template
            </ActionButton>
          </Fragment>
        )
      }
    ]
  }

  getGridTrProps = () => ({
    hoverStyle: `
    background-color: ${grey.ClientRectListA000};
    `
  })

  editTemplate = form =>
    browserHistory.push(`/dashboard/account/deal/templates/${form.id}`)

  render() {
    const data = this.Forms

    return (
      <Fragment>
        <PageHeader
          isFlat
          style={{ marginBottom: '1.5em', marginTop: '1.5rem' }}
        >
          <PageHeader.Title showBackButton={false}>
            <PageHeader.Heading>Form Templates</PageHeader.Heading>
          </PageHeader.Title>
        </PageHeader>
        <div className="c-deal-templates">
          <Search
            disableOnSearch={false}
            placeholder="Search all forms"
            onChange={filter => this.setState({ filter })}
            debounceTime={100}
            minimumLength={1}
            onClearSearch={() => this.setState({ filter: '' })}
          />
          <GridContainer>
            <Grid
              showPagination={false}
              data={data}
              getTrProps={this.getGridTrProps}
              columns={this.Columns}
            />
          </GridContainer>
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
