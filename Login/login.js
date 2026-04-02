// ========================================
// SISTEMA DE AUTENTICACIÓN - CALDOS CONSTITUCIÓN
// ========================================

// Elementos del DOM
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// ========================================
// CAMBIO DE PESTAÑAS
// ========================================
tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active', 'text-primary');
    tabLogin.classList.remove('text-gray-400');
    tabRegister.classList.remove('active', 'text-primary');
    tabRegister.classList.add('text-gray-400');
    
    formLogin.classList.add('active');
    formRegister.classList.remove('active');
    clearMessages();
});

tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active', 'text-primary');
    tabRegister.classList.remove('text-gray-400');
    tabLogin.classList.remove('active', 'text-primary');
    tabLogin.classList.add('text-gray-400');
    
    formRegister.classList.add('active');
    formLogin.classList.remove('active');
    clearMessages();
});

// ========================================
// TOGGLE PASSWORD VISIBILITY
// ========================================
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ========================================
// VALIDACIONES
// ========================================

// Validar formato de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validar formato de teléfono (flexible para varios formatos)
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Validar fuerza de contraseña
function validatePasswordStrength(password) {
    const result = {
        isValid: false,
        strength: 0,
        messages: []
    };
    
    if (password.length < 8) {
        result.messages.push('Mínimo 8 caracteres');
    } else {
        result.strength += 25;
    }
    
    if (!/[A-Z]/.test(password)) {
        result.messages.push('Una mayúscula');
    } else {
        result.strength += 25;
    }
    
    if (!/[a-z]/.test(password)) {
        result.messages.push('Una minúscula');
    } else {
        result.strength += 25;
    }
    
    if (!/[0-9]/.test(password)) {
        result.messages.push('Un número');
    } else {
        result.strength += 25;
    }
    
    // Bonus por caracteres especiales
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        result.strength = Math.min(100, result.strength + 10);
    }
    
    result.isValid = result.messages.length === 0;
    
    return result;
}

