import React from 'react'
import './../style.css';

import { init, update } from './logic';
import Button from 'react-bootstrap/Button';
const input = require('./input');

class Millipede extends React.Component {
  constructor(props) {
    super(props);
    this.focus = React.createRef();
    this.start = this.start.bind(this);
  }

  componentDidMount() {

    this.start();
    input.setup(this);
  }

  start()
  {
    this.canvas = this.refs.canvas;
    this.gameState = {
      props: [],
      blockSize: 20,
      fps: 60,
      fail: false,
      boundHeight: 100,
      score: {
        update: function(){
          this.gameState.score.value++;
        },
        value: 0
      },
      then: Date.now(),
      deleteQueue: []
    } 

    this.gameState.score.update = this.gameState.score.update.bind(this);
    this.props.getHighscore('millipede');

    init(this.canvas, this.gameState);
    this.refs.canvas.focus();

    this.game = setInterval(
      () => this.tick(), 
      1000/this.gameState.fps
    );
  }

  tick()
  {
    this.setState({ 
      tick: Date.now() 
    })
  }

  componentWillUnmount() {
    clearInterval(this.game);
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state === null)
    {
      return;
    }
    let ctx = this.canvas.getContext('2d')
    if(this.gameState.fail)
    {
      // If highscore, update
      let score = this.gameState.score.value;
      if(score > this.props.highscore.value)
      {
        let payload = {
          score: score,
          username: 'yawmus',
          game: 'millipede'
        }
        this.props.setHighscore(payload); 
      }
      clearInterval(this.game);
      return;
    }

    var interval = 1000/this.gameState.fps;
    let delta = this.state.tick - this.gameState.then;
    // Game loop
    this.gameState.then = this.state.tick - (delta % interval);

    // Store the current transformation matrix
    // Use the identity matrix while clearing the canvas
    // Restore the transform
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
    ctx.fillRect(0, this.canvas.height - this.gameState.boundHeight, this.canvas.width, this.gameState.boundHeight)

    delta /= 100;
    this.gameState = update(ctx, delta, this.gameState);

    this.gameState.props = this.gameState.props.filter(
      (prop) => !this.gameState.deleteQueue.includes(prop.id)
    )
  }

  render() {
    let highScore = this.props.highscore.value;
    let score = this.gameState ? this.gameState.score.value : 0;
    let fail = this.gameState ? this.gameState.fail : false;

    return (
      <div className='container'>
        <canvas tabIndex='1' ref='canvas' className='canvas' width={480} height={400}/>
        <h4 className='score'>Score {score}</h4>
        { this.props.highscore.isFetching ? 
        <h4 className='highscore'>...</h4> :
        <h4 className='highscore'>Highscore {highScore}</h4>
        }
        { 
          fail 
          ? <div className='gameOver'><h2>Game Over</h2>
            <Button id='restart' onClick={this.start}>Retry</Button></div> : null 
          }
      </div>
    );
  }
}

export default Millipede
