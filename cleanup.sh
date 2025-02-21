#!/bin/bash

# Remove test type definition files
rm -f src/types/test-*.d.ts
rm -f src/types/vitest*.d.ts
rm -f src/tests/test-*.d.ts
rm -f src/tests/vitest*.d.ts
rm -f src/tests/types/*.d.ts
rm -f src/tests/environment.d.ts
rm -f src/tests/globals.d.ts

# Remove test type directories and their contents
rm -rf src/tests/types

# Remove root test type files
rm -f vitest.d.ts
rm -f tsconfig.test.json

# Preserve only essential files
echo "Preserving only essential files:"
echo "- src/tests/helpers.ts"
echo "- src/tests/Example.test.ts"
echo "- src/tests/setup.ts"
echo "- vitest.config.ts"

chmod +x cleanup.sh
