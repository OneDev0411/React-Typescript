import { useState } from 'react'

import { Theme } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Helmet } from 'react-helmet'
import { connect, useDispatch } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { selectActiveBrandId } from '@app/selectors/brand'
import { getContextsByBrand } from 'actions/deals'
import LoadingContainer from 'components/LoadingContainer'
import { addNotification as notify } from 'components/notification'
import PageHeader from 'components/PageHeader'
import { useBrandPropertyTypes } from 'hooks/use-get-brand-property-types'
import createNewContext from 'models/Deal/context/create-context'
import deleteContext from 'models/Deal/context/delete-context'
import editContext from 'models/Deal/context/edit-context'
import { IAppState } from 'reducers'
import { selectBrandContexts } from 'reducers/deals/contexts'

import CategoryItem from '../components/CategoryItem'
import EmptyState from '../components/EmptyState'
import NewCategoryModal from '../components/NewCategory'

interface Props {
  activeBrandId: UUID
  isFetching: boolean
  isEmpty: boolean
  list: Record<string, IDealBrandContext[]>
}

function DealContext({ activeBrandId, isFetching, isEmpty, list }: Props) {
  const dispatch = useDispatch()
  const theme = useTheme<Theme>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [selectedContext, setSelectedContext] =
    useState<IDealBrandContext | null>(null)

  useEffectOnce(() => {
    dispatch(getContextsByBrand(activeBrandId))
  })

  const {
    propertyTypes: brandPropertyTypes,
    reload: reloadBrandPropertyTypes
  } = useBrandPropertyTypes(activeBrandId)

  async function contextFormHandler(
    contextData: IDealBrandContext & {
      checklists: Record<UUID, boolean>
    },
    contextId?: UUID
  ) {
    try {
      const editMode: boolean = !!(contextId && selectedContext)
      let context: IDealBrandContext

      const checklists = Object.entries(contextData.checklists)
        .filter(([_, is_required]) => is_required !== null)
        .map(([checklist, is_required]) => ({
          checklist,
          is_required
        }))

      if (editMode) {
        context = await editContext(activeBrandId, contextId, {
          ...contextData,
          checklists
        })
      } else {
        context = await createNewContext(activeBrandId, {
          ...contextData,
          checklists
        })
      }

      if (context) {
        dispatch(
          notify({
            message: !editMode ? 'New Context is Saved!' : 'Context is Edited!',
            status: 'success'
          })
        )
        dispatch(getContextsByBrand(activeBrandId))
        setIsModalOpen(false)

        if (editMode) {
          setSelectedContext(null)
        }

        reloadBrandPropertyTypes()
      }
    } catch (err) {
      if (err.status === 409) {
        dispatch(
          notify({
            message: 'There is already an existing context id!',
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
      const res = await deleteContext(activeBrandId, contextId)

      if (res) {
        dispatch(
          notify({
            message: 'Context deleted',
            status: 'success'
          })
        )

        dispatch(getContextsByBrand(activeBrandId))
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

    if (isEmpty) {
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
      {activeBrandId && isModalOpen && (
        <NewCategoryModal
          isOpen={isModalOpen}
          section={selectedSection}
          context={selectedContext}
          brandId={activeBrandId}
          brandPropertyTypes={brandPropertyTypes}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedContext(null)
            setSelectedSection(null)
          }}
          onSubmit={contextFormHandler}
        />
      )}
      <div style={{ padding: theme.spacing(0, 3, 9) }}>{renderContent()}</div>
    </>
  )
}

const mapStateToProps = (state: IAppState) => {
  const activeBrandId = selectActiveBrandId(state)
  const exactContexts = selectBrandContexts(state.deals.contexts, activeBrandId)

  return {
    activeBrandId,
    isFetching: isEmpty(state.deals.contexts),
    isEmpty: isEmpty(exactContexts),
    list: groupBy(exactContexts, 'section')
  }
}

export default connect(mapStateToProps)(DealContext)
