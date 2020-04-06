import * as functions from 'firebase-functions'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions
//   .region('asia-northeast1')
//   .https.onRequest((_request: any, _response: any) => {
//     _response.send('Hello from Firebase!')
//   })

exports.transformTest = functions
  .region('asia-northeast1')
  .https.onRequest((_req: any, _res: any) => {
    // CORS allow setting
    _res.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    _res.set('Access-Control-Allow-Headers', 'Content-Type')

    console.log(_req.method, _req.hostname, _req.ip)
    console.log(_req.get('Content-Type'))
    // get parameter
    console.log(_req.query)
    // get post data
    console.log(_req.body)
    // _res.send('Transformed.')
    if (
      _req.body.type !== undefined &&
      _req.body.data !== undefined &&
      _req.body.scaleType !== undefined
    ) {
      _res.send('ok')
    } else {
      _res.send('no supported file')
    }
  })
