module.exports = function multiFilter(array, filters) {
    const filterKeys = Object.keys(filters)
    // filters all elements passing the criteria
    return array.filter((item) => {
      // dynamically validate all filter criteria
      return filterKeys.every(key => {
          //ignore when the filter is empty Anne
        if(!filters[key].length) return false
        return !!~filters[key].indexOf(item[key])
      })
    })
  }