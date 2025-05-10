document.addEventListener('DOMContentLoaded', () => {
  // Hamburger menu functionality
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      
      // Toggle hamburger animation
      const bars = this.querySelectorAll('.bar');
      if (this.classList.contains('active')) {
          bars[0].style.transform = 'translateY(8px) rotate(45deg)';
          bars[1].style.opacity = '0';
          bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
      } else {
          bars[0].style.transform = 'translateY(0) rotate(0)';
          bars[1].style.opacity = '1';
          bars[2].style.transform = 'translateY(0) rotate(0)';
      }
  });
  
  // Close menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navLinks.classList.remove('active');
          const bars = hamburger.querySelectorAll('.bar');
          bars[0].style.transform = 'translateY(0) rotate(0)';
          bars[1].style.opacity = '1';
          bars[2].style.transform = 'translateY(0) rotate(0)';
      });
  });
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