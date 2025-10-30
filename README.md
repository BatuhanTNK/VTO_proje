# Virtual Try-On Mobile Application

A full-stack AI-powered virtual try-on mobile application built with React Native Expo and Node.js/Express. Users can upload photos of themselves and garments to see how clothes would look on them using advanced AI technology.

## Features

### Mobile App (React Native Expo)
- **Image Selection**: Choose images via camera, gallery, or URL
- **AI Processing**: Real-time virtual try-on using fal.ai API
- **Results View**: Three-panel comparison (person, garment, result)
- **History**: View and manage all try-on attempts
- **Favorites**: Save and organize favorite results
- **Sharing**: Download and share results
- **Dark Theme**: Modern, polished UI with smooth animations
- **Offline Storage**: Supabase integration for data persistence

### Backend API (Node.js/Express)
- **Try-On Endpoint**: Process virtual try-on requests
- **Image Upload**: Support for direct image uploads
- **Rate Limiting**: Prevent abuse with configurable limits
- **Error Handling**: Comprehensive error management
- **CORS Support**: Mobile-friendly CORS configuration
- **Health Check**: Monitor server status

## Tech Stack

### Frontend
- React Native with Expo SDK 54
- Expo Router for navigation
- TypeScript for type safety
- Supabase for database
- AsyncStorage for local caching
- Expo Camera & Image Picker
- Expo Linear Gradient
- Lucide React Native for icons

### Backend
- Node.js with Express
- TypeScript
- Axios for API calls
- Multer for file uploads
- Express Rate Limit
- CORS middleware
- dotenv for configuration

### Database
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Real-time subscriptions ready

## Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Supabase account (already configured)

## Installation

### 1. Install Mobile App Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Environment Configuration

The project is pre-configured with Supabase credentials in `.env` and `app.json`.

Backend environment variables are in `server/.env`:
- `PORT`: Server port (default: 3000)
- `FAL_AI_API_KEY`: fal.ai API key (pre-configured)
- `FAL_AI_API_URL`: fal.ai API endpoint
- `CORS_ORIGIN`: CORS origin (default: *)

## Running the Application

### Start the Backend Server

In the `server` directory:

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The API will be available at `http://localhost:3000`

### Start the Mobile App

In the root directory:

```bash
# Start Expo development server
npm run dev
```

Then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Press `w` for web browser
- Scan QR code with Expo Go app for physical device

## API Endpoints

### POST /api/try-on
Process virtual try-on request

**Request Body:**
```json
{
  "personImageUrl": "https://example.com/person.jpg",
  "garmentImageUrl": "https://example.com/garment.jpg",
  "garmentType": "tops",
  "category": "casual"
}
```

**Response:**
```json
{
  "success": true,
  "resultImageUrl": "https://example.com/result.jpg",
  "message": "Try-on processed successfully"
}
```

### POST /api/upload
Upload image file

**Request:**
- Content-Type: multipart/form-data
- Field name: `image`
- Max size: 5MB

**Response:**
```json
{
  "success": true,
  "imageUrl": "data:image/jpeg;base64,...",
  "message": "Image uploaded successfully"
}
```

### GET /api/health
Check server health

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-14T12:00:00.000Z",
  "uptime": 12345
}
```

## Database Schema

### tryon_history Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | User reference (nullable) |
| person_image_url | text | Person image URL |
| garment_image_url | text | Garment image URL |
| result_image_url | text | Generated result URL |
| is_favorite | boolean | Favorite flag |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |
| garment_type | text | Garment type (nullable) |
| metadata | jsonb | Additional data |

## Project Structure

```
.
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigation
│   │   ├── index.tsx        # Home screen
│   │   ├── history.tsx      # History screen
│   │   └── favorites.tsx    # Favorites screen
│   ├── select-images.tsx    # Image selection
│   ├── processing.tsx       # Processing screen
│   └── result.tsx          # Result display
├── components/              # Reusable components
│   ├── Button.tsx
│   ├── ImagePickerModal.tsx
│   ├── LoadingOverlay.tsx
│   ├── ErrorAlert.tsx
│   └── Toast.tsx
├── context/                 # React context
│   └── TryOnContext.tsx
├── services/                # API services
│   ├── api.ts
│   ├── supabaseClient.ts
│   └── historyService.ts
├── constants/               # Constants
│   ├── theme.ts
│   └── samples.ts
├── types/                   # TypeScript types
│   └── index.ts
└── server/                  # Backend API
    └── src/
        ├── server.ts
        ├── types.ts
        ├── middleware.ts
        ├── routes/
        │   └── tryOn.ts
        └── services/
            └── falAiService.ts
```

## Sample Images

The app includes pre-configured sample images from Pexels for quick testing:
- Person images: Full-body portraits
- Garment images: Various clothing items

## Tips for Best Results

1. **Person Images:**
   - Use clear, well-lit photos
   - Person should face forward
   - Full body or upper body shots work best
   - Avoid busy backgrounds

2. **Garment Images:**
   - Clear view of the entire garment
   - Good lighting and contrast
   - Flat lay or on mannequin preferred
   - Single garment per image

## Troubleshooting

### Backend not responding
- Ensure server is running on port 3000
- Check `server/.env` configuration
- Verify fal.ai API key is valid

### Mobile app can't connect to backend
- Update API_BASE_URL in `services/api.ts` for physical devices
- Use your computer's IP address instead of localhost
- Ensure devices are on the same network

### Image picker not working
- Check camera and photo library permissions
- Restart the app after granting permissions
- On iOS, check Privacy settings
- On Android, check App permissions

### Supabase connection issues
- Verify Supabase URL and anon key in `.env`
- Check internet connection
- Review Supabase project status

## Performance Optimization

- Images are compressed before upload (max 2MB)
- Results are cached in Supabase
- Lazy loading for history/favorites
- Optimized re-renders with React.memo
- Native animations for smooth UX

## Security Considerations

- Row Level Security (RLS) enabled on all tables
- API rate limiting to prevent abuse
- Input validation on all endpoints
- Secure environment variable management
- HTTPS for all image URLs

## Future Enhancements

- User authentication with Supabase Auth
- Social sharing integrations
- AR preview mode
- Multiple garment try-on
- Style recommendations
- Collections and wishlists
- In-app purchases for premium features

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
