import React from 'react'
export default class Error extends React.Component {
  // @ts-ignore
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode }
  }
  
  render() {
    return (
      <p>
        // @ts-ignore
        {this.props.statusCode
          // @ts-ignore
          ? `An error ${this.props.statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
    )
  }
}