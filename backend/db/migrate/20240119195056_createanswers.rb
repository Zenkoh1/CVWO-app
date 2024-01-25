class Createanswers < ActiveRecord::Migration[7.1]
  def change
    create_table :answers do |t|
      t.references :question, null: false, foreign_key: true
      t.references :author, index: true, null: false, foreign_key: {to_table: :users, on_delete: :cascade}
      t.text :content

      t.timestamps
    end
    #add_foreign_key :answers, :users, column: :author_id
  end
end
