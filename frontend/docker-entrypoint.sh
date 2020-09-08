#!/bin/sh
set -eu

# Replace placeholders
find .next -type f -not -path '.next/cache/*' -exec sed -i \
	-e "s#__FNHS_ASSET_PREFIX__#$ORIGIN#g" \
	-e "s#__FNHS_INSTRUMENTATION_KEY__#$NEXT_PUBLIC_INSTRUMENTATION_KEY#g" \
	{} +

# Start application
exec "$@"
