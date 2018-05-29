// entry-server.js
import { app, router, store } from './app.js'

const isDev = process.env.NODE_ENV !== 'production'

export default context => {
  //console.log(context)
  const s = isDev && Date.now()
  console.log(s)
  // 注意下面这句话要写在export函数里供服务端渲染调用，重新初始化那store、router
  return new Promise((resolve, reject) => {
    console.log(context.url)
    console.log(context.url)
    router.push(context.url)
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        reject({ code: 404 })
      }
      //console.log(matchedComponents.length)
      Promise.all(matchedComponents.map(component => {
        /*if(component.preFetch) {
          // 调用组件上的preFetch(这部分只能拿到router第一级别组件，子组件的preFetch拿不到)
          return component.preFetch(store)
        }*/
        if(component.asyncData) {
          // 调用组件上的preFetch(这部分只能拿到router第一级别组件，子组件的preFetch拿不到)
          //console.log('111111111111111111111111')
          //console.log(router.currentRoute)
          return component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        /*isDev && */console.log(`data pre-fetch: ${Date.now() - s}ms`)
        // 暴露数据到HTMl，使得客户端渲染拿到数据，跟服务端渲染匹配
        //console.log(store.state)
        context.state = store.state
        /*context.state.posts.forEach((element, index) => {
          context.state.posts[index].content = '';
        })*/
        resolve(app)
      }).catch(reject)
      //resolve(app)
    })
  })
}