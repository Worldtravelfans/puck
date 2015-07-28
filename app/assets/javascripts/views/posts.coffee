Octothorpe.module "Views", (Modals, Octothorpe, Backbone, Marionette, $, _) ->
  class @Posts extends Backbone.Marionette.ItemView
    template: JST['posts']

    events:
      'click .js-delete'  :      'delete'

    initialize: (data)->
      @posts = data.posts || []
      console.log(@posts)

    templateHelpers: ->
      return {posts: @posts}

    delete: (e)->
      id = e.target.id
      console.log("deleting #{id}")
      @requestDelete(id)
      @clearRow(id)


    requestDelete: (id)->
      $.ajax
        type: 'DELETE'
        url: "/post/#{id}"
        success: (response) =>
          console.log(response)
          @clearRow(id) unless !response.success

    clearRow: (id)->
      $("#post-"+id).fadeOut();








