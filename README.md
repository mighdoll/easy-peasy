patched-peasy is a slightly patched version of easy peasy.

See the [official website](https://easy-peasy.now.sh) for tutorials, API docs, recipes, and more.



---
## Patches:
* Don't persist computed fields. [easy-peasy #539](https://github.com/ctrlplusb/easy-peasy/issues/539), [patch](https://github.com/mighdoll/patched-peasy/commit/059f6208fc38d03032cc6663888b3c654f3e8ef7)
* Adds a store config option postActionReducer that runs before computeds are reattached to state. [patch](https://github.com/mighdoll/patched-peasy/commit/fc69855254037689ddc3086d4aeebc58e2f6a922)