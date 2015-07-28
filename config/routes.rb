Rails.application.routes.draw do

    get '/' => "campaign#index"

    resources :user_image
    resources :user
    get '/get_image/:id' => 'user_image#get_image'
    get '/ping_image' => 'user_image#ping_image'
    resources :error
    resources :post
    scope :campaign do
        get '/:id/image' => 'campaign#promo_image'
        get '/manage/new' => 'campaign#create_view'
        get '/manage/' => 'campaign#manage'
        post '/new' => 'campaign#create'
        post '/' => 'campaign#get'
        get '/' => 'campaign#all_active'
        delete '/:id' => 'campaign#destroy'
        get '/new/:id' => 'campaign#getById'
        put '/new/:id' => 'campaign#update'
        get '/expired' => 'campaign#expired'
      end
    get '/manage' => 'campaign#index'
    get '/users' => 'campaign#index'
    get '/posts' => 'campaign#index'
    delete '/user/:id' => 'user#destroy'

    match '/404', to: 'error#not_found', via: :all
end
