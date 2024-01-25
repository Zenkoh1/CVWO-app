class User < ApplicationRecord
  has_many :questions, inverse_of: 'author'
  has_many :answers, inverse_of: 'author'
  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, 
  :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist
         #:recoverable, :rememberable, :validatable,
end
