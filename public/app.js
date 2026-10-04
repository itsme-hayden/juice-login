const form = document.getElementById('loginForm');
const message = document.getElementById('message');

function validateLogin(email, password) {
  if (!email.trim() || !password.trim()) return 'Both fields are required.';
  if (!email.includes('@')) return 'Email must contain @.';
  if (password.length < 8) return 'Password must have at least 8 characters.';
  return '';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const error = validateLogin(email, password);
  if (error) {
    message.textContent = error;
    return;
  }
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    // User-controlled email is rendered as text, never as executable HTML.
    message.textContent = result.message;
  } catch {
    message.textContent = 'Could not reach the server.';
  }
});
