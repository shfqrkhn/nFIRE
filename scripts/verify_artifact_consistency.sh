#!/usr/bin/env bash
set -euo pipefail

readme_version=$(
  sed -n \
    -e 's|.*\*\*Version:\*\* v\([0-9]\+\.[0-9]\+\.[0-9]\+\).*|\1|p' \
    -e 's|.*Version-\([0-9]\+\.[0-9]\+\.[0-9]\+\)-neon.*|\1|p' \
    README.md | head -n 1
)
index_version=$(sed -n 's|.*>v\([0-9]\+\.[0-9]\+\.[0-9]\+\)</div>|\1|p' index.html)
notfound_version=$(sed -n 's|.*>v\([0-9]\+\.[0-9]\+\.[0-9]\+\)</div>|\1|p' 404.html)

[[ -n "$readme_version" && -n "$index_version" && -n "$notfound_version" ]]
[[ "$readme_version" == "$index_version" && "$index_version" == "$notfound_version" ]]

for file in index.html 404.html; do
  grep -q "upgrade-insecure-requests" "$file"
  grep -q "touch-action: manipulation" "$file"
  grep -q "github.com/sponsors/shfqrkhn?o=esb" "$file"
  grep -q "Planning aid only" "$file"
done

grep -q "upgrade-insecure-requests" _headers
grep -q "Cross-Origin-Resource-Policy: same-origin" _headers
grep -q "Origin-Agent-Cluster: ?1" _headers

echo "OK: artifact security/version invariants are consistent (v${readme_version})."
