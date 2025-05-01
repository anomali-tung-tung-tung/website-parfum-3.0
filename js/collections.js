document.addEventListener('DOMContentLoaded', () => {
    const aromaCards = document.querySelectorAll('.aroma-card');
  
    aromaCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
      });
  
      card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.07)';
      });
    });
  });  