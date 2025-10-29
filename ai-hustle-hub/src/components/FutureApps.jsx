"use client";

const futureApps = [
    { 
        name : "AI Expense Tracker",
        description: "Track expenses, analyze spending, and get AI budget insights."
    },
    { 
        name: "AI Note Taker", 
        description: "Smart note organization with AI summarization and tagging." 
    },
    { 
        name: "AI Goal Tracker", 
        description: "Set, track, and achieve your goals with AI-driven progress insights." 
    },
];


const FutureApps = () => {
    return (
        <section id="future-apps" className="py-20 px-4 bg-gray-50">
            <h2 className="text-3xl font-bold text-center mb-12">Future Apps</h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {
                    futureApps.map((app) => (
                        <div
                          key={app.name}
                          className="border rounded-xl p-8 bg-white shadow-md text-center hover:shadow-xl transition"
                        >
                            <h3 className="text-xl font-semibold mb-4">{app.name}</h3>
                            <p className="text-gray-600">{app.description}</p>

                        </div>
                    ))
                }
            </div>
        </section>
    )
}

export default FutureApps;