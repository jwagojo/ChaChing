function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Share Your Feedback</h1>
        <p className="text-xl text-gray-600">
          Help us improve ChaChing! Your thoughts and suggestions matter to us.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6">Tell us what you think</h2>
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
            <label className="block text-gray-700 font-medium mb-2">Email (Optional)</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Feedback Type</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option>General Feedback</option>
              <option>Bug Report</option>
              <option>Feature Request</option>
              <option>User Experience</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Your Feedback</label>
            <textarea 
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Share your thoughts, suggestions, or report any issues..."
            ></textarea>
          </div>
          <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
