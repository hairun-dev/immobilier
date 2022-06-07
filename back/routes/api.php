<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function  () {
    return [
        'success' => true,
        'message' => 'Laravel 8.* Vue js',
        'data' => [
            'version' => '1.0',
            'language' => app()->getLocale()
        ]
    ];
});
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
