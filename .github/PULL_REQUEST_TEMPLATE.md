# Pull Request

## Description
<!-- Provide a clear and concise description of your changes -->

## Type of Change
<!-- Mark the appropriate option with an "x" -->
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to break)
- [ ] Documentation update
- [ ] Test enhancement
- [ ] Performance improvement
- [ ] Code refactoring
- [ ] DevOps/CI improvement
- [ ] Other (please describe)

## Test Toolkit Changes
<!-- List any changes to the test toolkit -->
- [ ] New test utilities
- [ ] Modified test configuration
- [ ] Added test examples
- [ ] Updated documentation
- [ ] Modified scripts
- [ ] Other (please describe)

## Test Coverage
<!-- Provide information about test coverage -->
```
Code coverage summary:
- Lines      : XX.XX%
- Functions  : XX.XX%
- Branches   : XX.XX%
- Statements : XX.XX%
```

## Validation Results
<!-- Include the output from check-pr.sh -->
```bash
# Run validation
./scripts/check-pr.sh

# Paste output here
```

## Breaking Changes
<!-- Mark if applicable -->
- [ ] This PR introduces breaking changes
<!-- If checked, describe the breaking changes and migration path -->

## Documentation
<!-- List documentation changes -->
- [ ] README.md updated
- [ ] CHANGELOG.md updated
- [ ] API documentation updated
- [ ] Test documentation added/updated
- [ ] Comments added/updated
- [ ] Other documentation changes

## Test Plan
<!-- Describe how you tested your changes -->
1. Test scenario 1
   - Step 1
   - Step 2
   - Expected result
2. Test scenario 2
   - Step 1
   - Step 2
   - Expected result

## Performance Impact
<!-- Describe any performance implications -->
- [ ] No significant impact
- [ ] Improved performance
- [ ] Performance regression
<!-- If performance is affected, provide benchmarks -->

## Dependencies
<!-- List any new dependencies -->
- [ ] No new dependencies
- [ ] New dependencies added:
  ```json
  // List new dependencies from package.json
  ```

## Related Issues
<!-- Link related issues -->
- Fixes #(issue)
- Related to #(issue)

## Pre-submission Checklist
<!-- Mark completed items -->
- [ ] Run `./scripts/check-pr.sh` with no errors
- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Breaking changes documented
- [ ] Performance impact assessed
- [ ] Dependencies documented
- [ ] All validation checks passing

## Screenshots/Recordings
<!-- If applicable, add screenshots or recordings -->

## Additional Notes
<!-- Add any additional information -->

## Reviewer Notes
<!-- Notes for reviewers -->
- Areas needing special attention
- Testing suggestions
- Known limitations

## Post-merge Tasks
<!-- List any tasks needed after merging -->
- [ ] Deploy changes
- [ ] Update documentation site
- [ ] Notify stakeholders
- [ ] Monitor performance
- [ ] Other (please specify)
