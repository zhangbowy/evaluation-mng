import { action, observable } from 'mobx'

type SearchType<T> = {
    [key in keyof T]: T[key]
}
const SearchData = observable({
    searchObj: <any>{},
    setSearchObj<T>(obj: SearchType<T>) {
        this.searchObj = obj
    },
}, {
    setSearchObj: action
})

export { SearchData }