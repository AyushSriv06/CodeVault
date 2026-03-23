FROM python:3.12-alpine

# Create non-root user
RUN adduser -D -u 1000 runner

WORKDIR /app
COPY runner.sh /app/runner.sh
RUN chmod +x /app/runner.sh

USER runner

ENTRYPOINT ["/app/runner.sh"]