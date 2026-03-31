import { useEffect, useState } from 'react';
import { createAccount, getDomains, getMessages, login } from '../api/mailtmp';

export const Home = () => {
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!token) return;

    const checkEmail = async () => {
      console.log('--> Check email...');
      try {
        const msgList = await getMessages(token);
        console.log('<-- response', msgList?.length);
        setMessages(msgList || []);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    checkEmail();

    const interval = setInterval(checkEmail, 5000);

    return () => {
      console.log('Clear interaval');
      clearInterval(interval);
    };
  }, [token]);

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      const domains = await getDomains();

      if (!domains || domains.length === 0) {
        alert('Домены не найдены');
        return;
      }

      const domain = domains[0].domain;
      const randomLogin = 'user' + Math.random().toString(36).substring(2, 10);
      const fullAddress = `${randomLogin}@${domain}`;
      const password = 'Pass' + Math.random().toString(36).substring(2, 12);

      const newAcc = await createAccount(fullAddress, password);

      const authToken = await login(fullAddress, password);

      setToken(authToken);
      setAccount(newAcc);

      setIsLoading(false);
    } catch (error) {
      console.error('Error generate:', error);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Random Email Generator</h1>

      {account ? (
        <div
          className="email-box"
          style={{
            background: '#222',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
          }}>
          <h2>Your email:</h2>
          <code style={{ fontSize: '1.2rem', color: '#4daafc' }}>{account.address}</code>
          <p>Passowrd: {account.password}</p>
        </div>
      ) : (
        <p>Press button to create email</p>
      )}

      <button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generaing' : 'Create a new email'}
      </button>

      <hr style={{ margin: '30px 0', opacity: 0.2 }} />

      <div className="inbox">
        <h3>Inbox ({messages.length})</h3>
        {messages.length === 0 ? (
          <p>No letters yet. Send a test email to the address above!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {messages.map((msg) => (
              <li
                key={msg.id}
                style={{
                  background: '#333',
                  margin: '10px 0',
                  padding: '10px',
                  borderRadius: '5px',
                }}>
                <strong>From: {msg.from.address}</strong>
                <p>Message: {msg.intro}</p>
                <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
