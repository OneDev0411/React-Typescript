import urlParser from 'url'

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import reducers from '../../../app/reducers'
import config from '../../../config/webpack'
import { getUserTeams } from '../../../app/store_actions/user/teams'
import { getBrandByHostname } from '../../../app/models/brand/get-brand-by-hostname'

import getUserProfile from '../get-user-profile'

function fetch(store, renderProps) {
  return renderProps.components.map(component => {
    if (component && component.fetchData) {
      return component.fetchData(store.dispatch, renderProps.params)
    }

    return Promise.reslove
  })
}

function sanitize(state) {
  return new Promise(resolve => {
    const newState = escape(JSON.stringify(state))

    resolve(newState)
  })
}

async function display(file, renderProps) {
  this.log('Render:::Start')

  let user
  let initialState = {
    user,
    data: {
      user
    }
  }

  try {
    this.log('Render:::getUserProfile:::Start')
    user = await getUserProfile(this.session)
    initialState = {
      user,
      data: {
        user
      }
    }
  } catch (error) {
    this.log('Render:::getUserProfile:::Error')
    console.log(error)
  } finally {
    this.log('Render:::getUserProfile:::End')
  }

  try {
    this.log('Render:::getBrandByHostname:::Start')

    const { hostname } = urlParser.parse(this.request.origin)
    const brand = await getBrandByHostname(hostname)

    initialState = {
      ...initialState,
      brand,
      // we are still depend to Flux and AppStore.data :(
      data: {
        ...initialState.data,
        brand
      }
    }
  } catch (error) {
    this.log('Render:::getBrandByHostname:::Error')
    console.log(error)
  } finally {
    this.log('Render:::getBrandByHostname:::End')
  }

  // create store
  const store = createStore(
    reducers,
    initialState,
    compose(applyMiddleware(thunk))
  )

  // append user data to render props params
  if (initialState.user) {
    try {
      this.log('Render:::getUserTeams:::Start')
      await store.dispatch(getUserTeams(initialState.user))
    } catch (e) {
      this.log('Render:::getUserTeams:::Error')
      console.log(e)

      if (e.response && e.response.status === 401) {
        console.log('Can not get user teams. signing out...')

        return this.redirect('/signout')
      }
    } finally {
      this.log('Render:::getUserTeams:::End')
    }

    renderProps.params.user = store.getState().user
  }

  try {
    this.log('Render:::fetch:::Start')
    await Promise.all(fetch(store, renderProps))
  } catch (e) {
    this.log('Render:::fetch:::Error')
    console.log(e)
  } finally {
    this.log('Render:::fetch:::End')
  }

  // get store initial data
  try {
    this.log('Render:::sanitize:::Start')

    const store_data = await sanitize(store.getState())

    if (['production', 'stage'].indexOf(process.env.NODE_ENV) > -1) {
      await this.render(file || 'app', {
        openGraph: this.state.openGraph,
        variables: this.state.variables,
        store_data
      })
    } else {
      await this.render('development', {
        store_data,
        variables: this.state.variables,
        jsBundle: `${config.compile.publicPath}/${config.compile.jsBundle}`,
        jsVendorBundle: `${config.compile.publicPath}/${config.compile.jsVendorBundle}`
      })
    }
  } catch (error) {
    this.log('Render:::sanitize:::Error')
    console.log(error)
  } finally {
    this.log('Render:::sanitize:::End')
  }

  this.log('Render:::End')
}

export default () =>
  async function render(ctx, next) {
    if (!ctx.display) {
      ctx.display = display.bind(ctx)
    }

    return next()
  }
