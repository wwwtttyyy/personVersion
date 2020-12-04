import storage from 'store'
import { login, getInfo } from '@/api/login'
import { ACCESS_TOKEN, USER_NAME, USER_PASSWORD, USER_ENTITYNAME } from '@/store/mutation-types'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response
          storage.set(ACCESS_TOKEN, result.data[0].token, 7 * 24 * 60 * 60 * 1000)
          storage.set(USER_NAME, userInfo.name)
          storage.set(USER_PASSWORD, userInfo.password)
          storage.set(USER_ENTITYNAME, userInfo.enterprice)
          commit('SET_TOKEN', result.token) // 保存token
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      const data = {
        entityName: storage.get(USER_ENTITYNAME),
        password: storage.get(USER_PASSWORD),
        account: storage.get(USER_NAME)
      }
      console.log(data)
      return new Promise((resolve, reject) => {
        getInfo(data).then(response => {
          const result = response.data
          console.log(result)
          if (result.role) {
            // const role = result.role
            // role.permissions = result.role.permissions
            // role.permissions.map(per => {
            //   if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
            //     const action = per.actionEntitySet.map(action => { return action.action })
            //     per.actionList = action
            //   }
            // })
            // role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          // commit('SET_NAME', result.name)
          // commit('SET_AVATAR', result.avatar)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }

    // 登出
    // Logout ({ commit, state }) {
    //   return new Promise((resolve) => {
    //     logout(state.token).then(() => {
    //       resolve()
    //     }).catch(() => {
    //       resolve()
    //     }).finally(() => {
    //       commit('SET_TOKEN', '')
    //       commit('SET_ROLES', [])
    //       storage.remove(ACCESS_TOKEN)
    //     })
    //   })
    // }

  }
}

export default user
