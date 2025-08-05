// Atualiza o ano no rodapé dinamicamente
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Script para o formulário de contato
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const errorMessage = document.getElementById('errorMessage');
    const formTitle = document.getElementById('formContainerTitle'); // <-- NOVO: Pega o título do formulário

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); 

            const formData = new FormData(form);
            const formAction = form.getAttribute('action');

            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...`;
            submitButton.disabled = true;

            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    form.reset();
                    form.classList.add('hidden');
                    if (formTitle) { // <-- NOVO: Verifica se o título existe
                        formTitle.classList.add('hidden'); // <-- NOVO: Esconde o título
                    }
                    thankYouMessage.classList.remove('hidden');
                    errorMessage.classList.add('hidden');
                } else {
                    // Lógica de erro (permanece a mesma)
                    response.json().then(data => {
                        let errorText = 'Não foi possível enviar sua mensagem. ';
                        if (data.errors && data.errors.length > 0) {
                            errorText += data.errors.map(err => err.message || err.error || 'Erro desconhecido.').join(', ');
                        } else if (data.error) {
                            errorText += data.error;
                        }
                        errorMessage.querySelector('p').textContent = errorText;
                        errorMessage.classList.remove('hidden');
                        // Se o erro ocorrer, queremos que o título do formulário continue visível, então não o escondemos aqui.
                    }).catch(() => {
                        errorMessage.querySelector('p').textContent = 'Não foi possível enviar sua mensagem. Erro inesperado no servidor.';
                        errorMessage.classList.remove('hidden');
                    });
                }
            })
            .catch(error => {
                // Lógica de erro de rede (permanece a mesma)
                console.error('Fetch error:', error);
                errorMessage.querySelector('p').textContent = 'Erro de conexão. Verifique sua internet e tente novamente.';
                errorMessage.classList.remove('hidden');
            })
            .finally(() => {
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }

    // Adiciona smooth scroll para links de navegação internos (permanece o mesmo)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // ... (seu código de smooth scroll aqui) ...
         anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#' || this.getAttribute('data-toggle')) {
                return;
            }
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight || 70; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});