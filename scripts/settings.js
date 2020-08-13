export const getSettings = callback => {
    callback (fetch('./settings.cfg')
        .then(response => response.json()))
}

/*
getTodo(todo => {
    console.log(todo)
})
*/