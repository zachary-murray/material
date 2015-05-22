Documentation for implementing the remaining parts of search.

## Intent

Implement a search feature to allow users to find documentation on
services, directives and demos.

Ideally I wanted to tackle implementing search based on the design
spec for
[google material design](https://www.google.com/design/spec/patterns/search.html). This
way we would be able to implement a resuable search for others to
consume in their own project.  It was ambitious of me to think I would
be able to accomplish that in the short time period, but this is where
I would have liked to go.

## Background

Search was already implemented loosely based on how search was
implemented on the angularjs site.  Comments mentioned in the
following [issue](https://github.com/angular/material/issues/917) were
considered in implementing search here.

## Currently implemented

* Build process to extract keywords for search to be used by lunr.js
  * lunr.js and search-worker.js need to be seperate from docs.js so
    that they can be loaded independently in the web worker
* Search strategy for using web workers to load and provide search
  results with a local storage for fallback on browsers that do not
  support web workers
* A very, very crappy UI (Oh did I mention very enough, probably not)

## Needs implementing

* Compress svg images used for search (this may not be need if the
  approach is not the same in the material spec.
* Implement a good UI, this is probably the biggest missing peice
* Demos are currently not included in the search, demos are not part
  of ngDoc information (which is the only thing currently defining
  what is searched on)
* Layout pages
  [anything under the layout header in the menu](https://material.angularjs.org/#/layout/container)
  are not included either, they are built in the build process and are
  served as static content. This will need to be included too.
* I was thinking that it would make sense to have the results seperate
  demos from API, but that has not been implemented either.
