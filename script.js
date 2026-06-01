const WHATSAPP_NUMBER = '79057007536';
const WHATSAPP_TEXT = encodeURIComponent('Hello! I would like to get the Full Assessment Toolkit for Teachers.');
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;

document.querySelectorAll('.whatsapp-link').forEach(link => {
  link.href = whatsappUrl;
});

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('[data-nav]');
menuToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('[data-nav] a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const modal = document.querySelector('.preview-modal');
const modalTitle = document.querySelector('#modal-title');
const modalBody = document.querySelector('#modal-body');

function openPreviewModal(title, html) {
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  if (typeof modal.showModal === 'function') {
    modal.showModal();
  }
}

const pathText = {
  checklist: '<strong>Free checklist:</strong> a light first step with 10 quick formative assessment techniques for any lesson.',
  starter: '<strong>Starter Pack:</strong> a low-risk practical set with diagnostic templates, exit tickets and simple rubrics.',
  toolkit: '<strong>Full Toolkit:</strong> the most complete option for teachers who want ready-to-use assessment materials in one place.'
};

const pathPreviews = {
  checklist: {
    title: 'Step 1: Free Checklist',
    html: `
      <div class="offer-preview-card">
        <div class="offer-label">Free first step</div>
        <h4>10 Quick Formative Assessment Techniques for Any Lesson</h4>
        <p>This is the teacher’s first contact with the funnel. It gives a small useful result before any paid offer.</p>
        <ul class="offer-list">
          <li>3-minute exit question</li>
          <li>Traffic-light self-check</li>
          <li>One-minute reflection prompt</li>
          <li>Quick peer check</li>
        </ul>
        <div class="offer-action-row">
          <a class="button button-primary orbit-border modal-action-link" href="#request-form">Ask for the checklist</a>
          <button class="button button-secondary orbit-border modal-close-inline" type="button">Keep browsing</button>
        </div>
      </div>`
  },
  starter: {
    title: 'Step 2: Assessment Starter Pack',
    html: `
      <div class="offer-preview-card">
        <div class="offer-label">Low-risk practical offer</div>
        <h4>Starter Pack for quick classroom assessment</h4>
        <p>A small paid set for teachers who already want more practical help after the free checklist.</p>
        <div class="offer-columns">
          <div><strong>5</strong><span>diagnostic templates</span></div>
          <div><strong>5</strong><span>exit tickets</span></div>
          <div><strong>3</strong><span>simple rubrics</span></div>
        </div>
        <p class="offer-note">Good for testing the materials before choosing the full toolkit.</p>
        <div class="offer-action-row">
          <a class="button button-primary orbit-border modal-action-link" href="#request-form">Ask about the pack</a>
          <button class="button button-secondary orbit-border modal-close-inline" type="button">Keep browsing</button>
        </div>
      </div>`
  },
  toolkit: {
    title: 'Step 3: Full Assessment Toolkit',
    html: `
      <div class="offer-preview-card main-offer-preview">
        <div class="offer-label">Main product</div>
        <h4>Full Assessment Toolkit for Teachers</h4>
        <p>The complete digital product for busy school teachers who need ready-made materials for everyday assessment.</p>
        <ul class="offer-list two-cols">
          <li>Diagnostic templates</li>
          <li>Exit tickets</li>
          <li>Simple rubrics</li>
          <li>Feedback forms</li>
          <li>Peer-assessment guides</li>
          <li>Short teacher guide</li>
        </ul>
        <p class="offer-note"><strong>Value:</strong> save preparation time, check understanding faster, and make feedback more structured.</p>
        <div class="offer-action-row">
          <a class="button button-primary orbit-border modal-action-link" href="#request-form">Send request</a>
          <a class="button button-secondary orbit-border whatsapp-link" href="${whatsappUrl}" target="_blank" rel="noopener">Message on WhatsApp</a>
        </div>
      </div>`
  }
};

const pathOutput = document.querySelector('.path-output');

function choosePath(path) {
  if (!path || !pathText[path]) return;
  document.querySelectorAll('.path-button').forEach(btn => btn.classList.toggle('active', btn.dataset.path === path));
  document.querySelectorAll('.path-card').forEach(card => card.classList.toggle('selected', card.dataset.path === path));
  pathOutput.innerHTML = pathText[path];
  const preview = pathPreviews[path];
  openPreviewModal(preview.title, preview.html);
}

document.querySelectorAll('.path-button').forEach(button => {
  button.addEventListener('click', event => {
    event.stopPropagation();
    choosePath(button.dataset.path);
  });
});

document.querySelectorAll('.path-card[data-path]').forEach(card => {
  card.addEventListener('click', () => choosePath(card.dataset.path));
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      choosePath(card.dataset.path);
    }
  });
});