// ========================================
// SISTEMA DE MENSAJES
// ========================================
function showMessage(formId, message, type = 'error') {
    clearMessages();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-alert ${type} p-4 rounded-xl mb-4 text-sm font-medium animate-fade-in`;
    
    if (type === 'error') {
        messageDiv.style.backgroundColor = '#fee2e2';
        messageDiv.style.color = '#991b1b';
        messageDiv.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
    } else {
        messageDiv.style.backgroundColor = '#d1fae5';
        messageDiv.style.color = '#065f46';
        messageDiv.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;
    }
    
    const form = document.getElementById(formId);
    form.insertBefore(messageDiv, form.firstChild);
}

function clearMessages() {
    document.querySelectorAll('.message-alert').forEach(msg => msg.remove());
}

// ========================================
// INDICADOR DE FUERZA DE CONTRASEÑA
// ========================================
function createPasswordStrengthIndicator() {
    const registerPassword = document.getElementById('register-password');
    const container = registerPassword.closest('div').parentElement;
    
    const strengthDiv = document.createElement('div');
    strengthDiv.id = 'password-strength';
    strengthDiv.className = 'mt-2 hidden';
    strengthDiv.innerHTML = `
        <div class="flex gap-1 mb-2">
            <div class="strength-bar h-1 flex-1 bg-gray-200 rounded"></div>
            <div class="strength-bar h-1 flex-1 bg-gray-200 rounded"></div>
            <div class="strength-bar h-1 flex-1 bg-gray-200 rounded"></div>
            <div class="strength-bar h-1 flex-1 bg-gray-200 rounded"></div>
        </div>
        <p class="strength-text text-xs text-gray-500"></p>
    `;
    
    container.appendChild(strengthDiv);
    
    registerPassword.addEventListener('input', (e) => {
        const password = e.target.value;
        const strengthDiv = document.getElementById('password-strength');
        const bars = strengthDiv.querySelectorAll('.strength-bar');
        const text = strengthDiv.querySelector('.strength-text');
        
        if (password.length === 0) {
            strengthDiv.classList.add('hidden');
            return;
        }
        
        strengthDiv.classList.remove('hidden');
        const validation = validatePasswordStrength(password);
        
        // Resetear barras
        bars.forEach(bar => {
            bar.style.backgroundColor = '#e5e7eb';
        });
        
        // Colorear barras según fuerza
        const filledBars = Math.ceil(validation.strength / 25);
        let color = '#ef4444'; // Rojo
        let strengthText = 'Débil';
        
        if (validation.strength >= 75) {
            color = '#22c55e'; // Verde
            strengthText = 'Fuerte';
        } else if (validation.strength >= 50) {
            color = '#eab308'; // Amarillo
            strengthText = 'Media';
        }
        
        for (let i = 0; i < filledBars; i++) {
            bars[i].style.backgroundColor = color;
        }
        
        if (validation.messages.length > 0) {
            text.textContent = `Falta: ${validation.messages.join(', ')}`;
            text.style.color = '#ef4444';
        } else {
            text.textContent = `Contraseña ${strengthText}`;
            text.style.color = color;
        }
    });
}

// ========================================
// GESTIÓN DE USUARIOS (LocalStorage)
// ========================================

// Obtener usuarios del localStorage
function getUsers() {
    const users = localStorage.getItem('caldos_users');
    return users ? JSON.parse(users) : [];
}

// Guardar usuarios en localStorage
function saveUsers(users) {
    localStorage.setItem('caldos_users', JSON.stringify(users));
}

// Verificar si email ya existe
function emailExists(email) {
    const users = getUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Registrar nuevo usuario
function registerUser(userData) {
    const users = getUsers();
    users.push({
        id: Date.now(),
        name: userData.name,
        email: userData.email.toLowerCase(),
        phone: userData.phone,
        password: userData.password, 
        createdAt: new Date().toISOString()
    });
    saveUsers(users);
}

// Verificar credenciales de login
function verifyLogin(email, password) {
    const users = getUsers();
    return users.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && 
        user.password === password
    );
}

// Guardar sesión actual
function saveSession(user) {
    const session = {
        userId: user.id,
        name: user.name,
        email: user.email,
        loginTime: new Date().toISOString()
    };
    sessionStorage.setItem('caldos_session', JSON.stringify(session));
}

// ========================================
// MANEJO DE FORMULARIO DE LOGIN
// ========================================
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearMessages();
    
    const email = loginForm.querySelector('input[type="email"]').value.trim();
    const password = loginForm.querySelector('#login-password').value;
    
    // Validaciones
    if (!email || !password) {
        showMessage('loginForm', 'Por favor completa todos los campos', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('loginForm', 'El formato del email no es válido', 'error');
        return;
    }
    
    // Verificar credenciales
    const user = verifyLogin(email, password);
    
    if (!user) {
        showMessage('loginForm', 'Email o contraseña incorrectos', 'error');
        return;
    }
    
    // Login exitoso
    saveSession(user);
    showMessage('loginForm', `¡Bienvenido ${user.name}!`, 'success');
    
    // Redirigir después de 1.5 segundos
    setTimeout(() => {
        // Cambia 'index.html' por la URL de tu página principal
        window.location.href = 'index.html';
    }, 1500);
});

// ========================================
// MANEJO DE FORMULARIO DE REGISTRO
// ========================================
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearMessages();
    
    const name = registerForm.querySelector('input[type="text"]').value.trim();
    const email = registerForm.querySelector('input[type="email"]').value.trim();
    const phone = registerForm.querySelector('input[type="tel"]').value.trim();
    const password = registerForm.querySelector('#register-password').value;
    const confirmPassword = registerForm.querySelector('#register-confirm').value;
    const termsAccepted = registerForm.querySelector('input[type="checkbox"]').checked;
    
    // Validaciones
    if (!name || !email || !phone || !password || !confirmPassword) {
        showMessage('registerForm', 'Por favor completa todos los campos', 'error');
        return;
    }
    
    if (name.length < 3) {
        showMessage('registerForm', 'El nombre debe tener al menos 3 caracteres', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('registerForm', 'El formato del email no es válido', 'error');
        return;
    }
    
    if (emailExists(email)) {
        showMessage('registerForm', 'Este email ya está registrado', 'error');
        return;
    }
    
    if (!isValidPhone(phone)) {
        showMessage('registerForm', 'El formato del teléfono no es válido', 'error');
        return;
    }
    
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
        showMessage('registerForm', `Contraseña débil. Falta: ${passwordValidation.messages.join(', ')}`, 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('registerForm', 'Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (!termsAccepted) {
        showMessage('registerForm', 'Debes aceptar los términos y condiciones', 'error');
        return;
    }
    
    // Registrar usuario
    try {
        registerUser({ name, email, phone, password });
        showMessage('registerForm', '¡Cuenta creada exitosamente! Redirigiendo...', 'success');
        
        // Limpiar formulario
        registerForm.reset();
        
        // Auto-login y redirección
        const user = verifyLogin(email, password);
        saveSession(user);
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        showMessage('registerForm', 'Error al crear la cuenta. Intenta de nuevo.', 'error');
        console.error('Error:', error);
    }
});

// ========================================
// VALIDACIÓN EN TIEMPO REAL
// ========================================

// Email en login
loginForm.querySelector('input[type="email"]').addEventListener('blur', function() {
    if (this.value && !isValidEmail(this.value)) {
        this.style.borderColor = '#ef4444';
    } else {
        this.style.borderColor = '';
    }
});

// Email en registro
registerForm.querySelector('input[type="email"]').addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && !isValidEmail(email)) {
        this.style.borderColor = '#ef4444';
    } else if (email && emailExists(email)) {
        this.style.borderColor = '#ef4444';
        showMessage('registerForm', 'Este email ya está registrado', 'error');
    } else {
        this.style.borderColor = '';
    }
});

// Teléfono en registro
registerForm.querySelector('input[type="tel"]').addEventListener('blur', function() {
    if (this.value && !isValidPhone(this.value)) {
        this.style.borderColor = '#ef4444';
    } else {
        this.style.borderColor = '';
    }
});

// Confirmar contraseña en tiempo real
registerForm.querySelector('#register-confirm').addEventListener('input', function() {
    const password = registerForm.querySelector('#register-password').value;
    if (this.value && this.value !== password) {
        this.style.borderColor = '#ef4444';
    } else if (this.value === password && password.length > 0) {
        this.style.borderColor = '#22c55e';
    } else {
        this.style.borderColor = '';
    }
});

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Crear indicador de fuerza de contraseña
    createPasswordStrengthIndicator();
    
    // Verificar si ya hay sesión activa
    const session = sessionStorage.getItem('caldos_session');
    if (session) {
        const userData = JSON.parse(session);
        console.log('Sesión activa:', userData.name);
        // Opcional: redirigir automáticamente si ya está logueado
        // window.location.href = 'index.html';
    }
    
    console.log('Sistema de autenticación inicializado ✓');
});

// ========================================
// FUNCIONES AUXILIARES PÚBLICAS
// ========================================

// Cerrar sesión (usar en otras páginas)
function logout() {
    sessionStorage.removeItem('caldos_session');
    window.location.href = 'login.html';
}

// Obtener usuario actual (usar en otras páginas)
function getCurrentUser() {
    const session = sessionStorage.getItem('caldos_session');
    return session ? JSON.parse(session) : null;
}

// Verificar si está logueado (usar en otras páginas)
function isLoggedIn() {
    return sessionStorage.getItem('caldos_session') !== null;
}