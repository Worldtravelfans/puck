class AddRequiredSocialNetworksToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :required_social_networks, :json
  end
end
