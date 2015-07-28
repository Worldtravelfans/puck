class Post < ActiveRecord::Base
    belongs_to :user
    has_one :user_image
end