# Notes to self for CraftFinal

## Errors and solutions

When trying to commit:

Error message: "`pre-commit` not found.  Did you forget to activate your virtualenv?"

Root cause: likely python version upgraded and the old version is no longer available at the path expected by `pre-commit`
Solution: 

```zsh
brew install pre-commit
pre-commit install -t commit-msg
```

