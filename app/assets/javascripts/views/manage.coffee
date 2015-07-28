Octothorpe.module "Views", (Modals, Octothorpe, Backbone, Marionette, $, _) ->
  class @Manage extends Backbone.Marionette.LayoutView
    template: JST['manage']
    className: 'manage'
    regions:
      campaignListRegion: "#js-attach-campaign-list"
      activeCampaignListRegion: "#js-attach-campaign-list-expired"

    events: 
      'click .js-create'  :      'showCreate'

    initialize: ->
      @campaigns = []
      @expired = []
      @fetchCampaigns()
      @fetchExpiredCampaigns()

    onDomRefresh: ->
      if @campaigns.length 
        @campaignListRegion.show new Octothorpe.Views.CampaignList {campaigns: @campaigns}
      if @expired.length
        @activeCampaignListRegion.show new Octothorpe.Views.CampaignList {campaigns: @expired}

    fetchCampaigns: ->
      $.ajax
        type: 'GET'
        url: '/campaign'
        success: (response) =>
          @campaigns = _.sortBy(response, 'begin_date') 
          # @render()

    fetchExpiredCampaigns: ->
      $.ajax
        type: 'GET'
        url: '/campaign/expired'
        success: (response) =>
          @expired = _.sortBy(response, 'begin_date') 
          @render()

    showCreate: ->
      Octothorpe.wrapRegion.show new Octothorpe.Views.EditCampaign {model: new Octothorpe.Models.Campaign}
      false