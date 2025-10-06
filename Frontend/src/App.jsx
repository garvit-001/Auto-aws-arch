import React, { useState } from 'react';
import axios from 'axios';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function App() {
  const [user_input, setUser_input] = useState('');
  const [provider, setProvider] = useState('AWS');
  const [terraformCode, setTerraformCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTerraformCode('');

    try {
      const response = await axios.post('http://localhost:5000/generate-terraform', {
        user_input,
        provider,
      });
      setTerraformCode(response.data.terraformCode);
    } catch (err) {
      setError('Error generating code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Terraform Code Generator</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Architecture Description:
          <textarea
            value={user_input}
            // {console.log("user,input", user_input}
            onChange={(e) => {setUser_input(e.target.value)}}
            placeholder="e.g., A scalable web app with EC2, RDS, and S3"
            rows={4}
            style={{ width: '100%', marginBottom: '10px' }}
            required
          />
        </label>
        <label>
          Cloud Provider:
          <select value={provider} onChange={(e) => setProvider(e.target.value)} style={{ marginBottom: '10px' }}>
            <option value="AWS">AWS</option>
            <option value="Azure">Azure</option>
            <option value="GCP">GCP</option>
          </select>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Terraform Code'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {terraformCode && (
        <div style={{ marginTop: '20px' }}>
          <h2>Generated Terraform Code:</h2>
          <SyntaxHighlighter language="hcl" style={docco}>
            {terraformCode}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}

export default App;