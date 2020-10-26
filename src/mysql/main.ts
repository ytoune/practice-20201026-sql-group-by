/* eslint-disable @typescript-eslint/no-explicit-any */
import { performance } from 'perf_hooks'
import { answers } from '../answers'
import { createConn } from './conn'

let conn: import('mysql2/promise').Connection

export const main = async () => {
  conn = await createConn()

  for (const table of ['surveys', 'surveys2']) {
    await getperf(table + ': CASE SUM', async () => {
      const [r] = await conn.query<any[]>(`
        SELECT
          CONCAT(
            FORMAT(
              100.0 * SUM(CASE WHEN answer = '良かった' THEN 1 ELSE 0 END) / COUNT(*),
              1),
            '%'
          ) AS \`良かった\`,
          CONCAT(
            FORMAT(
              100.0 * SUM(CASE WHEN answer = 'ふつう'   THEN 1 ELSE 0 END) / COUNT(*),
              1),
            '%'
          ) AS \`ふつう\`,
          CONCAT(
            FORMAT(
              100.0 * SUM(CASE WHEN answer = '悪かった' THEN 1 ELSE 0 END) / COUNT(*),
              1),
            '%'
          ) AS \`悪かった\`
        FROM ${table}
      `)
      return r[0]
    })

    await getperf(table + ': CASE SUM 2', async () => {
      const [r] = await conn.query<any[]>(`
        SELECT
          SUM(CASE WHEN answer = '良かった' THEN 1 ELSE 0 END) AS "良かった",
          SUM(CASE WHEN answer = 'ふつう'   THEN 1 ELSE 0 END) AS "ふつう",
          SUM(CASE WHEN answer = '悪かった' THEN 1 ELSE 0 END) AS "悪かった"
        FROM ${table}
      `)
      const row = r[0]
      const sum = answers.reduce((s, a) => s + (row[a] | 0), 0)
      return Object.fromEntries(
        answers.map(a => [a, ((100 * row[a]) / sum).toFixed(1) + '%']),
      )
    })

    await getperf(table + ': CASE AVG', async () => {
      const [r] = await conn.query<any[]>(`
        SELECT
          CONCAT(
            FORMAT(
              AVG(CASE WHEN answer = '良かった' THEN 100 ELSE 0 END),
              1),
            '%'
          ) AS \`良かった\`,
          CONCAT(
            FORMAT(
              AVG(CASE WHEN answer = 'ふつう'   THEN 100 ELSE 0 END),
              1),
            '%'
          ) AS \`ふつう\`,
          CONCAT(
            FORMAT(
              AVG(CASE WHEN answer = '悪かった' THEN 100 ELSE 0 END),
              1),
            '%'
          ) AS \`悪かった\`
        FROM ${table}
      `)
      return r[0]
    })

    await getperf(table + ': GROUP BY', async () => {
      const [r] = await conn.query<any[]>(`
        SELECT
          answer,
          CONCAT(
            FORMAT(
              100.0 * COUNT(*) / (SELECT COUNT(*) FROM ${table}),
              1),
            '%'
          ) AS rate
        FROM ${table}
        GROUP BY answer
      `)
      const rows = Object.fromEntries(
        r
          .sort((q, w) => answers.indexOf(q.answer) - answers.indexOf(w.answer))
          .map(r => [r.answer, r.rate]),
      )
      return rows
    })

    await getperf(table + ': GROUP BY 2', async () => {
      const [r] = await conn.query<any[]>(`
        SELECT
          answer,
          100.0 * COUNT(*) AS \`count\`
        FROM ${table}
        GROUP BY answer
      `)
      const sum = r.reduce((q, w) => q + Number(w.count), 0)
      const rows = Object.fromEntries(
        r
          .sort((q, w) => answers.indexOf(q.answer) - answers.indexOf(w.answer))
          .map(r => [r.answer, ((100 * r.count) / sum).toFixed(1) + '%']),
      )
      return rows
    })
  }
}

const getperf = async (name: string, fn: () => Promise<unknown>) => {
  const start = performance.now()
  const r = await fn()
  console.log('#', name, performance.now() - start)
  undefined === r || console.log(r)
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
