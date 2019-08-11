import React from 'react'
import YouTube from 'react-youtube';

class Home extends React.Component {
  onSubmit = () => {
    this.props.history.push('/')
  }
  render() {
    const opts = {
      height: '300',
      width: '520',
      playerVars: {
        autoplay: 0
      }
    };

    return (
      <div className="home">
      <YouTube
        videoId="CEo4JYssQRI"
        opts={opts}
        onReady={this._onReady}
      />
      </div>
    )
  }
}
export default Home