const form = document.querySelector('.lead-form');
const formMessage = document.querySelector('.form-message');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form?.addEventListener('submit', event => {
  event.preventDefault();
  formMessage.classList.remove('success', 'error');

  const formData = new FormData(form);
  const request = {
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    role: String(formData.get('role') || '').trim(),
    requestType: String(formData.get('requestType') || '').trim(),
    message: String(formData.get('message') || '').trim(),
    date: new Date().toISOString()
  };

  const fieldChecks = [
    { selector: '#name', valid: request.name.length >= 2, message: 'Please write how I should address you.' },
    { selector: '#email', valid: emailPattern.test(request.email), message: 'Please enter a valid email address.' },
    { selector: '#role', valid: Boolean(request.role), message: 'Please choose your teaching context.' },
    { selector: '#request-type', valid: Boolean(request.requestType), message: 'Please choose what you need.' },
    { selector: '#message', valid: request.message.length >= 10, message: 'Please describe your request in at least 10 characters.' }
  ];

  const failed = fieldChecks.find(check => !check.valid);
  if (failed) {
    formMessage.textContent = failed.message;
    formMessage.classList.add('error');
    document.querySelector(failed.selector)?.focus();
    return;
  }

  const storedRequests = JSON.parse(localStorage.getItem('assessmentToolkitRequests') || '[]');
  storedRequests.push(request);
  localStorage.setItem('assessmentToolkitRequests', JSON.stringify(storedRequests));

  formMessage.textContent = 'Thank you! Your request was saved in this browser prototype.';
  formMessage.classList.add('success');
  form.reset();
  showToast('Request saved');
});

const templatePreviews = {
  diagnostic: {
    title: 'Diagnostic Template: Starting Point Check',
    html: `
      <div class="template-doc diagnostic-doc">
        <div class="doc-header"><span>Teacher note</span><strong>Use before a new unit</strong></div>
        <h4>What do students already know?</h4>
        <div class="two-column-fields">
          <label>Topic / Unit <span></span></label>
          <label>Class / Group <span></span></label>
        </div>
        <div class="prompt-box"><strong>1. Quick self-check</strong><p>Circle one: I know this well / I know a little / This is new for me.</p></div>
        <div class="prompt-box"><strong>2. Key vocabulary or ideas</strong><p>Write 3 words or concepts connected with today’s topic.</p></div>
        <div class="prompt-box"><strong>3. Teacher decision</strong><p>Start normally / Add short revision / Give differentiated support.</p></div>
      </div>`
  },
  exitTicket: {
    title: 'Exit Ticket: 3-Minute Lesson Check',
    html: `
      <div class="template-doc exit-doc">
        <div class="doc-header"><span>Student exit ticket</span><strong>Last 3 minutes</strong></div>
        <h4>Before you leave, answer briefly</h4>
        <ol class="template-questions">
          <li>One thing I understood today:</li>
          <li>One question I still have:</li>
          <li>One thing I can try next lesson:</li>
        </ol>
        <div class="teacher-use"><strong>Teacher use:</strong> sort answers into “ready”, “needs support”, and “needs reteaching”.</div>
      </div>`
  },
  rubric: {
    title: 'Simple Rubric: Speaking or Project Task',
    html: `
      <div class="template-doc rubric-doc">
        <div class="doc-header"><span>Editable rubric</span><strong>3 clear levels</strong></div>
        <h4>Assessment criteria</h4>
        <table class="rubric-table">
          <thead><tr><th>Criterion</th><th>Needs support</th><th>Good</th><th>Strong</th></tr></thead>
          <tbody>
            <tr><td>Content</td><td>Basic ideas</td><td>Clear answer</td><td>Detailed answer</td></tr>
            <tr><td>Organization</td><td>Hard to follow</td><td>Mostly clear</td><td>Logical structure</td></tr>
            <tr><td>Language</td><td>Many errors</td><td>Minor errors</td><td>Accurate and varied</td></tr>
          </tbody>
        </table>
      </div>`
  },
  feedback: {
    title: 'Feedback Form: Fast Teacher Comments',
    html: `
      <div class="template-doc feedback-doc">
        <div class="doc-header"><span>Feedback form</span><strong>Reusable structure</strong></div>
        <h4>Structured feedback</h4>
        <div class="feedback-lines"><b>Strength:</b><span></span></div>
        <div class="feedback-lines"><b>One thing to improve:</b><span></span></div>
        <div class="feedback-lines"><b>Next lesson goal:</b><span></span></div>
        <div class="comment-bank"><strong>Comment bank:</strong><p>“Your idea is clear. Now add one example.” / “Good progress. Check the task criteria again.”</p></div>
      </div>`
  }
};

document.querySelectorAll('.preview-card').forEach(card => {
  card.addEventListener('click', () => {
    const preview = templatePreviews[card.dataset.preview];
    if (!preview) return;
    openPreviewModal(preview.title, preview.html);
  });
});

document.querySelector('.modal-close')?.addEventListener('click', () => modal.close());
modal?.addEventListener('click', event => {
  const rect = modal.getBoundingClientRect();
  const clickedOutside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (clickedOutside) modal.close();
});

modalBody?.addEventListener('click', event => {
  const closeButton = event.target.closest('.modal-close-inline');
  if (closeButton) {
    modal.close();
    return;
  }

  const actionLink = event.target.closest('.modal-action-link');
  if (actionLink && actionLink.getAttribute('href')?.startsWith('#')) {
    modal.close();
  }
});

document.querySelectorAll('[data-policy]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const policy = link.dataset.policy;
    const message = {
      privacy: 'Privacy Policy: contact details are used only to answer the request and send product information. This prototype stores form data locally in the browser only.',
      terms: 'Terms of Use: toolkit files are for personal teaching use. Materials may be adapted for lessons, but should not be resold or redistributed as a separate product.',
      refund: 'Refund / Access Policy: access is provided digitally after confirmation. If a file cannot be opened, support or replacement access is provided.'
    }[policy];
    showToast(message, 4200);
  });
});

function showToast(message, timeout = 2600) {
  const toast = document.querySelector('.toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('visible'), timeout);
}
