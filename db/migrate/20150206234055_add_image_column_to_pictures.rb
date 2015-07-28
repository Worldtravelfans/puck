class AddImageColumnToPictures < ActiveRecord::Migration
  def change
    add_column :user_images, :picture, :oid
  end
end
