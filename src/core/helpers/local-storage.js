 
export const LocalStorage = {
    get: (key) => {
        const item = localStorage.getItem(key)
        if(item && item !== 'undefined'){
            return JSON.parse(item)
        } else {
            return null
        }
    },
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    remove: (key) => localStorage.removeItem(key),
}
