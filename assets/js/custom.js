document.addEventListener('DOMContentLoaded', () => {

    const submitButton = document.getElementById('submit-button');
    const phoneInput = document.getElementById('telefonas');
    const contactForm = document.getElementById('custom-contact-form');
    const submissionDetailsDiv = document.getElementById('submission-details'); 
    const successPopup = document.getElementById('success-popup'); 

    const NAME_REGEX = /^[A-ZĄČĘĖĮŠŲŪŽa-ząčęėįšųūž\s'-]+$/;
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const MIN_PHONE_LENGTH = 15; 

    const validationFields = [
        { id: 'vardas', type: 'name' },
        { id: 'pavarde', type: 'name' },
        { id: 'el_pastas', type: 'email' },
        { id: 'adresas', type: 'address' }
    ];

    function updateSliderValue(sliderId, valueDisplayId) {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(valueDisplayId);

        if (slider && valueDisplay) {
            valueDisplay.textContent = slider.value;
            slider.addEventListener('input', (event) => {
                valueDisplay.textContent = event.target.value;
            });
        }
    }
    
    function showMessage(type) {
        const loadingDiv = contactForm ? contactForm.querySelector('.loading') : null;
        const errorDiv = contactForm ? contactForm.querySelector('.error-message') : null;

        if (loadingDiv) loadingDiv.style.display = 'none';
        if (errorDiv) errorDiv.style.display = 'none';
        if (successPopup) successPopup.style.display = 'none'; 

        if (type === 'loading' && loadingDiv) {
            loadingDiv.style.display = 'block';
        } else if (type === 'error' && errorDiv) {
            errorDiv.textContent = 'Please correct the errors marked in the form.';
            errorDiv.style.display = 'block';
        }
    }
    
    function checkFormValidity() {
        if (!submitButton) return;

        let isFormValid = true;

        validationFields.forEach(field => {
            if (!validateField(field.id, field.type, true)) {
                 isFormValid = false;
            }
        });
        
        const isPhoneCompleted = phoneInput && phoneInput.value.length === MIN_PHONE_LENGTH;

        if (!isPhoneCompleted) {
            isFormValid = false;
        }

        submitButton.disabled = !isFormValid;
    }

    function validateField(fieldId, type, checkOnly = false) {
        const inputField = document.getElementById(fieldId);
        const errorField = document.getElementById(fieldId + '-error'); 

        if (!inputField) return true;
        
        const value = inputField.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (value === '') {
            isValid = false;
            errorMessage = 'This field is required.';
        } else if (isValid) {
            switch (type) {
                case 'name':
                    if (!NAME_REGEX.test(value)) {
                        isValid = false;
                        errorMessage = 'Name/Last Name must contain only letters (A-Z, Lithuanian).';
                    }
                    break;
                case 'email':
                    if (!EMAIL_REGEX.test(value)) {
                        isValid = false;
                        errorMessage = 'Enter a valid email address (e.g., user@example.com).';
                    }
                    break;
                case 'address':
                    break;
            }
        }
        
        if (!checkOnly) {
            if (errorField) {
                if (!isValid) {
                    inputField.classList.add('is-invalid');
                    inputField.classList.remove('is-valid');
                    errorField.textContent = errorMessage;
                } else {
                    inputField.classList.remove('is-invalid');
                    inputField.classList.add('is-valid');
                }
            }
            checkFormValidity(); 
        }

        return isValid; 
    }
    
    function formatPhoneNumber(inputField) {
        const currentCursorPosition = inputField.selectionStart;
        const previousValueLength = inputField.value.length;
        
        let digits = inputField.value.replace(/\D/g, ''); 
        
        if (digits.startsWith('3706')) {
             digits = digits.substring(4);
        } else if (digits.startsWith('370')) {
             digits = digits.substring(3);
        }
        
        const MAX_DIGITS = 8; 
        digits = digits.substring(0, MAX_DIGITS);

        let formattedValue = '+370 6'; 
        
        if (digits.length > 0) {
            
            formattedValue += ' '; 
            
            if (digits.length > 3) {
                formattedValue += digits.substring(0, 3) + ' ' + digits.substring(3);
            } else {
                formattedValue += digits;
            }
        }
        
        inputField.value = formattedValue.trim();

        const minCursorPosition = 7; 
        
        let newCursorPosition = currentCursorPosition + (inputField.value.length - previousValueLength);
        
        if (inputField === document.activeElement) {
             inputField.setSelectionRange(Math.max(minCursorPosition, newCursorPosition), Math.max(minCursorPosition, newCursorPosition));
        }

        const errorField = document.getElementById('telefonas-error'); 
        const isCompleted = inputField.value.length === MIN_PHONE_LENGTH; 

        if (errorField) {
             if (!isCompleted && inputField.value.length > 7) { 
                  inputField.classList.add('is-invalid');
                  inputField.classList.remove('is-valid');
                  errorField.textContent = 'Phone number is too short or incomplete.';
             } else if (isCompleted) {
                  inputField.classList.remove('is-invalid');
                  inputField.classList.add('is-valid');
                  errorField.textContent = '';
             } else {
                  inputField.classList.remove('is-invalid');
                  inputField.classList.remove('is-valid');
                  errorField.textContent = '';
             }
        }
        
        checkFormValidity(); 
    }

    updateSliderValue('vertinimas1', 'vertinimas1_value');
    updateSliderValue('vertinimas2', 'vertinimas2_value');
    updateSliderValue('vertinimas3', 'vertinimas3_value');

    validationFields.forEach(field => {
        const inputField = document.getElementById(field.id);
        if (inputField) {
            inputField.addEventListener('input', () => validateField(field.id, field.type));
            inputField.addEventListener('blur', () => validateField(field.id, field.type));
        }
    });
    
    const MIN_CURSOR_POSITION = 7; 

    if (phoneInput) {
        
        if (phoneInput.value === '') {
             phoneInput.value = '+370 6';
        }
        
        phoneInput.addEventListener('input', () => {
            formatPhoneNumber(phoneInput);
        });
        
        phoneInput.addEventListener('keydown', (event) => {
            const cursorPosition = phoneInput.selectionStart;
            const key = event.key;
            
            if ((key === 'Backspace' || key === 'Delete' || key === 'ArrowLeft') && cursorPosition <= MIN_CURSOR_POSITION) {
                event.preventDefault(); 
                
                if (key === 'ArrowLeft') {
                    phoneInput.setSelectionRange(MIN_CURSOR_POSITION, MIN_CURSOR_POSITION);
                }
            }

            if (phoneInput.value.length >= MIN_PHONE_LENGTH && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(key)) {
                event.preventDefault();
            }
        });
        
        phoneInput.addEventListener('focus', () => {
            if (phoneInput.value.trim().length < MIN_CURSOR_POSITION) {
                 phoneInput.value = '+370 6';
            }
            const currentLength = phoneInput.value.length;
            phoneInput.setSelectionRange(Math.max(MIN_CURSOR_POSITION, currentLength), Math.max(MIN_CURSOR_POSITION, currentLength));
        });
        
        phoneInput.addEventListener('blur', () => {
             const errorField = document.getElementById('telefonas-error');
             
             if (phoneInput.value.length > MIN_CURSOR_POSITION && phoneInput.value.length < MIN_PHONE_LENGTH) {
                 if (errorField) {
                     errorField.textContent = 'Phone number is incomplete.';
                     phoneInput.classList.add('is-invalid');
                 }
             } else if (phoneInput.value.trim().length === MIN_CURSOR_POSITION) {
                 phoneInput.classList.remove('is-valid', 'is-invalid');
                 if (errorField) errorField.textContent = '';
             }
             checkFormValidity();
        });
    }
    
    if (submitButton) {
        submitButton.disabled = true; 
    }

    if (contactForm && submissionDetailsDiv && successPopup) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            if (submitButton.disabled) {
                showMessage('error');
                return;
            }

            submissionDetailsDiv.innerHTML = '';
            showMessage('loading');

            const formData = new FormData(this);
            const data = {};
            
            formData.forEach((value, key) => {
                data[key] = value;
            });

            console.log('--- Submitted Data Object ---');
            console.log(data);
            console.log('-----------------------------');
            
            const loadingDiv = contactForm.querySelector('.loading');

            setTimeout(() => {
                
                const vertinimai = [
                    parseInt(data.vertinimas1, 10),
                    parseInt(data.vertinimas2, 10),
                    parseInt(data.vertinimas3, 10)
                ].filter(val => !isNaN(val));

                let vidurkis = 0;
                if (vertinimai.length > 0) {
                    vidurkis = (vertinimai.reduce((a, b) => a + b, 0) / vertinimai.length).toFixed(1);
                }

                let htmlOutput = '<h4>Submitted Details:</h4>';
                htmlOutput += `<p>`;
                htmlOutput += `<strong>Name:</strong> ${data.vardas} <br>`;
                htmlOutput += `<strong>Last Name:</strong> ${data.pavarde} <br>`;
                htmlOutput += `<strong>Email:</strong> ${data.el_pastas} <br>`;
                htmlOutput += `<strong>Phone Number:</strong> ${data.telefonas} <br>`;
                htmlOutput += `<strong>Address:</strong> ${data.adresas} <br>`;
                htmlOutput += `<br>`;
                htmlOutput += `<strong>1. Website Design Rating:</strong> ${data.vertinimas1} / 10 <br>`;
                htmlOutput += `<strong>2. Clarity of Information Rating:</strong> ${data.vertinimas2} / 10 <br>`;
                htmlOutput += `<strong>3. Overall Impression Rating:</strong> ${data.vertinimas3} / 10 <br>`;
                htmlOutput += `<br>`;
                
                htmlOutput += `<strong>Overall Average Rating:</strong> <br>`;
                htmlOutput += `<span style="font-size: 1.2em; font-weight: bold;">${data.vardas} ${data.pavarde}: ${vidurkis}</span>`;
                htmlOutput += `</p>`;

                submissionDetailsDiv.innerHTML = htmlOutput;
                submissionDetailsDiv.style.border = '1px solid #ccc';
                submissionDetailsDiv.style.padding = '15px';
                submissionDetailsDiv.style.backgroundColor = '#f9f9f9';
                submissionDetailsDiv.style.borderRadius = '8px';

                if (loadingDiv) loadingDiv.style.display = 'none';
                successPopup.style.display = 'block';
                
                setTimeout(() => {
                    successPopup.style.display = 'none';
                }, 3000); 
                
                this.reset();
                this.querySelectorAll('.form-control').forEach(el => {
                    el.classList.remove('is-valid', 'is-invalid');
                });
                
                updateSliderValue('vertinimas1', 'vertinimas1_value');
                updateSliderValue('vertinimas2', 'vertinimas2_value');
                updateSliderValue('vertinimas3', 'vertinimas3_value');
                phoneInput.value = '+370 6'; 
                
                checkFormValidity(); 
                
            }, 1500);
        });
    } else {
        console.error("The contact form, submission details container, or success popup was not found.");
    }
});