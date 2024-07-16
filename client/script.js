const sayHiButton = document.getElementById('button-1');
const mainContent = document.querySelector('main')
const toggleClassButton = document.getElementById('toggleClass');
const API_URL = 'http://localhost:3000/api';

// Fetch and display comments
async function fetchComments() {
    try {
        const response = await fetch(`${API_URL}/comments`);
        const comments = await response.json();
        const commentsList = document.getElementById('comments-list');
        commentsList.innerHTML = '';

        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.dataset.commentId = comment.id;  // Add this line
            commentElement.innerHTML = `
                <h3>${comment.name}</h3>
                <p class="comment-content">${comment.content}</p>
                <button class="edit-button">Edit</button>
                <button class="delete-button">Delete</button>
            `;
            const editButton = commentElement.querySelector('.edit-button');
            editButton.addEventListener('click', () => showEditForm(comment.id, comment.name, comment.content));
            const deleteButton = commentElement.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => deleteComment(comment.id));
            commentsList.appendChild(commentElement);
        });
        console.log('Comments loaded:', comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

// Add a new comment
async function addComment(event) {
    event.preventDefault();
    const nameInput = document.getElementById('name');
    const contentInput = document.getElementById('content');

    const name = nameInput.value.trim();
    const content = contentInput.value.trim();

    if (!name || !content) {
        alert('Please fill in both name and comment fields.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, content }),
        });

        if (response.ok) {
            nameInput.value = '';
            contentInput.value = '';
            fetchComments();
        } else {
            throw new Error('Failed to add comment');
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        alert('Failed to add comment. Please try again.');
    }
}

// Edit a comment
async function editComment(id, name, newContent) {
    try {
        const response = await fetch(`${API_URL}/comments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, content: newContent }),
        });

        if (response.ok) {
            fetchComments();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update comment');
        }
    } catch (error) {
        console.error('Error updating comment:', error);
        alert(error.message);
    }
}

// Show edit form
function showEditForm(id, name, content) {
    console.log('showEditForm called with:', id, name, content);
    const commentElement = document.querySelector(`.comment[data-comment-id="${id}"]`);
    if (!commentElement) {
        console.error('Comment element not found');
        return;
    }
    const contentElement = commentElement.querySelector('.comment-content');
    if (!contentElement) {
        console.error('Content element not found');
        return;
    }
    contentElement.innerHTML = `
        <input type="text" id="edit-name-${id}" value="${name}" placeholder="Your Name" required>
        <textarea id="edit-content-${id}">${content}</textarea>
        <button onclick="submitEdit(${id})">Save</button>
        <button onclick="cancelEdit(${id}, '${name.replace(/'/g, "\\'")}', '${content.replace(/'/g, "\\'")}')">Cancel</button>
    `;
}
// Submit edited comment
function submitEdit(id) {
    const name = document.getElementById(`edit-name-${id}`).value;
    const newContent = document.getElementById(`edit-content-${id}`).value;
    editComment(id, name, newContent);
}

// Cancel edit
function cancelEdit(id, originalName, originalContent) {
    const commentElement = document.querySelector(`.comment:has(button[onclick^="showEditForm(${id})"])`);
    const contentElement = commentElement.querySelector('.comment-content');
    contentElement.innerHTML = originalContent;
}

// Delete a comment
async function deleteComment(id) {
    try {
        const response = await fetch(`${API_URL}/comments/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchComments();
        } else {
            throw new Error('Failed to delete comment');
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment. Please try again.');
    }
}

document.getElementById('comment-form').addEventListener('submit', addComment);

fetchComments();
console.log('Initial fetch of comments called');


sayHiButton.addEventListener('click', () => {
    const newContent = document.createElement('p');
    newContent.textContent = 'Hi! I am Darol.';
    mainContent.appendChild(newContent);
})

toggleClassButton.addEventListener('click', () => {
    mainContent.classList.toggle('highlight');
});