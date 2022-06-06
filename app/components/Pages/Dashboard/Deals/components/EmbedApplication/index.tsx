import React, { useCallback, useState } from 'react'

import * as MaterialUi from '@material-ui/core'
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Typography
} from '@material-ui/core'
import { mdiReload } from '@mdi/js'
import { useDispatch, useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'
import superagent from 'superagent'

import { useDealBrandContexts } from '@app/hooks/use-deal-brand-contexts'
import useNotify from '@app/hooks/use-notify'
import { useQueryParamValue } from '@app/hooks/use-query-param'
import { createContextObject } from '@app/models/Deal/helpers/brand-context/create-context-object'
import { getContext } from '@app/models/Deal/helpers/context'
import { IAppState } from '@app/reducers'
import { getBrandChecklistsById } from '@app/reducers/deals/brand-checklists'
import { getDealChecklists } from '@app/reducers/deals/checklists'
import { selectDealRoles } from '@app/reducers/deals/roles'
import { upsertContexts } from '@app/store_actions/deals'
import { DialogTitle } from '@app/views/components/DialogTitle'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import DealRoleForm from 'components/DealRole/Form'
import Logo from 'components/Logo'
import {
  QuestionWizard,
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'
import config from 'config'

import { ContactRoles } from '../../Create/components/ContactRoles'
import { RoleCard } from '../RoleCard'

import { Manifest } from './types'

interface State {
  user: Nullable<IUser>
  brandChecklists: IBrandChecklist[]
  checklists: IDealChecklist[]
  roles: IDealRole[]
  attributeDefs: {
    byId: Record<UUID, IContactAttributeDef>
    byName: Record<string, UUID>
    bySection: Record<string, UUID[]>
  }
}
interface Props {
  deal: IDeal
  task: IDealTask
  isBackOffice: boolean
  onClose: () => void
}

export function EmbedApplication({ deal, task, isBackOffice, onClose }: Props) {
  const development = useQueryParamValue('dev')
  const host = useQueryParamValue('host', 'localhost:8081')

  const [module, setModule] = useState<any>(null)
  const [manifest, setManifest] = useState<Partial<Manifest>>({})

  const notify = useNotify()
  const dispatch = useDispatch()

  const { user, roles, attributeDefs, brandChecklists, checklists } =
    useSelector<IAppState, State>(({ deals, user, contacts }) => ({
      user,
      roles: selectDealRoles(deals.roles, deal),
      attributeDefs: contacts.attributeDefs,
      brandChecklists: deal
        ? getBrandChecklistsById(deals.brandChecklists, deal.brand.id)
        : [],
      checklists: getDealChecklists(deal, deals.checklists)
    }))

  const brandContexts = useDealBrandContexts(deal)

  const loadChunk = () => {
    try {
      ;(async () => {
        const baseUrl = development ? `http://${host}` : task.application.url

        const { body: manifest } = await superagent.get(
          `${baseUrl}/manifest.json`
        )

        setManifest(manifest)

        const chunkUrl = development
          ? `${baseUrl}/bundle.js?v=${Math.random()}`
          : `${baseUrl}/bundle.${manifest.build}.js`

        const url = development
          ? chunkUrl
          : `${config.app.share_url ?? ''}/api/apps?url=${chunkUrl}`

        const module = await import(/* webpackIgnore: true */ url)

        setModule(module)
      })()
    } catch (e) {
      console.log(e)
    }
  }

  useEffectOnce(() => {
    loadChunk()
  })

  useEffectOnce(() => {
    window.libs = {
      React,
      MaterialUi
    }

    return () => {
      window.libs = undefined
    }
  })

  const updateDealContext = useCallback(
    (key: string, value: unknown) => {
      const brandContext = brandContexts.find(context => context.key === key)

      if (!brandContext) {
        console.error(`Invalid Context Key: ${key}`)

        return
      }

      try {
        const context = createContextObject(
          deal,
          brandChecklists,
          checklists,
          brandContext.key,
          value,
          isBackOffice ? true : !brandContext.needs_approval
        )

        dispatch(upsertContexts(deal.id, [context]))
      } catch (e) {
        console.log(e)
      }
    },
    [brandChecklists, brandContexts, checklists, deal, dispatch, isBackOffice]
  )

  const getDealContext = useCallback(
    (name: string) => getContext(deal, name),
    [deal]
  )

  const App = useCallback(
    props => {
      if (!module) {
        return null
      }

      return module.default({
        ...props,
        Components: {
          Logo,
          RoleForm: DealRoleForm,
          RoleCard,
          ContactRoles,
          Wizard: {
            QuestionWizard,
            QuestionSection,
            QuestionTitle,
            QuestionForm
          }
        }
      })
    },
    [module]
  )

  return (
    <Dialog open fullWidth maxWidth={manifest?.size ?? 'md'}>
      <DialogTitle onClose={onClose}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{manifest.name}</Typography>

          {development && module && (
            <Tooltip title="Reload" placement="top-start">
              <IconButton onClick={loadChunk}>
                <SvgIcon path={mdiReload} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        {module ? (
          <App
            models={{
              deal,
              user,
              roles,
              attributeDefs
            }}
            utils={{
              notify
            }}
            api={{
              getDealContext,
              updateDealContext
            }}
          />
        ) : (
          <CircularProgress />
        )}
      </DialogContent>
    </Dialog>
  )
}
