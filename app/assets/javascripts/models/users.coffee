
Octothorpe.module "Models", (Models, Octothorpe, Marionette, $, _) ->
  class @User extends Backbone.Model
    urlRoot: -> "/user"


  class @Users extends Backbone.Collection
      model: Models.User
      url: -> "/user"