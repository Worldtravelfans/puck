
Octothorpe.module "Controllers", (Controllers, Octothorpe, Backbone, Marionette, $, _) ->
  @addInitializer ->
    Octothorpe.ActiveRouters.Campaign = new @CampaignRoutes

  class @CampaignController

    index: ->
      $(document).ready (->
        model = new Octothorpe.Models.Campaign()
        Octothorpe.wrapRegion.show new Octothorpe.Views.Manage {model}
      )

    users: ->
       $(document).ready (->
        col = new Octothorpe.Models.Users()
        col.fetch({
             success: => Octothorpe.wrapRegion.show new Octothorpe.Views.Users {users: col}
          })
        
      )

    posts: ->
       $(document).ready (->
        col = new Octothorpe.Models.Posts()
        col.fetch({
             success: => Octothorpe.wrapRegion.show new Octothorpe.Views.Posts {posts: col}
          })
        
      )




  class @CampaignRoutes extends Controllers.BaseRouter
    controller: new Controllers.CampaignController

    appRoutes:
      'manage'                                  : 'index'
      '/'                                       : 'index'
      'users'                                   : 'users'
      'posts'                                   : 'posts'
