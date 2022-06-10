<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Property extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'address',
        'description',
        'price',
        'user_id',
    ];

    protected $appends = [
        'gallery',
    ];

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id ');
    }

    public function getGalleryAttribute()
    {
        return $this->getMedia('gallery');
    }

    public static function  getProperty()
    {
        return DB::table('properties')->select('id', 'address', 'description', 'price')->get()->toArray();

    }
}
