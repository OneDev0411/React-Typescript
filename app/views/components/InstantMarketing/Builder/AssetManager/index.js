import grapesjs from 'grapesjs'
import Backbone from 'backbone'
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import { Uploader } from 'components/Uploader'

import { AssetImage } from './AssetImage'

import Fetch from '../../../../../services/fetch'

const CUSTOM_ASSET_UPLOAD_PATH = '/templates/assets'

export default grapesjs.plugins.add('asset-blocks', editor => {
  let target

  const getStorageData = async key =>
    new Promise(res => {
      editor.StorageManager.load(key, data => res(data))
    })

  const AssetView = Backbone.View.extend({
    initialize({ model }) {
      this.model = model
    },
    render() {
      ReactDOM.render(
        <AssetImage model={this.model} target={target} />,
        this.el
      )

      return this
    }
  })

  const AssetUploadButtonView = Backbone.View.extend({
    render() {
      ReactDOM.render(
        <Uploader
          accept="image/*"
          uploadHandler={async files => {
            const { templateId } = await getStorageData('templateId')

            try {
              const uploadResponses = await Promise.all(
                files.map(file =>
                  new Fetch()
                    .upload(CUSTOM_ASSET_UPLOAD_PATH)
                    .attach('attachment', file, file.name)
                    .field('template', templateId)
                )
              )

              const uploadedAssets = uploadResponses.map(response => ({
                previewUrl: response.body.data.file.preview_url,
                url: response.body.data.file.url
              }))

              const uploadedAssetsCollection = uploadedAssets.map(asset => ({
                image: asset.url,
                userFile: true
              }))

              view.collection.reset([
                ...uploadedAssetsCollection,
                ...view.collection.models
              ])
            } catch (e) {
              console.error(e)
            }
          }}
        >
          <Fragment>Click or drop images here</Fragment>
        </Uploader>,
        this.el
      )

      return this
    }
  })

  const AssetsView = Backbone.View.extend({
    initialize({ coll }) {
      this.collection = coll
      this.listenTo(this.collection, 'reset', this.reset)
    },
    reset() {
      this.$el.empty()

      const uploadButtonView = new AssetUploadButtonView()

      uploadButtonView.render()
      uploadButtonView.$el.appendTo(this.el)

      if (!target) {
        return false
      }

      let collection = []

      const type = target.attributes.attributes['rechat-assets']

      if (type === 'listing-image') {
        collection = this.collection.filter(asset => {
          const listing = target.attributes.attributes['rechat-listing']

          return !listing || asset.attributes.listing === listing
        })
      }

      if (type === 'avatar') {
        collection = this.collection.filter(
          asset => asset.attributes.userFile || asset.attributes.avatar
        )
      }

      collection.forEach(asset => {
        const view = new AssetView({ model: asset })

        view.render()
        view.$el.appendTo(this.el)
      })
    },
    render: () => this
  })

  const view = new AssetsView({
    coll: editor.AssetManager.getAll()
  })

  view.render()
  view.$el.hide()

  const pn = editor.Panels
  const id = 'views-container'
  const panels = pn.getPanel(id) || pn.addPanel({ id })

  editor.on('load', () => {
    panels.set('appendContent', view.$el).trigger('change:appendContent')
  })

  editor.on('component:selected', selected => {
    const attributes = selected.get('attributes')

    if (!attributes || !attributes['rechat-assets']) {
      view.$el.hide()

      return false
    }

    target = selected
    view.reset()
    view.$el.show()
  })
})
