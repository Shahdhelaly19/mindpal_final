




export class ApiFeature {
    constructor(mongooseQuery , searchQuery) {
        this.mongooseQuery = mongooseQuery
        this.searchQuery = searchQuery
    }

    pagination() {
        let pageNumber = this.searchQuery.page * 1 || 1 
        if (this.searchQuery.page < 1) pageNumber = 1 
        const limit = 5 
        let skip = (pageNumber - 1) * limit 
        this.mongooseQuery.skip(skip).limit(limit)
        this.pageNumber = pageNumber 
        return this // fun chain ().().()
    }

    filter() {
        let filterObj = structuredClone(this.searchQuery)
        filterObj = JSON.stringify(filterObj)
        filterObj = filterObj.replace(/(lt|lte|gt|gte)/g, (value) => `$${value}`)
        
        filterObj = JSON.parse(filterObj)

        let excuted = ['page', 'sort', 'fields', 'search']
        excuted.forEach(val => {
            delete filterObj[val]
        })
        this.mongooseQuery.find(filterObj)

        return this
    }


    sort() {
        if (this.searchQuery.sort) {
            let sortBy = this.searchQuery.sort.split(',').join(" ")
            this.mongooseQuery.sort(sortBy)
        } 
        
        return this
    }


    fields() {
        if (this.searchQuery.fields) {
            let selectedBy = this.searchQuery.fields.split(',').join(" ")
            this.mongooseQuery.select(selectedBy)
        } 
        
        return this
    }

     search() {
        if (this.searchQuery.search) {
            this.mongooseQuery.find({
                $or: [
                     { title: { $regex: this.searchQuery.search, $options: 'i' } },
                     {description:{$regex:this.searchQuery.search , $options:'i'}}
                ]
            })
        } 
        
        return this
    }
    
}