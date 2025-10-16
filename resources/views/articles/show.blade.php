@extends('layouts.app')

@section('title', $article['title'] ?? 'Article')

@section('content')
    <article class="article-card">
        <h1>{{ $article['title'] ?? 'Untitled' }}</h1>
        <div class="article-meta">by <strong>{{ $article['author'] ?? 'Unknown' }}</strong></div>
        <div class="content">
            <p>{{ $article['content'] ?? '' }}</p>
        </div>
        <div style="margin-top:12px">
            <a href="{{ route('articles.index') }}" class="btn btn-outline">Back to Articles</a>
        </div>
    </article>
@endsection
