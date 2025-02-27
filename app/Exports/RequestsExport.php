<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class RequestsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $requests;

    public function __construct($requests)
    {
        $this->requests = $requests;
    }

    public function collection()
    {
        return collect($this->requests);
    }

    public function headings(): array
    {
        return [
            'Request Number',
            'Type',
            'Requested By',
            'Department',
            'Status',
            'Amount',
            'Date',
            'Remarks'
        ];
    }

    public function map($request): array
    {
        return [
            $request['request_number'],
            $request['type'],
            $request['user_name'],
            $request['department'],
            ucfirst($request['status']),
            '₱' . number_format($request['total_amount'] ?? $request['amount'] ?? 0, 2),
            $request['created_at'],
            $request['remarks'] ?? ''
        ];
    }
} 