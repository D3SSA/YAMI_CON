document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен');

    const nameInput = document.getElementById('name-user');
    const phoneInput = document.getElementById('tel-number');
    const submitBtn = document.querySelector('.submit-btn');
    const formContainer = document.querySelector('.order-form-container'); // переименовали

    console.log('Найдены элементы:', { nameInput, phoneInput, submitBtn, formContainer });

    // Простая валидация
    
   const validateAndSanitize = (input, type) => {
    const patterns = {
        name: /^[a-zA-Zа-яА-ЯёЁ\s\-]{2,12}$/,
        phone: /^(\+7|8)[\d\s\-()]{9,18}$/
    };
    
    if (!patterns[type].test(input)) return null;
    
    // Санитизация для имени
    if (type === 'name') {
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
    
    return input; // телефон возвращаем как есть
};
function validateForm() {
    const nameValue = nameInput.value.trim();
    const phoneValue = phoneInput.value.trim();
// Использование
    const safeName = validateAndSanitize(nameValue, 'name'); // исправлено на 'name'
    const safePhone = validateAndSanitize(phoneValue, 'phone'); // исправлено на 'phone'

    const isNameValid = safeName !== null;
    const isPhoneValid = safePhone !== null && safePhone.replace(/\D/g, '').length >= 11;

    // Обновление классов для имени
    const parentName = nameInput.closest('.input-with-label');
    if (parentName) {
        if (isNameValid) {
            parentName.classList.add('valid');
            parentName.classList.remove('invalid');
        } else {
            parentName.classList.remove('valid');
            parentName.classList.add('invalid');
        }
    }

    // Обновление классов для телефона
    const parentPhone = phoneInput.closest('.input-with-label');
    if (parentPhone) {
        if (isPhoneValid) {
            parentPhone.classList.add('valid');
            parentPhone.classList.remove('invalid');
        } else {
            parentPhone.classList.remove('valid');
            parentPhone.classList.add('invalid');
        }
    }

    // Активировать кнопку
    if (isNameValid && isPhoneValid) {
        submitBtn.disabled = false;
        submitBtn.classList.add('active');
        return true;
    } else {
        submitBtn.disabled = true;
        submitBtn.classList.remove('active');
        return false;
    }
}
    // Валидация при вводе
    nameInput.addEventListener('input', validateForm);
    phoneInput.addEventListener('input', validateForm);

    // Также валидируем при загрузке страницы
    validateForm();

    // Обработчик КЛИКА на кнопку
    submitBtn.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('🎯 Кнопка НАЖАТА! Начинаем отправку...');

        if (validateForm()) {
            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();

            const BOT_TOKEN = '8432828838:AAEbapIxUrqAxhHT_OHxp9QBTb-JP1mwOyA';
            const CHAT_ID = '797155315';

            const telegramData = {
                chat_id: CHAT_ID,
                text: `📞 НОВАЯ ЗАЯВКА С САЙТА!\n\n👤 Имя: ${name}\n📱 Телефон: ${phone}\n⏰ Время: ${new Date().toLocaleString()}`,
                parse_mode: 'HTML'
            };

            console.log('Отправляем в Telegram:', telegramData);

            // Показываем загрузку
            submitBtn.textContent = 'Отправляем...';
            submitBtn.disabled = true;

            // Отправляем сообщение
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(telegramData)
            })
            .then(response => {
                console.log('Статус ответа:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Ответ от Telegram:', data);
                
                if (data.ok) {
                    alert('✅ Заявка отправлена! Мы свяжемся с вами в течение 15 минут.');
                    // Сбрасываем поля вручную вместо form.reset()
                    nameInput.value = '';
                    phoneInput.value = '';
                    submitBtn.disabled = true;
                    submitBtn.classList.remove('active');
                    console.log('✅ Форма очищена');
                } else {
                    alert('❌ Ошибка отправки: ' + (data.description || 'Неизвестная ошибка'));
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('❌ Ошибка сети. Попробуйте еще раз.');
            })
            .finally(() => {
                submitBtn.textContent = 'Заказать';
                validateForm();
            });
        } else {
            console.log('Форма не валидна, отправка отменена');
            alert('❌ Пожалуйста, заполните все поля правильно');
        }
    });

    // Дополнительно: обработчик для отладки
    submitBtn.addEventListener('mouseover', function() {
        console.log('Мышь над кнопкой, disabled:', submitBtn.disabled);
    });

    console.log('Обработчики установлены. Ждем клик...');

});
