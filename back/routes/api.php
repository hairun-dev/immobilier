<?php

use App\Http\Controllers\Api\V1\PropertyController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Http\Controllers\ProfileInformationController;

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
Route::apiResource('user', UserController::class);
Route::get('user-list', [UserController::class, 'userList']);
Route::post('medias/{id}', [PropertyController::class, 'galleryUpdate']);
Route::get('export-excel', [PropertyController::class, 'exportIntoExcel']);
Route::put('/user/update', [UserController::class, 'update'])
    ->middleware(['guest:'.config('fortify.guard')])
    ->name('user-profile-information.update');

Route::get('/register-retry', function(){
    Cookie::queue(Cookie::forget(strtolower(str_replace(' ', '_', config('app.name'))) . '_session'));;
    return redirect('/');
 });
