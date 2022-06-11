<?php

namespace App\Library\Services;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class UploadImage
{
    public static function uploadMultipleImages($type, $request, $instance)
    {
        if ($request->hasFile($type)) {
            $fileAdders = $instance->addMultipleMediaFromRequest(['images'])
                ->each(function ($fileAdder) {
                    $fileAdder->toMediaCollection('gallery');
                });
        }
    }
}
