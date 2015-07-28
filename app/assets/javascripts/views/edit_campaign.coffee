Octothorpe.module "Views", (Modals, Octothorpe, Backbone, Marionette, $, _) ->
  class @EditCampaign extends Backbone.Marionette.LayoutView
    template: JST['edit_campaign']
    events: 
      'click .js-submit'       : 'submit'
      'click .js-reset'        : 'reset'
      'change .js-file-upload' : 'upload'
      # 'keydown  input'         : 'inputChanged'

    initialize: (data) ->
      @model = data.model
      

    setFields: ->
      $('#promo-text').val(@model.get('promo_text'))
      sn = @model.get("required_social_networks")

      console.log(sn)

      $('#facebook').attr("checked", _.contains(sn, "facebook"))
      $('#twitter').attr("checked", _.contains(sn, "twitter"))

      @latitude = @model.get("latitude") ||  41.8804534
      @longitude = @model.get("longitude") || -87.6289166

      console.log @model

    clearFields: ->
      $('input').val("")

    inputChanged: (e)->
      console.log(e)
      if e.keyCode == 13
        e.preventDefault();

    templateHelpers: ->
      return {model: @model, isTwitterSelected: true}

    onDomRefresh: ->
      @setFields()
      @initLocationPicker()
      

    reset: ->
      console.log 'reset'
      @model = new Octothorpe.Models.Campaign()
      @clearFields()

    upload: (e)->
      console.log ("image uploading")
      file = e.target.files[0]
      reader = new FileReader

      reader.onloadend = (event) =>
        console.log("Image uploaded")
        @fileData = event.target.result
        console.log @fileData
        return

      reader.readAsDataURL file



    submit: (e) ->
      params = $('form').formParams()

      social_networks = []
      if params["twitter_checked"]
        social_networks.push "twitter"
      if params["facebook_checked"]
        social_networks.push "facebook"

      
      params["latitude"] = @latitude
      params["longitude"] = @longitude
      params["required_social_networks"] = social_networks
      params["hash_tags"] = params["hash_tags"].split(';')
      params["image"] = @fileData

      console.log params


      @model.save params,
        success: =>
          console.log ("saved campaign")
          alert("campaign saved")
        error: (e)=>
          console.log (e)
          alert("Failed to save Campaign")


    initLocationPicker: ->
      $('.js-location-picker').locationpicker
        location:
          latitude: @latitude
          longitude: @longitude
        radius: @model.get('radius')
        enableAutocomplete: true
        inputBinding:
          radiusInput: $('#js-radius')
          locationNameInput: $('#js-address')
        onchanged: (currentLocation, radius, isMarkerDropped) =>
          console.log currentLocation
          @latitude = currentLocation.latitude
          @longitude = currentLocation.longitude
          @radius = radius
          return


