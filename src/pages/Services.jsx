function Services() {
  const services = [
    {
      title: "Personal Finance",
      description: "Manage your personal finances with our comprehensive tools and insights.",
      price: "$9.99/month"
    },
    {
      title: "Business Solutions",
      description: "Scale your business with our enterprise-grade financial management platform.",
      price: "$49.99/month"
    },
    {
      title: "Investment Tracking",
      description: "Track and analyze your investment portfolio with real-time data and analytics.",
      price: "$19.99/month"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Our Services</h1>
        <p className="text-xl text-gray-600">
          Choose the perfect plan for your financial needs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-100 hover:border-orange-300 transition-colors">
            <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
            <p className="text-gray-600 mb-6">{service.description}</p>
            <div className="text-3xl font-bold text-orange-600 mb-6">{service.price}</div>
            <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors">
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
