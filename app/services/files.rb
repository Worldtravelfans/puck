module Files
  class FileFromString
    def self.call(string, type = 'application/jpeg')
      file = FilelessIO.new(string)
      file.original_filename = SecureRandom.urlsafe_base64 + '.jpeg'
      file.content_type = type

      return file
    end

  end

  class FileFromBase64
    def self.call(string, type = 'application/jpeg')
      file = FilelessIO.new(Base64.decode64(string))
      file.original_filename = SecureRandom.urlsafe_base64 + '.jpeg'
      file.content_type = type

      return file
    end
  end

end