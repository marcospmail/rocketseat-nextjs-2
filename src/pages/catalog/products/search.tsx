import React, { useState, FormEvent } from 'react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PrismicDom from 'prismic-dom'
import { Document } from 'prismic-javascript/types/documents'
import { client } from '@/lib/prismic'
import Prismic from 'prismic-javascript'

interface SearchProps {
  searchResults: Document[]
}

const Search = ({ searchResults }: SearchProps) => {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    router.push(`/catalog/products/search?q=${query}`)
  }


  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={e => { setQuery(e.target.value) }} />
        <button type="submit">Search</button>
      </form>
      {
        searchResults.map(product => (
          <li>
            <Link key={product.data.id} href={`/catalog/products/${product.uid}`} >
              <a>
                <span>{PrismicDom.RichText.asText(product.data.title)}</span>
              </a>
            </Link>
          </li>
        ))
      }
    </>
  )
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async (context) => {
  const { q } = context.query

  if (!q) {
    return {
      props: {
        searchResults: []
      }
    }
  }

  const searchResult = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.fulltext('my.product.title', String(q))
  ])

  return {
    props: {
      searchResults: searchResult.results
    }
  }
}



export default Search