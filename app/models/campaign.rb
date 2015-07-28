class Campaign < ActiveRecord::Base
    mount_uploader :image, PictureUploader
    reverse_geocoded_by :latitude, :longitude

    def city_state
      return unless latitude && longitude
      coord = to_coordinates
      key = "/coord/#{coord}"
      Rails.cache.fetch(key) do
        puts "caching with key #{key}"
        result = Geocoder.search(coord).first
        result.city + ", "  + result.state
      end
    end

    def as_json(options={})
        super.as_json(options).merge({:city_state => city_state})
    end
end