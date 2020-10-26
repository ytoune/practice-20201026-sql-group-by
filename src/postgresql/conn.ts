import pg from 'pg'

export const createConn = () => {
  return new pg.Client({
    connectionString: 'postgresql://root:root@localhost:5432/pgtest',
  })
}
