<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Requests Report</title>
    <style>
        @font-face {
            font-family: 'DejaVu Sans';
            src: url('{{ storage_path('fonts/DejaVuSans.ttf') }}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 10px;
            line-height: 1.3;
            margin: 20px;
            color: #374151;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
        }
        .logo {
            max-width: 120px;
            height: auto;
            margin-bottom: 10px;
        }
        .company-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #1e40af;
        }
        .report-title {
            font-size: 14px;
            margin-bottom: 5px;
            text-transform: uppercase;
            color: #4b5563;
        }
        .date {
            font-size: 10px;
            color: #6b7280;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 9px;
        }
        th, td {
            border: 0.5px solid #e5e7eb;
            padding: 6px;
            text-align: left;
        }
        th {
            background-color: #1e40af;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 8px;
        }
        tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .status-pending {
            color: #f59e0b;
            font-weight: 600;
        }
        .status-approved {
            color: #10b981;
            font-weight: 600;
        }
        .status-rejected {
            color: #ef4444;
            font-weight: 600;
        }
        .amount {
            text-align: right;
            font-family: 'Courier New', monospace;
            font-weight: 600;
        }
        .summary-section {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
        }
        .summary-title {
            font-size: 12px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 15px;
        }
        .summary-item {
            background-color: #f8fafc;
            padding: 8px;
            border-radius: 4px;
            border: 0.5px solid #e5e7eb;
        }
        .summary-label {
            font-size: 8px;
            color: #6b7280;
            margin-bottom: 3px;
            text-transform: uppercase;
        }
        .summary-value {
            font-size: 10px;
            font-weight: bold;
            color: #374151;
        }
        .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            font-size: 8px;
            text-align: center;
            color: #6b7280;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('images/logo.png') }}" class="logo" alt="Company Logo">
        <div class="company-name">{{ $companyName }}</div>
        <div class="report-title">{{ $reportTitle }}</div>
        <div class="date">Generated on: {{ $date }}</div>
    </div>

    <div class="report-header">
        <h1>{{ $reportTitle }}</h1>
        <p>Generated on: {{ $date }}</p>
        @if($isDateRangeActive)
        <p>Date Range: {{ $startDate }} - {{ $endDate }}</p>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>Request #</th>
                <th>Type</th>
                <th>Requestor</th>
                <th>Department</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach($requests as $request)
                <tr>
                    <td>{{ $request['request_number'] }}</td>
                    <td>{{ $request['type'] }}</td>
                    <td>{{ $request['user_name'] }}</td>
                    <td>{{ $request['department'] }}</td>
                    <td class="amount">PHP {{ number_format($request['total_amount'] ?? $request['amount'] ?? 0, 2) }}</td>
                    <td class="status-{{ strtolower($request['status']) }}">{{ $request['status'] }}</td>
                    <td>{{ $request['created_at'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="summary-section">
        <div class="summary-title">Summary Breakdown</div>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-label">Total Requests</div>
                <div class="summary-value">{{ count($requests) }}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Total Amount</div>
                <div class="summary-value">PHP {{ number_format(collect($requests)->sum(function($request) {
                    return $request['total_amount'] ?? $request['amount'] ?? 0;
                }), 2) }}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Date Range</div>
                <div class="summary-value">{{ isset($startDate) ? $startDate . ' - ' . $endDate : 'All Time' }}</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <p>© {{ date('Y') }} {{ $companyName }}. All rights reserved.</p>
        <div>Page 1</div>
    </div>
</body>
</html> 