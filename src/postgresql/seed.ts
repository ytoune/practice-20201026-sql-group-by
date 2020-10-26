import { answers } from '../answers'
import { createConn } from './conn'

const conn = createConn()

export const main = async () => {
  await conn.connect()

  for (const table of ['surveys', 'surveys2']) {
    await conn.query(`DROP TABLE IF EXISTS ${table} CASCADE`)

    await conn.query(`CREATE TABLE IF NOT EXISTS ${table} (
      id SERIAL PRIMARY KEY NOT NULL,
      user_id INTEGER NOT NULL,
      answer TEXT NOT NULL
    )`)

    for (const _ of Array.from({ length: 1_000 })) {
      const pos: string[] = []
      const vars: (string | number)[] = []
      for (const n of Array.from({ length: 1_000 }, (_, n) => 1 + n)) {
        pos.push('($' + (2 * n - 1) + ', $' + 2 * n + ')')
        vars.push((Math.random() * 1_000_000_000) | 0)
        vars.push(answers[(Math.random() * answers.length) | 0])
      }
      await conn.query(
        `INSERT INTO ${table} (user_id, answer) VALUES ${pos.join(',')}`,
        vars,
      )
    }
  }

  await conn.query(`CREATE INDEX "idx_answer" ON surveys2("answer")`)
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
