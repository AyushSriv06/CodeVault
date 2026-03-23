FROM alpine:3.19

# Install C/C++ build tools
RUN apk add --no-cache build-base

# Create non-root user
RUN adduser -D -u 1000 runner

WORKDIR /app
COPY runner.sh /app/runner.sh
RUN chmod +x /app/runner.sh

USER runner

ENTRYPOINT ["/app/runner.sh"]