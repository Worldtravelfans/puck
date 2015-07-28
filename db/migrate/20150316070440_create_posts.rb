class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
        t.string :message
        t.integer :user_id
        t.json :data
        t.string :hash_tag
        t.integer :user_image_id
        t.timestamps
    end
  end
end
