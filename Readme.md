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
{
"DBHost": "mongodb://127.0.0.1:27017/dbname",
"ROOT_STATIC_DIR": "name",
"SECRET_KEY": "some-secret-key",
"PORT": "port"
}
```

### Example:
/home/my-projects/prostogram-server/config/test.json
```
{
"DBHost": "mongodb://127.0.0.1:27017/prostogramtestdb",
"ROOT_STATIC_DIR": "test-static",
"SECRET_KEY": "some-secret-key",
"PORT": "3012"
}
```
