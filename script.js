
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});
const footerYear = document.getElementById('year');
if (footerYear) footerYear.textContent = new Date().getFullYear();
// Dark Mode com preferência salva
document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('toggle-dark-mode');
  const theme = localStorage.getItem('theme');

  // Verifica preferência salva ou do sistema
  if (theme === 'dark' ||
    (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }

  // Alternar tema ao clicar no botão
  toggleButton.addEventListener('click', function () {
    const currentTheme = document.documentElement.getAttribute('data-theme');

    if (currentTheme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }

    // Adiciona efeito visual de clique
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
  });
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
  }
  
  // Suavizar rolagem (opcional - se ainda não tiver)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formContatoPortfolio');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Substitua pelo SEU endpoint do Formspree
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpqjawyn';
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Impede envio tradicional
        
        // Validação básica
        if (!validarFormulario()) {
            mostrarStatus('Por favor, preencha todos os campos corretamente.', 'error');
            return;
        }
        
        // Prepara formulário para envio
        prepararParaEnvio();
        
        try {
            // Cria FormData a partir do formulário
            const formData = new FormData(this);
            
            // Envia para Formspree
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            // Processa resposta
            if (response.ok) {
                await processarSucesso();
            } else {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            processarErro(error);
        }
    });
    
    // Funções auxiliares
    function validarFormulario() {
        const nome = form.querySelector('input[name="nome"]').value.trim();
        const email = form.querySelector('input[name="email"]').value.trim();
        const mensagem = form.querySelector('textarea[name="mensagem"]').value.trim();
        
        // Validação de email simples
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        return nome.length > 2 && 
               emailRegex.test(email) && 
               mensagem.length > 10;
    }
    
    function prepararParaEnvio() {
        // Mostra estado de carregamento
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;
        form.classList.add('form-disabled');
        
        // Esconde mensagens anteriores
        formStatus.style.display = 'none';
    }
    
    async function processarSucesso() {
        // Mostra mensagem de sucesso
        mostrarStatus('✅ Mensagem enviada com sucesso! Redirecionando...', 'success');
        
        // Pega dados para personalizar a página de obrigado (opcional)
        const nomeUsuario = form.querySelector('input[name="nome"]').value;
        sessionStorage.setItem('ultimoNomeContato', nomeUsuario);
        
        // Redireciona após 2 segundos (usuário vê a confirmação)
        setTimeout(() => {
            window.location.href = 'obrigado.html';
        }, 2000);
    }
    
    function processarErro(error) {
        console.error('Erro Formspree:', error);
        
        // Mostra mensagem de erro amigável
        let mensagemErro = 'Erro ao enviar mensagem. ';
        
        if (error.message.includes('Failed to fetch')) {
            mensagemErro += 'Verifique sua conexão com a internet.';
        } else if (error.message.includes('429')) {
            mensagemErro += 'Muitas tentativas. Tente novamente em alguns minutos.';
        } else {
            mensagemErro += 'Tente novamente ou entre em contato diretamente por email.';
        }
        
        mostrarStatus(mensagemErro, 'error');
        
        // Restaura botão
        setTimeout(() => {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
            form.classList.remove('form-disabled');
        }, 3000);
    }
    
    function mostrarStatus(mensagem, tipo) {
        formStatus.textContent = mensagem;
        formStatus.className = `form-status ${tipo}`;
        formStatus.style.display = 'block';
        
        // Rola suavemente até a mensagem
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Bônus: Validação em tempo real
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() && !this.checkValidity()) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '';
            }
        });
    });
});
function redirecionarComDados(nome, email) {
    // Salva temporariamente
    sessionStorage.setItem('ultimoNomeContato', nome);
    sessionStorage.setItem('ultimoEmailContato', email);
    
    // Redireciona
    window.location.href = 'obrigado.html';
}

// No evento de submit (no sucesso):
const nomeUsuario = form.querySelector('input[name="nome"]').value;
const emailUsuario = form.querySelector('input[type="email"]').value;

setTimeout(() => {
    redirecionarComDados(nomeUsuario, emailUsuario);
}, 1500);
function initSkillSimulator() {
    let progress = 0;
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = document.getElementById('progress-percent');
    const progressValue = document.getElementById('progress-value');
    const skillLevel = document.getElementById('skill-level');
    const buildBtn = document.getElementById('build-btn');
    const resetBtn = document.getElementById('reset-btn');

    if (!progressBar || !buildBtn || !resetBtn) return;

    // Níveis de habilidade baseados no progresso
    const skillLevels = [
        { min: 0, max: 30, name: "Iniciante", color: "var(--cor-primaria)" },
        { min: 31, max: 60, name: "Intermediário", color: "#8b5cf6" },
        { min: 61, max: 90, name: "Avançado", color: "#10b981" },
        { min: 91, max: 100, name: "Especialista", color: "#f59e0b" }
    ];

    function updateSkillLevel() {
        const level = skillLevels.find(l => progress >= l.min && progress <= l.max);
        if (level) {
            skillLevel.textContent = level.name;
            skillLevel.style.color = level.color;
            progressPercent.style.color = level.color;
        }
    }

    function updateProgress() {
        progressBar.style.width = `${progress}%`;
        progressPercent.textContent = `${progress}%`;
        progressValue.textContent = `${progress}%`;
        
        // Mostrar porcentagem na barra quando for maior que 20%
        if (progress > 20) {
            progressPercent.style.opacity = '1';
        } else {
            progressPercent.style.opacity = '0';
        }
        
        updateSkillLevel();
        
        // Efeito de "pulsação" quando aumenta
        progressBar.style.transform = 'scale(1.02)';
        setTimeout(() => {
            progressBar.style.transform = 'scale(1)';
        }, 150);
    }

    buildBtn.addEventListener('click', () => {
        if (progress < 100) {
            progress += 10;
            if (progress > 100) progress = 100;
            
            updateProgress();
            
            if (progress === 100) {
                buildBtn.disabled = true;
                buildBtn.textContent = '✅ Domínio Concluído!';
                buildBtn.style.background = 'var(--cor-secundaria)';
            }
        }
    });

    resetBtn.addEventListener('click', () => {
        progress = 0;
        updateProgress();
        buildBtn.disabled = false;
        buildBtn.textContent = '🛠️ Construir Habilidade';
        buildBtn.style.background = 'var(--cor-primaria)';
    });

    // Inicializar
    updateProgress();
}

// ====== INICIALIZAR QUANDO O DOCUMENTO ESTIVER PRONTO ======
document.addEventListener('DOMContentLoaded', () => {
    initQuoteGenerator();
    initSkillSimulator();
    
    // Observar mudanças no tema (dark/light mode)
    const observer = new MutationObserver(() => {
        // Reaplicar estilos se necessário
        if (document.getElementById('progress-bar')) {
            document.getElementById('progress-bar').style.background = 
                'linear-gradient(90deg, var(--cor-primaria), var(--cor-secundaria))';
        }
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
});