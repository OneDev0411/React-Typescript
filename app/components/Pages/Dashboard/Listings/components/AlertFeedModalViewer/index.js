import React, { Component } from 'react'
import AlertViewerModal from './components/Modal'
import getFeed from '../../../../../../models/listings/alerts/get-alert-feed'

export default class AlertViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      feed: null,
      loading: false
      // updated_at: '',
      // loadMoreLoading: false
    }

    // this.loadMoreFeed = this.loadMoreFeed.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { show } = nextProps
    const { feed } = this.state

    if (show === true && feed == null) {
      this.getAlertFeed()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { loading } = this.state

    if (loading === true && loading === nextState.loading) {
      return false
    }

    return true
  }

  async getAlertFeed() {
    if (this.state.loading) {
      return false
    }

    let feed
    const { alert: { id: alertId, room: roomId } } = this.props

    // set loading
    this.setState({ ...this.state, loading: true })
    this.props.onChangeLoading(true)

    try {
      const response = await getFeed(alertId, roomId)
      feed = response[alertId]
    } catch (error) {
      console.log(error)
    }

    this.setState({
      feed,
      loading: false
    })

    this.props.onChangeLoading(false)
  }

  // async getAlertFeed() {
  //   if (this.state.loading) {
  //     return false
  //   }

  //   let updated_at
  //   let { feed } = this.state
  //   const { alert } = this.props

  //   // set loading
  //   this.setState({ loading: true })
  //   this.props.onChangeLoading(true)

  //   try {
  //     const response = await api.getFeed(alert.id, alert.room)
  //     const { data, info } = response
  //     // updated_at = data[data.length - 1].updated_at

  //     feed = {
  //       data,
  //       total: info.total
  //     }
  //   } catch (e) {
  //     /* nothing */
  //   }

  //   this.setState({
  //     feed,
  //     updated_at,
  //     loading: false
  //   })

  //   this.props.onChangeLoading(false)
  // }

  // async loadMoreFeed() {
  //   if (this.state.loadMoreLoading) {
  //     return false
  //   }

  //   const { alert } = this.props
  //   let { feed, updated_at } = this.state

  //   if (!alert || !updated_at) {
  //     return false
  //   }

  //   // set loading
  //   this.setState({ loadMoreLoading: true })

  //   try {
  //     const response = await api.getFeed(alert.id, alert.room, updated_at)
  //     const { data } = response
  //     updated_at = data[data.length - 1].updated_at
  //     feed = {
  //       ...feed,
  //       data: [...feed.data, ...data]
  //     }
  //   } catch (e) {
  //     /* nothing */
  //   }

  //   this.setState({
  //     feed,
  //     updated_at,
  //     loadMoreLoading: false
  //   })
  // }

  onHide() {
    this.props.onHide()

    this.setState({
      feed: null
    })
  }

  render() {
    const { feed, loading } = this.state
    const { show } = this.props

    return (
      <AlertViewerModal
        feed={feed}
        onHide={() => this.onHide()}
        show={show === true && !loading && feed != null}
      />
    )
  }
}
