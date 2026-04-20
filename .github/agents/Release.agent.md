---
name: ReleaseAgent
description: "Generate changelog, create tags and publish releases on approval."
applyTo:
  - "*"
rules:
  - id: changelog-required
    description: "Generate changelog entries from merged PRs."
    severity: medium
actions:
  - create_release: true
  - publish_artifacts: true
  - generate_changelog: true
permissions:
  - releases:write
  - contents:read
merge_policy:
  auto_merge: false
  require_human_approval: true
---

Release agent aggregates merged PR metadata to generate a changelog,
creates semantic tags and publishes release artifacts when human
approval is present.
