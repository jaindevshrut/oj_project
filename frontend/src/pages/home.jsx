import React from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background with subtle blur effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 text-black">
              Welcome to <span className="border-b-4 border-black">CodeJudge</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Master your coding skills with our comprehensive online judge platform. 
              Solve problems, compete with others, and grow as a developer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/problems')}
                className="px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Solving Problems
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="px-8 py-4 bg-white text-black border-2 border-black rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-black">
            Why Choose CodeJudge?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg border-2 border-black hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Diverse Problems</h3>
              <p className="text-gray-700 leading-relaxed">
                From beginner-friendly challenges to advanced algorithms. 
                Practice data structures, dynamic programming, and more.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg border-2 border-black hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Real-time Execution</h3>
              <p className="text-gray-700 leading-relaxed">
                Test your code instantly with our powerful online compiler. 
                Support for multiple programming languages.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg border-2 border-black hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">AI-Powered Review</h3>
              <p className="text-gray-700 leading-relaxed">
                Get intelligent feedback on your solutions. 
                Learn best practices and optimize your code.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-16 text-black">Join Our Community</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8">
              <div className="text-4xl font-bold text-black mb-2">1000+</div>
              <div className="text-gray-600 font-medium">Problems Available</div>
            </div>
            <div className="p-8">
              <div className="text-4xl font-bold text-black mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Solutions Submitted</div>
            </div>
            <div className="p-8">
              <div className="text-4xl font-bold text-black mb-2">10K+</div>
              <div className="text-gray-600 font-medium">Active Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Coding?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers improving their skills every day. 
            Start your coding journey with us today!
          </p>
          <button 
            onClick={() => navigate('/auth')}
            className="px-8 py-4 bg-white text-black rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home