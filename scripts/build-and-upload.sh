#!/bin/bash
set -e

STEP="${1:-step2-v2}"
VERSION="${2:-1.0.1}"
WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="${WORKSPACE_DIR}/build-apks"
mkdir -p "${OUTPUT_DIR}"

echo "=========================================================="
echo "  Lucky Wine & Liquor - Release Build & Upload (Step: ${STEP})"
echo "=========================================================="

export ANDROID_HOME="${ANDROID_HOME:-/opt/android/sdk}"
export PATH="${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/cmdline-tools/latest/bin:${PATH}"

# 0. Ensure Keystores are restored or generated
# Passwords for NEW keystores are random and only ever written to the git-ignored keystores/keystore.properties.
# BACK UP the keystores/ folder - a regenerated key cannot update an installed app.
USERS_PASS="${USERS_KEYSTORE_PASSWORD:-$(openssl rand -hex 16)}"
ADMIN_PASS="${ADMIN_KEYSTORE_PASSWORD:-$(openssl rand -hex 16)}"
VERSION_CODE="${VERSION_CODE:-$(( $(date +%s) / 60 ))}"   # always increasing, so new builds install over old ones
mkdir -p "${WORKSPACE_DIR}/keystores"
if [ ! -f "${WORKSPACE_DIR}/keystores/users-release.keystore" ]; then
    if [ -f "${WORKSPACE_DIR}/keystores/users-release.keystore.base64" ]; then
        echo "Restoring users-release.keystore from base64 backup..."
        base64 -d "${WORKSPACE_DIR}/keystores/users-release.keystore.base64" > "${WORKSPACE_DIR}/keystores/users-release.keystore"
    else
        echo "Generating users-release.keystore..."
        keytool -genkey -v -keystore "${WORKSPACE_DIR}/keystores/users-release.keystore" -alias users-release-key -keyalg RSA -keysize 2048 -validity 10000 -storepass "${USERS_PASS}" -keypass "${USERS_PASS}" -dname "CN=LuckyWine, OU=Mobile, O=LuckyWine, L=Bengaluru, ST=Karnataka, C=IN"
    fi
fi

if [ ! -f "${WORKSPACE_DIR}/keystores/admin-release.keystore" ]; then
    if [ -f "${WORKSPACE_DIR}/keystores/admin-release.keystore.base64" ]; then
        echo "Restoring admin-release.keystore from base64 backup..."
        base64 -d "${WORKSPACE_DIR}/keystores/admin-release.keystore.base64" > "${WORKSPACE_DIR}/keystores/admin-release.keystore"
    else
        echo "Generating admin-release.keystore..."
        keytool -genkey -v -keystore "${WORKSPACE_DIR}/keystores/admin-release.keystore" -alias admin-release-key -keyalg RSA -keysize 2048 -validity 10000 -storepass "${ADMIN_PASS}" -keypass "${ADMIN_PASS}" -dname "CN=LuckyWineAdmin, OU=Mobile, O=LuckyWine, L=Bengaluru, ST=Karnataka, C=IN"
    fi
fi

if [ ! -f "${WORKSPACE_DIR}/keystores/keystore.properties" ]; then
    echo "Creating keystore.properties..."
    cat <<EOF > "${WORKSPACE_DIR}/keystores/keystore.properties"
USERS_STORE_FILE=${WORKSPACE_DIR}/keystores/users-release.keystore
USERS_STORE_PASSWORD=${USERS_PASS}
USERS_KEY_ALIAS=users-release-key
USERS_KEY_PASSWORD=${USERS_PASS}

ADMIN_STORE_FILE=${WORKSPACE_DIR}/keystores/admin-release.keystore
ADMIN_STORE_PASSWORD=${ADMIN_PASS}
ADMIN_KEY_ALIAS=admin-release-key
ADMIN_KEY_PASSWORD=${ADMIN_PASS}
EOF
fi

# 1. Sync & Build Web Apps
echo "[1/4] Building web assets for Users and Admin apps..."
(cd "${WORKSPACE_DIR}/users" && npm run build && npx cap sync android)
(cd "${WORKSPACE_DIR}/admin" && npm run build && npx cap sync android)

# 2. Build Signed Release APKs
echo "[2/4] Assembling Release APKs with Gradle..."
(cd "${WORKSPACE_DIR}/users/android" && chmod +x ./gradlew && ./gradlew assembleRelease -PappVersionCode="${VERSION_CODE}" -PappVersionName="${VERSION}")
(cd "${WORKSPACE_DIR}/admin/android" && chmod +x ./gradlew && ./gradlew assembleRelease -PappVersionCode="${VERSION_CODE}" -PappVersionName="${VERSION}")

USERS_SRC="${WORKSPACE_DIR}/users/android/app/build/outputs/apk/release/app-release.apk"
ADMIN_SRC="${WORKSPACE_DIR}/admin/android/app/build/outputs/apk/release/app-release.apk"

USERS_APK="${OUTPUT_DIR}/lucky-users-v${VERSION}-${STEP}.apk"
ADMIN_APK="${OUTPUT_DIR}/lucky-admin-v${VERSION}-${STEP}.apk"

cp "${USERS_SRC}" "${USERS_APK}"
cp "${ADMIN_SRC}" "${ADMIN_APK}"

echo "[3/4] Release APKs created successfully:"
ls -lh "${USERS_APK}" "${ADMIN_APK}"

upload_to_gofile() {
    "${WORKSPACE_DIR}/scripts/upload-gofile.sh" "$1" || echo "FAILED"
}

echo "[4/4] Uploading to Gofile.io..."
USERS_LINK=$(upload_to_gofile "${USERS_APK}")
ADMIN_LINK=$(upload_to_gofile "${ADMIN_APK}")

USERS_SIZE=$(du -h "${USERS_APK}" | cut -f1)
ADMIN_SIZE=$(du -h "${ADMIN_APK}" | cut -f1)

echo ""
echo "=========================================================="
echo "                 RELEASE SUMMARY (${STEP})"
echo "=========================================================="
echo "App 1: Customer App"
echo "  - Name: Lucky Wine & Liquor"
echo "  - Package: com.wine.lucky"
echo "  - File: $(basename "${USERS_APK}")"
echo "  - Size: ${USERS_SIZE}"
echo "  - Download: ${USERS_LINK}"
echo ""
echo "App 2: Admin Portal"
echo "  - Name: Lucky Wine Store Manager"
echo "  - Package: wine.admin.lucky"
echo "  - File: $(basename "${ADMIN_APK}")"
echo "  - Size: ${ADMIN_SIZE}"
echo "  - Download: ${ADMIN_LINK}"
echo "=========================================================="
