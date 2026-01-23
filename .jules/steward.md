## 2025-01-24 - Sentinel - Artifact-Only Architecture
**Insight:** Repository contains only build artifacts; source code is missing. Modifying precached files (index.html) breaks Service Worker integrity.
**Protocol:** Implement security and performance fixes via deployment configuration (_headers) or new files, avoiding modification of signed artifacts.
