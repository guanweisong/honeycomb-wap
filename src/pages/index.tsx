import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Index = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/list/category')
  }, [])

  return (<></>)
}

export default Index
