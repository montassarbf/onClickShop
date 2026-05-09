import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/** Quick-contact form section on the Landing page. */
const ContactSection: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleQuickSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
    setNote("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="min-h-[50vh] bg-gray-100 px-6 py-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* Left: heading + full contact page link */}
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            <span className="text-orange-400">Contact</span> us
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We are here to help with orders, returns, or anything about Onclick Shop.
            Use the quick form or open the full contact page.
          </p>
          <button
            type="button"
            className="btn btn-outline border-orange-400 text-orange-500 hover:bg-orange-50"
            onClick={() => navigate("/contact")}
          >
            Full contact page
          </button>
        </div>

        {/* Right: quick send form */}
        <form
          onSubmit={handleQuickSend}
          className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 space-y-4"
        >
          {submitted && (
            <p className="text-sm text-green-600">Thanks — we will get back to you.</p>
          )}

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Message</label>
            <textarea
              required
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none resize-y"
              placeholder="Brief message…"
            />
          </div>

          <button
            type="submit"
            className="btn w-full bg-orange-500 hover:bg-orange-600 text-white border-0"
          >
            Send
          </button>
        </form>

      </div>
    </section>
  );
};

export default ContactSection;
