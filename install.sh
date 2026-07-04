#!/usr/bin/env bash
set -euo pipefail

package='github:Happyalex1122/multi-tier-agent-system'
args=("-y" "$package" "--")

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target)
      args+=("--target" "$2")
      shift 2
      ;;
    --only)
      args+=("--only" "$2")
      shift 2
      ;;
    --dry-run)
      args+=("--dry-run")
      shift
      ;;
    --force)
      args+=("--force")
      shift
      ;;
    --all)
      args+=("--all")
      shift
      ;;
    *)
      args+=("$1")
      shift
      ;;
  esac
done

npx "${args[@]}"
