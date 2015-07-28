class AddRadiusToCampaign < ActiveRecord::Migration
  def change
    add_column :campaigns, :radius, :integer
  end
end
