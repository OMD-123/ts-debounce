// Form Auto-Save Example
// Run with: npx ts-node examples/form-auto-save.ts

import { debounce } from '../src/index';

interface FormData {
  title: string;
  content: string;
  tags: string;
}

const form = document.getElementById('editor') as HTMLFormElement | null;
const STORAGE_KEY = 'draft-form-data';
const STATUS_EL = document.getElementById('save-status') as HTMLSpanElement | null;

function saveDraft(data: FormData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  if (STATUS_EL) {
    STATUS_EL.textContent = 'Saved';
    STATUS_EL.style.color = 'green';
  }
  console.log('Draft saved at', new Date().toISOString());
}

function loadDraft(): FormData | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
}

function showSaving() {
  if (STATUS_EL) {
    STATUS_EL.textContent = 'Saving...';
    STATUS_EL.style.color = 'orange';
  }
}

// Auto-save: debounce 2s, but force save at least every 10s
const autoSave = debounce(
  () => {
    showSaving();
    if (!form) return;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData) as FormData;
    saveDraft(data);
  },
  2000,
  { maxWait: 10000 }
);

// Attach to all form inputs
if (form) {
  form.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('input', () => autoSave());
  });
  
  // Load existing draft on init
  const draft = loadDraft();
  if (draft) {
    Object.entries(draft).forEach(([key, value]) => {
      const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement | HTMLTextAreaElement | null;
      if (input) input.value = value;
    });
    console.log('Draft loaded from localStorage');
  }
  
  // Manual save button
  const saveBtn = document.getElementById('manual-save') as HTMLButtonElement | null;
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      autoSave.flush(); // Force immediate save
    });
  }
  
  // Clear draft button
  const clearBtn = document.getElementById('clear-draft') as HTMLButtonElement | null;
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      if (STATUS_EL) {
        STATUS_EL.textContent = 'Draft cleared';
        STATUS_EL.style.color = 'red';
      }
      autoSave.cancel();
    });
  }
}

console.log('Form auto-save initialized. Type in form fields to trigger auto-save.');
console.log('Draft persists across page reloads.');

export { saveDraft, loadDraft, autoSave };