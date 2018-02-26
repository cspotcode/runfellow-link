*EXPERIMENT* Simple webservice to integrate Strava routes with other running apps and with the Runfellow website.

After you create routes in Strava, this app will:

- download GPX of the route and put it in a public S3 bucket
- generate RunGo route from GPX
- generate .png of the route with mile markers via Google Maps Static API

## Dev notes

To run locally:

    serverless offline start


