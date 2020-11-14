import { GetServerSideProps } from 'next'
import { Title } from '@/styles/pages/Home'
import Link from 'next/link'
import Prismic from 'prismic-javascript'
import PrismicDom from 'prismic-dom'
import { Document } from 'prismic-javascript/types/documents'

import { client } from '@/lib/prismic'
import SEO from '@/components/SEO'

interface HomeProps {
  products: Document[]
}

const Home = ({ products: recommendedProducts }: HomeProps) => {

  return (
    <div style={{ border: '1px solid red' }}>
      <SEO
        title="Home"
      />

      <Title>Hello teacher</Title>

      <ul>
        {recommendedProducts.map(product => (
          <li key={product.id}>
            <Link href={`/catalog/products/${product.id}`} >
              <a>
                {PrismicDom.RichText.asText(product.data.title)}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ])

  return {
    props: {
      products: recommendedProducts.results
    }
  }

}
