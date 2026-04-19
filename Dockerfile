FROM python:3.11-slim

WORKDIR /app

# install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# app code
COPY main.py .
COPY frontend/dist ./frontend/dist

# data directory (overridden by volume mount on NAS)
RUN mkdir -p /app/data/import /app/data/export

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/patients')"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
