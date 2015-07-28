class AddLatitudeAndLongitudeToUserImages < ActiveRecord::Migration
  def change
    add_column :user_images, :latitude, :float
    add_column :user_images, :longitude, :float
  end
end
