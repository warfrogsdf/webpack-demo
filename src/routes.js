/**
 * Created by Su on 2018/1/7.
 */
/*import About from './pages/about/index';
 import Login from './pages/login/index';
 import Main from './pages/main/index';*/

const About = () => import('./pages/about/index')
const Login = () => import('./pages/login/index')
const Main = () => import('./pages/main/index')
const ChatList = () => import('./pages/chatlist/index')
const FriendList = () => import('./pages/friendlist/index')
const Chat = () => import('./pages/chat/index')


export default [
    /*{
     "path": "/",
     redirect: { path: '/main' }
    },*/
  {
    "path": "/",
    component: Main,
    children: [

    ]
  },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/main',
        component: Main,
        children: [
            {
                path: 'chatlist',
                component: ChatList,
            },
            {
                path: 'friendlist',
                component: FriendList,
            }
        ]
    },
    {
        path: '/about',
        component: About,
    },
    {
        path: '/chat',
        component: Chat,
    }

]