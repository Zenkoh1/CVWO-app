class MembersController < ApplicationController
    before_action :authenticate_user!

    def show
        user =  get_user_from_token
        render json: {
            message: "You have successfully authenticated",
            user: user
        }
    end

    private
    def get_user_from_token
        jwt_payload = JWT.decode(request.headers["Authorization"].split(" ")[1], Rails.application.credentials.devise[:jwt_secret_key]).first
        user = User.find(jwt_payload["sub"])
    end
end