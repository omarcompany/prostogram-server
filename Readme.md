Quick start description:

1. For production:
   1.1 Create default.json.

- Example path config/default.json
  1.2 Install deps:
- npm i
  1.3 Run application:
- node app.js

2. For devel:
   2.1 Create dev.json.

- Example path config/dev.json
  2.2 Install deps:
- npm i
  2.3 Run dev
- npm run dev

3. For tests:
   1.1 Create test.json.

- Example path config/test.json
  1.2 Install deps:
- npm i
  1.3 Run tests:
- npm test

Template of config file:
Config-Template
{
"DBHost": "mongodb://127.0.0.1:27017/dbname",
"ROOT_STATIC_DIR": "name",
"SECRET_KEY": "some-secret-key",
"PORT": "port"
}

Example:
Path: ~/your-path/prostogram-server/config/test.json
{
"DBHost": "mongodb://127.0.0.1:27017/prostogramtestdb",
"ROOT_STATIC_DIR": "test-static",
"SECRET_KEY": "some-secret-key",
"PORT": "3012"
}
