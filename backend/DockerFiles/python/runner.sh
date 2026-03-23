#!/bin/sh
set -e

# Decode base64-encoded code and input
echo "$CODE" | base64 -d > /tmp/solution.py
echo "$INPUT" | base64 -d > /tmp/input.txt

# Execute with stdin
exec python3 /tmp/solution.py < /tmp/input.txt
