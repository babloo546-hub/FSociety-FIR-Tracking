FROM python:3.10-slim

WORKDIR /app

# Ensure output is not buffered
ENV PYTHONUNBUFFERED=1

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Install PyMySQL if missing from requirements just to be safe
RUN pip install PyMySQL

COPY . /app/
RUN chmod +x /app/start.sh

# Port exposed in docker-compose
EXPOSE 8000

CMD ["/app/start.sh"]
