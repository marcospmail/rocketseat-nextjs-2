import Prismic from 'prismic-javascript'

export const apiEndpoint = 'https://mpcompany.cdn.prismic.io/api/v2'

const client = (req = null) => {
  const options = req ? { req } : null

  return Prismic.client(apiEndpoint, options)
}

export {
  client
}