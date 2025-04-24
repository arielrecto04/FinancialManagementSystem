<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style type="text/css">
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
        }
        .header {
            background-color: #3490dc;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
        .button {
            display: inline-block;
            background-color: #3490dc;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            margin-top: 15px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>{{ $requestType }} Request Notification</h2>
        <p>Request #{{ $requestNumber }}</p>
    </div>
    
    <div class="content">
        <p>Hello {{ $adminName }},</p>
        
        <p>A new {{ $requestType }} request has been submitted by <strong>{{ $requesterName }}</strong>.</p>
        
        <h3>Request Details:</h3>
        
        <table>
            <tbody>
                @if(strtolower($requestType) == 'supply')
                    <tr>
                        <th>Department</th>
                        <td>{{ $requestData['department'] }}</td>
                    </tr>
                    <tr>
                        <th>Purpose</th>
                        <td>{{ $requestData['purpose'] }}</td>
                    </tr>
                    <tr>
                        <th>Date Needed</th>
                        <td>{{ $requestData['date_needed'] }}</td>
                    </tr>
                    <tr>
                        <th>Total Amount</th>
                        <td>₱{{ number_format($requestData['total_amount'], 2) }}</td>
                    </tr>
                @elseif(strtolower($requestType) == 'reimbursement')
                    <tr>
                        <th>Department</th>
                        <td>{{ $requestData['department'] }}</td>
                    </tr>
                    <tr>
                        <th>Expense Type</th>
                        <td>{{ $requestData['expense_type'] }}</td>
                    </tr>
                    <tr>
                        <th>Expense Date</th>
                        <td>{{ $requestData['expense_date'] }}</td>
                    </tr>
                    <tr>
                        <th>Amount</th>
                        <td>₱{{ number_format($requestData['amount'], 2) }}</td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>{{ $requestData['description'] }}</td>
                    </tr>
                @elseif(strtolower($requestType) == 'liquidation')
                    <tr>
                        <th>Department</th>
                        <td>{{ $requestData['department'] }}</td>
                    </tr>
                    <tr>
                        <th>Expense Type</th>
                        <td>{{ $requestData['expense_type'] }}</td>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <td>{{ $requestData['date'] }}</td>
                    </tr>
                    <tr>
                        <th>Cash Advance</th>
                        <td>₱{{ number_format($requestData['cash_advance_amount'], 2) }}</td>
                    </tr>
                    <tr>
                        <th>Total Amount</th>
                        <td>₱{{ number_format($requestData['total_amount'], 2) }}</td>
                    </tr>
                @elseif(strtolower($requestType) == 'petty cash')
                    <tr>
                        <th>Department</th>
                        <td>{{ $requestData['department'] }}</td>
                    </tr>
                    <tr>
                        <th>Purpose</th>
                        <td>{{ $requestData['purpose'] }}</td>
                    </tr>
                    <tr>
                        <th>Date Needed</th>
                        <td>{{ $requestData['date_needed'] }}</td>
                    </tr>
                    <tr>
                        <th>Amount</th>
                        <td>₱{{ number_format($requestData['amount'], 2) }}</td>
                    </tr>
                    <tr>
                        <th>Category</th>
                        <td>{{ $requestData['category'] }}</td>
                    </tr>
                @elseif(strtolower($requestType) == 'hr expenses')
                    <tr>
                        <th>Date of Request</th>
                        <td>{{ $requestData['date_of_request'] }}</td>
                    </tr>
                    <tr>
                        <th>Expenses Category</th>
                        <td>{{ $requestData['expenses_category'] }}</td>
                    </tr>
                    <tr>
                        <th>Total Amount</th>
                        <td>₱{{ number_format($requestData['total_amount_requested'], 2) }}</td>
                    </tr>
                    <tr>
                        <th>Expected Payment Date</th>
                        <td>{{ $requestData['expected_payment_date'] }}</td>
                    </tr>
                @elseif(strtolower($requestType) == 'operating expenses')
                    <tr>
                        <th>Date of Request</th>
                        <td>{{ $requestData['date_of_request'] }}</td>
                    </tr>
                    <tr>
                        <th>Expense Category</th>
                        <td>{{ $requestData['expense_category'] }}</td>
                    </tr>
                    <tr>
                        <th>Total Amount</th>
                        <td>₱{{ number_format($requestData['total_amount'], 2) }}</td>
                    </tr>
                    <tr>
                        <th>Expected Payment Date</th>
                        <td>{{ $requestData['expected_payment_date'] }}</td>
                    </tr>
                @endif
            </tbody>
        </table>
        
        <p>Please review this request at your earliest convenience.</p>
        
        <div style="text-align: center;">
            <a href="{{ url('/reports?request=' . $requestNumber) }}" class="button">View Request</a>
        </div>
    </div>
    
    <div class="footer">
        <p>This is an automated message from the Financial Management System. Please do not reply to this email.</p>
    </div>
</body>
</html> 