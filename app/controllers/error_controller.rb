class ErrorController < ApplicationController
    skip_before_filter :verify_authenticity_token

    def create 
        Error.create! error_params
        render json: {success: true}, status: 200
    end

    def not_found

    end

  private
  def error_params
    params.permit(:message, :device_model, :verison, :build, :device_identifier, :history).tap do |wl|
        wl[:history] = params[:history]
    end
  end

end

