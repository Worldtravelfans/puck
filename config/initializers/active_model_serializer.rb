ActiveModel::Serializer.root = false
ActiveModel::ArraySerializer.root = false

class SerializerBase < ActiveModel::Serializer  
  def created_at; object.created_at.to_f * 1000; end
  def updated_at; object.updated_at.to_f * 1000; end
end