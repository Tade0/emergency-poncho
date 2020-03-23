const express = require('express');
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

  Object.keys(indexedEntries).forEach(url => {
    const entry = indexedEntries[url];
    const {indexes, GET, POST} = entry;

    app.get(`${url}\*`, (req, res) => {
      const exact = GET.find(({search}) => req.url.endsWith(search));

      if (exact) {
        indexes.GET = GET.indexOf(exact);
      }

      const {status, headers, content} = GET[indexes.GET].response;

      console.log(`GET ${url}${GET[indexes.GET].search}`);

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

      indexes.GET = (indexes.GET + 1) % GET.length;

      res.end(content.text);
    });

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

      res.end(content.text);
    });
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
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
  if (headerObject['content-type']) {
    debugger;
    headerObject['content-type'] = headerObject['content-type'].replace('text/css', 'application/css');
  }

  delete headerObject['content-encoding'];
  delete headerObject['content-length'];
}