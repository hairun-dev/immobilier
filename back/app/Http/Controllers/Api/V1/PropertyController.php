<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePropertyRequest;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $property = Property::all();
        return \response()->json([
            "property" => $property
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StorePropertyRequest $request
     * @return JsonResponse
     */
    public function store(StorePropertyRequest  $request)
    {
        $property = Property::create([
            'address' => $request->get('address'),
            'description' => $request->get('description'),
            'price' => $request->get('price'),
            'user_id' => $request->get('user_id'),
        ]);

        if ($property)
        {
            if ($request->hasFile('images')) {
                $fileAdders = $property->addMultipleMediaFromRequest(['images'])
                    ->each(function ($fileAdder) {
                        $fileAdder->toMediaCollection('gallery');
                    });
            }
        }

        return response()->json([
            "message" => "success",
            "status" => 200,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param Property $property
     * @return Response
     */
    public function show(Property $property)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param StorePropertyRequest $request
     * @param Property $property
     * @return JsonResponse
     */
    public function update(StorePropertyRequest $request, Property $property)
    {
        return \response()->json([
            "property" => $property->update($request->all()),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Property $property
     * @return Response
     */
    public function destroy(Property $property)
    {
        $property->delete();
        return response(null, 204);
    }

    public function galleryUpdate(Request $request, $id)
    {
        $media = Media::find($id);
        $property = Property::find($media->model_id);
        $property->media()->delete($id);
        if ($request->hasFile('images')) {
            foreach ($request->images as $images) {
                $property->addMedia($images)
                    ->toMediaCollection('gallery');
            }
        }
    }
}
