import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 px-4 sm:px-8 py-12">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-orange-500 mb-6"
          >
            ← Back
          </button>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Get in <span className="text-orange-400">touch</span>
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Questions about an order, a product, or a partnership? Send us a message and we will get back to you as soon as we can.
          </p>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-orange-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg></span>
              <span>support@onclickshop.example</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-orange-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone-icon lucide-phone"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg></span>
              <span>+216 20 619 233 </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-orange-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock4-icon lucide-clock-4"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>
              <span>Mon–Sat, 9:00–18:00</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          {sent && (
            <div className="mb-4 rounded-lg bg-green-50 text-green-800 text-sm px-4 py-3 border border-green-100">
              Thanks — your message has been recorded. (Connect this form to your backend when ready.)
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-y min-h-[120px]"
                placeholder="How can we help?"
              />
            </div>
            <button type="submit" className="w-full btn bg-orange-500 hover:bg-orange-600 text-white border-0 rounded-xl">
              Send message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
