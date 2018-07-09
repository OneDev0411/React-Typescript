var osm = 'open-sm';

module.exports = {
  stylePrefix: 'pn-',

  defaults: [
    {
      id: 'commands',
      buttons: [{}]
    },
    {
      id: 'views',
      buttons: [
        {
          id: osm,
          className: 'fa fa-paint-brush',
          command: osm,
          active: true,
          attributes: { title: 'Open Style Manager' }
        }
      ]
    }
  ]
}