class Users::SessionsController < Devise::SessionsController
    respond_to :json
    
    def respond_with(_resource, _opts = {})
        login_success && return if resource.persisted?

        login_failed
    end

    def login_success   
        render json: {
            message: "Logged in sucessfully.",
            user: current_user
        }, status: :ok
    end

    def login_failed
        render json: {
            message: "Something went wrong."
        }, status: :unprocessable_entity
    end

    def respond_to_on_destroy
        log_out_success && return if current_user

        log_out_failure

    end
    
    def log_out_success
        render json: {
            message: "Logged out sucessfully.",
        }, status: :ok
    end

    def log_out_failure
        render json: {
            message: "Something went wrong."
        }, status: :unprocessable_entity    
    end


end