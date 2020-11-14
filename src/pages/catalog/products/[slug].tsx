import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from 'next/router'
import PrismicDom from 'prismic-dom'

import { client } from '@/lib/prismic'

interface IProduct {
  id: string
  title: string
  description: string
  thumbnail: {
    url: string
  }
}

interface ProductProps {
  product: {
    data: IProduct
  }
}

const Product = ({ product }: ProductProps) => {
  const router = useRouter()

  if (router.isFallback) {
    return <p>Loading...</p>
  }

  return (
    <>
      { !product ? (
        <h1>Nothing found</h1>
      ) : (
          <>
            <h1>{PrismicDom.RichText.asText(product.data.title)}</h1>

            <img src={product.data.thumbnail.url} alt={product.data.title} style={{ width: 200 }} />

            <div dangerouslySetInnerHTML={{ __html: PrismicDom.RichText.asText(product.data.description) }} />
          </>
        )}
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params

  const product = await client().getByUID('product', String(slug), {})

  return {
    props: {
      product: product ?? null
    },
    revalidate: 5
  }
}


export default Product