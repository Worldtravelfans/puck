class CampaignController < ApplicationController
    def get
        radius = (Campaign.maximum(:radius) || 200) / 1609.34
        results = Campaign.near([location_params[:latitude], location_params[:longitude]], radius).where("begin_date <= ? AND end_date >= ?", Date.today, Date.today)
        campaign = results.first #unless results.first.distance_to([location_params[:latitude], location_params[:longitude]]) <= results.first.radius
        render json: campaign, layout:nil, status: 200     
    end

    def getById
      render json: Campaign.find(campaign_params[:id])
    end

    def all_active
      render json: Campaign.where("begin_date <= ? AND end_date >= ?", Date.today, Date.today).to_json
    end

    def expired
      render json: Campaign.where("end_date < ?", Date.today).to_json
    end

    def destroy
      campaign = Campaign.where(:id => params[:id]).first
      if campaign
        result = campaign.delete
        if (result)
          render json: {success: true}
        else
          render json: {success: false, message: "Unknown Error deleting campaign."}
        end
      else
        render json: {success: false, message: "Could not find campaign."}
      end
    end

    def promo_image
      campaign = Campaign.where(:id => params[:id]).first
      if (campaign != nil)
        send_data campaign.image.read, type: 'image/jpeg', :disposition => 'inline'
      else
        render text: "No Image Found", layout: nil, status: 200
      end
    end

    def index

    end

    def manage 

    end


    def create
      campaign = Campaign.create! campaign_params

      if campaign.valid?
        render json: {success: true, campaign_id: campaign.id}, layout: nil, status: 200
      else
        render json: {success: false, error: "Could not create campaign"}, layout: nil, status: 500
      end
    end

    def update
      campaign = Campaign.find campaign_params[:id]
      campaign.update!(campaign_params)

      if campaign.valid?
        render json: {success: true, campaign_id: campaign.id}, layout: nil, status: 200
      else
        render json: {success: false, error: "Could not create campaign"}, layout: nil, status: 500
      end
    end

  private
  def campaign_params
    params.permit(:id, :image, :hash_tags, :begin_date, :end_date, 
                  :latitude, :longitude, :radius, :intro_text, :promo_text, :userId).tap do |wl|
        wl[:image] = convert_image params[:image]
        wl[:hash_tags] = params[:hash_tags]
        wl[:required_social_networks] = params[:required_social_networks]
    end
  end

  def location_params
    params.permit(:latitude, :longitude)
  end

  def convert_image image_data
      puts "Image Uploading..."
      if image_data && image_data.length > 0
        image_string = image_data.split(',').last
        Files::FileFromBase64.call(image_string)
      end
  end


end