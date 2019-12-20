export default {
  canvasCss: `
  html {
    background-color: rgb(243, 243, 243);
  }

  .gjs-comp-selected[data-gjs-type=text] {
    outline-offset: 5px;
  }

  .gjs-comp-selected {
    outline-color: #0945eb !important;
  }

  .gjs-hovered {
    outline: 2px dashed #0945eb !important;
    cursor: pointer;
    outline-offset: 1px;
  }

  .gjs-hovered[data-gjs-type=text] {
    outline-offset: 5px;
  }

  .gjs-dashed *[data-highlightable] {
    outline: none;
  }`,
  height: '100%',
  allowScripts: true,
  styleManager: {
    textNoElement: '',

    sectors: [
      {
        name: 'Text',
        open: true
        //         buildProps: ['color', 'font-size']
      }
    ],

    appendTo: '.gjs-pn-views-container'
  },
  traitManager: {
    appendTo: '.gjs-pn-views-container'
  },
  blockManager: {
    appendTo: '.gjs-pn-views-container'
  }
}
