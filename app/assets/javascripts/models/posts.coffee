
Octothorpe.module "Models", (Models, Octothorpe, Marionette, $, _) ->
  class @Post extends Backbone.Model
    urlRoot: -> "/post"


  class @Posts extends Backbone.Collection
      model: Models.Post
      url: -> "/post"