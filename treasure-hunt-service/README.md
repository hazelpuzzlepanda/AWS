# Treasure Hunt Backend — Commands Only

## Setup Commands

# Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe CLI
stripe login

# Forward webhook events to your backend
stripe listen --forward-to localhost:5000/api/payment/verify

# Create a Twilio account: https://www.twilio.com/try-twilio
# Get TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
# Fill them inside .env file


# Start server in development mode
   npm run dev

# Server Start Running on
    http://localhost:5000



