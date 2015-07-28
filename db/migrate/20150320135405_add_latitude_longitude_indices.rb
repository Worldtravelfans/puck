class AddLatitudeLongitudeIndices < ActiveRecord::Migration
  def change
    add_index :campaigns, [:latitude, :longitude]
    add_index :user_images, [:latitude, :longitude]
  end
end
