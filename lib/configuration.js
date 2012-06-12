const
convict = require('convict');

module.exports = convict({
  browserid: {
    origin: {
      doc: "URL of the BrowserID service that will be requesting keys",
      format: 'string = "https://browserid.org"'
    },
    verifier: {
      host: {
        doc: "Hostname of the verification service to use",
        format: 'string = "browserid.org"'
      },
      port: {
        doc: "Port that the verification service listens on",
        format: 'integer{1,65535}?'
      },
      scheme: {
        doc: "Scheme (http or https) for the verification service",
        format: 'string = "https"'
      }
    }
  },
  bind_to: {
    host: {
      doc: "The ip address the server should bind",
      format: 'string = "127.0.0.1"',
      env: 'IP_ADDRESS'
    },
    port: {
      doc: "The port the server should bind",
      format: 'integer{1,65535}?',
      env: 'PORT'
    }
  }
}).loadFile(__dirname + '/config.json').validate();
