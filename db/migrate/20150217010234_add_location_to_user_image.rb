class AddLocationToUserImage < ActiveRecord::Migration
  def change
    add_column :user_images, :lat, :string
    add_column :user_images, :lon, :string
  end
end
