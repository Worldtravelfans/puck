class UserController < ApplicationController
    skip_before_filter :verify_authenticity_token
    def index
        render json: User.all, layout: nil, status: 200 
    end

    def destroy
      user = User.find(params[:id])
      if user
        result = user.delete
        if (result)
          render json: {success: true}
        else
          render json: {success: false, message: "Unknown Error deleting user."}
        end
      else
        render json: {success: false, message: "Could not find user."}
      end
    end

    def create
        user = User.where(device_identifier: params[:device_identifier]).first
        if (user != nil)
            if user_params[:data].class == String
              updated_user = eval(user_params[:data])
            else
              updated_user = user_params[:data]
            end
            user.data = updated_user.merge user.data
            user.data = user.data.update updated_user #/ not working???
            user.save!
        else
            user = User.create! user_params
        end
        if user.valid?
          user.last_access_time = DateTime.now
          user.save!
          render json: {success: true, id: user.id}, status: 200
        else
            render json: {success: false, message: "Error creating adding user."}, status: 500
        end
    end

   private
   def user_params
     params.permit(:device_model, :device_identifier, :data).tap do |wl|
         wl[:data] = params[:data]
     end
   end
end
