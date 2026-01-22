# HookHub Frontend

Modern React-based dashboard for managing webhook subscriptions and monitoring delivery status in the HookHub webhook delivery system.

## 🎨 Features

- **Subscription Management**: Create, view, and delete webhook subscriptions
- **Webhook Sender**: Test webhook delivery with JSON payload editor
- **Delivery Logs**: Monitor webhook delivery status with real-time updates
- **Beautiful UI**: Modern design with glassmorphism effects and gradients
- **Responsive**: Works on all screen sizes

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Lucide React** for icons

## 📋 Prerequisites

- Node.js 18+ and npm
- HookHub backend running on `http://localhost:8080`

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd frontend
npm install
```

Required packages will be installed:
- `axios` - HTTP client
- `react-hot-toast` - Toast notifications
- `lucide-react` - Icon library
- `tailwindcss` - CSS framework
- And development dependencies

### 2. Start Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

## 🔌 Backend Connection

The frontend connects to the Spring Boot backend via:
- **API Base URL**: `http://localhost:8080/api`
- **CORS**: Already configured in the backend to allow `localhost:5173`

Make sure the backend is running before using the frontend.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Card.tsx        # Reusable card component
│   │   ├── StatusBadge.tsx # Status indicator badges
│   │   ├── SubscriptionManager.tsx   # Subscription CRUD
│   │   ├── WebhookSender.tsx        # Webhook sending interface
│   │   └── DeliveryLogs.tsx         # Logs viewer
│   ├── services/           # API service layer
│   │   └── api.ts         # Backend API integration
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## 🎯 Usage

### Creating a Subscription

1. Navigate to the **Subscriptions** tab
2. Click **New Subscription**
3. Fill in:
   - Target URL (webhook endpoint)
   - Event Type (e.g., `user.created`)
   - Secret (optional, for webhook signing)
4. Click **Create Subscription**

### Sending a Webhook

1. Navigate to the **Send Webhook** tab
2. Select a subscription from the dropdown
3. Modify the JSON payload as needed
4. Click **Send Webhook**
5. Check the delivery logs to verify

### Viewing Delivery Logs

1. Navigate to the **Delivery Logs** tab
2. Search by:
   - **Subscription ID**: View all deliveries for a subscription
   - **Task ID**: View all attempts for a specific delivery
3. Filter by outcome: All, Success, Retry, or Failed
4. Click **View** to expand error details

## 🎨 UI Features

- **Glassmorphism Design**: Modern glass-like UI elements
- **Gradient Backgrounds**: Animated gradient backgrounds
- **Status Badges**: Color-coded delivery status indicators
- **Toast Notifications**: User-friendly success/error messages
- **Responsive Layout**: Collapsible sidebar and responsive tables
- **Dark Theme**: Easy on the eyes with a dark color scheme

## 🔧 Configuration

### API Base URL

To change the backend URL, edit `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Vite Proxy

The Vite config includes a proxy for the `/api` path. Edit `vite.config.ts` if needed:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  },
}
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:
1. Ensure the backend is running on port 8080
2. Verify CORS configuration in `WebhookDeliveryApplication.java`
3. Check that `allowedOrigins` includes `http://localhost:5173`

### Module Not Found

If you see "Cannot find module" errors:
```bash
npm install
```

### Connection Refused

If the API calls fail:
1. Start the backend: `docker-compose up -d` (from HookHub directory)
2. Start Spring Boot application
3. Verify backend is accessible at `http://localhost:8080`

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 📄 License

Part of the HookHub webhook delivery system.
