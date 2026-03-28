## Description
<!-- Describe your changes in detail here. Why is this change required? What problem does it solve? -->
- Fixes # (issue number)
- Relates to # (issue number)

## Type of Change
<!-- Check all that apply -->
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Smart Contract modification (Requires deep review)

## Smart Contract Impact
<!-- Verify that this PR does not casually break the immutable core business logic -->
- [ ] **No Smart Contract state was altered.**
- [ ] **Smart Contracts were intentionally updated.**
  - [ ] Accompanying migration/deployment script has been included and tested.
  - [ ] Hardhat tests have been run and updated locally.

## Testing Performed
<!-- Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce. -->
- [ ] `npm run test` (Backend/Frontend passed)
- [ ] `npx hardhat test` (All contract validations remain intact)
- [ ] Manually tested flow on local environment

## Checklist
- [ ] My code follows the code style of this project
- [ ] I have updated the swagger/API documentation accordingly
- [ ] I have read the `API_REFERENCE.md` and `CONTRACTS_REFERENCE.md` to ensure my modifications align with system architecture
