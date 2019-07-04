import { ReactElement, ReactNode, useState } from 'react'
import { connect } from 'react-redux'

import { IAppState } from 'reducers/index'

import { importGoogleContacts } from 'models/contacts/import-google-contacts'

import { startImportingGoogleContacts } from './helpers'

interface RenderProps {
  connecting: boolean
  connect: (event: MouseEvent) => void
}
interface Props {
  user: IUser
  googleAccounts: IGoogleAccount[]
  children: (renderProps: RenderProps) => ReactElement<any>
}

/**
 * A render prop component for adding google accounts.
 * If we were using latest versions of redux so that we could use redux hooks
 * this could be a simple hook with {connect, connecting} return value,
 * instead of a render prop component
 * @param props
 * @constructor
 */
function ConnectGoogleButton(props: Props) {
  const [connecting, setConnecting] = useState(false)

  const connect = async () => {
    const url = (await importGoogleContacts()).url

    setConnecting(true)

    startImportingGoogleContacts(props.googleAccounts)

    window.location.href = url
  }

  return props.children({ connecting, connect })
}

export default connect(({ contacts: { googleAccounts } }: IAppState) => ({
  googleAccounts
}))(ConnectGoogleButton)
