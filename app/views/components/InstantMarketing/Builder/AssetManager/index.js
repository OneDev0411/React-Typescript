import EventEmitter from 'events'

import grapesjs from 'grapesjs'
import Backbone from 'backbone'
import React from 'react'
import ReactDOM from 'react-dom'

import { ImageUploader } from 'components/ImageUploader'

export default grapesjs.plugins.add('asset-blocks', editor => {
  let target

  const AssetView = Backbone.View.extend({
    events: {
      click: 'onClick'
    },
    onClick() {
      const url = this.model.get('src')

      const setSrc = () => target.set('src', url)
      const setBg = () => {
        const old = target.get('style')
        const style = { ...old }

        style['background-image'] = `url(${url})`
        target.set('style', style)
      }

      const setters = {
        image: setSrc,
        cell: setBg,
        text: setBg,
        '': setBg
      }

      const type = target.get('type')

      setters[type]()
    },
    initialize({ model }) {
      this.model = model
    },
    render() {
      this.$el.html(
        `<img src="${this.model.get(
          'src'
        )}" style="margin: 8px 3% 8px 5%; border-radius: 2px; width: 90%; cursor: pointer;"/>`
      )

      return this
    }
  })
  const ee = new EventEmitter()
  const AssetUploadButtonView = Backbone.View.extend({
    render() {
      ReactDOM.render(
        <ImageUploader
          closeHandler={console.log}
          stateChangEventEmitter={ee}
          width={300}
          height={200}
          scale={1}
          saveHandler={data => {
            console.log(data)

            const reader = new FileReader()

            reader.addEventListener(
              'load',
              () => {
                const dataURL = reader.result

                console.log(dataURL)

                const setSrc = () => target.set('src', dataURL)

                const setters = {
                  image: setSrc
                }

                const type = target.get('type')

                if (type !== 'image') {
                  return
                }

                setters[type]()
              },
              false
            )

            reader.readAsDataURL(data.file)
          }}
        />,
        this.el
      )

      return this
    }
  })

  const AssetsView = Backbone.View.extend({
    initialize({ coll }) {
      this.collection = coll
    },
    reset() {
      ee.emit('resetAndDismiss')

      this.$el.empty()

      const uploadButtonView = new AssetUploadButtonView()

      uploadButtonView.render()
      uploadButtonView.$el.appendTo(this.el)

      for (let i = 0; i < this.collection.length; i++) {
        const asset = this.collection.at(i)
        const view = new AssetView({ model: asset })

        view.render()
        view.$el.appendTo(this.el)
      }
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
