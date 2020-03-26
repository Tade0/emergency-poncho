const express = require('express');
const url = require('url');
const app = express();
const port = 3000;
const {parseArguments} = require('./cli');
const {parseHar} = require('./parser');

const arguments = parseArguments(process.argv);

if (arguments.harContent) {
  const entries = parseHar(arguments.harContent);

  if (arguments.justLog) {
    console.log(JSON.stringify(entries, null, 2));

    process.exit();
  }

  const indexedEntries = Object.keys(entries).reduce((acc, key) => {
    const entry = deepCopy(entries[key]);

    entry.indexes = Object.keys(entry).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});

    acc[key] = entry;

    return acc;
  }, {});

  app.use((req, res, next) => {
    const {pathname, search} = url.parse(req.url);
    const entry = indexedEntries[pathname];

    if (entry) {
      const {indexes} = entry;
      const exact = entry[req.method].find(item => item.search === search);

      if (exact) {
        indexes[req.method] = entry[req.method].indexOf(exact);
      }

      const indexedEntry = entry[req.method][indexes[req.method]];
      const {status, headers, content} = indexedEntry.response;

      console.log(`${req.method} ${req.url}${indexedEntry.search}`);

      res.status(roundStatus(status));

      if (headers) {
        const headerObject = headers.reduce((acc, header) => {
          acc[header.name] = header.value;

          return acc;
        }, {});

        correctHeaders(headerObject);

        res.set(
          headerObject
        );
      }

      indexes[req.method] = (indexes[req.method] + 1) % entry[req.method].length;

      res.end(content.text);
    } else {
      res.status(404);
      res.end('');
    }

    next();
  });

  app.listen(port, () => console.log(`Listening on port ${port}!`));
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function roundStatus(status) {
  if (status < 400) {
    return 200;
  }

  return status;
}

function correctHeaders(headerObject) {
  delete headerObject['Content-Encoding'];
  delete headerObject['content-encoding']; // Remove probable gzip
}
