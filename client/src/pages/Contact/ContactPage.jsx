import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import './ContactPage.css';

const faqs = [
  {
    q: 'What is your average delivery time?',
    a: 'We pride ourselves on our 30–40 minute delivery guarantee. If your order takes longer due to weather or traffic, our live tracker will keep you updated in real-time.',
  },
  {
    q: 'Do you offer contactless delivery?',
    a: 'Yes! Simply mention "Contactless delivery" in the special instructions field during checkout, and our delivery rider will safely leave your order at your doorstep.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We currently accept Cash on Delivery (COD) as well as direct card payments upon delivery with our mobile POS machines.',
  },
  {
    q: 'Are your pizzas 100% Halal and fresh?',
    a: 'Absolutely. All our meat toppings and ingredients are 100% certified Halal, inspected daily, and prepared in strictly hygienic kitchens.',
  },
  {
    q: 'Can I customize my pizza toppings or crust?',
    a: 'Yes, our kitchen accommodates special requests! Add your preferred modifications in the checkout notes, or contact our support team directly.',
  },
];

const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you! Your message has been sent. We'll reply within 24 hours.");
      setForm({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="contact-page">
      <section className="page-hero">
        <div className="container">
          <span className="hero-tag" style={{ background: 'rgba(230, 57, 70, 0.2)', color: 'var(--orange)', padding: '6px 16px', borderRadius: 20, display: 'inline-block', marginBottom: 12, fontSize: 13, fontWeight: 700 }}>
            WE WOULD LOVE TO HEAR FROM YOU
          </span>
          <h1>Get In Touch With Us</h1>
          <p>Have questions, feedback, or catering inquiries? Our support team is ready to assist you.</p>
        </div>
      </section>

      <div className="container contact-container">
        {/* Info Cards */}
        <div className="contact-cards-grid">
          <div className="card contact-info-card">
            <div className="contact-card-icon"><Phone size={24} /></div>
            <h3>Call Us</h3>
            <p className="card-desc">Direct hotline for fast orders &amp; support</p>
            <strong className="contact-detail">+92 (021) 111-749-924</strong>
            <span className="contact-sub">Toll-free 24/7</span>
          </div>

          <div className="card contact-info-card">
            <div className="contact-card-icon"><Mail size={24} /></div>
            <h3>Email Support</h3>
            <p className="card-desc">For general inquiries and corporate orders</p>
            <strong className="contact-detail">support@pizzahub.com</strong>
            <span className="contact-sub">Response within 2 hours</span>
          </div>

          <div className="card contact-info-card">
            <div className="contact-card-icon"><MapPin size={24} /></div>
            <h3>Headquarters</h3>
            <p className="card-desc">Flagship Kitchen &amp; Experience Center</p>
            <strong className="contact-detail">Block 5, Clifton, Karachi</strong>
            <span className="contact-sub">Sindh, Pakistan</span>
          </div>

          <div className="card contact-info-card">
            <div className="contact-card-icon"><Clock size={24} /></div>
            <h3>Working Hours</h3>
            <p className="card-desc">Oven hot and ready every day</p>
            <strong className="contact-detail">11:00 AM – 02:00 AM</strong>
            <span className="contact-sub">Monday through Sunday</span>
          </div>
        </div>

        {/* Contact Form & FAQ */}
        <div className="contact-split-grid">
          <div className="card form-card">
            <h2>Send Us a Message</h2>
            <p className="form-sub">We value your thoughts and reply quickly.</p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sarah Jenkins"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="sarah@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Order question, catering, feedback..."
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  className="form-input"
                  rows={5}
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ width: '100%' }}>
                {submitting ? (
                  <><div className="spinner spinner-sm" /> Sending...</>
                ) : (
                  <><Send size={18} /> Send Message</>
                )}
              </button>
            </form>
          </div>

          <div className="faq-wrap">
            <h2>Frequently Asked Questions</h2>
            <p className="faq-sub">Quick answers to common questions about our delivery and pizzas.</p>

            <div className="faq-list">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className={`card faq-item ${isOpen ? 'open' : ''}`}>
                    <button
                      className="faq-question-btn"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown size={18} className={`faq-arrow ${isOpen ? 'rotated' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="faq-answer">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
