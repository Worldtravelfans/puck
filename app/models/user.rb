class User < ActiveRecord::Base
    has_many :posts

    def post_counts
        h = {}
        posts = Post.where(:user_id =>  self.id).pluck(:social_network)
        posts.each do |p|
            h[p] = h[p] ||= 0
            h[p] = h[p] += 1
        end
        h
    end
    def as_json(options={})
        super.as_json(options).merge({:post_counts => post_counts})
    end
end
