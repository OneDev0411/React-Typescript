import React, { useCallback, useRef, useState } from 'react'

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
import { useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'
import * as ReactUse from 'react-use'
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
import {
  changeNeedsAttention,
  changeTaskStatus,
  upsertContexts,
  deleteRole,
  updateRole
} from '@app/store_actions/deals'
import { AgentsPicker } from '@app/views/components/AgentsPicker'
import { normalizeForm } from '@app/views/components/DealRole/helpers/normalize-form'
import { DialogTitle } from '@app/views/components/DialogTitle'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import DatePicker from 'components/DatePicker'
import DealRoleForm from 'components/DealRole/Form'
import Logo from 'components/Logo'
import {
  QuestionWizard,
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'
import { useSectionErrorContext } from 'components/QuestionWizard/hooks/use-section-error-context'
import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { useReduxDispatch } from 'hooks/use-redux-dispatch'

import Message from '../../../Chatroom/Util/message'
import useNotificationBadgesContext from '../../../SideNav/notificationBadgesContext/useNotificationBadgesContext'
import { ContactRoles } from '../../Create/components/ContactRoles'
import { isPrimaryAgent } from '../../utils/roles'
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
  const { reload: reloadNotificationBadges } = useNotificationBadgesContext()
  const app = useRef<any>(null)
  const [module, setModule] = useState<any>(null)
  const [debugVersion, setDebugVersion] = useState(Math.random())
  const [manifest, setManifest] = useState<Partial<Manifest>>({})

  const notify = useNotify()
  const dispatch = useReduxDispatch()

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

        const version = Math.random()

        setManifest(manifest)

        const chunkUrl = development
          ? `${baseUrl}/bundle.js?v=${version}`
          : `${baseUrl}/bundle.${manifest.build}.js`

        const url = development
          ? chunkUrl
          : `${
              new URL(window.location.href).origin ?? ''
            }/api/apps?url=${chunkUrl}`

        const module = await import(/* webpackIgnore: true */ url)

        setModule(module)
        setDebugVersion(version)
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
      MaterialUi,
      ReactUse
    }

    return () => {
      window.libs = undefined
    }
  })

  const notifyOffice = useCallback(
    async (attentionRequest: boolean = true, comment: string = '') => {
      if (comment && user) {
        Message.postTaskComment(task, {
          comment,
          author: user.id,
          room: task.room.id
        })
      }

      await dispatch(changeNeedsAttention(deal.id, task.id, attentionRequest))
      reloadNotificationBadges()
    },
    [user, dispatch, deal.id, task, reloadNotificationBadges]
  )

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

  const deleteDealRole = useCallback(
    async (role: IDealRole) => {
      if (isPrimaryAgent(role.role, deal.deal_type)) {
        return null
      }

      try {
        dispatch(deleteRole(deal.id, role.id))

        return true
      } catch (e) {
        console.log(e)

        return null
      }
    },
    [deal, dispatch]
  )

  const updateDealRole = useCallback(
    async (data: Partial<IDealRole>) => {
      try {
        dispatch(updateRole(deal.id, normalizeForm(data)))

        return true
      } catch (e) {
        console.log(e)

        return null
      }
    },
    [deal, dispatch]
  )

  const updateTaskStatus = useCallback(
    async (
      status: 'Approved' | 'Declined' | 'Incomplete',
      attentionRequest: Nullable<boolean> = null,
      comment: string = ''
    ) => {
      if (comment && user) {
        Message.postTaskComment(task, {
          comment,
          author: user.id,
          room: task.room.id
        })
      }

      try {
        if (attentionRequest !== null) {
          await dispatch(
            changeNeedsAttention(deal.id, task.id, attentionRequest)
          )
          reloadNotificationBadges()
        }

        if (status) {
          await dispatch(changeTaskStatus(task.id, status))
        }
      } catch (e) {
        console.log(e)
      }
    },
    [user, task, dispatch, deal.id, reloadNotificationBadges]
  )

  const App = useCallback(
    props => {
      if (!module) {
        return null
      }

      if (app.current?.version === debugVersion) {
        return React.cloneElement(app.current.bundle, props)
      }

      app.current = {
        version: debugVersion,
        bundle: module.default({
          ...props,
          hooks: {
            wizard: {
              useSectionContext,
              useWizardContext,
              useSectionErrorContext
            }
          },
          Components: {
            Logo,
            RoleForm: DealRoleForm,
            RoleCard,
            ContactRoles,
            AgentsPicker,
            DatePicker,
            Wizard: {
              QuestionWizard,
              QuestionSection,
              QuestionTitle,
              QuestionForm
            }
          }
        })
      }

      return app.current.bundle
    },
    [module, debugVersion]
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
              notify,
              isBackOffice
            }}
            api={{
              notifyOffice,
              getDealContext,
              updateDealContext,
              updateTaskStatus,
              deleteRole: deleteDealRole,
              updateRole: updateDealRole,
              close: onClose
            }}
          />
        ) : (
          <CircularProgress />
        )}
      </DialogContent>
    </Dialog>
  )
}
