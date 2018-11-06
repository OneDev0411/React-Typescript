export default {
  canvasCss: `
  .gjs-comp-selected[data-gjs-type=text] {
    outline-offset: 5px;
  }

  .gjs-comp-selected {
    outline-color: #003bdf !important;
  }

  .gjs-hovered {
    outline: 2px dashed #003bdf !important;
    cursor: pointer;
    outline-offset: 1px;
  }

  .gjs-hovered[data-gjs-type=text] {
    outline-offset: 5px;
  }
  `,
  height: '100%',
  styleManager: {
    textNoElement: '',

    sectors: [
      {
        name: 'Color',
        open: true,
//         buildProps: ['background-color', 'color']
      }
    ],

    appendTo: '.gjs-pn-views-container'
  },
  traitManager: {
    appendTo: '.gjs-pn-views-container'
  },
  panels: {
    stylePrefix: 'pn-',
    defaults: [
      {
        id: 'commands',
        buttons: [{}]
      },

    ]
  }
}
