"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let tempErrors = { ...errors };
    let isValid = true;

    if (name === "name" && !value) {
      tempErrors.name = "Name is required";
      isValid = false;
    } else if (name === "name") {
      tempErrors.name = "";
    }

    if (name === "email" && !value) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      tempErrors.email = "Email is invalid";
      isValid = false;
    } else if (name === "email") {
      tempErrors.email = "";
    }

    if (name === "subject" && !value) {
      tempErrors.subject = "Subject is required";
      isValid = false;
    } else if (name === "subject") {
      tempErrors.subject = "";
    }

    if (name === "message" && !value) {
      tempErrors.message = "Message is required";
      isValid = false;
    } else if (name === "message") {
      tempErrors.message = "";
    }

    setErrors(tempErrors);
    return isValid;
  };

  const validate = () => {
    let tempErrors = { name: "", email: "", subject: "", message: "" };
    let isValid = true;

    if (!formData.name) {
      tempErrors.name = "Name is required";
      isValid = false;
    }
    if (!formData.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
      isValid = false;
    }
    if (!formData.subject) {
      tempErrors.subject = "Subject is required";
      isValid = false;
    }
    if (!formData.message) {
      tempErrors.message = "Message is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await fetch(`/api/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (!res.ok) {
          throw new Error("Failed to submit form");
        }

        const data = await res.json();
        toast.success("Message Sent successfully!");
        router.push('/')
        // Reset form fields
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } catch (error) {
        console.error("Error submitting form", error);
        toast.error("Failed to send message. Please try again.");
      }
    }

    
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 p-2 w-full border ${errors.name ? "border-red-500" : "border-green-500"} rounded-md outline-none`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 p-2 w-full border ${errors.email ? "border-red-500" : "border-green-500"} rounded-md outline-none`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject
        </label>
        <input
          type="text"
          name="subject"
          id="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`mt-1 p-2 w-full border ${errors.subject ? "border-red-500" : "border-green-500"} rounded-md outline-none`}
        />
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className={`mt-1 p-2 w-full border ${errors.message ? "border-red-500" : "border-green-500"} rounded-md outline-none`}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
        Submit
      </button>
    </form>
  );
};

export default ContactForm;
