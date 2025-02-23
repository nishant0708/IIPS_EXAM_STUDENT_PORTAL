# Use the base Python image
FROM python:3.12.3

# Install libGL for OpenCV compatibility
RUN apt-get update && apt-get install -y libgl1

# Set the working directory
WORKDIR /app

# Copy all files to the container
COPY . /app

# Install dependencies
RUN pip install -r requirements.txt

# Expose the necessary port (if needed)
EXPOSE 5000

# Start the application
CMD ["python", "server.py"]
