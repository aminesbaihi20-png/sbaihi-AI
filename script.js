const card = document.getElementById('creditCard');
const cvvInput = document.getElementById('cvvInput');
const numberInput = document.getElementById('cardNumberInput');
const cardBrand = document.getElementById('cardBrand');

// قلب البطاقة عند التركيز على حقل الـ CVV
cvvInput.onfocus = () => {
  card.classList.add('flipped');
};
cvvInput.onblur = () => {
  card.classList.remove('flipped');
};

// تغيير نوع البطاقة تلقائياً بناءً على الرقم الأول (مثلاً إذا بدأ بـ 4 تولي Visa، وإذا بدأ بـ 5 تولي MC)
numberInput.oninput = (e) => {
  const value = e.target.value;
  if (value.startsWith('4')) {
    cardBrand.textContent = 'VISA';
  } else if (value.startsWith('5')) {
    cardBrand.textContent = 'MASTERCARD';
  } else {
    cardBrand.textContent = 'SBAIHIPAY'; // أو اسم شركتك الخاصة اللي بغيتي
  }
};