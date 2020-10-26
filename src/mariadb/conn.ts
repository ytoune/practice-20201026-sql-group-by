import mysql2 from 'mysql2/promise'

export const createConn = () => {
  return mysql2.createConnection('mysql://test:test@localhost:3307/test')
}
