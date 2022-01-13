class httpRouter extends Function {
  constructor(routes = {}) {
    super('req','res','router',
    `
    let url
    let routes
    try{
    url = req.method.toLowerCase() + '|' + req.url
    routes = router[Object.keys(router).slice(-1)]
    try{
    routes[url](req,res)
    } catch(err) {
      console.log(err)
    try {
    routes[url.split('/').slice(0,-1).join('/')+'/*'](req,res)
    } catch(err) {
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
