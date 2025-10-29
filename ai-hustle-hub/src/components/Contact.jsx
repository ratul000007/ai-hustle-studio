"use client";

const Contact = () => {
    return (
        <section id="contact" className="py-20 px-4 bg-gray-50">
            <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>

            <div className="max-w-3xl mx-auto text-center space-y-6">
                <p className="text-gray-700">
                    Have questions or want to get in touch? Reach out to us!
                </p>

                <p className="text-gray-700">
                    📧 Email: <a href="mailto:newsletter@aihustlestudio.com" className="text-blue-600 hover:underline cursor-pointer">newsletter@aihustlestudio.com</a>
                </p>
                <p className="text-gray-700">
                    🌐 Follow us on social media: 
                    <a href="#" className="text-blue-600 hover:underline cursor-pointer ml-2">Facebook</a> | 
                    <a href="#" className="text-blue-600 hover:underline cursor-pointer ml-2">YouTube</a> | 
                    <a href="#" className="text-blue-600 hover:underline cursor-pointer ml-2">Instagram</a> | 
                    <a href="#" className="text-blue-600 hover:underline cursor-pointer ml-2">Twitter</a>
                </p>

                <form className="mt-8 flex flex-col ga[-4 text-left">
                    <input 
                        type="text" 
                        placeholder="Your Name"
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
                    />
                    <textarea
                        placeholder="Your Message"
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
                        rows={4}
                    ></textarea>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Contact;