Octothorpe.ActiveRouters = {}
Octothorpe.addRegions
  wrapRegion: '#js-attach-wrap'
  footerRegion: '#js-attach-footer'
  modalRegion: '#modal-container'

Octothorpe.on "start", ->
  Backbone.history.start {pushState: true}
  

Octothorpe.start()

