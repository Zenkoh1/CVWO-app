class Question < ApplicationRecord
  
  belongs_to :author,
    class_name: "User",
    foreign_key: :author_id
  has_and_belongs_to_many :categories
  has_many :answers, dependent: :destroy
end
