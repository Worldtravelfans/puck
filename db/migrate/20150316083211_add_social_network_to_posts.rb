class AddSocialNetworkToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :social_network, :string
  end
end
