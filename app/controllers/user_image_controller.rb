class UserImageController < ApplicationController
    skip_before_filter :verify_authenticity_token
    def index

    end

    def create
      puts "Image Uploading..."
      image_string = params[:data].split(',').last
      file_upload = Files::FileFromBase64.call(image_string)
      location_data = extractLocation image_string

      user_id = nil
      user = User.where(device_identifier: params[:device_identifier]).first
      user_id = user.id unless !user

      if (location_data)
        image = UserImage.create! picture: file_upload, latitude: location_data[:location][:latitude], longitude: location_data[:location][:longitude], camera_model: location_data[:camera_model], user_id: user_id
      else
        image = UserImage.create! picture: file_upload, latitude: params[:latitude], longitude: params[:longitude], camera_model: params[:camera_model], user_id: user_id
      end
      puts "Image Uploaded!"
      render json: {success: true, user_image_id: image.id}, layout: nil, status: 200
    end

    def ping_image
      img = UserImage.last
      if img
        img_data = {
                  id: img.id,
                  camera_model: img.camera_model,
                  location: {latitude: img.latitude, longitude: img.longitude},
                  taken_on: img.created_at
              }
        render json: img_data, layout: nil, status: 200
      else
        render json: {}, layout: nil, status: 200
      end
    end

    def get_image
      img = UserImage.where(:id => params[:id]).first
      if (img != nil)
        # img_string = Base64.encode64(img.picture.read)
        send_data img.picture.read, type: 'image/jpeg', :disposition => 'inline'
      else
        render text: "No Image Found", layout: nil, status: 200
      end
    end

    def extractLocation imageString
      begin
          file = Tempfile.new('picture')
          File.open(file,"wb") {|f| f.write Base64.decode64(imageString) }
          img =  EXIFR::JPEG.new(file.path)

          img_data = {
                camera_model: img.model,
                location: {latitude: img.gps.latitude, longitude: img.gps.longitude},
                taken_on: img.date_time
            }
      rescue Exception => e
        puts "Location Could not be retrieved from image."
        puts e
        nil
      end
    end
end
