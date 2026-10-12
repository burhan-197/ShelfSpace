const filterForm = document.getElementById('filter-form');
const dropDown = document.getElementById('filter-genre');
const sortDropdown = document.getElementById('filter-sort');

const deleteBookBtns = document.querySelectorAll('.delete-book-btn');
const deleteModal = document.getElementById('delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

const editBookBtns = document.querySelectorAll('.edit-book-btn');
const editModal = document.getElementById('edit-modal');
const editCloseBtn = document.getElementById('edit-close-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const editForm = document.getElementById('edit-book-form');

let selectedBookId = null;


// Genre filter
if (dropDown) {
    dropDown.addEventListener('change', function () {
        filterForm.submit();
    });
}

if (sortDropdown) {
    sortDropdown.addEventListener('change', function () {
        filterForm.submit();
    });
}

// Open delete modal
deleteBookBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        selectedBookId = btn.dataset.bookId;

        deleteModal.classList.remove('hidden');
    });
});


// Cancel deletion
cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.classList.add('hidden');
    selectedBookId = null;
});


// Confirm deletion
confirmDeleteBtn.addEventListener('click', async () => {
    if (!selectedBookId) return;

    try {
        const response = await fetch(`/books/${selectedBookId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            deleteModal.classList.add('hidden');
            window.location.reload();
        } else {
            console.error('Failed to delete book');
        }

    } catch (err) {
        console.error('Error deleting book:', err);
    }
});

editBookBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        selectedBookId = btn.dataset.bookId;
        editModal.classList.remove('hidden');
    });
});

editCloseBtn.addEventListener('click', () => {
    editModal.classList.add('hidden');
    selectedBookId = null;
});

cancelEditBtn.addEventListener('click', () => {
    editModal.classList.add('hidden');
    selectedBookId = null;
});
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedBookId) return;

    const formData = new FormData(editForm);

    for (const [key, value] of formData.entries()) {
        if (value === '' || (value instanceof File && value.size === 0)) {
            formData.delete(key);
        }
    }

    const response = await fetch(`/books/${selectedBookId}`, {
        method: 'PATCH',
        body: formData
    });

    if (response.ok) {
        window.location.reload();
    }
});
// ── Search: repopulate from ?q=, toggle the clear button ──
(function initSearch() {
    const searchInput = document.getElementById('book-search');
    const searchClear = document.getElementById('search-clear');
    if (!searchInput || !searchClear) return;

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) searchInput.value = q;

    const toggleClear = () => {
        searchClear.style.visibility = searchInput.value ? 'visible' : 'hidden';
    };
    searchInput.addEventListener('input', toggleClear);
    toggleClear();

    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        toggleClear();
        searchInput.focus();
    });
})();

// ── Pagination: keep current search/filters when changing pages ──
(function preservePaginationParams() {
    const current = new URLSearchParams(window.location.search);
    document.querySelectorAll('.pagination__btn[data-page]').forEach((btn) => {
        const params = new URLSearchParams(current);
        params.set('page', btn.dataset.page);
        btn.href = '?' + params.toString();
    });
})();
