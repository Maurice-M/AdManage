var sqlMap = {
    user: {
        seachUser: 'select * from users where email = ? and password = ?'
    }
}

module.exports = sqlMap