"use client";

const benefits = [
    { title: "Stay Focused", description: "Track your tasks and avoid distractions with focus timers." },
    { title: "AI Recommendations", description: "Get smart AI suggestions to prioritize your tasks." },
    { title: "Track Progress", description: "Monitor your streaks and productivity easily." },
    { title: "Free & Paid Plans", description: "Start free, upgrade to unlock all powerful features." },
]
const Benefits = () => {
    return (
        <section className="py-20 px-4 bg-white">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose AI Hustle Hub</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {benefits.map((b => (
                    <div key={b.title} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-2">{b.title}</h3>
                        <p className="text-gray-600">{b.description}</p>
                    </div>
                )))                
                }
            </div>
        </section>
    );
}
export default Benefits;