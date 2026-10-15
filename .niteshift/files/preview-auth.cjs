const { writeFile } = require('node:fs/promises');
const { setTimeout: delay } = require('node:timers/promises');

async function main() {
  const stateFile = process.env.NITESHIFT_AUTH_STATE_FILE;
  if (!stateFile) throw new Error('NITESHIFT_AUTH_STATE_FILE is required');

  // Use the existing local demo login through the same proxy as the browser.
  // These are the public fixture credentials in public/server/sessions-create.php.
  const url = 'http://localhost:3000/php-server/sessions-create.php?user_name=admin&user_password=admin';
  let token;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch(url, { method: 'POST', signal: AbortSignal.timeout(5000) });
      const result = await response.json();
      if (!response.ok || result.code !== 200 || !result.data?.token) {
        throw new Error('Demo login rejected');
      }
      token = result.data.token;
      break;
    } catch {
      if (attempt === 29) throw new Error('Local demo login did not become ready');
      await delay(1000);
    }
  }

  // Middleware reads the cookie; AuthProvider restores its session from localStorage.
  await writeFile(stateFile, JSON.stringify({
    cookies: [{
      name: 'SITE_DATA_LOGIN_COOKIE',
      value: token,
      domain: 'localhost',
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60,
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    }],
    origins: [{
      origin: 'http://localhost:3000',
      localStorage: [{ name: 'SITE_DATA_AUTH', value: JSON.stringify({ token }) }],
    }],
  }), { mode: 0o600 });
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
