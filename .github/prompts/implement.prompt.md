---
name: implement
description: "Prompt to ask DeveloperAgent to implement a feature from an issue or spec."
---

Usage

- Input: issue number or description; constraints; files to avoid; required behaviors.
- Output: proposed patch (diff), tests, branch name, PR title and body, short rationale.

Example

```
/implement
{
  "issue": 123,
  "spec": "Add POST /api/users to create user with validation",
  "constraints": "follow existing error handling and validation"
}
```
