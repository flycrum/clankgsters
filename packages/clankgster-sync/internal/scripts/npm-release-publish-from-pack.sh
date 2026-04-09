#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

TAG="${1:-alpha}"

cd "${PACKAGE_DIR}"

PREFLIGHT_OUTPUT="$("${SCRIPT_DIR}/npm-release-preflight.sh")"
printf '%s\n' "${PREFLIGHT_OUTPUT}"

TARBALL_PATH="$(printf '%s\n' "${PREFLIGHT_OUTPUT}" | awk -F= '/^TARBALL_PATH=/{print $2}' | tail -1)"
if [[ -z "${TARBALL_PATH}" ]]; then
  echo "Could not determine tarball path from preflight output."
  exit 1
fi

if [[ ! -f "${TARBALL_PATH}" ]]; then
  echo "Tarball does not exist: ${TARBALL_PATH}"
  exit 1
fi

echo "Publishing ${TARBALL_PATH} with dist-tag ${TAG}..."
NPM_PUBLISH_ARGS=("${TARBALL_PATH}" "--tag" "${TAG}")
if [[ -n "${NPM_OTP:-}" ]]; then
  NPM_PUBLISH_ARGS+=("--otp" "${NPM_OTP}")
fi

npm publish "${NPM_PUBLISH_ARGS[@]}"
