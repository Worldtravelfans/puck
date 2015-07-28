class AddUserIdToUserImages < ActiveRecord::Migration
  def change
    add_column :user_images, :user_id, :integer
  end
end
