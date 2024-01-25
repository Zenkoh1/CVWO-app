class UpdateForeignKey < ActiveRecord::Migration[7.1]
  def change
    remove_foreign_key :answers, :questions 
    add_foreign_key :answers, :questions, on_delete: :cascade
  end
end
