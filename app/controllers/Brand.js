// Brand.js
import AppDispatcher from '../dispatcher/AppDispatcher'
import AppStore from '../stores/AppStore'
import merge from 'merge'
class Brand {
  constructor() {
    this.checkBranding()
  }

  color(name, def) {
    let brand = AppStore.data.brand
    if (!brand)
      return def

    do {
      const palette = brand.palette

      if (palette && palette[name])
        return palette[name].replace('#', '')

      brand = brand.parent
    } while (brand)

    return def
  }

  asset(name, def) {
    let brand = AppStore.data.brand
    if (!brand)
      return def

    do {
      const assets = brand.assets

      if (assets && assets[name])
        return assets[name]

      brand = brand.parent
    } while (brand)

    return def
  }

  message(name, def) {
    let brand = AppStore.data.brand
    if (!brand)
      return def

    do {
      const messages = brand.messages

      if (messages && messages[name])
        return messages[name]

      brand = brand.parent
    } while (brand)

    return def
  }

  checkBranding() {
    if (typeof window === 'undefined')
      return

    const hostname = window.location.hostname
    AppDispatcher.dispatch({
      action: 'get-branding',
      hostname
    })
  }

  flatten(brand) {
    if (!brand)
      return null
    let new_brand = { ...brand }
    const brands = [new_brand]
    while (new_brand.parent) {
      brands.push(new_brand.parent)
      new_brand = new_brand.parent
    }
    brands.reverse()
    const merged = {}
    brands.forEach((brand_loop) => {
      merge.recursive(merged, brand_loop)
    })
    return merged
  }
}

const b = new Brand()

export default b