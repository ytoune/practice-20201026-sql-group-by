import { answers } from '../answers'
import { createConn } from './conn'

let conn: import('mysql2/promise').Connection
export const main = async () => {
  conn = await createConn()

  for (const table of ['surveys', 'surveys2']) {
    await conn.query(`DROP TABLE IF EXISTS ${table}`)

    await conn.query(`CREATE TABLE IF NOT EXISTS ${table} (
      id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
      user_id INTEGER NOT NULL,
      answer VARCHAR(127) NOT NULL
    )`)

    for (const _ of Array.from({ length: 1_000 })) {
      const pos: string[] = []
      const vars: (string | number)[] = []
      for (const _ of Array.from({ length: 1_000 })) {
        pos.push('(?, ?)')
        vars.push((Math.random() * 1_000_000_000) | 0)
        vars.push(answers[(Math.random() * answers.length) | 0])
      }
      await conn.query(
        `INSERT INTO ${table} (user_id, answer) VALUES ${pos.join(',')}`,
        vars,
      )
    }
  }

  await conn.query(`CREATE INDEX idx_answer ON surveys2(answer)`)
}

require.main &&
  main()
    .catch(x => {
      console.log('# something happens.')
      console.error(x)
      if ('undefined' === typeof process) return
      process.exit(1)
    })
    .finally(() => {
      conn.end()
    })
