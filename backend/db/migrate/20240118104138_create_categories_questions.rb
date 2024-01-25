class CreateCategoriesQuestions < ActiveRecord::Migration[7.1]
  def change
    create_join_table :categories, :questions do |t|
      t.index :category_id
      t.index :question_id
    end
  end
end
