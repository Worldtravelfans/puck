class AddHistoryToErrors < ActiveRecord::Migration
  def change
    add_column :errors, :history, :json
  end
end
