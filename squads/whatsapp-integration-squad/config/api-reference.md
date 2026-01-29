# UAZAPI Reference

## Getting Started

1. Create account: https://uazapi.com
2. Connect WhatsApp Business Account
3. Get API Token from dashboard
4. Use your phone number for sending

## API Endpoint

```
POST https://free.uazapi.com/send/text
```

## Request Format

```json
{
  "token": "your-api-token",
  "phone": "5511999999999",
  "message": "Your message text here"
}
```

## Response Format

```json
{
  "status": 200,
  "message": "Message sent",
  "message_id": "wamid.xxx"
}
```

## Error Codes

| Code | Meaning               | Solution                      |
| ---- | --------------------- | ----------------------------- |
| 200  | Success               | Message was sent              |
| 400  | Bad Request           | Check format                  |
| 401  | Unauthorized          | Invalid token                 |
| 429  | Rate Limited          | Wait before retry             |
| 503  | WhatsApp Disconnected | Reconnect in UAZAPI dashboard |

## Phone Number Format

- Include country code
- No spaces or dashes
- Example: `5511987654321` (Brazil)

## Message Limits

- Max 4096 characters
- Special characters supported
- Markdown formatting supported

## Connection Status Check

Check UAZAPI dashboard to verify:

1. Token is valid
2. WhatsApp is connected
3. Account has credits
