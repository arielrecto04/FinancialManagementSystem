<?php

namespace App\Actions;

use App\Models\Liquidation;
use App\Models\HrExpense;
use App\Models\SupplyRequest;
use App\Models\ReimbursementRequest;
use App\Models\PettyCashRequest;
use App\Models\OperatingExpense;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;

class GenerateRequestNumber
{
    protected $modelMap = [
        'liquidation' => [
            'model' => Liquidation::class,
            'prefix' => 'LIQ',
            'sequence_field' => 'request_number'
        ],
        'hr_expense' => [
            'model' => HrExpense::class,
            'prefix' => 'HR',
            'sequence_field' => 'request_number'
        ],
        'supply_request' => [
            'model' => SupplyRequest::class,
            'prefix' => 'SUP',
            'sequence_field' => 'request_number'
        ],
        'reimbursement_request' => [
            'model' => ReimbursementRequest::class,
            'prefix' => 'REM',
            'sequence_field' => 'request_number'
        ],
        'petty_cash_request' => [
            'model' => PettyCashRequest::class,
            'prefix' => 'PC',
            'sequence_field' => 'request_number',
            'include_request_type' => true
        ],
        'operating_expense' => [
            'model' => OperatingExpense::class,
            'prefix' => 'OPEX',
            'sequence_field' => 'request_number'
        ]
    ];

    public function handle(string $modelType, Model $model, array $additionalParams = []): string
    {
        if (!array_key_exists($modelType, $this->modelMap)) {
            throw new \InvalidArgumentException("Invalid model type: {$modelType}");
        }

        $config = $this->modelMap[$modelType];
        $prefix = $config['prefix'];
        $sequenceField = $config['sequence_field'];
        $includeRequestType = $config['include_request_type'] ?? false;

        $query = $config['model']::query();

        // For models that need request type in the sequence
        if ($includeRequestType && !empty($additionalParams['request_type'])) {
            $query->where('request_type', $additionalParams['request_type']);
            $prefix .= '-' . strtoupper(substr($additionalParams['request_type'], 0, 3));
        }

        // Get the latest record
        $latest = (clone $query)->latest('id')->first();

        // Extract the sequence number from the latest record if it exists
        $sequence = 1;
        if ($latest && !empty($latest->{$sequenceField})) {
            $lastNumber = $this->extractSequenceNumber($latest->{$sequenceField}, $prefix);
            if ($lastNumber !== null) {
                $sequence = $lastNumber + 1;
            }
        }

        // Format the request number
        $requestNumber = $this->formatRequestNumber($prefix, $sequence);



        // Set the request number on the model
        $model->{$sequenceField} = $requestNumber;

        return $requestNumber;
    }

    protected function extractSequenceNumber(string $requestNumber, string $prefix): ?int
    {
        $pattern = '/^' . preg_quote($prefix, '/') . '-(\\d+)$/';
        if (preg_match($pattern, $requestNumber, $matches)) {
            return (int) $matches[1];
        }
        return null;
    }

    protected function formatRequestNumber(string $prefix, int $sequence): string
    {
        return sprintf('%s-%04d', $prefix, $sequence);
    }
}
