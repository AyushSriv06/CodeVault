#!/bin/sh
set -e

# Decode base64-encoded code and input
echo "$CODE" | base64 -d > /tmp/Main.java
echo "$INPUT" | base64 -d > /tmp/input.txt

# Compile
javac /tmp/Main.java -d /tmp 2>&1

# Check compilation result
if [ $? -ne 0 ]; then
    exit 1
fi

# Execute
exec java -classpath /tmp Main < /tmp/input.txt
