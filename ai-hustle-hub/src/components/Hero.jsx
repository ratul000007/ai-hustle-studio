'use client';

const Hero = () => {
    return (
        <section id="home" className="bg-blue-50 py-32 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-700">
                Boost Your Productivity with AI
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-700">
                Manage tasks, stay focused, and achieve more with AI-powered tools.
            </p>
            <a 
                href="#apps"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
                Explore Apps
            </a>
        </section>
    )
}

export default Hero;