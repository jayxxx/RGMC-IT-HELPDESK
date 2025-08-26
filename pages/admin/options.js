import { useState, useEffect } from 'react';

export default function OptionsAdmin() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState({ categories: [], companies: [], departments: [] });
  const [inputs, setInputs] = useState({ categories: '', companies: '', departments: '' });

  const fetchData = () => {
    ['categories','companies','departments'].forEach(type => {
      fetch(`/api/options/${type}`).then(res => res.json()).then(items => {
        setData(prev => ({ ...prev, [type]: items }));
      });
    });
  };

  useEffect(() => { if (authed) fetchData(); }, [authed]);

  const addItem = async type => {
    await fetch(`/api/options/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: inputs[type] })
    });
    setInputs(prev => ({ ...prev, [type]: '' }));
    fetchData();
  };

  const deleteItem = async (type, id) => {
    await fetch(`/api/options/${type}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchData();
  };

  if (!authed) {
    return (
      <div style={{ maxWidth: 400, margin: 'auto' }}>
        <h2>Admin Login</h2>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button onClick={() => {
          if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) setAuthed(true);
          else alert('Wrong password');
        }}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <h1>Manage Options</h1>
      {['categories','companies','departments'].map(type => (
        <div key={type} style={{ marginBottom: 20 }}>
          <h2>{type}</h2>
          <ul>
            {data[type].map(item => (
              <li key={item._id}>
                {item.name} <button onClick={() => deleteItem(type, item._id)}>Delete</button>
              </li>
            ))}
          </ul>
          <input value={inputs[type]} onChange={e => setInputs(prev => ({ ...prev, [type]: e.target.value }))} placeholder={`New ${type}`} />
          <button onClick={() => addItem(type)}>Add</button>
        </div>
      ))}
    </div>
  );
}
