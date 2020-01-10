import React, { useEffect } from 'react'
import { AnyAction } from 'redux'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Helmet } from 'react-helmet'
import { Theme } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'
import _ from 'lodash'

import { IAppState } from 'reducers'
import { selectContextsByBrand } from 'reducers/deals/contexts'
import { getContextsByBrand } from 'actions/deals'
import { getActiveTeamId } from 'utils/user-teams'
import PageHeader from 'components/PageHeader'
import LoadingContainer from 'components/LoadingContainer'

import CategoryItem from '../components/CategoryItem'

interface Props {
  brandId: UUID
  list: Array<{ section: string; items: Array<IDealBrandContext> }>
  getContextsByBrand: IAsyncActionProp<typeof getContextsByBrand>
}

function DealContext({ brandId, list, getContextsByBrand }: Props) {
  useEffect(() => {
    getContextsByBrand(brandId)
  }, [getContextsByBrand, brandId])

  const theme = useTheme<Theme>()
  const renderContent = () => {
    if (!list) {
      return <LoadingContainer style={{ padding: '30vh 0 0' }} />
    }

    return list.map(({ section, items }) => (
      <CategoryItem key={section} title={section} items={items} />
    ))
  }

  return (
    <>
      <Helmet>
        <title>Deal Context | Rechat</title>
      </Helmet>

      <PageHeader>
        <PageHeader.Title showBackButton={false}>
          <PageHeader.Heading>Deal Context</PageHeader.Heading>
        </PageHeader.Title>
      </PageHeader>

      <div style={{ padding: theme.spacing(0, 3, 9) }}>{renderContent()}</div>
    </>
  )
}

const mapStateToProps = ({ deals, user }: IAppState) => {
  const brandId = getActiveTeamId(user)

  return {
    brandId,
    list: _.chain(selectContextsByBrand(deals.contexts, brandId))
      .groupBy('section')
      .map((value, key) => ({
        section: key !== 'null' ? key : 'Unorganized',
        items: value
      }))
      .value()
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  getContextsByBrand: brandId => dispatch(getContextsByBrand(brandId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DealContext)
