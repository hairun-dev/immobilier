<?php

use App\Http\Controllers\Api\V1\PropertyController;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cookie;
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

Route::apiResource('property', PropertyController::class);

Route::middleware(['auth', 'verified'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/register-retry', function(){
    Cookie::queue(Cookie::forget(strtolower(str_replace(' ', '_', config('app.name'))) . '_session'));;
    return redirect('/');
 });
