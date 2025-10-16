@extends('layouts.app')

@section('title','Articles')

@section('content')
    <div class="page-head">
        <h1>Articles</h1>
        <a href="{{ route('articles.create') }}" class="btn">+ Add New Article</a>
    </div>

    <div class="search-row">
        <form action="{{ route('articles.search') }}" method="GET" style="width:100%;display:flex">
            <input type="search" name="search" id="searchInput" placeholder="Search articles by title..." value="{{ request('search') }}" style="flex:1">
        </form>
    </div>

    <div class="articles-grid" id="articleList">
        @forelse($articles as $article)
            <article class="article-card">
                <h3><a href="{{ route('articles.show', $article->id) }}">{{ $article->title }}</a></h3>
                <div class="article-meta">by <strong>{{ $article->author }}</strong></div>
                <p class="muted">{{ 
                    strlen($article->content) > 140 ? substr($article->content,0,140) . '...' : $article->content
                }}</p>
                <div style="margin-top:10px">
                    <a href="{{ route('articles.show', $article->id) }}" class="btn btn-outline">Read</a>
                    <form action="{{ route('articles.destroy', $article->id) }}" method="POST" style="display:inline-block;margin-left:8px" onsubmit="return confirm('Delete this article?');">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-outline-danger">Delete</button>
                    </form>
                </div>
            </article>
        @empty
            <div class="muted">No articles yet. Add one using the button above.</div>
        @endforelse
    </div>
@endsection
