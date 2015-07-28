class AddDeviceModelToUsers < ActiveRecord::Migration
  def change
    add_column :users, :device_model, :string
  end
end
