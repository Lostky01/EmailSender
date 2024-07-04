// frontend/src/components/EmailForm.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmailForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachment: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('content', formData.content);
    data.append('attachment', formData.attachment);

    // i used 2 local servers for bettter compatibility
    const response = await fetch('http://localhost:5000/send-email', {
      method: 'POST',
      body: data,
    });

    const result = await response.json();
    console.log(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </div>
      <div>
        <label>Content:</label>
        <textarea name="content" value={formData.content} onChange={handleChange}></textarea>
      </div>
      <div>
        <label>Attachment:</label>
        <input type="file" name="attachment" onChange={handleFileChange} />
      </div>
      <button type="submit">Send Email</button>
    </form>
  );
};

export default EmailForm;
