class Api::V1::AnswersController < ApplicationController
  before_action :set_answer, only: %i[ show update destroy ]

  # GET /answers
  def index
    @answers = Answer.all

    render json: @answers.as_json(include: [:author, :get_likes])
  end

  # GET /answers/1
  def show
    render json: @answer.as_json(include: [:author, :get_likes])
  end

  # POST /answers
  def create
    @answer = Answer.new(answer_params)

    if @answer.save
      render json: @answer, status: :created, location: api_v1_answer_url(@answer)
    else
      render json: @answer.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /answers/1
  def update
    if @answer.update(answer_params)
      render json: @answer
    else
      render json: @answer.errors, status: :unprocessable_entity
    end
  end

  # DELETE /answers/1
  def destroy
    @answer.destroy!
  end

  def upvote
    @answer = Answer.find(params[:id])
    if not params.has_key?(:user_id)
      render json: {error: "No user_id provided"}, status: :unprocessable_entity
    else
      @user = User.find(params[:user_id])
      if @answer.voted_on_by? @user
        @answer.unliked_by @user
      else
        @answer.liked_by @user
      end
      render json: @answer
    end
  end

  def upvote_info
    @answer = Answer.find(params[:id])
    if params.has_key?(:user_id)
      @user = User.find(params[:user_id])
      @is_upvoted = @answer.voted_on_by? @user
    else
      @is_upvoted = false
    end
    render json: {is_upvoted: @is_upvoted, upvote_count: @answer.get_likes.size}
  end

  
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_answer
      @answer = Answer.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def answer_params
      params.require(:answer).permit(:question_id, :author_id, :content)
    end
end
