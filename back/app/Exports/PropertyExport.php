<?php

namespace App\Exports;

use App\Models\Property;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PropertyExport implements FromCollection
{
    public function heading(): array
    {
        return [
           'Id',
            'Address',
            'Description',
            'Prix'
        ];
    }
    /**
    * @return Collection
    */
    public function collection(): Collection
    {
        return collect(Property::getProperty());
    }
}
