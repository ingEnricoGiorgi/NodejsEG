    // Profilo utente con token JWT
    // Funzione base64 decoder compatibile
    function parseJwt(token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join('')
        );
        return JSON.parse(jsonPayload);
      } catch (e) {
        return null;
      }
    }

    // Carica info utente
    fetch('/api/user-info', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Non autorizzato');
        //  otteniamo il token direttamente (solo se backend lo fornisce)
        return res.json();
      })
      .then(data => {
        document.getElementById('info').innerText =
          `Benvenuto ${data.username}, il tuo ID è ${data.id}`;

        //  Otteniamo il token decodificato dal backend
        if (data.token) {
          const decoded = parseJwt(data.token);
          startCountdown(decoded.exp);
        }
      })
      .catch(() => {
        window.location.href = '/login.html';
      });

function startCountdown(exp) {
  const countdown = document.getElementById('countdown');
  const interval = setInterval(() => {
    const now = Math.floor(Date.now() / 1000);
    const secondsLeft = exp - now;

    if (secondsLeft <= 0) {
      clearInterval(interval);
      countdown.innerText = 'Token scaduto';

      //Logout anche lato server
      fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      }).finally(() => {
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 1000);
      });

    } else {
      const m = Math.floor(secondsLeft / 60);
      const s = secondsLeft % 60;
      countdown.innerText = `Token valido per: ${m}m ${s}s`;
    }
  }, 1000);
}


    function logout() {
      fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      }).then(() => {
        window.location.href = '/login.html';
      });
    }
