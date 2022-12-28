# Quick start guide

## Production:
Create default.json. 
```
config/default.json
```
Install deps:
```
npm i
```
Run application:
```
node app.js
```

## Devel:
Create dev.json.
```
config/dev.json
```
Install deps:
```
npm i
```
Run dev
```
npm run dev
```

## Tests:
Create test.json.
```
config/test.json
```
Install deps:
```
npm i
```
Run tests:
```
npm test
```

### Config-Template
```
/home/my-projects/prostogram-server/config/test.json

{
  "PORT": "3012",
  "DBHost": "mongodb://127.0.0.1:27017/prostogramtestdb",
  "ROOT_STATIC_DIR": "test-static",
  "JWT_ACCESS_SECRET": "jwt-access-secret-key",
  "JWT_REFRESH_SECRET": "jwt-refresh-secret-key",
  "SMTP_HOST": "",
  "SMTP_PORT": "",
  "SMTP_USER": "",
  "SMTP_PASSWORD": "",
  "API_URL": "http://localhost:3011",
  "CLIENT_URL": "http://localhost:5000",
  "TEST_USER_EMAIL": ""
}

```
