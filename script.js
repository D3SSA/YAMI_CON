// DOMContentLoaded
// ├── function rotateCards() { ... }
// ├── const nameInput, phoneInput, etc...
// ├── function validateAndSanitize() { ... }
// ├── function validateForm() { ... }
// ├── addEventListener для input
// ├── addEventListener для click
// └── setInterval(rotateCards, 3000) ← В КОНЦЕ



document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен');
    
    // Функция ротации карточек
function rotateCards() {
    const container = document.querySelector('.delicious-colletion');
    const cards = Array.from(container.querySelectorAll('.delicious-card'));
    
    if (cards.length > 0) {
        const firstCard = cards[0];
        
        // Исчезновение с движением
        firstCard.style.opacity = '0';
        firstCard.style.transform = 'scale(0.8) translateY(20px)';
        
        setTimeout(() => {
            container.appendChild(firstCard);
            
            setTimeout(() => {
                // Появление с движением
                firstCard.style.opacity = '1';
                firstCard.style.transform = 'scale(1) translateY(0)';
            }, 50);
        }, 600);
    }
}
    // Код формы
    const nameInput = document.getElementById('name-user');
    const phoneInput = document.getElementById('tel-number');
    const submitBtn = document.querySelector('.submit-btn');
    const formContainer = document.querySelector('.order-form-container');

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
        
        const safeName = validateAndSanitize(nameValue, 'name');
        const safePhone = validateAndSanitize(phoneValue, 'phone');

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

    // ЗАПУСК РОТАЦИИ КАРТОЧЕК
    setInterval(rotateCards, 3000);
    
    console.log('Обработчики установлены. Ждем клик...');
});
