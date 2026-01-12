 #!/usr/bin/env bash
set -euo pipefail

echo "Starting SSH tunnels to ddd (Mongo + MinIO)..."
echo "  - Mongo:  localhost:27018 -> ddd:27017"
echo "  - MinIO:  localhost:9000  -> ddd:9000"
echo ""
echo "Press Ctrl+C to stop."

exec ssh -N \
  -L 27017:127.0.0.1:27017 \
  -L 9000:127.0.0.1:9000 \
  sebastian@sebweb

