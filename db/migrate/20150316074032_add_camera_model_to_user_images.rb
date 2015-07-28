class AddCameraModelToUserImages < ActiveRecord::Migration
  def change
    add_column :user_images, :camera_model, :string
  end
end
