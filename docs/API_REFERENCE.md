# ToraShaout API Reference

Complete API documentation for all endpoints.

---

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

---

## Authentication

### Auth Header

For authenticated endpoints, include the Supabase session cookie:

```http
Cookie: sb-access-token=YOUR_TOKEN
```

Or use the `Authorization` header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Admin Endpoints

Endpoints marked with 🔐 require admin role. Returns:
- `401 Unauthorized` - If not authenticated
- `403 Forbidden` - If authenticated but not admin

---

## Talent Applications

### Submit Application

Submit a new talent application.

**Endpoint**: `POST /api/talent-applications`
**Access**: Authenticated users only
**Authentication**: Required (must be logged in)

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "stageName": "JD the Musician",
  "email": "john@example.com",
  "phone": "+263123456789",
  "category": "Musician",
  "bio": "Professional musician with 10+ years experience...",
  "yearsActive": "10",
  "notableWork": "Album XYZ, Show ABC, Festival performances...",
  "instagramHandle": "@johnmusic",
  "instagramFollowers": "50000",
  "facebookPage": "facebook.com/johnmusic",
  "facebookFollowers": "30000",
  "youtubeChannel": "youtube.com/@johnmusic",
  "youtubeSubscribers": "25000",
  "twitterHandle": "@johnmusic",
  "tiktokHandle": "@johnmusic",
  "proposedPrice": "75",
  "responseTime": "48",
  "hearAboutUs": "social_media",
  "additionalInfo": "Available for live performances too",
  "agreeToTerms": true
}
```

**Validation Rules**:
- `firstName`, `lastName`, `stageName`: Required, non-empty string
- `email`: Required, valid email format, must be unique
- `phone`: Required, non-empty string
- `category`: Required, must be valid category
- `bio`: Required, minimum 10 characters
- `yearsActive`: Required, positive integer
- `notableWork`: Required, minimum 10 characters
- `proposedPrice`: Required, minimum 25 (USD)
- `responseTime`: Required, must be 24, 48, 72, or 168
- `agreeToTerms`: Required, must be true

**Success Response**: `200 OK`
```json
{
  "success": true,
  "applicationId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Application submitted successfully! We will review it and get back to you within 5-7 business days."
}
```

**Error Response**: `401 Unauthorized`
```json
{
  "success": false,
  "error": "You must be logged in to submit an application."
}
```

**Error Response**: `400 Bad Request` (Duplicate Application)
```json
{
  "success": false,
  "error": "You already have an application with status: pending. Please wait for review."
}
```

**Validation Error**: `400 Bad Request`
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "First name is required",
    "Valid email address is required",
    "Bio must be at least 10 characters"
  ]
}
```

---

### Get All Applications 🔐

Get all talent applications with optional filtering.

**Endpoint**: `GET /api/talent-applications?status=pending`
**Access**: Admin only
**Authentication**: Required

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by status: `all`, `pending`, `under_review`, `approved`, `rejected`, `onboarding` |

**Example Requests**:
```bash
# Get all applications
GET /api/talent-applications

# Get pending applications
GET /api/talent-applications?status=pending

# Get approved applications
GET /api/talent-applications?status=approved
```

**Success Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "first_name": "John",
      "last_name": "Doe",
      "stage_name": "JD the Musician",
      "email": "john@example.com",
      "phone": "+263123456789",
      "category": "musician",
      "bio": "Professional musician...",
      "years_active": 10,
      "notable_work": "Album XYZ...",
      "instagram_handle": "@johnmusic",
      "instagram_followers": 50000,
      "facebook_page": "facebook.com/johnmusic",
      "facebook_followers": 30000,
      "youtube_channel": "youtube.com/@johnmusic",
      "youtube_subscribers": 25000,
      "twitter_handle": "@johnmusic",
      "tiktok_handle": "@johnmusic",
      "proposed_price_usd": 75.00,
      "response_time_hours": 48,
      "hear_about_us": "social_media",
      "additional_info": "Available for live performances",
      "status": "pending",
      "admin_notes": null,
      "reviewed_by": null,
      "reviewed_at": null,
      "created_at": "2026-01-20T10:30:00Z",
      "updated_at": "2026-01-20T10:30:00Z"
    }
  ]
}
```

**Error Response**: `401 Unauthorized`
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**Error Response**: `403 Forbidden`
```json
{
  "success": false,
  "error": "Forbidden: Admin access required"
}
```

---

### Get Application by ID 🔐

Get a single application by its ID.

**Endpoint**: `GET /api/talent-applications/[id]/status`
**Access**: Admin only
**Authentication**: Required

**URL Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Application ID |

**Example Request**:
```bash
GET /api/talent-applications/550e8400-e29b-41d4-a716-446655440000/status
```

**Success Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "first_name": "John",
    "last_name": "Doe",
    "stage_name": "JD the Musician",
    // ... all other fields
  }
}
```

**Error Response**: `404 Not Found`
```json
{
  "success": false,
  "error": "Application not found."
}
```

---

### Update Application Status 🔐

Update the status of an application.

**Endpoint**: `PATCH /api/talent-applications/[id]/status`
**Access**: Admin only
**Authentication**: Required

**URL Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Application ID |

