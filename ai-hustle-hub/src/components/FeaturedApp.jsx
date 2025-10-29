'use client';

const FeaturedApp = () => {
    return (
        <section id="apps" className="py-20 px-4 bg-blue-50">
            <h2 className="text-3xl font-bold text-center mb-12">Featured App</h2>
            <div className="max-w-3xl mx-auto border rounded-xl p-8 bg-white shadow-lg text-center">
                <h3 className="text-2xl font-semibold mb-4">AI Hustle Task & Focus Manager</h3>
                <p className="text-gray-600 mb-6">
                     10 free tasks/day, focus timer. Paid: unlimited tasks, recurring tasks, streak tracking, cloud sync, and AI-powered scheduling.
                </p>
                <a href="#" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Try Now
                </a>
            </div>
        </section>
    );
};

export default FeaturedApp;

