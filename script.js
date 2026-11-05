// Interações discretas e QR Code da própria página.
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-ready');
  // Animações progressivas respeitando a preferência de acessibilidade.
  const elements = document.querySelectorAll('.reveal');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    elements.forEach(el => observer.observe(el));
  }

  const area = document.getElementById('qr-code');
  const message = document.getElementById('qr-message');
  const button = document.getElementById('download-qr');
  if (window.location.protocol === 'file:') {
    message.textContent = 'O QR Code aparecerá quando o site estiver publicado.';
    return;
  }

  const url = new URL(window.location.href);
  url.search = ''; url.hash = '';
  const makeQr = () => {
    if (typeof QRCode === 'undefined') {
      message.textContent = 'Não foi possível carregar o gerador de QR Code. Confira sua conexão.';
      return;
    }
    new QRCode(area, { text: url.href, width: 200, height: 200, colorDark: '#173c55', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H });
    button.hidden = false;
    button.addEventListener('click', () => {
      const canvas = area.querySelector('canvas');
      const img = area.querySelector('img');
      const data = canvas?.toDataURL('image/png') || img?.src;
      if (!data) return;
      const link = document.createElement('a');
      link.href = data;
      link.download = 'qr-code-carla-enrique.png';
      document.body.append(link); link.click(); link.remove();
    });
  };
  // O script externo tem defer e pode carregar depois deste arquivo.
  if (typeof QRCode !== 'undefined') makeQr();
  else window.addEventListener('load', makeQr, { once: true });
});
