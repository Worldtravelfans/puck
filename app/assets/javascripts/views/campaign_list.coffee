Octothorpe.module "Views", (Modals, Octothorpe, Backbone, Marionette, $, _) ->
  class @CampaignList extends Backbone.Marionette.ItemView
    template: JST['campaign_list']

    events:
      'click .js-delete'  :      'delete'
      'click .js-edit'    :        'update'

    initialize: (data)->
      @campaigns = data.campaigns

    templateHelpers: ->
      return {campaigns: @campaigns}

    delete: (e)->
      id = e.target.id
      console.log("deleting #{id}")
      @requestDelete(id)
      @clearRow(id)

    update: (e)->
      id = parseInt(e.target.id)
      console.log("updating #{id}")
      campaign = new Octothorpe.Models.Campaign
      c = _.findWhere(@campaigns, {id: id})
      campaign.set(c)
      Octothorpe.wrapRegion.show new Octothorpe.Views.EditCampaign {model: campaign}
      
      

    requestDelete: (id)->
      $.ajax
        type: 'DELETE'
        url: "/campaign/#{id}"
        success: (response) =>
          console.log(response)
          @clearRow(id) unless !response.success

    clearRow: (id)->
      $("#campaign-"+id).fadeOut();








