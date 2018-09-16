import urlParser from 'url'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from '../../../app/reducers'
import config from '../../../config/webpack'
import getBrand from '../../../app/models/brand'
import getTeams from '../../../app/store_actions/user/teams'

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
  let initialState = {
    user: this.session.user,
    data: {
      user: this.session.user
    }
  }

  try {
    const { hostname } = urlParser.parse(this.request.origin)
    const brand = await getBrand(hostname)

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
    console.log(error)
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
      await store.dispatch(getTeams(initialState.user))
    } catch (e) {
      if (e.response && e.response.status === 401) {
        console.log('Can not get user teams. signing out...')

        return this.redirect('/signout')
      }
    }

    renderProps.params.user = {
      ...store.getState().user,
      activeTeam: this.cookie['rechat-active-team'] || null
    }
  }

  try {
    await Promise.all(fetch(store, renderProps))
  } catch (e) {
    /* do nothing */
  }

  // get store initial data
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
      jsVendorBundle: `${config.compile.publicPath}/${
        config.compile.jsVendorBundle
      }`
    })
  }
}

export default () =>
  async function render(ctx, next) {
    if (!ctx.display) {
      ctx.display = display.bind(ctx)
    }

    return next()
  }
