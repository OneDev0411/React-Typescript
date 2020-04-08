import nunjucks from 'nunjucks'
import flattenBrand from 'utils/flatten-brand'

export const BRAND_STYLES_TEMPLATE = `{% if get('body-font-family') %}
  <mj-font name="{{get('body-font-family')}}" href="https://fonts.googleapis.com/css?family={{get('body-font-family')}}"></mj-font>
{% endif %}

{% if get('container-font-family') %}
  <mj-font name="{{get('container-font-family')}}" href="https://fonts.googleapis.com/css?family={{get('container-font-family')}}"></mj-font>
{% endif %}

{% if get('h1-font-family') %}
  <mj-font name="{{get('h1-font-family')}}" href="https://fonts.googleapis.com/css?family={{get('h1-font-family')}}"></mj-font>
{% endif %}

{% if get('h2-font-family') %}
  <mj-font name="{{get('h2-font-family')}}" href="https://fonts.googleapis.com/css?family={{get('h2-font-family')}}"></mj-font>
{% endif %}

{% if get('h3-font-family') %}
  <mj-font name="{{get('body-font-family')}}" href="https://fonts.googleapis.com/css?family={{get('h3-font-family')}}"></mj-font>
{% endif %}

{% if get('button-font-family') %}
  <mj-font name="{{get('button-font-family')}}" href="https://fonts.googleapis.com/css?family={{get('button-font-family')}}"></mj-font>
{% endif %}

<mj-attributes>
  <mj-body
    background-color="{{get('body-bg-color')}}"
  />
  <mj-class
    name="body"
    background-color="{{get('body-bg-color')}}"
    color="{{get('body-text-color')}}"
    font-family="{{get('body-font-family')}}"
    font-weight="{{get('body-font-weight')}}"
    font-size="{{get('body-font-size')}}"
  />
  <mj-class
    name="container"
    background-color="{{get('container-bg-color')}}"
    color="{{get('container-text-color')}}"
    font-family="{{get('container-font-family')}}"
    font-weight="{{get('container-font-weight')}}"
    font-size="{{get('container-font-size')}}"
  />
  <mj-class
    name="inverted-container"
    background-color="{{get('inverted-container-bg-color')}}"
    color="{{get('inverted-container-text-color')}}"
  />
  <mj-class
    name="h1"
    color="{{get('h1-text-color')}}"
    font-family="{{get('h1-font-family')}}"
    font-weight="{{get('h1-font-weight')}}"
    font-size="{{get('h1-font-size')}}"
  />
  <mj-class
    name="inverted-h1"
    color="{{get('inverted-h1-text-color')}}"
  />
  <mj-class
    name="h2"
    color="{{get('h2-text-color')}}"
    font-family="{{get('h2-font-family')}}"
    font-weight="{{get('h2-font-weight')}}"
    font-size="{{get('h2-font-size')}}"
  />
  <mj-class
    name="inverted-h2"
    color="{{get('inverted-h2-text-color')}}"
  />
  <mj-class
    name="h3"
    color="{{get('h3-text-color')}}"
    font-family="{{get('h3-font-family')}}"
    font-weight="{{get('h3-font-weight')}}"
    font-size="{{get('h3-font-size')}}"
  />
  <mj-class
    name="inverted-h3"
    color="{{get('inverted-h3-text-color')}}"
  />
  <mj-class
    name="light"
    color="{{get('light-text-color')}}"
    font-family="{{get('light-font-family')}}"
    font-weight="{{get('light-font-weight')}}"
    font-size="{{get('light-font-size')}}"
  />
  <mj-class
    name="inverted-light"
    color="{{get('inverted-light-text-color')}}"
  />
  <mj-button
    background-color="{{get('button-bg-color')}}"
    color="{{get('button-text-color')}}"
    font-family="{{get('button-font-family')}}"
    border="{{get('button-border')}}"
    font-weight="{{get('button-font-weight')}}"
    font-size="{{get('button-font-size')}}"
  />
  <mj-button
    name="inverted-button"
    background-color="{{get('inverted-button-bg-color')}}"
    color="{{get('inverted-button-text-color')}}"
  />
</mj-attribues>
`

export function getBrandStyles(brand, get) {
  const brandData = flattenBrand(brand)
  return nunjucks.renderString(BRAND_STYLES_TEMPLATE, { brand: brandData, get })
}
