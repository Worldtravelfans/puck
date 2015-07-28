Octothorpe.module "Views", (Modals, Octothorpe, Backbone, Marionette, $, _) ->
  class @Users extends Backbone.Marionette.ItemView
    template: JST['users']

    events:
      'click .js-delete'  :      'delete'

    initialize: (data)->
      @users = data.users || []
      console.log(@users)

    templateHelpers: ->
      return {users: @users}

    delete: (e)->
      id = e.target.id
      console.log("deleting #{id}")
      @requestDelete(id)
      @clearRow(id)


    requestDelete: (id)->
      $.ajax
        type: 'DELETE'
        url: "/user/#{id}"
        success: (response) =>
          console.log(response)
          @clearRow(id) unless !response.success

    clearRow: (id)->
      $("#user-"+id).fadeOut();








