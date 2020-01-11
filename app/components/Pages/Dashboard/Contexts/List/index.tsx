import React, { useState, useEffect } from 'react'
import { AnyAction } from 'redux'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Helmet } from 'react-helmet'
import { Theme } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'
import _ from 'lodash'
import { addNotification as notify } from 'reapop'

import { IAppState } from 'reducers'
import createNewContext from 'models/Deal/context/create-context'
import { selectContextsByBrand } from 'reducers/deals/contexts'
import { getContextsByBrand } from 'actions/deals'
import { getActiveTeamId } from 'utils/user-teams'
import PageHeader from 'components/PageHeader'
import LoadingContainer from 'components/LoadingContainer'

import CategoryItem from '../components/CategoryItem'
import NewCategoryModal from '../components/NewCategory'

interface Props {
  brandId: UUID
  list: Array<{ section: string; items: Array<IDealBrandContext> }>
  getContextsByBrand: IAsyncActionProp<typeof getContextsByBrand>
  notify: IAsyncActionProp<typeof notify>
}

function DealContext({ brandId, list, getContextsByBrand, notify }: Props) {
  useEffect(() => {
    getContextsByBrand(brandId)
  }, [getContextsByBrand, brandId])

  const theme = useTheme<Theme>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [
    selectedContext,
    setSelectedContext
  ] = useState<IDealBrandContext | null>(null)

  async function newContextHandler(contextData: IDealBrandContext) {
    try {
      const context = await createNewContext(brandId, contextData)

      if (context) {
        notify({
          message: 'New Context is Saved!',
          status: 'success'
        })
        getContextsByBrand(brandId)
        setIsModalOpen(false)
      }
    } catch (err) {
      console.error(err)
      notify({
        message: 'Unexpected error happened',
        status: 'error'
      })
      setIsModalOpen(false)
      setSelectedContext(null)
    }
  }

  const renderContent = () => {
    if (!list) {
      return <LoadingContainer style={{ padding: '30vh 0 0' }} />
    }

    return list.map(({ section, items }) => (
      <CategoryItem
        key={section}
        title={section}
        items={items}
        setIsModalOpen={setIsModalOpen}
        setSelectedContext={setSelectedContext}
      />
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
      <NewCategoryModal
        isOpen={isModalOpen}
        context={selectedContext}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedContext(null)
        }}
        onSubmit={newContextHandler}
      />
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
  getContextsByBrand: brandId => dispatch(getContextsByBrand(brandId)),
  notify: (...args: Parameters<typeof notify>) => dispatch(notify(...args))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DealContext)
