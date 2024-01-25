class CreateQuestionsTable < ActiveRecord::Migration[7.1]
  def change
    create_table :questions do |t|
      t.string :title
      t.references :author, index: true, null: false, foreign_key: {to_table: :users, on_delete: :cascade}
      t.timestamps
    end
  end
end
