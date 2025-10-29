"use client";

const Pricing = () => {
    return (
        <section id="pricing" className="py-20 px-4 bg-white">
            <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>

            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                {/* Free Plan */}
                <div className="border rounded-xl p-8 shadow-md bg-gray-50 text-center hover:shadow-lg transition">
                    <h3 className="text-2xl font-semibold mb-4">Free Plan</h3>
                    <p className="text-gray-600 mb-6">Perfect for starters and students.</p>
                    <ul className="text-left mb-6 space-y-2 text-gray-700">
                        <li>✅ Add up to 10 tasks/day</li>
                        <li>✅ Simple focus timer</li>
                        <li>✅ AI task suggestions (limited)</li>
                        <li>❌ Cloud sync</li>
                        <li>❌ Streak tracking</li>
                    </ul>
                    <button className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition cursor-pointer">
                        Get Started
                    </button>
                </div>

                {/* Pro Plan */}
                 <div className="border rounded-xl p-8 shadow-md bg-blue-50 text-center hover:shadow-lg transition">
                    <h3 className="text-2xl font-semibold mb-4">Pro Plan</h3>
                    <p className="text-gray-600 mb-6">For freelancers, creators, and focus-driven users.</p>
                    <ul className="text-left mb-6 space-y-2 text-gray-700">
                        <li>✅ Unlimited tasks</li>
                        <li>✅ Recurring tasks</li>
                        <li>✅ Cloud sync & streak tracking</li>
                        <li>✅ AI-powered scheduling</li>
                        <li>✅ Early access to future apps</li>
                    </ul>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer">
                        Upgrade to Pro
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Pricing;