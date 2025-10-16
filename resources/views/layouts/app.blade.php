<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Blog Application')</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body>
    <header class="site-header">
        <div class="container header-inner">
            <div class="brand">
                <a href="{{ route('articles.index') }}">Blog<span class="accent">Application</span></a>
            </div>
        </div>
    </header>

    <main class="container main-content">
        @yield('content')
    </main>

    <script src="{{ asset('js/articles.js') }}"></script>
</body>
</html>