**Request Body**:
```json
{
  "status": "approved",
  "adminNotes": "Strong social media presence. Approved for onboarding."
}
```

**Status Values**:
- `pending` - Initial state
- `under_review` - Admin is reviewing
- `approved` - Application approved
- `rejected` - Application rejected
- `onboarding` - Approved and in onboarding process

**Optional Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `adminNotes` | string | Admin comments about the application |

**Automatic Fields**:
When status is changed from `pending`:
- `reviewed_by`: Set to current admin's user ID
- `reviewed_at`: Set to current timestamp

**Automatic Talent Onboarding**:
When status is set to `approved`, the system automatically:
1. Changes user's role from `fan` to `talent`
2. Creates a `talent_profiles` record with:
   - `display_name`: from application's `stage_name`
   - `bio`: from application's `bio`
   - `category`: from application's `category`
   - `price_usd`: from application's `proposed_price_usd`
   - `response_time_hours`: from application's `response_time_hours`
   - `admin_verified`: set to `true`
   - `is_accepting_bookings`: set to `true`
3. Makes talent profile visible on the platform

**Success Response**: `200 OK`
```json
{
  "success": true
}
```

**Error Response**: `400 Bad Request`
```json
{
  "success": false,
  "error": "Invalid status"
}
```

**Error Response**: `401 Unauthorized`
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**Error Response**: `403 Forbidden`
```json
{
  "success": false,
  "error": "Forbidden: Admin access required"
}
```

---

## Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid input, validation failed |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Authenticated but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server error occurred |

---

## Rate Limiting

**Not yet implemented** - Consider adding rate limiting to prevent abuse, especially on public endpoints like application submission.

**Recommended limits**:
- Application submission: 5 per hour per IP
- Admin endpoints: 100 per minute per user

---

## Error Handling

### Standard Error Response

All errors follow this format:

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

### Validation Errors

Validation errors include details array:

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "First name is required",
    "Email must be valid"
  ]
}
```

---

## Examples

### cURL Examples

**Submit Application**:
```bash
curl -X POST http://localhost:3000/api/talent-applications \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "stageName": "JD",
    "email": "john@example.com",
    "phone": "+263123456789",
    "category": "Musician",
    "bio": "Professional musician with 10 years experience",
    "yearsActive": "10",
    "notableWork": "Album XYZ, Show ABC",
    "proposedPrice": "75",
    "responseTime": "48",
    "agreeToTerms": true
  }'
```

**Get Applications (Admin)**:
```bash
curl http://localhost:3000/api/talent-applications?status=pending \
  -H "Cookie: sb-access-token=YOUR_TOKEN"
```

**Update Status (Admin)**:
```bash
curl -X PATCH http://localhost:3000/api/talent-applications/550e8400-e29b-41d4-a716-446655440000/status \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=YOUR_TOKEN" \
  -d '{
    "status": "approved",
    "adminNotes": "Great candidate!"
  }'
```

### JavaScript/TypeScript Examples

**Submit Application**:
```typescript
const response = await fetch('/api/talent-applications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    stageName: 'JD',
    email: 'john@example.com',
    phone: '+263123456789',
    category: 'Musician',
    bio: 'Professional musician with 10 years experience',
    yearsActive: '10',
    notableWork: 'Album XYZ, Show ABC',
    proposedPrice: '75',
    responseTime: '48',
    agreeToTerms: true,
  }),
});

const result = await response.json();

if (result.success) {
  console.log('Application submitted:', result.applicationId);
} else {
  console.error('Error:', result.error);
}
```

**Get Applications (Admin)**:
```typescript
const response = await fetch('/api/talent-applications?status=pending');
const result = await response.json();

if (result.success) {
  console.log('Applications:', result.data);
} else {
  console.error('Error:', result.error);
}
```

**Update Status (Admin)**:
```typescript
const response = await fetch(`/api/talent-applications/${applicationId}/status`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    status: 'approved',
    adminNotes: 'Great candidate!',
  }),
});

const result = await response.json();

if (result.success) {
  console.log('Status updated successfully');
} else {
  console.error('Error:', result.error);
}
```

---

## Testing

### Postman Collection

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "ToraShaout API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Submit Application",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/talent-applications",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"stageName\": \"JD\",\n  \"email\": \"john@example.com\",\n  \"phone\": \"+263123456789\",\n  \"category\": \"Musician\",\n  \"bio\": \"Professional musician with 10 years experience\",\n  \"yearsActive\": \"10\",\n  \"notableWork\": \"Album XYZ\",\n  \"proposedPrice\": \"75\",\n  \"responseTime\": \"48\",\n  \"agreeToTerms\": true\n}"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

---

## Webhooks

**Not yet implemented** - Future feature for notifying external systems when applications are approved/rejected.

---

## Versioning

**Current Version**: v1 (no version prefix in URLs yet)

When v2 is released, endpoints will be prefixed:
- `POST /api/v2/talent-applications`

---

## Support

For API issues:
1. Check this documentation
2. Verify request format matches examples
3. Check response status codes
4. Review server logs in Supabase dashboard

---

**API Documentation Complete!** 📚

All endpoints documented with examples and error codes for the talent applications system.
