import { client } from "@/lib/prismic"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import Link from 'next/link'
import PrismicDom from 'prismic-dom'
import Prismic from 'prismic-javascript'
import { Document } from 'prismic-javascript/types/documents'

interface CategoryProps {
  category: Document
  products: Document[]
}

const Category = ({ category, products }: CategoryProps) => {
  const router = useRouter()

  if (router.isFallback) {
    return <p>Loading...</p>
  }

  return (
    <>
      <h1>{`Category ${router.query.slug}`}</h1>
      <h2>{`Category ${PrismicDom.RichText.asText(category.data.title)}`}</h2>

      <ul>
        {products.map(product => (
          <li key={product.id}>
            <Link href={`/catalog/products/${product.uid}`} >
              <a>
                {PrismicDom.RichText.asText(product.data.title)}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {

  const categories = await client().query([
    Prismic.Predicates.at('document.type', 'category')
  ])

  const paths = categories.results.map(category => ({
    params: {
      slug: category.uid
    }
  }))

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params

  const category = await client().getByUID('category', String(slug), {})

  const products = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.at('my.product.category', category.id)
  ])

  return {
    props: {
      category,
      products: products.results
    }
  }
}


export default Category