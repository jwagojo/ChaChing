function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About ChaChing</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're revolutionizing the way people manage their finances with cutting-edge technology and user-friendly solutions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            To make financial management accessible, simple, and powerful for everyone. We believe that everyone deserves the tools to achieve financial success.
          </p>
          <p className="text-gray-600">
            Founded in 2024, ChaChing has been at the forefront of financial technology innovation, serving thousands of customers worldwide.
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-100 to-purple-100 rounded-lg p-8">
          <h3 className="text-2xl font-semibold mb-4">Why Choose Us?</h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
              Expert team with 10+ years experience
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
              24/7 customer support
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
              Award-winning platform
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;
