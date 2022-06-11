<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePropertyRequest;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Exports\PropertyExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Library\Services;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PropertyController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
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

        if ($property) {
            Services\UploadImage::uploadMultipleImages('images', $request, $property);
        }

        return response()->json([
            "message" => "success",
        ], 201);
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
    public function update(StorePropertyRequest $request, Property $property): JsonResponse
    {
        return \response()->json([
            "property" => $property->update($request->all()),
        ],202 );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Property $property
     * @return Response
     */
    public function destroy(Property $property): Response
    {
        $property->delete();
        return response(null, 204);
    }

    /**
     * Remove all Gallery and Insert new
     * @param Request $request
     * @param $id
     * @return JsonResponse
     */
    public function galleryUpdate(Request $request, $id): JsonResponse
    {
        $media = Media::find($id);
        $property = Property::find($media->model_id);
        if($property){
            $property->media()->delete($id);
            Services\UploadImage::uploadMultipleImages('images', $request, $property);
        }
        return \response()->json([
            "message" => 'success',
        ]);
    }

    public function exportIntoExcel(): BinaryFileResponse
    {
        return Excel::download(new PropertyExport, 'propertyList.xlsx');
    }

}
