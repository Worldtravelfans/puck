class MigrateUserImageDataToNewColumns < ActiveRecord::Migration
  def change
    UserImage.where("lat IS NOT NULL AND latitude IS NULL").each do |img|
        img.latitude = img.lat
        img.longitude = img.lon
        img.save!
    end
    Campaign.where("lat IS NOT NULL AND latitude IS NULL").each do |img|
        img.latitude = img.lat
        img.longitude = img.lon
        img.save!
    end
    remove_column :user_images, :lat
    remove_column :user_images, :lon
    remove_column :campaigns, :lat
    remove_column :campaigns, :lon
  end
end
