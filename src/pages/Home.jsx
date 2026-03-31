import { useState } from 'react';
import { createAccount, getDomains } from '../api/mailtmp';

export const Home = () => {
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      const domains = await getDomains();
      if (!domains || domains.length === 0) {
        alert('Not found availible domains');
        return;
      }
      const domain = domains[0].domain;
      const randomLogin = 'user' + Math.random().toString(36).substring(2, 8);
      const fullAddress = `${randomLogin}@${domain}`;
      const password = 'Pass' + Math.random().toString(36).substring(2, 10);
      console.log('Try to create: ', { address: fullAddress, password });

      const newAcc = await createAccount(fullAddress, password);

      setAccount(newAcc.address);
      alert('Email has created:' + newAcc.address);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Random Email Generator</h1>

      {account ? (
        <div className="email-box">
          <h2>Your temporary email: </h2>
          <code>{account.address}</code>
          <p>Password (save him): {account.password}</p>
        </div>
      ) : (
        <p>Press any button, to create a new email</p>
      )}

      <button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Create a random email'}
      </button>
    </div>
  );
};
