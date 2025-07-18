# Payments Page

## Overview
The payments page displays a comprehensive list of all payments in the system with advanced filtering capabilities and summary statistics.

## Features

### 1. Advanced Filtering
- **Date Range Filtering**: Filter payments by from/to dates
- **Organization Filtering**: Filter by specific organization
- **Status Filtering**: Filter by payment status (Success, Pending, Failed, Processing, Refunded)
- **Payment Method Filtering**: Filter by payment method (Stripe, Momo, VNPay, Cash)
- **Clear Filters**: Reset all filters to default state

### 2. Summary Statistics
- **Total Payments**: Count of all payments in the filtered results
- **Total Amount**: Sum of all payment amounts in VND
- **Success Rate**: Percentage of successful payments

### 3. Payment Table
The table displays the following information for each payment:
- **User**: User who made the payment (with avatar)
- **Event**: Associated event
- **Organization**: Organization that owns the event
- **Amount**: Payment amount in VND
- **Payment Method**: Method used (Stripe, Momo, VNPay, Cash)
- **Status**: Payment status with color-coded badges
- **Transaction ID**: Unique transaction identifier
- **Created At**: Timestamp of payment creation

## API Integration

### Current Implementation
The page currently works with the existing API structure:
- Fetches all orders via `/orders` endpoint
- For each order, fetches payments via `/orders/{orderId}/payments`
- Combines and filters the data on the frontend

### Suggested API Improvements
For better performance, consider implementing these new endpoints:

#### 1. General Payments Endpoint
```
GET /payments?from_date=2025-01-01&to_date=2025-12-31&organization_id=org_id&status=SUCCESS&payment_method=STRIPE&page=1&limit=20
```

#### 2. Payment Statistics Endpoint
```
GET /payments/stats?from_date=2025-01-01&to_date=2025-12-31&organization_id=org_id&group_by=day
```

## Usage

### Accessing the Page
1. Navigate to the sidebar menu
2. Click on "Payments" under the "OTHERS" section
3. The page will load with all payments and summary statistics

### Using Filters
1. **Date Range**: Select from and to dates to filter payments within a specific period
2. **Organization**: Choose a specific organization from the dropdown
3. **Status**: Select a payment status to filter by
4. **Payment Method**: Choose a payment method to filter by
5. **Clear Filters**: Click "Clear Filters" to reset all filters

### Understanding the Data
- **Payment Status Colors**:
  - Green: Success/Completed
  - Yellow: Pending
  - Red: Failed
  - Blue: Processing
  - Purple: Refunded
  - Gray: Other statuses

- **Payment Method Colors**:
  - Blue: Stripe
  - Pink: Momo
  - Green: VNPay
  - Gray: Cash

## Technical Details

### Components Used
- `DashboardLayout`: Main layout wrapper
- `IconCreditCard`, `IconUser`, `IconCheck`, etc.: Tabler icons
- Custom `AvatarImg` component for user avatars
- Responsive table with horizontal scrolling

### State Management
- `payments`: Array of payment objects
- `loading`: Loading state
- `error`: Error state
- `organizations`: List of organizations for filter dropdown
- `filters`: Current filter state

### Authentication
- Uses JWT token from localStorage/sessionStorage
- Handles 401 authentication errors
- Redirects to login if no token found

## Future Enhancements

1. **Pagination**: Add pagination for large datasets
2. **Export**: Add CSV/PDF export functionality
3. **Real-time Updates**: WebSocket integration for live payment updates
4. **Advanced Analytics**: Charts and graphs for payment trends
5. **Bulk Actions**: Select multiple payments for bulk operations
6. **Search**: Add text search functionality
7. **Sorting**: Add column sorting capabilities

## Dependencies
- React hooks (useState, useEffect)
- Next.js Image component
- Tabler Icons
- Tailwind CSS for styling
- Custom API configuration

## Error Handling
- Network errors are displayed to the user
- Authentication errors redirect to login
- Empty states show appropriate messages
- Loading states provide user feedback 