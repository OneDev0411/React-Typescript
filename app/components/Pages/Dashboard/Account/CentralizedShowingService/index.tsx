import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import Flex from 'styled-flex-component'
import { Helmet } from 'react-helmet'

import { addNotification, Notification } from 'components/notification'

import { CSSInput, CSSData } from 'models/css/types'
import connectCSS from 'models/css/connect'
import getCSS from 'models/css/get'
import disconnectCSS from 'models/css/disconnect'

import IconCircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import FormCard from 'components/FormCard'

import Header from './Header'
import Description from './Description'
import Connect from './Connect'
import Disconnect from './Disconnect'

import { CSSLogo, LoadingContainer } from './styled'

import { MARKET_LOCATIONS } from './constants'

interface FormInputData {
  username: string
  password: string
  market: string
}

function getCSSInput({
  username,
  password,
  market: selected_location
}: FormInputData): CSSInput {
  return {
    username,
    password,
    selected_location,
    selected_location_string: MARKET_LOCATIONS.find(
      market => market.value === selected_location
    )!.label
  }
}

interface Props {
  notify: (notification: Notification) => any
}

function CentralizedShowingService({ notify }: Props) {
  const [loading, setLoading] = useState<boolean>(true)
  const [cssData, setCSSData] = useState<CSSData | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const responseData = await getCSS()

        setCSSData(responseData)
      } catch (err) {
        // ignore if it's 404
        // it means it's not connected yet
        if (err.status !== 404) {
          console.error(err)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  async function connectHandler(rawData: any): Promise<void> {
    setLoading(true)

    try {
      const data: FormInputData = {
        username: rawData.username,
        password: rawData.password,
        market: rawData.market
      }

      const cssInput: CSSInput = getCSSInput(data)

      const connectedCSS = await connectCSS(cssInput)

      setCSSData(connectedCSS)
    } catch (err) {
      if (err.status === 403) {
        notify({
          status: 'error',
          message: 'The username or password is incorrect.'
        })
      }

      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function disconnectHandler(): Promise<void> {
    setLoading(true)

    try {
      await disconnectCSS()
      setCSSData(null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const title = `${cssData ? 'Disconnect' : 'Connect'} your CSS account`

  return (
    <>
      <Helmet>
        <title>Centralized Showing Service | Settings | Rechat</title>
      </Helmet>
      <Header />
      <Description />
      <FormCard title={title}>
        <Flex alignCenter column>
          <CSSLogo alt="css" src="/static/images/account/css/logo.png" />
          {loading && (
            <LoadingContainer>
              <IconCircleSpinner style={{ width: '5rem', height: '5rem' }} />
            </LoadingContainer>
          )}
          {!loading && cssData && (
            <Disconnect onDisconnect={disconnectHandler} />
          )}
          {!loading && !cssData && (
            <Connect
              marketLocations={MARKET_LOCATIONS}
              onSubmit={connectHandler}
            />
          )}
        </Flex>
      </FormCard>
    </>
  )
}

export default connect(null, { notify: addNotification })(
  CentralizedShowingService
)
