# Time Difference Calculator

## Demo
![timediff](https://github.com/user-attachments/assets/301c68ca-f2aa-40b4-9cbb-5186c003b7af)

## Overview
This is the author's practice application in React with TypeScript. This is my first time using these languages, so it may not follow the best practices. Please let me know if you detect room for improvement.

## Quick Start

### Register APIs
This project depends on [Geonames API](https://www.geonames.org/export/web-services.html) and [Timezone DB API](https://timezonedb.com/api), both of which are free but require registration. Please make sure that you obtain the username for Geonames and the API key for Timezone DB.

### Place `.env` file
Place your .env file on root directory. Your .env file looks like:

```
ENV="prd"
GEONAMES_USERNAME=(your Geonames username)
TIMEZONE_DB_API_KEY=(your Timezone DB API key)
```

### Start Container
Execute `docker compose up`, and the web application will start to listen on port 8000. You can access it via http://localhost:8000.

## For Developers

### Dependencies
- Python >= 3.9.0
- npm >= 10.0.0

### Setup
1. Install necessary Python packages
   - Run `pip install -r requrements.txt`.
2. Place `.env` file in root directory
   - It must contain `ENV="dev"`.
   - In development environment, API keys are not needed since the APIs are mocked.
3. Run Flask app in development mode
   - Run `python app.py`, and you can access it at http://localhost:8000
4. Install necessary Node.js packages
   - Change the directory `cd client`.
   - Run `npm install` (This might require a few minutes).
   - RUn `npm run build` for development, and you can access it at http://localhost:3000

## License
The source code is licensed MIT. The website content is licensed CC BY 4.0.
