// Client-side helpers for article listing and search. Works gracefully on pages without all elements.
document.addEventListener('DOMContentLoaded', () => {
    const articleForm = document.getElementById('articleForm');
    const articleList = document.getElementById('articleList');
    const searchInput = document.getElementById('searchInput');

    // Utility: read articles from localStorage; fall back to empty array.
    function readArticles() {
        try {
            return JSON.parse(localStorage.getItem('articles')) || [];
        } catch (e) {
            console.warn('Could not parse articles from localStorage', e);
            return [];
        }
    }

    // Render articles grid (expects element with id articleList)
    function renderArticles(listEl, articles) {
        if (!listEl) return;
        listEl.innerHTML = '';
        if (!articles.length) {
            listEl.innerHTML = '<div class="muted">No articles yet.</div>';
            return;
        }
        articles.forEach((article, index) => {
            const card = document.createElement('article');
            card.className = 'article-card';
            // build delete form HTML using CSRF token from meta tag (server expects @csrf and _method=DELETE)
            const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            card.innerHTML = `
                <h3><a href="/articles/${article.id}">${escapeHtml(article.title)}</a></h3>
                <div class="article-meta">by <strong>${escapeHtml(article.author)}</strong></div>
                <p class="muted">${escapeHtml(article.content.length > 140 ? article.content.slice(0,140) + '...' : article.content)}</p>
                <div style="margin-top:10px">
                    <a href="/articles/${article.id}" class="btn btn-outline">Read</a>
                    <form action="/articles/${article.id}" method="POST" style="display:inline-block;margin-left:8px" onsubmit="return confirm('Delete this article?');">
                        <input type="hidden" name="_token" value="${csrf}">
                        <input type="hidden" name="_method" value="DELETE">
                        <button type="submit" class="btn btn-outline-danger">Delete</button>
                    </form>
                </div>
            `;
            listEl.appendChild(card);
        });
    }

    // Basic XSS-safe text escape
    function escapeHtml(text) {
        if (typeof text !== 'string') return '';
        return text.replace(/[&<>\"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]);
    }

    // When form exists, wire submission to localStorage and let server route handle session copy (server-side uses session currently)
    if (articleForm) {
        articleForm.addEventListener('submit', (e) => {
            // Let the normal form submit occur so server controller can store in session.
            // But also save a copy in localStorage for client-side reads.
            const title = document.getElementById('title')?.value || '';
            const author = document.getElementById('author')?.value || '';
            const content = document.getElementById('content')?.value || '';

            const articles = readArticles();
            // create a local id if none
            const nextId = articles.length ? (Math.max(...articles.map(a=>a.id||0)) +1) : 1;
            articles.push({ id: nextId, title, author, content });
            localStorage.setItem('articles', JSON.stringify(articles));
            // don't prevent default: allow post to server
        });
    }

    // Search handler
    if (searchInput) {
        // If server rendered the list, submit the form to server after a debounce;
        // otherwise, use client-side filtering (fallback).
        const form = searchInput.closest('form');
        if (form && articleList && articleList.children.length > 0) {
            // server side: debounce submit so typing triggers GET requests
            let timer = null;
            const debounceMs = 400;
            searchInput.addEventListener('input', () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    const q = searchInput.value || '';
                    const url = form.action + (q ? ('?search=' + encodeURIComponent(q)) : '');
                    // navigate to server search URL
                    window.location.href = url;
                }, debounceMs);
            });
        } else if (searchInput && articleList) {
            // client-side fallback (when list is not server-rendered)
            const handleSearch = () => {
                const q = (searchInput.value || '').toLowerCase();
                const articles = readArticles();
                const filtered = articles.filter(a => (a.title||'').toLowerCase().includes(q));
                renderArticles(articleList, filtered);
            };
            searchInput.addEventListener('input', handleSearch);
        }
    }

    // Initial render: only render client-side if server did not already render articles
    if (articleList) {
        const hasServerRendered = articleList.children.length > 0;
        if (!hasServerRendered) {
            renderArticles(articleList, readArticles());
        } else {
            // server rendered content exists: remove stale client-side articles to avoid conflicts
            try { localStorage.removeItem('articles'); } catch(e) {}
        }
    }
});
