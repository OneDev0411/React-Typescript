import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Theme } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'

import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import { addNotification as notify } from 'components/notification'

import { IAppState } from 'reducers'
import createNewContext from 'models/Deal/context/create-context'
import editContext from 'models/Deal/context/edit-context'
import deleteContext from 'models/Deal/context/delete-context'
import { selectExactContextsByBrand } from 'reducers/deals/contexts'
import { getContextsByBrand } from 'actions/deals'
import { getActiveTeamId } from 'utils/user-teams'
import PageHeader from 'components/PageHeader'
import LoadingContainer from 'components/LoadingContainer'

import CategoryItem from '../components/CategoryItem'
import NewCategoryModal from '../components/NewCategory'
import EmptyState from '../components/EmptyState'

interface Props {
  brandId: UUID
  isFetching: boolean
  list: { [key: string]: Array<IDealBrandContext> }
}

function DealContext({ brandId, isFetching, list }: Props) {
  const dispatch = useDispatch()
  const theme = useTheme<Theme>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [
    selectedContext,
    setSelectedContext
  ] = useState<IDealBrandContext | null>(null)

  useEffect(() => {
    dispatch(getContextsByBrand(brandId))
  }, [brandId, dispatch])

  async function contextFormHandler(
    contextData: IDealBrandContext,
    contextId?: UUID
  ) {
    try {
      const editMode: boolean = !!(contextId && selectedContext)
      let context: IDealBrandContext

      if (editMode) {
        context = await editContext(brandId, contextId, contextData)
      } else {
        context = await createNewContext(brandId, contextData)
      }

      if (context) {
        dispatch(
          notify({
            message: !editMode ? 'New Context is Saved!' : 'Context is Edited!',
            status: 'success'
          })
        )
        dispatch(getContextsByBrand(brandId))
        setIsModalOpen(false)

        if (editMode) {
          setSelectedContext(null)
        }
      }
    } catch (err) {
      if (err.status === 409) {
        dispatch(
          notify({
            message: 'Context id has already taken!',
            status: 'error'
          })
        )

        return
      }

      dispatch(
        notify({
          message: 'Unexpected error happened',
          status: 'error'
        })
      )
      setIsModalOpen(false)
      setSelectedContext(null)
    }
  }
  async function deleteContextHandler(contextId: UUID) {
    try {
      const res = await deleteContext(brandId, contextId)

      if (res) {
        notify({
          message: 'Context is Deleted!',
          status: 'success'
        })
        dispatch(getContextsByBrand(brandId))
      }
    } catch (err) {
      console.error(err)
      notify({
        message: 'Unexpected error happened',
        status: 'error'
      })
    }
  }

  const renderContent = () => {
    if (isFetching) {
      return <LoadingContainer style={{ padding: '30vh 0 0' }} />
    }

    if (list.isEmpty) {
      return <EmptyState onOpenNewContext={() => setIsModalOpen(true)} />
    }

    return Object.keys(list)
      .sort()
      .map(key => (
        <CategoryItem
          key={key}
          title={key}
          items={list[key]}
          onSetIsModalOpen={() => {
            setSelectedSection(key)
            setIsModalOpen(true)
          }}
          onSetSelectedContext={setSelectedContext}
          onDelete={deleteContextHandler}
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
        section={selectedSection}
        context={selectedContext}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedContext(null)
          setSelectedSection(null)
        }}
        onSubmit={contextFormHandler}
      />
      <div style={{ padding: theme.spacing(0, 3, 9) }}>{renderContent()}</div>
    </>
  )
}

const mapStateToProps = ({ deals, user }: IAppState) => {
  const brandId = getActiveTeamId(user)
  const exactContexts = selectExactContextsByBrand(deals.contexts, brandId)

  return {
    brandId,
    isFetching: isEmpty(deals.contexts.byBrand),
    list: !isEmpty(exactContexts)
      ? groupBy(exactContexts, 'section')
      : { isEmpty: true }
  }
}

export default connect(mapStateToProps)(DealContext)
