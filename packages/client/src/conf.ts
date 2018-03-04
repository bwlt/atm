if (!process.env.GOOGLE_MAPS_API_KEY) throw new Error(`Missing required environment variable 'GOOGLE_MAPS_API_KEY'.`)

export default {
  googleMapsAPIKey: process.env.GOOGLE_MAPS_API_KEY
}