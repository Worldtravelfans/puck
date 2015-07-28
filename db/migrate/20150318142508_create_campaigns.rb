class CreateCampaigns < ActiveRecord::Migration
  def change
    create_table    :campaigns do |t|
        t.datetime  :begin_date
        t.datetime  :end_date
        t.string    :lat
        t.string    :lon
        t.text      :hash_tags, array: true, default: []
        t.string    :intro_text
        t.string    :promo_text
        t.timestamps
    end
    add_column :campaigns, :image, :oid
  end
end

