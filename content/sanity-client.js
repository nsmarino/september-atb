import sanityClient from "@sanity/client"

const client = sanityClient({
  projectId: '4cv68xhy',
  dataset: 'production',
  apiVersion: '2021-03-25', // use current UTC date - see "specifying API version"!
  useCdn: false, // `false` if you want to ensure fresh data
})


const query = '*[]'
const res = await client.fetch(query)
console.log(res)

export default client