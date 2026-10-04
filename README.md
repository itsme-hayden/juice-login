# Juice Shop Login Homework

A basic login-style form to iterate on OWASP Juice Shop's login. Both sides reject blank values, emails without `@`, and passwords shorter than eight characters.

This is a validation demonstration, not a complete authentication system. It does not store passwords, query a database, issue sessions, or grant access to accounts. A 200 response means only that validation passed.

## Run

Install Node.js, open a terminal in this folder, and run:

```sh
npm start
```

Open http://localhost:3000. No npm packages need installing. Stop with Ctrl+C. Do not open index.html directly: the server is needed for /api/login.

## Validation checks

Try empty fields, an email without @, and a seven-character password. Each should show an error. Try student@example.com and TestPass123: validation should pass without logging you into an account.

To bypass the browser and check server validation, open the browser console and run:

```js
fetch('/api/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email: 'not-an-email', password: 'short'})
}).then(async r => console.log(r.status, await r.json()));
```

Expected: HTTP 400 and a validation error.

## Part 3: attempted XSS

1. Start the server and open the page.
2. Enter this exact payload in Email:

```html
<img src=x onerror=alert('XSS')>@example.com
```

3. Enter TestPass123 in Password and click Log in.
4. The payload satisfies the assignment's simple validation checks and reaches the server. The expected response is validation passed, with the payload displayed literally and no alert.
5. Screenshot the page showing the literal payload and result. Inspect the message element: it should contain text, not an img element. Record your actual observation.

The defense is message.textContent. Changing it to innerHTML would interpret the image tag and potentially execute its onerror handler. Do not apply that change to the submitted version. Checking for @ alone does not prevent XSS.

This single failed test does not prove the application is free of all vulnerabilities. SQL injection is not a meaningful test here because there is no SQL database.

