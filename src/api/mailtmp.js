const BASE_URL = 'https://api.mail.tm';

// GET Domains
export const getDomains = async () => {
  const response = await fetch(`${BASE_URL}/domains`);
  const data = await response.json();

  return data['hydra:member'];
};

// POST Create account
export const createAccount = async (address, password) => {
  const response = await fetch(`${BASE_URL}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, password }),
  });

  return response.json();
};

export const login = async (address, password) => {
  const response = await fetch(`${BASE_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, password }),
  });

  const data = await response.json();
  return data.token;
};

export const getMessages = async (token) => {
  console.log('Отправляю запрос за письмами с токеном:', token.substring(0, 10) + '...');
  const response = await fetch(`${BASE_URL}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  console.log('Ответ сервера (полный):', data); // ПОСМОТРИМ, ЧТО ТАМ
  return data['hydra:member'];
};
