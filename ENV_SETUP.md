# Environment Variable Setup

## Add to your .env file:

```
AUTH_SECRET="your-super-secret-key-change-this-in-production-make-it-long-and-random"
```

## How to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use any random string generator. Make it long and random!

## Your .env file should now have:

```
DATABASE_URL="your-neon-connection-string"
AUTH_SECRET="your-super-secret-key"
```
