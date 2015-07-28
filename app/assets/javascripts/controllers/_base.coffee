Octothorpe.module "Controllers", (Controllers, RP, Backbone, Marionette, $, _) ->
  class @BaseRouter extends Backbone.Marionette.AppRouter
    navigate: (fragment, options) ->

      super(arguments...)

