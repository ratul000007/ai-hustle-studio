// 'use client';

// const Footer = () => {
//     return (
//         <footer id="contact" className="bg-gray-100 py-10 text-center text-gray-600">
//             <p>© 2025 AI Hustle Studio. All rights reserved.</p>
//             <p className="mt-2">
//                 Contact: <a href="mailto:newsletter@aihustlestudio.com" className="hover:text-blue-600">newsletter@aihustlestudio.com</a>
//             </p>
//             <div className="flex justify-center mt-4 space-x-4">
//                 <a href="#" className="hover:text-blue-600">Facebook</a>
//                 <a href="#" className="hover:text-blue-600">YouTube</a>
//                 <a href="#" className="hover:text-blue-600">Instagram</a>
//                 <a href="#" className="hover:text-blue-600">Twitter</a>
//             </div>
//         </footer>
//     );
// };

// export default Footer;
'use client';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        {/* Brand / Copyright */}
        <p className="text-gray-400">© 2025 AI Hustle Studio. All rights reserved.</p>

        {/* Contact */}
        <p>
          Contact:{" "}
          <a
            href="mailto:newsletter@aihustlestudio.com"
            className="text-blue-500 hover:text-blue-400 cursor-pointer transition"
          >
            newsletter@aihustlestudio.com
          </a>
        </p>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mt-2">
          {["Facebook", "YouTube", "Instagram", "Twitter"].map((platform) => (
            <a
              key={platform}
              href="#"
              className="hover:text-blue-500 transition cursor-pointer"
            >
              {platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
