export default {
    setCache(key, value){
        sessionStorage.setItem(key, value)
    },
    getCache(key){
        return sessionStorage.getItem(key)
    },
    delCache(key){
        sessionStorage.removeItem(key)
    }
}