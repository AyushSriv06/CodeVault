#!/bin/sh
set -e

# Decode base64-encoded code and input
echo "$CODE" | base64 -d > /tmp/solution.$LANGUAGE
echo "$INPUT" | base64 -d > /tmp/input.txt

# Compile based on language
if [ "$LANGUAGE" = "c" ]; then
    gcc /tmp/solution.c -o /tmp/solution -lm -O2 2>&1
elif [ "$LANGUAGE" = "cpp" ]; then
    g++ /tmp/solution.cpp -o /tmp/solution -lm -O2 -std=c++17 2>&1
else
    echo "Unsupported language: $LANGUAGE" >&2
    exit 1
fi

# Check compilation result
if [ $? -ne 0 ]; then
    exit 1
fi

# Execute
exec /tmp/solution < /tmp/input.txt
