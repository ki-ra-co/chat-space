class Message < ApplicationRecord
  belongs_to :user
  belongs_to :group

  validates :content, precence: true, unless :image?
end
