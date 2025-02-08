import React, { useState } from "react";
import "./contact-us .css";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    // Simulate form submission success
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="contact-container">
      <div className="contact-right">
        {!submitted ? (
          <>
            <h1 className="contact-title">Contact Us</h1>
            <form onSubmit={handleSubmit}>
              <input
                className="contact-input"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="contact-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                className="contact-textarea"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="5"
                required
              />
              <button type="submit" className="contact-button">Submit</button> {/* Added type="submit" */}
            </form>
          </>
        ) : (
          <div className="contact-thank-you-message">
            <h1 className="thank-you-title">Thank you for contacting us!</h1>
            <p className="thank-you-message">We will get back to you shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
