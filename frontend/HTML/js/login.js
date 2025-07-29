    const form = document.getElementById('loginForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(this);

      fetch('/api/login', {
        method: 'POST',
        body: new URLSearchParams(formData),
        credentials: 'include'
      })
        .then(res => {
          if (res.redirected) {
            window.location.href = res.url;
          } else if (res.status === 401) {
            document.getElementById('error').innerText = 'Credenziali errate';
          } else {
            document.getElementById('error').innerText = 'Errore imprevisto';
          }
        })
        .catch(() => {
          document.getElementById('error').innerText = 'Errore di rete';
        });
    });
