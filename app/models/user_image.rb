class UserImage < ActiveRecord::Base
    mount_uploader :picture, PictureUploader
    reverse_geocoded_by :latitude, :longitude
    # after_validation :reverse_geocode  # auto-fetch address
end
