# CouchBugger
A chrome extension for CouchDB users to debug data model changes. CouchDB saves copies of the entire json document on every save. Sometimes it is necessary to follow the audit trail of a particular value of a deeply nested key in the json document.

This extension takes an input of all the paths for which we need to retrieve the history. It scans through all available revisions of the document and fetches the value of that key from each revision. All the values are logged in the chrome console. It reads all the necessary details from the futon page of the concerned document. So it is important you have the right document page open when you use the extension

###Demo
https://chrome.google.com/webstore/detail/couchbugger/okbdcfglboidcakggjbfigiddclkgcnp

This is tested with CouchDB v1.6.3 but should work with almost all versions
