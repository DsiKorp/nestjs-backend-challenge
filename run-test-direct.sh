#!/bin/bash
# Script to run E2E tests directly by managing a local PostgreSQL instance

set -e

echo "🔍 Checking for local PostgreSQL on port 5432..."

# Check if PostgreSQL is already running and accepting connections
if nc -z localhost 5432; then
  echo "✅ PostgreSQL is already running on localhost:5432"
else
  echo "🐘 Starting local PostgreSQL container for testing..."

  # Start PostgreSQL container
  POSTGRES_CONTAINER=$(docker run -d \
    -p 5432:5432 \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=usersdb_test \
    postgres:17-alpine)

  echo "📦 PostgreSQL container started: $POSTGRES_CONTAINER"

  # Wait for PostgreSQL to be ready
  echo "⏳ Waiting for PostgreSQL to be ready..."
  for i in {1..30}; do
    if docker exec $POSTGRES_CONTAINER pg_isready -U postgres; then
      echo "✅ PostgreSQL is ready!"
      break
    fi
    if [ $i -eq 30 ]; then
      echo "❌ Timeout waiting for PostgreSQL to start"
      docker stop $POSTGRES_CONTAINER >/dev/null 2>&1
      docker rm $POSTGRES_CONTAINER >/dev/null 2>&1
      exit 1
    fi
    sleep 1
  done

  # Create the test database
  echo "🗄️  Creating test database..."
  docker exec $POSTGRES_CONTAINER createdb -U postgres usersdb_test

  # Set up cleanup trap
  cleanup() {
    echo "🧹 Cleaning up PostgreSQL container..."
    docker stop $POSTGRES_CONTAINER >/dev/null 2>&1
    docker rm $POSTGRES_CONTAINER >/dev/null 2>&1
  }
  trap cleanup EXIT
fi

# Run the tests
echo "🧪 Running E2E tests..."
npm run test:e2e

echo "✅ Tests completed!"