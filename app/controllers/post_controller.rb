class PostController < ApplicationController
    def create
        user = User.where(device_identifier: post_params[:device_identifier]).first
        if (user != nil)
            Post.create! post_params.except(:device_identifier).merge(:user_id => user.id)
            render json: {success: true, user_id: user.id}, status: 200
        else
            render json: {success: false, message: "Could not find user."}, status: 500
        end
    end

    def index
        render json: Post.all, layout: nil, status: 200 
    end

   private
   def post_params
     params.permit(:data, :device_identifier, :message, :hash_tag, :user_image_id, :social_network, :campaign_id).tap do |wl|
         wl[:data] = params[:data]
         wl[:social_network] = params[:social_network].downcase
     end
   end
end
