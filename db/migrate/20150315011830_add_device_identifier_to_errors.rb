class AddDeviceIdentifierToErrors < ActiveRecord::Migration
  def change
    add_column :errors, :device_identifier, :string
  end
end
