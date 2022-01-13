class httpRouter extends Function {
  constructor(routes = {}) {
    super('req','res','router',
    `
    let url
    let urlProcessing
    let slashes
    let routes
    let route
    try{
    url = req.method.toLowerCase() + '|' + req.url
    routes = router[Object.keys(router).slice(-1)]
    try{
    routes[url](req,res)
    } catch {
    try {
      urlProcessing = url.replace(/\\\/*$/,'')
      slashes = (urlProcessing.split('/')).length
      for(let i = 0; i < slashes; i++) {
        try{
        route = routes[(Object.keys(routes).filter(route => (new RegExp(\`\${urlProcessing.split('|').join('\\\\|')}.*\\\\*\`)).test(route)).sort((a,b)=> a.length - b.length))[0]]
        if(route) {
          i = Infinity
          route(req,res)
        } else {
          throw('')
        }
        } catch {
          urlProcessing = (urlProcessing.split('/').slice(0,-1).join('/'))+'/'
        }
      }
    } catch(err) {
      console.log(err)
      routes['default'](req,res)
    }
  }} catch(err) {
    console.error(err)
    if(!req || !res) {
      console.trace('No req/res object given.')
    } else {
      console.trace('Invalid route')
    }
  }
    `)
    this.routes = {"default": (req,res,err) => {res.writeHead(404); if(err) {console.log(err)}; res.end()}, ...routes}
  }
}

httpRouter.prototype.parseJSONBody = async (req) => {
return new Promise((resolve,reject)=>{
  let body = []
req.on('data',data=>{
body.push(data.toString())
})

req.on('end',async ()=>{
  try{
  req.body = JSON.parse(body.join(''))
  resolve()
  } catch {req.body = {}
  resolve()
}
})})}

exports.httpRouter = httpRouter

