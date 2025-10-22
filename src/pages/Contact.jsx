function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <p className="text-xl text-gray-600">
          Get in touch with our team - we'd love to hear from you
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea 
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Your message..."
              ></textarea>
            </div>
            <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors">
              Send Message
            </button>
          </form>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-8">
          <h3 className="text-xl font-semibold mb-6">Get in touch</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Email</h4>
              <p className="text-gray-600">support@chaching.com</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Phone</h4>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Address</h4>
              <p className="text-gray-600">123 Finance Street<br />Money City, MC 12345</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Business Hours</h4>
              <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
