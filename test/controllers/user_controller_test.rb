require 'test_helper'

class UserControllerTest < ActionController::TestCase
  test "should get UserImage" do
    get :UserImage
    assert_response :success
  end

end
