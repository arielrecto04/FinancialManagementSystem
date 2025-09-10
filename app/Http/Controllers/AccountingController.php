<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountingController extends Controller
{
    public function index()
    {
        return Inertia::render('Accounting/Dashboard');
    }

}
