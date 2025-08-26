import { useEffect, useState } from 'react';

export default function NewTicket() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', description: '', category: '', company: '', department: '' });
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    ['categories','companies','departments'].forEach(type => {
      fetch(`/api/options/${type}`).then(res => res.json()).then(data => {
        if (type === 'categories') setCategories(data);
        if (type === 'companies') setCompanies(data);
        if (type === 'departments') setDepartments(data);
      });
    });
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('/api/tickets/createWithMeta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      alert('Ticket created!');
      setForm({ name: '', email: '', subject: '', description: '', category: '', company: '', department: '' });
    } else {
      alert('Error creating ticket');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>Create Ticket</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} required /><br/>
        <input type="email" name="email" placeholder="Your email" value={form.email} onChange={handleChange} required /><br/>
        <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required /><br/>
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required /><br/>
        
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
        </select><br/>
        
        <select name="company" value={form.company} onChange={handleChange} required>
          <option value="">Select Company</option>
          {companies.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
        </select><br/>
        
        <select name="department" value={form.department} onChange={handleChange} required>
          <option value="">Select Department</option>
          {departments.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
        </select><br/>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
