<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Requests Report</title>
    <style>
        /* Reset and Base Styles */
        body { 
            font-family: DejaVu Sans, sans-serif;
            margin: 0;
            padding: 30px;
            color: #374151;
            line-height: 1.5;
        }

        /* Header Styles */
        .header { 
            margin-bottom: 40px;
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
        }

        .logo {
            max-width: 180px;
            height: auto;
            margin-bottom: 15px;
        }

        .company-name {
            font-size: 28px;
            font-weight: bold;
            margin: 15px 0;
            color: #1e40af;
            letter-spacing: 0.5px;
        }

        .report-title {
            font-size: 22px;
            margin: 10px 0;
            color: #4b5563;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .date { 
            color: #6b7280;
            margin: 10px 0;
            font-size: 14px;
        }

        /* Table Styles */
        .table-container {
            margin: 20px 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        table { 
            width: 100%; 
            border-collapse: collapse; 
            background-color: white;
            font-size: 14px;
        }

        th { 
            background-color: #1e40af;
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 13px;
            letter-spacing: 0.5px;
        }

        td { 
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            color: #4b5563;
        }

        tr:nth-child(even) {
            background-color: #f8fafc;
        }

        tr:hover {
            background-color: #f3f4f6;
        }

        /* Status Badges */
        .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            text-transform: capitalize;
        }

        .status-pending {
            background-color: #fef3c7;
            color: #92400e;
        }

        .status-approved {
            background-color: #dcfce7;
            color: #166534;
        }

        .status-rejected {
            background-color: #fee2e2;
            color: #991b1b;
        }

        /* Amount Column */
        .amount {
            font-family: DejaVu Sans Mono, monospace;
            font-weight: 600;
        }

        /* Summary and Footer Styles */
        .summary-and-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
        }

        .summary {
            margin-bottom: 20px;
            font-size: 14px;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 4px 0;
        }

        .summary-label {
            color: #6b7280;
            font-weight: 500;
        }

        .summary-value {
            font-weight: 600;
            color: #1e40af;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }

        .page-number {
            text-align: right;
            font-size: 12px;
            color: #9ca3af;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('images/logo.png') }}" class="logo" alt="Company Logo">
        <div class="company-name">Innvoato Information Technology Solutions</div>
        <div class="report-title">Requests Report</div>
        <div class="date">Generated on: {{ $date }}</div>
    </div>

    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Request Number</th>
                    <th>Type</th>
                    <th>Requested By</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Amount</th>
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
                        <td>
                            <span class="status-badge status-{{ strtolower($request['status']) }}">
                                {{ ucfirst($request['status']) }}
                            </span>
                        </td>
                        <td class="amount">PHP {{ number_format($request['total_amount'] ?? $request['amount'] ?? 0, 2) }}</td>
                        <td>{{ $request['created_at'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="summary-and-footer">
        <div class="summary">
            <div class="summary-row">
                <span class="summary-label">Total Requests:</span>
                <span class="summary-value">{{ count($requests) }}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Total Amount:</span>
                <span class="summary-value">PHP {{ number_format(collect($requests)->sum(function($request) {
                    return $request['total_amount'] ?? $request['amount'] ?? 0;
                }), 2) }}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Date Range:</span>
                <span class="summary-value">{{ isset($startDate) ? $startDate . ' - ' . $endDate : 'All Time' }}</span>
            </div>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} Innvoato Information Technology Solutions. All rights reserved.</p>
            <div class="page-number">Page 1 of 1</div>
        </div>
    </div>
</body>
</html> 