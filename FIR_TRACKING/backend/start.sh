#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting Database Migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "Starting Gunicorn Server..."
# Using gunicorn to serve the Django WSGI application
exec gunicorn core.wsgi:application --bind 0.0.0.0:8000 --access-logfile - --error-logfile -
