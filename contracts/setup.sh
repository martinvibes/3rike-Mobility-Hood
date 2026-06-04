#!/usr/bin/env bash
# Fetches the contract dependencies (kept out of git to avoid ~700 vendored
# files). Run once after cloning: `cd contracts && ./setup.sh`
set -euo pipefail
cd "$(dirname "$0")"

fetch() { # repo  ref  dest
  rm -rf "lib/$3"
  git clone --depth 1 --branch "$2" "https://github.com/$1.git" "lib/$3"
  rm -rf "lib/$3/.git"
}

fetch "OpenZeppelin/openzeppelin-contracts" "v5.1.0" "openzeppelin-contracts"
fetch "foundry-rs/forge-std"                "v1.9.4" "forge-std"

echo "Dependencies installed. Run: forge build && forge test"
