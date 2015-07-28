class CreateErrors < ActiveRecord::Migration
  def change
    create_table :errors do |t|
        t.string :message
        t.string :device_model
        t.string :version
        t.string :build
      t.timestamps
    end
  end
end
