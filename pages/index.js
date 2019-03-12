import React from 'react'
import Page from '../components/Page'

export default class Counter extends React.Component {
  render() {
    console.log('index', this);
    return <Page title="Index Page" linkTo="/other" />
  }
}
