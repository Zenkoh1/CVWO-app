# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
Category.create!([{
    name: "Babies",
    desc: "For babies"
},{
    name: "Teens",
    desc: "For teens"
},{
    name: "Food",
    desc: "For questions about food"
},{
    name: "Clothes",
    desc: "For questions about clothes"
},{
    name: "Girls",
    desc: "For girls"
},{
    name: "Boys",
    desc: "For boys"
},{
    name: "Infants",
    desc: "For infants"
},
])

User.create!([{
    username: "Admin",
    email: "admin@test.com",
    password: "admin",
    admin: true
}])
