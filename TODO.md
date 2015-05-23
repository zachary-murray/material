Documentation for implementing the remaining parts of edit codepen
with HLJS usage.

## Intent

Pages located under services/directives all have examples defined in
ngDocs as @usage with highlight.js markup. Allowing users to edit
these examples would add value.

## Currently implemented

* Build process to build example data
  * @usage is not available via the docs within the site
* Refactor codepen service to accept a flattened example object
  * Allows for easier consumption where the data is already flattened
* Button is added to services/directives

## Needs implementing

* Some examples are not complete, they will not show anything on
  codepen
* Some examples actually break the codepen api, not sure why, they
  just do
* Some examples have multiple <hljs lang="html"> blocks
  * This was not discovered until too late.  currently no solution for
    this
