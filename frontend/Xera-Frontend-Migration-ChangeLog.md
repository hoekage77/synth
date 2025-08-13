# Xera Frontend Migration Change Log

## Summary
This document details the changes made to migrate the frontend branding and logic from Suna to Xera, as part of the rebranding of the Suna.so project to Xera by team Kortix. The home page was intentionally excluded from this migration.

## Changed Files
- `src/components/dashboard/dashboard-content.tsx`
- `src/components/agents/agent-tools-configuration.tsx`
- `src/components/agents/config/agent-header.tsx`
- `src/app/(dashboard)/projects/[projectId]/thread/[threadId]/page.tsx`

## Key Changes
### 1. Naming and Branding
- All references to "Suna" (including variables, display names, and descriptions) were changed to "Xera".
- All references to `isSunaAgent` and `is_suna_default` were renamed to `isXeraAgent` and `is_xera_default` respectively.
- Descriptions mentioning Suna's management were updated to Xera.

### 2. UI and Metadata
- Document titles and Open Graph meta tags now use "Kortix Xera" instead of "Xera".
- LocalStorage keys for upgrade dialogs were renamed from `suna_upgrade_dialog_displayed` to `xera_upgrade_dialog_displayed`.

### 3. Code Logic
- All logic and props related to Suna agent detection and configuration were updated to Xera equivalents.

## Exclusions
- The home page was not modified as per user instruction.

---
For further details, see the diffs in the respective files.
