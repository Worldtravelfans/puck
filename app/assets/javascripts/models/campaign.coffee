
Octothorpe.module "Models", (Models, Octothorpe, Marionette, $, _) ->
  class @Campaign extends Backbone.Model
    urlRoot: -> "/campaign/new"


  class @Campaigns extends Backbone.Collection
      model: Models.Campaign
      url: -> "/campaign"