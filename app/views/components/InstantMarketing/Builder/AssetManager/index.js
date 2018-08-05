import grapesjs from 'grapesjs'
import Backbone from 'backbone'

export default grapesjs.plugins.add('asset-blocks', editor => {
  let target
  const AssetView = Backbone.View.extend({
    events: {
      click: 'onClick'
    },
    onClick() {
      const url = this.model.get('src')

      const setSrc = () => target.set('src', url)
      const setBg  = () => {
        const old = target.get('style')
        const style = { ...old }
        style['background-image'] = `url(${url})`
        target.set('style', style)
      }

      const setters = {
        image: setSrc,
        cell:  setBg,
        text:  setBg
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
        )}" style="margin: 16px 5% 0 5%; border-radius: 5px; width: 90%; cursor: pointer;"/>`
      )

      return this
    }
  })

  const AssetsView = Backbone.View.extend({
    initialize({ coll }) {
      this.collection = coll
    },
    reset() {
      this.$el.empty()

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
    const type = selected.get('type')

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
