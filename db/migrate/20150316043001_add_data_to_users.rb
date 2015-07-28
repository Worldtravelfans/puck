class AddDataToUsers < ActiveRecord::Migration
  def change
    add_column :users, :data, :json
    add_column :users, :device_identifier, :string
  end
end
