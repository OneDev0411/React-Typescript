// Branch.js
import { useState } from 'react'

import * as BranchSDK from 'branch-sdk-rechat'
import idx from 'idx'
import { useDispatch, useSelector } from 'react-redux'
import { browserHistory, withRouter } from 'react-router'
import { useDeepCompareEffect } from 'react-use'

import { selectUser } from 'selectors/user'

import publicConfig from '../../../../config/public'
import { lookUpUserByEmail } from '../../../models/user/lookup-user-by-email'
import Loading from '../../Partials/Loading'

import ConflictModal from './components/ConflictModal'
import NeedsToLoginModal from './components/NeedsToLoginModal'
import VerifyRedirectModal from './components/VerifyRedirectModal'
import redirectHandler from './helpers/redirectHandler'

const branchKey = publicConfig.branch.key

const Branch = ({ location }) => {
  const dispatch = useDispatch()
  const loggedInUser = useSelector(selectUser)

  const [activeModal, setActiveModal] = useState(null)
  const [branchData, setBranchData] = useState(null)
  const [content, setContent] = useState(<Loading />)
  const waitingForRedirect = Object.keys(location.query).includes(
    'waitingForRedirect'
  )

  useDeepCompareEffect(() => {
    if (activeModal) {
      const { name, params } = activeModal

      switch (name) {
        case 'CONFLICT':
        case 'SHADOW_CONFLICT':
        case 'PROTECTED_RESOURCE':
          setContent(<ConflictModal params={params} />)
          break
        case 'VERIFIED':
        case 'VERIFYING_CONFLICT':
          setContent(<VerifyRedirectModal type={name} params={params} />)
          break
        case 'NEEDS_TO_LOGIN':
          setContent(<NeedsToLoginModal params={params} />)
          break
        default:
          break
      }
    } else if (!branchData) {
      BranchSDK.init(
        branchKey,
        {
          retries: 30,
          retry_delay: 3000
        },
        async (err, data) => {
          if (err) {
            console.log('Init - error', err, data)
            browserHistory.push('/oops')
          }

          if (idx(data, d => d.data_parsed.action)) {
            let userInfo = null

            if (data.data_parsed.email) {
              try {
                userInfo = await lookUpUserByEmail(data.data_parsed.email)
              } catch (error) {
                console.log(error)
              }
            }

            setBranchData({
              ...data.data_parsed,
              userInfo
            })
          } else {
            console.log('Init - success but with corrupted data', data)
          }
        }
      )
    } else if (!waitingForRedirect) {
      const { userInfo, action } = branchData

      if (action) {
        if (action === 'ShareTemplateInstance') {
          browserHistory.push({ pathname: '/share', state: branchData })
        } else if (action.includes('Verification')) {
          let email_confirmed
          let phone_confirmed

          if (userInfo) {
            email_confirmed = userInfo.email_confirmed
            phone_confirmed = userInfo.phone_confirmed
          }

          const { email_code, phone_code } = branchData

          if (
            (email_code && !email_confirmed) ||
            (phone_code && !phone_confirmed)
          ) {
            redirectHandler('VERIFY', branchData, loggedInUser, setActiveModal)
          } else {
            setActiveModal({
              name: 'VERIFIED',
              params: {
                userInfo,
                verificationType: phone_code ? 'phone number' : 'email address'
              }
            })
          }
        } else {
          redirectHandler(
            branchData.action || 'OTHER', // userLogin
            branchData,
            loggedInUser, // false
            setActiveModal,
            dispatch
          )
        }
      } else {
        console.log('last oops in last else', branchData)
        browserHistory.push('/oops')
      }
    }
  }, [branchData, activeModal])

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {content}
    </div>
  )
}

export default withRouter(Branch)
