class AddLastAccessTimeToUsers < ActiveRecord::Migration
  def change
    add_column :users, :last_access_time, :datetime
  end
end
