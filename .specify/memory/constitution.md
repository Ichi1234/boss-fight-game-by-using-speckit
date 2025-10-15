<!--
Sync Impact Report

- Version change: 1.0.0 → 1.1.0
- Modified principles:
  - I. Code Quality (expanded into sub-principles)
  - II. Testing Standards
  - III. User Experience Consistency
  - IV. Performance & Resource Constraints
- Added/expanded sections: Detailed Code Quality sub-principles (readability,
  documentation, dependency hygiene, maintainability & reviews)
- Templates updated:
  - .specify/templates/plan-template.md ✅ updated
  - .specify/templates/tasks-template.md ✅ updated
  - .specify/templates/spec-template.md ⚠ pending (reviewed; no required edits)
  - .specify/templates/commands/*.md ⚠ pending (directory not present; verify)
- Deferred items / TODOs:
  - TODO(RATIFICATION_AUDIT): Confirm original ratification date if backfilling historical records.
-->

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)
All code contributed to this repository MUST satisfy the following sub-principles
which operationalize code quality in concrete, testable ways:

- Readability & Style: Code MUST follow the project's style and linting rules.
  Formatting and style violations MUST be fixed prior to merge. Naming SHOULD
  be self-explanatory and functions/methods SHOULD be short and single-responsibility.
- Documentation: Public APIs, complex algorithms, and non-obvious decisions
  MUST include concise inline documentation and a short usage example in the
  repository docs where applicable. Modules SHOULD include a top-level README
  summarizing intent and key design constraints.
- Dependency Hygiene: All third-party dependencies MUST be evaluated for
  security, maintenance, and licensing risk. Production dependencies that
  affect runtime MUST be pinned in lockfiles; transitive risk MUST be
  documented in the plan if not addressable before merge.
- Maintainability & Reviews: Pull requests MUST be small enough for an
  effective review (prefer increments < 400 LOC). Every PR MUST have at least
  one approving reviewer; larger changes MUST include a migration strategy and
  integration plan. Code owners SHOULD be involved for cross-cutting subsystem
  changes.
- CI & Static Checks: Static analysis, linting, and type checks (when
  applicable) MUST run in CI and block merges on failure. Security scans and
  dependency checks SHOULD run regularly and be part of release criteria.

Rationale: Breaking code quality down into measurable sub-principles makes
policy actionable and enforces maintainable, secure, and readable code.

### II. Testing Standards (NON-NEGOTIABLE)
Automated tests are mandatory for all behavioral changes. Tests MUST be
present at the appropriate level: unit tests for internal logic, integration
or contract tests for cross-component behavior, and acceptance tests for P1
user journeys. Test-first development is encouraged: tests SHOULD be written
and verified to fail prior to implementation. Continuous Integration MUST run
tests and block merges on failures. Coverage goals and required test types
for a feature MUST be declared in the feature's plan.

Rationale: Tests provide confidence for refactoring and protect against
regressions; they are a communication vehicle for expected behavior.

### III. User Experience Consistency
User-facing behavior (UI, CLI, API responses) MUST follow documented patterns
for layout, wording, error states, and accessibility. Shared components and
design tokens SHOULD be used to maintain consistency. Quickstarts and sample
flows MUST illustrate common use-cases and troubleshooting steps.

Rationale: Consistent UX reduces cognitive load, support burden, and helps
users discover and use features correctly.

### IV. Performance & Resource Constraints
Each plan MUST include measurable performance goals (e.g., p95 latency,
throughput, memory limits) and any resource budgets. New or changed code that
affects performance MUST include benchmarks or performance tests. CI SHOULD
run lightweight performance checks when practical; major regressions MUST be
blocked until resolved or explicitly accepted with justification.

Rationale: Declared performance expectations avoid last-minute rework and
ensure the product meets user needs at scale.

## Cross-Cutting Constraints

- Observability: Critical flows MUST emit structured logs and metrics; errors
	MUST include correlation identifiers when applicable.
- Security: Secrets MUST never be committed; dependencies MUST be scanned
	regularly; follow least-privilege for permissions.
- Versioning: Public contract changes MUST follow semantic versioning. Breaking
	changes to governance or principles are MAJOR version bumps.

## Development Workflow & Quality Gates

- Code review: All changes require at least one approving reviewer familiar
	with the affected subsystem. Significant changes MUST include a migration
	strategy and rollback plan where applicable.
- CI gates: Linting, type checks, unit tests, and required integration tests
	declared in the plan MUST pass before merge.
- Releases: Releases MUST include a changelog, migration notes, and any
	required operational follow-up steps.

## Governance

This constitution is the authoritative development policy for the repository.
Amendments MUST be proposed as a documented PR including the amendment text,
the rationale, a version bump recommendation (MAJOR/MINOR/PATCH), and a
migration/communication plan. Amendments require two maintainer approvals OR
one maintainer plus one domain expert in the affected area. The PR must set
the **Last Amended** date to the merge date and record the new version.

**Version**: 1.1.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm if backfilled | **Last Amended**: 2025-10-15