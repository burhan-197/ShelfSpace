const deleteBookBtn = document.getElementById('delete-book-btn');
const deleteModal = document.getElementById('delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const editBookBtn = document.getElementById('edit-book-btn');
const editModal = document.getElementById('edit-modal');
const editCloseBtn = document.getElementById('edit-close-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const editForm = document.getElementById('edit-book-form');


let selectedBookId = null;

deleteBookBtn.addEventListener('click', () => {
    deleteModal.classList.remove('hidden');
});
cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.classList.add('hidden');
});
confirmDeleteBtn.addEventListener('click', async () => {
    selectedBookId = deleteBookBtn.dataset.bookId;
    if (!selectedBookId) return;

    try {

        const response = await fetch(`/books/${selectedBookId}`, {
            method: 'DELETE'
        });
        console.log('status:', response.status);
console.log('ok:', response.ok);

        if (response.ok) {
            deleteModal.classList.add('hidden');
            window.location.href = '/';
        } else {
            console.error('Failed to delete book');
        }

    } catch (err) {
        console.error('Error deleting book:', err);
    }
});

editBookBtn.addEventListener('click', () => {
    editModal.classList.remove('hidden');
});

editCloseBtn.addEventListener('click', () => {
    editModal.classList.add('hidden');
});

cancelEditBtn.addEventListener('click', () => {
    editModal.classList.add('hidden');
});

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookId = editBookBtn.dataset.bookId;

    const formData = new FormData(editForm);

    
    for (const [key, value] of formData.entries()) {
        if (value === '' || (value instanceof File && value.size === 0)) {
            formData.delete(key);
        }
    }

    const response = await fetch(`/books/${bookId}`, {
        method: 'PATCH',
        body: formData
    });

    if (response.ok) {
        window.location.reload();
    }
});