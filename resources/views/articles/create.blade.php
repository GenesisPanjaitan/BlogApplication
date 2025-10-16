@extends('layouts.app')

@section('title','Add Article')

@section('content')
    <div class="page-head">
        <h1>Add New Article</h1>
    </div>

    <form id="articleForm" action="{{ route('articles.store') }}" method="POST">
        @csrf
        <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" name="title" required>
        </div>
        <div class="form-group">
            <label for="author">Author</label>
            <input type="text" id="author" name="author" required>
        </div>
        <div class="form-group">
            <label for="content">Content</label>
            <textarea id="content" name="content" required></textarea>
        </div>
        <button type="submit" class="btn">Submit</button>
    </form>
@endsection
